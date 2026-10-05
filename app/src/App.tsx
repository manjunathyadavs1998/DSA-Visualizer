import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATALOG, TOPICS, byId } from '@/data/catalog';
import type { Difficulty } from '@/data/catalog';
import type { Args } from '@/engine/types';
import { trace, parseArgs, defaultRaw } from '@/engine/tracer';
import { buildTree, stepBoundaries, stateAt } from '@/engine/stateAt';
import {
  toRTreeNodes,
  toStackFrames,
  stripHtml,
  currentArgOf,
  heapValues,
  DONE_KEYS,
  FRONTIER_KEYS,
} from '@/components/algo/adapters';
import StructurePanel from '@/components/algo/StructurePanel';
import { GRAPH_DATA } from '@/data/graphData';
import RecursionTree from '@/components/RecursionTree';
import CodePanel from '@/components/CodePanel';
import StackPanel from '@/components/StackPanel';
import HeapPanel from '@/components/HeapPanel';
import ComplexityPanel from '@/components/ComplexityPanel';
import ControlsBar from '@/components/ControlsBar';
import type { StepKind } from '@/components/ControlsBar';
import NarrationBar from '@/components/NarrationBar';
import ThreeBackground from '@/components/ThreeBackground';
import ArrayPanel from '@/components/algo/ArrayPanel';
import GridPanel from '@/components/algo/GridPanel';
import MemoPanel from '@/components/algo/MemoPanel';
import HeapObjectsPanel from '@/components/algo/HeapObjectsPanel';
import MetricsPanel from '@/components/algo/MetricsPanel';
import AlgoInputs from '@/components/algo/AlgoInputs';

type Theme = 'dark' | 'light';
type ProgressState = 'todo' | 'progress' | 'done';

const PROGRESS_META: Record<ProgressState, { icon: string; cls: string; label: string }> = {
  todo: { icon: '○', cls: 'text-t5', label: 'to do' },
  progress: { icon: '◐', cls: 'text-am', label: 'in progress' },
  done: { icon: '●', cls: 'text-gr', label: 'done' },
};

/** Layout preferences — which panels are open and how big they are. */
interface UIState {
  leftOpen: boolean;
  rightOpen: boolean;
  codeOpen: boolean;
  stackOpen: boolean;
  heapOpen: boolean;
  memoOpen: boolean;
  metricsOpen: boolean;
  structOpen: boolean;
  leftW: number;
  rightW: number;
  codeH: number;
}

const UI_DEFAULT: UIState = {
  leftOpen: true,
  rightOpen: true,
  codeOpen: true,
  stackOpen: true,
  heapOpen: true,
  memoOpen: true,
  metricsOpen: true,
  structOpen: true,
  leftW: 300,
  rightW: 330,
  codeH: 228,
};

const RAIL_W = 36; // width of a collapsed side panel
const DEFAULT_ID = 'classic:fibonacci';

/** Resume the last-opened problem across reloads. */
function getInitialSel(): string {
  try {
    const s = localStorage.getItem('rl-sel');
    if (s && byId(s)) return s;
  } catch {
    /* fall through */
  }
  return DEFAULT_ID;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: 'text-gr',
  Medium: 'text-am',
  Hard: 'text-pk',
  '—': 'text-t4',
};

/** Thin draggable divider for resizing a neighbouring panel. */
function DragHandle({
  axis,
  invert = false,
  getBase,
  setSize,
}: {
  axis: 'x' | 'y';
  invert?: boolean;
  getBase: () => number;
  setSize: (v: number) => void;
}) {
  const drag = useRef<{ start: number; base: number } | null>(null);
  return (
    <div
      style={{ touchAction: 'none' }}
      className={`z-10 shrink-0 bg-line/60 transition-colors hover:bg-cy/50 ${
        axis === 'x' ? 'h-full w-[3px] cursor-col-resize' : 'h-[3px] w-full cursor-row-resize'
      }`}
      onPointerDown={(e) => {
        e.preventDefault();
        drag.current = { start: axis === 'x' ? e.clientX : e.clientY, base: getBase() };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const d = (axis === 'x' ? e.clientX : e.clientY) - drag.current.start;
        setSize(drag.current.base + (invert ? -d : d));
      }}
      onPointerUp={(e) => {
        drag.current = null;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }}
    />
  );
}

