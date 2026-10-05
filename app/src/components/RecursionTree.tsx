import { useMemo, useRef, useState, useCallback } from 'react';
import type { RTreeNode } from '@/types/trace';

const NODE_H = 32;
const Y_GAP = 46;

interface Pos {
  x: number;
  y: number;
  w: number;
}

function nodeWidth(label: string, ret?: string) {
  const len = Math.max(label.length, ret ? ret.length + 2 : 0);
  return Math.max(58, len * 7.4 + 18);
}

/** Tidy tree layout: leaves get successive fixed-width slots, parents center over children. */
function layout(nodes: RTreeNode[]): Map<string, Pos> {
  const pos = new Map<string, Pos>();
  if (nodes.length === 0) return pos;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const widths = new Map(nodes.map((n) => [n.id, nodeWidth(n.label, n.ret)]));
  const slotW = Math.max(...widths.values()) + 18;
  const children = new Map<string, string[]>();
  nodes.forEach((n) => {
    if (n.parentId) {
      const arr = children.get(n.parentId) ?? [];
      arr.push(n.id);
      children.set(n.parentId, arr);
    }
  });
  const roots = nodes.filter((n) => !n.parentId || !byId.has(n.parentId));
  let leafCursor = 60;
  const visit = (id: string): number => {
    const n = byId.get(id)!;
    const kids = children.get(id) ?? [];
    let cx: number;
    if (kids.length === 0) {
      cx = leafCursor + widths.get(id)! / 2;
      leafCursor += slotW;
    } else {
      const cxs = kids.map((k) => visit(k));
      cx = (cxs[0] + cxs[cxs.length - 1]) / 2;
    }
    pos.set(id, { x: cx, y: n.depth * (NODE_H + Y_GAP) + 44, w: widths.get(id)! });
    return cx;
  };
  roots.forEach((r) => {
    visit(r.id);
  });
  return pos;
}

/* Theme-following colors (CSS vars defined in index.css); SVG attributes can't
   hold var()/color-mix, so these are applied via style props. */
const STATUS_STROKE: Record<string, string> = {
  current: 'var(--c-am)',
  active: 'var(--c-cy)',
  waiting: 'var(--c-line)',
  done: 'var(--c-gr)',
};
const STATUS_FILL: Record<string, string> = {
  current: 'color-mix(in srgb, var(--c-am) 14%, transparent)',
  active: 'color-mix(in srgb, var(--c-cy) 8%, transparent)',
  waiting: 'color-mix(in srgb, var(--c-panel) 90%, transparent)',
  done: 'color-mix(in srgb, var(--c-gr) 8%, transparent)',
};
const STATUS_TEXT: Record<string, string> = {
  current: 'var(--c-amt)',
  active: 'var(--c-cyt)',
  waiting: 'var(--c-t4)',
  done: 'var(--c-grt)',
};

export default function RecursionTree({
  nodes,
  memoLegend = false,
}: {
  nodes: RTreeNode[];
  memoLegend?: boolean;
}) {
  const pos = useMemo(() => layout(nodes), [nodes]);
  const [tiltOn, setTiltOn] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!tiltOn || !wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: nx * 7, y: -ny * 6 });
    },
    [tiltOn],
  );

  const bounds = useMemo(() => {
    if (pos.size === 0) return { w: 400, h: 200 };
    const ps = [...pos.values()];
    const maxX = Math.max(...ps.map((p) => p.x + p.w / 2)) + 50;
    const maxY = Math.max(...ps.map((p) => p.y)) + NODE_H + 66;
    return { w: maxX, h: maxY };
  }, [pos]);
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cy pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Recursion Tree
          </span>
          <span className="font-mono text-[10px] tracking-wider text-t4">{nodes.length} calls</span>
        </div>
        <button
          onClick={() => setTiltOn((v) => !v)}
          className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
            tiltOn ? 'border-cy/40 bg-cy/10 text-cy' : 'border-line text-t3 hover:text-t2'
          }`}
        >
          3D tilt {tiltOn ? 'on' : 'off'}
        </button>
      </div>

      <div
        ref={wrapRef}
        className="tree-stage relative flex-1 overflow-hidden"
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: '1400px' }}
      >
        {/* legend */}
        <div className="pointer-events-none absolute left-4 top-3 z-10 flex flex-col gap-1.5 text-[9px] uppercase tracking-[0.18em] text-t3">
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-am" /> executing</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-cy" /> on stack</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-gr" /> returned</span>
          {memoLegend && (
            <span className="flex items-center gap-1.5"><i className="inline-block text-[8px] not-italic text-pu">⚡</i> memo hit</span>
          )}
        </div>

        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="border border-dashed border-line px-6 py-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-t4">tree canvas empty</p>
              <p className="mt-1 text-[10px] text-t3">press NEXT to spawn the first call</p>
            </div>
          </div>
        ) : (
          <div
            className="h-full w-full transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: tiltOn ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg
              viewBox={`0 0 ${bounds.w} ${bounds.h}`}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* edges */}
              {nodes.map((n) => {
                if (!n.parentId) return null;
                const c = pos.get(n.id);
                const p = pos.get(n.parentId);
                if (!c || !p) return null;
                const x1 = p.x;
                const y1 = p.y + NODE_H;
                const x2 = c.x;
                const y2 = c.y;
                const my = (y1 + y2) / 2;
                return (
                  <path
                    key={`e-${n.id}`}
                    d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
                    fill="none"
                    strokeWidth={n.status === 'current' ? 1.6 : 1}
                    strokeOpacity={n.status === 'waiting' ? 0.5 : 0.75}
                    style={{ stroke: STATUS_STROKE[n.status] }}
                    className="edge-line"
                  />
                );
              })}
              {/* nodes */}
              {nodes.map((n) => {
                const p = pos.get(n.id);
                if (!p) return null;
                return (
                  <g
                    key={n.id}
                    className="tree-node"
                    style={{ transform: `translate(${p.x - p.w / 2}px, ${p.y}px)` }}
                  >
                    <rect
                      width={p.w}
                      height={NODE_H}
                      rx={5}
                      strokeWidth={n.status === 'current' ? 1.6 : 1}
                      style={{ fill: STATUS_FILL[n.status], stroke: STATUS_STROKE[n.status] }}
                      className={n.status === 'current' ? 'node-current' : undefined}
                    />
                    <text
                      x={p.w / 2}
                      y={NODE_H / 2 + 3.5}
                      textAnchor="middle"
                      fontSize={11}
                      style={{ fill: STATUS_TEXT[n.status] }}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {n.label}
                    </text>
                    {n.status === 'done' && n.ret !== undefined && n.ret !== '' && (
                      <text
                        x={p.w / 2}
                        y={NODE_H + 15}
                        textAnchor="middle"
                        fontSize={10}
                        style={{ fill: 'var(--c-gr)' }}
                        fontFamily="'JetBrains Mono', monospace"
                        className="ret-pop"
                      >
                        = {n.ret}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* current call banner */}
        {(() => {
          const cur = nodes.find((n) => n.status === 'current');
          if (!cur) return null;
          const parent = cur.parentId ? nodeById.get(cur.parentId) : null;
          return (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border border-am/30 bg-ink/90 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] tracking-wider text-t3">NOW EXECUTING&nbsp;&nbsp;</span>
              <span className="font-mono text-[11px] text-amt">{cur.label}</span>
              {parent && <span className="font-mono text-[10px] text-t4">&nbsp;&nbsp;called by {parent.label}</span>}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