export default function App() {
  const [selId, setSelId] = useState(getInitialSel);
  // classic-pipeline inputs
  const [inputVal, setInputVal] = useState<number>(() => {
    const it = byId(getInitialSel());
    return it?.classic?.input?.kind === 'number' ? it.classic.input.def : 0;
  });
  const [arrVal, setArrVal] = useState<number[]>(() => {
    const it = byId(getInitialSel());
    return it?.classic?.input?.kind === 'array' ? it.classic.input.def : [];
  });
  const [arrText, setArrText] = useState(() => {
    const it = byId(getInitialSel());
    return it?.classic?.input?.kind === 'array' ? it.classic.input.def.join(', ') : '';
  });
  // engine-pipeline inputs (text drafts → applied raw → parsed args)
  const [draftRaw, setDraftRaw] = useState<Record<string, string>>(() => {
    const it = byId(getInitialSel());
    return it?.algo ? defaultRaw(it.algo.solution) : {};
  });
  const [appliedRaw, setAppliedRaw] = useState<Record<string, string>>({});
  // playback
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  // catalog filters
  const [query, setQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ProgressState>('All');
  // study progress + collapsed topic groups (both persisted)
  const [progress, setProgress] = useState<Record<string, ProgressState>>(() => {
    try {
      return JSON.parse(localStorage.getItem('rl-progress') ?? '{}');
    } catch {
      return {};
    }
  });
  const [collapsedTopics, setCollapsedTopics] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rl-topics-collapsed') ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rl-progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('rl-topics-collapsed', JSON.stringify(collapsedTopics));
  }, [collapsedTopics]);

  const cycleProgress = (id: string) =>
    setProgress((p) => {
      const cur = p[id] ?? 'todo';
      const nxt: ProgressState = cur === 'todo' ? 'progress' : cur === 'progress' ? 'done' : 'todo';
      const copy = { ...p };
      if (nxt === 'todo') delete copy[id];
      else copy[id] = nxt;
      return copy;
    });

  const toggleTopic = (t: string) =>
    setCollapsedTopics((c) => (c.includes(t) ? c.filter((x) => x !== t) : [...c, t]));

  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('rl-theme') === 'light' ? 'light' : 'dark',
  );
  const [ui, setUi] = useState<UIState>(() => {
    try {
      return { ...UI_DEFAULT, ...JSON.parse(localStorage.getItem('rl-ui') ?? '{}') };
    } catch {
      return UI_DEFAULT;
    }
  });
  const patchUi = useCallback((patch: Partial<UIState>) => setUi((u) => ({ ...u, ...patch })), []);

  useEffect(() => {
    localStorage.setItem('rl-ui', JSON.stringify(ui));
  }, [ui]);

  useEffect(() => {
    localStorage.setItem('rl-sel', selId);
  }, [selId]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('rl-theme', theme);
  }, [theme]);

  const item = byId(selId) ?? CATALOG[0];
  const classic = item.kind === 'classic' ? item.classic! : null;
  const algo = item.kind === 'algo' ? item.algo! : null;

  /* ---------------- classic pipeline (hand-written tracers) ---------------- */
  const classicSteps = useMemo(() => {
    if (!classic) return null;
    const arg =
      classic.input?.kind === 'array' ? (arrVal.length ? arrVal : classic.input.def) : inputVal;
    return classic.generate(arg);
  }, [classic, inputVal, arrVal]);

  /* ---------------- engine pipeline (AlgoLens trace/replay) ---------------- */
  const args: Args = useMemo(
    () => (algo ? parseArgs(algo.solution, appliedRaw) : {}),
    [algo, appliedRaw],
  );
  const traced = useMemo(() => {
    if (!algo) return null;
    // Tracing runs user-provided inputs through real code — a divergent input
    // must degrade to a message, never crash the app.
    let res: ReturnType<typeof trace>;
    try {
      res = trace(algo.solution, args);
    } catch (e) {
      res = {
        events: [
          {
            t: 'narrate',
            msg: `⚠ These inputs made the run blow up (${(e as Error).message}). Adjust the inputs above and press ▶ run.`,
          },
        ],
        result: '—',
        truncated: true,
      };
    }
    const tree = buildTree(res.events);
    const bounds = stepBoundaries(res.events);
    const memoKeys: string[] = [];
    const seen = new Set<string>();
    for (const e of res.events)
      if (e.t === 'mset' && !seen.has(e.key)) {
        seen.add(e.key);
        memoKeys.push(e.key);
      }
    const initArr = algo.solution.array?.(args) ?? [];
    const initGrid = algo.solution.grid?.(args) ?? [];
    const heapUsed = res.events.some((e) => e.t === 'hset');
    return { res, tree, bounds, memoKeys, initArr, initGrid, heapUsed };
  }, [algo, args]);

  const total = classic ? classicSteps!.length : Math.max(1, traced!.bounds.length);
  const stepIdx = Math.min(idx, total - 1);
  const step = classic ? classicSteps![stepIdx] : null;
  const dstate = useMemo(() => {
    if (!algo || !traced) return null;
    const bk = traced.bounds.length ? traced.bounds[Math.min(idx, traced.bounds.length - 1)] : -1;
    return stateAt(traced.res.events, bk, traced.tree.byId, traced.initArr, traced.initGrid);
  }, [algo, traced, idx]);

  /** Per-step metadata: highlighted code line + what-happened kind.
   *  Drives the timeline markers, smart jumps, and code-line click-to-jump. */
  const stepMeta = useMemo(() => {
    if (classic && classicSteps) {
      const lines = classicSteps.map((s) => s.line);
      const kinds: StepKind[] = classicSteps.map((s, i) => {
        if (i === 0) return 'other';
        const d = s.stack.length - classicSteps[i - 1].stack.length;
        return d > 0 ? 'call' : d < 0 ? 'ret' : 'other';
      });
      return { lines, kinds };
    }
    if (traced) {
      const lines: number[] = [];
      const kinds: StepKind[] = [];
      let cur = -1;
      let bi = 0;
      const ev = traced.res.events;
      for (let i = 0; i < ev.length && bi < traced.bounds.length; i++) {
        const e = ev[i];
        if (e.t === 'line') cur = e.line;
        else if (e.t === 'call' && e.line !== undefined) cur = e.line;
        if (i === traced.bounds[bi]) {
          lines.push(cur);
          kinds.push(
            e.t === 'call'
              ? 'call'
              : e.t === 'ret'
                ? 'ret'
                : e.t === 'mget'
                  ? 'memoHit'
                  : e.t === 'mset'
                    ? 'memoSet'
                    : 'other',
          );
          bi++;
        }
      }
      return { lines, kinds };
    }
    return { lines: [] as number[], kinds: [] as StepKind[] };
  }, [classic, classicSteps, traced]);

  const jumpTargets = useMemo(() => {
    const find = (pred: (k: StepKind) => boolean) => {
      for (let i = stepIdx + 1; i < stepMeta.kinds.length; i++) if (pred(stepMeta.kinds[i])) return i;
      return null;
    };
    return {
      call: find((k) => k === 'call'),
      ret: find((k) => k === 'ret'),
      memo: find((k) => k === 'memoHit' || k === 'memoSet'),
    };
  }, [stepMeta, stepIdx]);

  const prevMsg = useMemo(() => {
    if (stepIdx === 0) return '';
    if (classic && classicSteps) return classicSteps[stepIdx - 1].message;
    if (traced) {
      const bk = traced.bounds.length
        ? traced.bounds[Math.min(stepIdx - 1, traced.bounds.length - 1)]
        : -1;
      return stripHtml(
        stateAt(traced.res.events, bk, traced.tree.byId, traced.initArr, traced.initGrid).msg,
      );
    }
    return '';
  }, [classic, classicSteps, traced, stepIdx]);

  const canPrev = stepIdx > 0;
  const canNext = stepIdx < total - 1;

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setIdx(0);
  }, []);
  const seek = useCallback((i: number) => {
    setPlaying(false);
    setIdx(i);
  }, []);
  const jumpTo = useCallback((i: number | null) => {
    if (i === null) return;
    setPlaying(false);
    setIdx(i);
  }, []);
  /** Seek to the next step (wrapping) whose highlighted code line is `line`. */
  const jumpToLine = useCallback(
    (line: number) => {
      const lines = stepMeta.lines;
      const n = lines.length;
      if (!n) return;
      for (let d = 1; d <= n; d++) {
        const i = (stepIdx + d) % n;
        if (lines[i] === line) {
          setPlaying(false);
          setIdx(i);
          return;
        }
      }
    },
    [stepMeta, stepIdx],
  );

  // autoplay (end-of-trace stop is deferred to a task so the effect stays pure)
  useEffect(() => {
    if (!playing) return;
    const atEnd = stepIdx >= total - 1;
    const t = setTimeout(() => (atEnd ? setPlaying(false) : next()), atEnd ? 0 : speed);
    return () => clearTimeout(t);
  }, [playing, stepIdx, total, speed, next]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return; // don't hijack typing
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((v) => !v);
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      } else if (e.key === 'c' || e.key === 'C') {
        jumpTo(jumpTargets.call);
      } else if (e.key === 'v' || e.key === 'V') {
        jumpTo(jumpTargets.ret);
      } else if (e.key === 'm' || e.key === 'M') {
        jumpTo(jumpTargets.memo);
      } else if (e.key === '[') {
        setUi((u) => ({ ...u, leftOpen: !u.leftOpen }));
      } else if (e.key === ']') {
        setUi((u) => ({ ...u, rightOpen: !u.rightOpen }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, reset, jumpTo, jumpTargets]);

  const selectItem = (id: string) => {
    const it = byId(id);
    if (!it) return;
    setSelId(id);
    setIdx(0);
    setPlaying(false);
    if (it.kind === 'classic') {
      const p = it.classic!;
      if (p.input?.kind === 'array') {
        setArrVal(p.input.def);
        setArrText(p.input.def.join(', '));
      } else {
        setInputVal(p.input?.kind === 'number' ? p.input.def : 0);
      }
    } else {
      const d = defaultRaw(it.algo!.solution);
      setDraftRaw(d);
      setAppliedRaw(d);
    }
  };

  const changeInput = (v: number) => {
    if (classic?.input?.kind !== 'number') return;
    setInputVal(Math.min(classic.input.max, Math.max(classic.input.min, v)));
    setIdx(0);
    setPlaying(false);
  };

  const applyArray = () => {
    if (classic?.input?.kind !== 'array') return;
    const spec = classic.input;
    const nums = arrText
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n))
      .map((n) => Math.min(spec.maxVal, Math.max(spec.minVal, Math.trunc(n))))
      .slice(0, spec.maxLen);
    if (nums.length < spec.minLen) {
      // invalid — revert the text to the array currently in use
      setArrText((arrVal.length ? arrVal : spec.def).join(', '));
      return;
    }
    setArrVal(nums);
    setArrText(nums.join(', '));
    setIdx(0);
    setPlaying(false);
  };

  const randomArray = () => {
    if (classic?.input?.kind !== 'array') return;
    const len = 5 + Math.floor(Math.random() * 3); // 5–7 elements
    const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 1);
    setArrVal(nums);
    setArrText(nums.join(', '));
    setIdx(0);
    setPlaying(false);
  };

  // silent apply (input blur): re-trace only when something actually changed
  const applyAlgoInputs = () => {
    if (!algo) return;
    if (JSON.stringify(draftRaw) === JSON.stringify(appliedRaw)) return;
    setAppliedRaw({ ...draftRaw });
    setIdx(0);
    setPlaying(false);
  };

  // ▶ run: always restarts the dry run from step 0 and autoplays,
  // even when the inputs are unchanged
  const runAlgo = () => {
    if (!algo) return;
    if (JSON.stringify(draftRaw) !== JSON.stringify(appliedRaw)) setAppliedRaw({ ...draftRaw });
    setIdx(0);
    setPlaying(true);
  };

  /** Input-structure diagrams (tree / graph problems). */
  const structures = useMemo(() => {
    if (!algo) return null;
    const trees = algo.solution.inputs
      .filter((s) => s.kind === 'numbers' && s.label.includes('level-order'))
      .map((s) => ({ name: s.name, label: s.label.replace(/\s*\(.*$/, '') }));
    const graph = GRAPH_DATA[algo.slug] ?? null;
    return trees.length || graph ? { trees, graph } : null;
  }, [algo]);

  const structHl = useMemo(() => {
    if (!dstate) return { current: null, done: new Set<number>(), frontier: new Set<number>() };
    return {
      current: currentArgOf(dstate),
      done: heapValues(dstate, DONE_KEYS),
      frontier: heapValues(dstate, FRONTIER_KEYS),
    };
  }, [dstate]);

  /* ---------------------------- catalog filtering --------------------------- */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter(
      (c) =>
        (topicFilter === 'All' || c.topic === topicFilter) &&
        (diffFilter === 'All' || c.difficulty === diffFilter) &&
        (statusFilter === 'All' || (progress[c.id] ?? 'todo') === statusFilter) &&
        (!q || c.title.toLowerCase().includes(q)),
    );
  }, [query, diffFilter, topicFilter, statusFilter, progress]);

  const status = stepIdx === 0 ? 'READY' : stepIdx >= total - 1 ? 'COMPLETE' : 'RUNNING';
  const statusColor =
    status === 'READY' ? 'var(--c-cy)' : status === 'COMPLETE' ? 'var(--c-gr)' : 'var(--c-am)';

  const message = classic
    ? step!.message
    : stripHtml(dstate?.msg ?? '') || 'Ready — press NEXT or play to start the dry run.';

  // Java-only display; `code` (JS) remains in the data purely as the engine's
  // line-number reference and a fallback if a future solution lacks Java.
  const codeLines = useMemo(() => {
    if (classic) return classic.code;
    return (algo!.solution.codeJava ?? algo!.solution.code).split('\n');
  }, [classic, algo]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink font-sans text-t1">
      <ThreeBackground theme={theme} />

      {/* header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-panel/90 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-9 items-center justify-center border border-cy/50 bg-cy/10 font-mono text-[11px] text-cy">
            ƒ(ƒ)
          </div>
          <div>
            <h1 className="text-[13px] font-bold uppercase tracking-[0.28em] text-t1">
              Recursion Lab
            </h1>
            <p className="text-[9px] uppercase tracking-[0.24em] text-t4">
              visual dry-run debugger
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-t3 sm:block">
            {item.topic} · {item.title}
          </span>
          <div
            className="flex items-center gap-2 border px-2.5 py-1"
            style={{
              borderColor: `color-mix(in srgb, ${statusColor} 33%, transparent)`,
              background: `color-mix(in srgb, ${statusColor} 7%, transparent)`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: statusColor }}
            />
            <span
              className="text-[9.5px] font-medium uppercase tracking-[0.22em]"
              style={{ color: statusColor }}
            >
              {status}
            </span>
          </div>
          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-7 w-7 items-center justify-center border border-line text-[13px] text-t3 transition-colors hover:border-cy/50 hover:text-cy"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      {/* main 3-column grid (sides collapsible + resizable) */}
      <main
        className="grid min-h-0 flex-1"
        style={{
          gridTemplateColumns: `${ui.leftOpen ? ui.leftW : RAIL_W}px ${
            ui.leftOpen ? 3 : 0
          }px minmax(0, 1fr) ${ui.rightOpen ? 3 : 0}px ${ui.rightOpen ? ui.rightW : RAIL_W}px`,
        }}
      >
        {/* left: problem catalog + brief */}
        {ui.leftOpen ? (
        <aside className="flex min-h-0 flex-col border-r border-line bg-panel/80 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-t3">
              Problem Set
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-t4">
                {visible.length}/{CATALOG.length}
              </span>
              <button
                onClick={() => patchUi({ leftOpen: false })}
                title="Collapse panel ( [ )"
                className="flex h-4 w-5 items-center justify-center border border-line text-[9px] leading-none text-t3 transition-colors hover:border-cy/50 hover:text-cy"
              >
                ◂
              </button>
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-col gap-1.5 border-b border-line px-3 py-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search problems…"
              spellCheck={false}
              className="w-full border border-line bg-ink px-2.5 py-1.5 text-[12px] text-t1 outline-none transition-colors placeholder:text-t5 focus:border-cy/50"
            />
            <div className="flex items-center gap-1">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`border px-2 py-1 text-[10px] uppercase tracking-[0.08em] transition-colors ${
                    diffFilter === d
                      ? 'border-cy/40 bg-cy/10 text-cy'
                      : 'border-line text-t4 hover:text-t2'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {(['All', 'todo', 'progress', 'done'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  title={s === 'All' ? 'any status' : PROGRESS_META[s].label}
                  className={`border px-2 py-1 text-[10px] uppercase tracking-[0.08em] transition-colors ${
                    statusFilter === s
                      ? 'border-cy/40 bg-cy/10 text-cy'
                      : 'border-line text-t4 hover:text-t2'
                  }`}
                >
                  {s === 'All' ? (
                    'All'
                  ) : (
                    <>
                      <span className={statusFilter === s ? '' : PROGRESS_META[s].cls}>
                        {PROGRESS_META[s].icon}
                      </span>{' '}
                      {s === 'progress' ? 'doing' : s}
                    </>
                  )}
                </button>
              ))}
            </div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full cursor-pointer border border-line bg-ink px-2 py-1.5 text-[11.5px] text-t2 outline-none focus:border-cy/50"
            >
              <option value="All">All topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* grouped problem list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {TOPICS.map((topic) => {
              const items = visible.filter((c) => c.topic === topic);
              if (!items.length) return null;
              // searching overrides collapse so matches are never hidden
              const isCollapsed = collapsedTopics.includes(topic) && !query.trim();
              const doneCount = items.filter((c) => progress[c.id] === 'done').length;
              return (
                <div key={topic}>
                  <button
                    onClick={() => toggleTopic(topic)}
                    title={isCollapsed ? 'Expand topic' : 'Collapse topic'}
                    className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-line bg-panel px-4 py-2 text-left transition-colors hover:bg-panel2"
                  >
                    <span className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-cy/80">
                      <span className="w-2.5 text-t4">{isCollapsed ? '▸' : '▾'}</span>
                      {topic}
                    </span>
                    <span
                      className={`font-mono text-[10px] ${
                        doneCount === items.length ? 'text-gr' : 'text-t4'
                      }`}
                    >
                      {doneCount}/{items.length}
                    </span>
                  </button>
                  {!isCollapsed &&
                    items.map((c, i) => {
                      const active = c.id === selId;
                      const st = progress[c.id] ?? 'todo';
                      const meta = PROGRESS_META[st];
                      return (
                        <div
                          key={c.id}
                          onClick={() => selectItem(c.id)}
                          className={`flex w-full cursor-pointer items-center gap-2.5 border-b border-line2 px-3 py-2.5 transition-colors duration-150 ${
                            active ? 'bg-cy/[0.07]' : 'hover:bg-panel2'
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleProgress(c.id);
                            }}
                            title={`${meta.label} — click to cycle`}
                            className={`shrink-0 text-[15px] leading-none transition-colors hover:scale-110 ${meta.cls}`}
                          >
                            {meta.icon}
                          </button>
                          <span
                            className={`min-w-0 flex-1 truncate text-[12.5px] ${
                              active ? 'text-cy' : st === 'done' ? 'text-t4' : 'text-t2'
                            }`}
                          >
                            <span className="mr-2 font-mono text-[10.5px] text-t5">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {c.title}
                          </span>
                          {c.kind === 'classic' ? (
                            <span
                              className={`shrink-0 border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                                active ? 'border-cy/40 text-cy' : 'border-line text-t4'
                              }`}
                            >
                              {c.classic!.tag}
                            </span>
                          ) : (
                            <span
                              className={`shrink-0 text-[10px] font-medium uppercase tracking-[0.08em] ${DIFF_COLOR[c.difficulty]}`}
                            >
                              {c.difficulty}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
            {visible.length === 0 && (
              <p className="p-4 text-center text-[11px] uppercase tracking-[0.14em] text-t4">
                no problems match the filters
              </p>
            )}
          </div>

          {/* brief + inputs */}
          <div className="max-h-[45%] shrink-0 overflow-y-auto border-t border-line p-4">
            {classic ? (
              <>
                <p className="text-[12px] leading-relaxed text-t3">{classic.desc}</p>
                {classic.input?.kind === 'number' && (
                  <div className="mt-3 flex items-center justify-between border border-line bg-ink px-3 py-2">
                    <span className="text-[10.5px] uppercase tracking-[0.16em] text-t4">
                      input · {classic.input.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeInput(inputVal - 1)}
                        className="h-7 w-7 border border-line text-[13px] text-t2 transition-colors hover:border-cy/50 hover:text-cy"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-mono text-[14px] text-am">
                        {classic.input.format ? classic.input.format(inputVal) : inputVal}
                      </span>
                      <button
                        onClick={() => changeInput(inputVal + 1)}
                        className="h-7 w-7 border border-line text-[13px] text-t2 transition-colors hover:border-cy/50 hover:text-cy"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                {classic.input?.kind === 'array' && (
                  <div className="mt-3 border border-line bg-ink px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] uppercase tracking-[0.16em] text-t4">
                        input · {classic.input.label}
                      </span>
                      <button
                        onClick={randomArray}
                        title="Generate a random array"
                        className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-t2 transition-colors hover:border-cy/50 hover:text-cy"
                      >
                        ⟳ random
                      </button>
                    </div>
                    <input
                      type="text"
                      value={arrText}
                      onChange={(e) => setArrText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') applyArray();
                      }}
                      onBlur={applyArray}
                      spellCheck={false}
                      placeholder="38, 27, 43, 3, 9"
                      className="mt-2 w-full border border-line bg-panel px-2.5 py-2 font-mono text-[12.5px] text-am outline-none transition-colors placeholder:text-t5 focus:border-cy/50"
                    />
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.1em] text-t4">
                      {classic.input.minLen}–{classic.input.maxLen} numbers · comma separated ·
                      enter to apply
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-[12px] leading-relaxed text-t3">{algo!.summary}</p>
                <a
                  href={algo!.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[10.5px] uppercase tracking-[0.14em] text-cy/80 transition-colors hover:text-cy"
                >
                  problem link ↗
                </a>
                <AlgoInputs
                  def={algo!.solution}
                  draft={draftRaw}
                  onDraft={(n, t) => setDraftRaw((r) => ({ ...r, [n]: t }))}
                  onApply={applyAlgoInputs}
                  onRun={runAlgo}
                />
              </>
            )}
          </div>
        </aside>
        ) : (
        <aside className="flex min-h-0 flex-col items-center gap-3 border-r border-line bg-panel/80 py-3 backdrop-blur-sm">
          <button
            onClick={() => patchUi({ leftOpen: true })}
            title="Expand problem panel ( [ )"
            className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-[10px] text-t3 transition-colors hover:border-cy/50 hover:text-cy"
          >
            ▸
          </button>
          <span
            className="text-[9px] uppercase tracking-[0.3em] text-t4"
            style={{ writingMode: 'vertical-rl' }}
          >
            Problem Set
          </span>
        </aside>
        )}

        {/* left resize handle */}
        {ui.leftOpen ? (
          <DragHandle
            axis="x"
            getBase={() => ui.leftW}
            setSize={(v) => patchUi({ leftW: clamp(v, 220, 440) })}
          />
        ) : (
          <div />
        )}

        {/* center: stage over code */}
        <section className="flex min-h-0 flex-col bg-ink/60">
          <div className="min-h-0 flex-1 border-b border-line">
            {classic ? (
              <RecursionTree nodes={step!.tree} />
            ) : algo!.solution.view === 'grid' ? (
              <GridPanel state={dstate!} stage />
            ) : algo!.solution.view === 'array' ? (
              <ArrayPanel state={dstate!} stage />
            ) : (
              <RecursionTree
                nodes={toRTreeNodes(traced!.tree.nodes, dstate!)}
                memoLegend={traced!.memoKeys.length > 0}
              />
            )}
          </div>
          {ui.codeOpen && (
            <DragHandle
              axis="y"
              invert
              getBase={() => ui.codeH}
              setSize={(v) => patchUi({ codeH: clamp(v, 110, 480) })}
            />
          )}
          <div
            style={{ height: ui.codeOpen ? ui.codeH : 34 }}
            className="shrink-0 bg-panel/80 backdrop-blur-sm"
          >
            <CodePanel
              code={codeLines}
              currentLine={classic ? step!.line : (dstate!.line ?? -1)}
              collapsed={!ui.codeOpen}
              onToggle={() => patchUi({ codeOpen: !ui.codeOpen })}
              title={classic ? 'Pseudocode · Java style' : 'Solution Code · Java'}
              onLineClick={jumpToLine}
            />
          </div>
        </section>

        {/* right resize handle */}
        {ui.rightOpen ? (
          <DragHandle
            axis="x"
            invert
            getBase={() => ui.rightW}
            setSize={(v) => patchUi({ rightW: clamp(v, 250, 480) })}
          />
        ) : (
          <div />
        )}

        {/* right: stack / heap / memo / metrics */}
        {ui.rightOpen ? (
        <aside className="flex min-h-0 flex-col border-l border-line bg-panel/80 backdrop-blur-sm">
          {classic ? (
            <>
              <div className={`${ui.stackOpen ? 'min-h-0 flex-[1.1]' : 'shrink-0'} border-b border-line`}>
                <StackPanel
                  stack={step!.stack}
                  collapsed={!ui.stackOpen}
                  onToggle={() => patchUi({ stackOpen: !ui.stackOpen })}
                />
              </div>
              <div className={`${ui.heapOpen ? 'min-h-0 flex-[1.2]' : 'shrink-0'} border-b border-line`}>
                <HeapPanel
                  heap={step!.heap}
                  collapsed={!ui.heapOpen}
                  onToggle={() => patchUi({ heapOpen: !ui.heapOpen })}
                />
              </div>
              <div className="shrink-0">
                <ComplexityPanel
                  problem={classic}
                  step={step!}
                  stepIndex={stepIdx}
                  total={total}
                  collapsed={!ui.metricsOpen}
                  onToggle={() => patchUi({ metricsOpen: !ui.metricsOpen })}
                />
              </div>
            </>
          ) : (
            <>
              {structures && (
                <div className={`${ui.structOpen ? 'min-h-0 flex-[1.3]' : 'shrink-0'} border-b border-line`}>
                  <StructurePanel
                    trees={structures.trees.map((t) => ({
                      ...t,
                      values: (args[t.name] as number[]) ?? [],
                    }))}
                    graph={structures.graph}
                    current={structHl.current}
                    done={structHl.done}
                    frontier={structHl.frontier}
                    collapsed={!ui.structOpen}
                    onToggle={() => patchUi({ structOpen: !ui.structOpen })}
                  />
                </div>
              )}
              <div className={`${ui.stackOpen ? 'min-h-0 flex-[1.1]' : 'shrink-0'} border-b border-line`}>
                <StackPanel
                  stack={toStackFrames(dstate!)}
                  collapsed={!ui.stackOpen}
                  onToggle={() => patchUi({ stackOpen: !ui.stackOpen })}
                />
              </div>
              {traced!.memoKeys.length > 0 && (
                <div className={`${ui.memoOpen ? 'min-h-0 flex-[1.3]' : 'shrink-0'} border-b border-line`}>
                  <MemoPanel
                    allKeys={traced!.memoKeys}
                    state={dstate!}
                    collapsed={!ui.memoOpen}
                    onToggle={() => patchUi({ memoOpen: !ui.memoOpen })}
                  />
                </div>
              )}
              {(traced!.heapUsed || traced!.memoKeys.length > 0) && (
                <div className={`${ui.heapOpen ? 'min-h-0 flex-1' : 'shrink-0'} border-b border-line`}>
                  <HeapObjectsPanel
                    state={dstate!}
                    memoEntries={Object.keys(dstate!.memo).length}
                    collapsed={!ui.heapOpen}
                    onToggle={() => patchUi({ heapOpen: !ui.heapOpen })}
                  />
                </div>
              )}
              <div className="shrink-0">
                <MetricsPanel
                  entry={algo!.solution.entry(args)}
                  calls={dstate!.calls}
                  result={traced!.res.result}
                  truncated={traced!.res.truncated}
                  stepIndex={stepIdx}
                  total={total}
                  time={algo!.time}
                  space={algo!.space}
                  collapsed={!ui.metricsOpen}
                  onToggle={() => patchUi({ metricsOpen: !ui.metricsOpen })}
                />
              </div>
            </>
          )}
        </aside>
        ) : (
        <aside className="flex min-h-0 flex-col items-center gap-3 border-l border-line bg-panel/80 py-3 backdrop-blur-sm">
          <button
            onClick={() => patchUi({ rightOpen: true })}
            title="Expand debug panels ( ] )"
            className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-[10px] text-t3 transition-colors hover:border-cy/50 hover:text-cy"
          >
            ◂
          </button>
          <span
            className="text-[9px] uppercase tracking-[0.3em] text-t4"
            style={{ writingMode: 'vertical-rl' }}
          >
            Stack · Heap · Metrics
          </span>
        </aside>
        )}
      </main>

      {/* narration + transport */}
      <NarrationBar
        current={classic ? message : dstate!.msg || message}
        prev={prevMsg}
        html={!classic}
      />
      <ControlsBar
        canPrev={canPrev}
        canNext={canNext}
        playing={playing}
        speed={speed}
        idx={stepIdx}
        total={total}
        kinds={stepMeta.kinds}
        jump={jumpTargets}
        hasMemo={!classic && (traced?.memoKeys.length ?? 0) > 0}
        onPrev={prev}
        onNext={next}
        onPlay={() => setPlaying((v) => !v)}
        onReset={reset}
        onSpeed={setSpeed}
        onSeek={seek}
        onJump={jumpTo}
      />
    </div>
  );
}
