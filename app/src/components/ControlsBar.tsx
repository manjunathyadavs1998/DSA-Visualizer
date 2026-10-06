/** What happened at each playback step — drives timeline markers and smart jumps. */
export type StepKind = 'call' | 'ret' | 'memoHit' | 'memoSet' | 'other';

const MARKER_COLOR: Partial<Record<StepKind, string>> = {
  call: 'var(--c-cy)',
  ret: 'var(--c-gr)',
  memoHit: 'var(--c-pu)',
  memoSet: 'var(--c-pu)',
};

interface Props {
  canPrev: boolean;
  canNext: boolean;
  playing: boolean;
  speed: number;
  idx: number;
  total: number;
  kinds: StepKind[];
  jump: { call: number | null; ret: number | null; memo: number | null };
  hasMemo: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onReset: () => void;
  onSpeed: (v: number) => void;
  onSeek: (i: number) => void;
  onJump: (i: number | null) => void;
}

function Btn({
  onClick,
  disabled,
  children,
  accent,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  accent?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-9 items-center gap-1.5 rounded border px-3.5 text-[11.5px] font-medium uppercase tracking-[0.14em] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-30 ${
        accent
          ? 'border-cy/50 bg-cy/[0.14] text-cy hover:bg-cy/[0.22]'
          : 'border-line/80 text-t2 hover:border-mid hover:bg-panel2 hover:text-t1'
      }`}
    >
      {children}
    </button>
  );
}

function JumpBtn({
  target,
  onJump,
  title,
  children,
}: {
  target: number | null;
  onJump: (i: number | null) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onJump(target)}
      disabled={target === null}
      title={title}
      className="flex h-7 items-center gap-1 rounded border border-line/70 px-2.5 text-[10.5px] uppercase tracking-[0.08em] text-t3 transition-colors hover:border-cy/50 hover:bg-panel2 hover:text-cy disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export default function ControlsBar(p: Props) {
  const pct = p.total <= 1 ? 0 : (p.idx / (p.total - 1)) * 100;
  return (
    <div className="flex h-[52px] items-center gap-2 border-t border-line bg-panel/98 px-4 backdrop-blur-sm">
      <Btn onClick={p.onReset} title="Reset (R)">
        <span className="text-[13px]">⏮</span> reset
      </Btn>
      <Btn onClick={p.onPrev} disabled={!p.canPrev} title="Previous step (←)">
        ◀ prev
      </Btn>
      <Btn onClick={p.onPlay} accent={p.playing} title="Play / pause (Space)">
        {p.playing ? '❚❚ pause' : '▶ play'}
      </Btn>
      <Btn onClick={p.onNext} disabled={!p.canNext} accent title="Next step (→)">
        next ▶
      </Btn>

      {/* smart jumps */}
      <div className="ml-2 flex items-center gap-1">
        <JumpBtn target={p.jump.call} onJump={p.onJump} title="Jump to next call (C)">
          ↘ call
        </JumpBtn>
        <JumpBtn target={p.jump.ret} onJump={p.onJump} title="Jump to next return (V)">
          ↗ ret
        </JumpBtn>
        {p.hasMemo && (
          <JumpBtn target={p.jump.memo} onJump={p.onJump} title="Jump to next memo event (M)">
            ⚡ memo
          </JumpBtn>
        )}
      </div>

      <div className="ml-2 hidden items-center gap-2 md:flex">
        <span className="text-[9.5px] uppercase tracking-[0.2em] text-t4">speed</span>
        <input
          type="range"
          min={150}
          max={1500}
          step={50}
          value={1650 - p.speed}
          onChange={(e) => p.onSpeed(1650 - Number(e.target.value))}
          className="speed-slider h-1 w-20 cursor-pointer appearance-none bg-line"
        />
      </div>

      {/* timeline scrubber with event markers */}
      <div className="relative ml-3 h-9 min-w-[120px] flex-1" title="Timeline — drag to scrub">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-line">
          <div className="h-full bg-cy/70" style={{ width: `${pct}%` }} />
        </div>
        {p.total > 1 &&
          p.kinds.map((k, i) => {
            const color = MARKER_COLOR[k];
            if (!color) return null;
            return (
              <span
                key={i}
                className="pointer-events-none absolute top-1/2 h-[9px] w-[2px] -translate-y-1/2"
                style={{ left: `${(i / (p.total - 1)) * 100}%`, background: color, opacity: 0.5 }}
              />
            );
          })}
        <input
          type="range"
          min={0}
          max={Math.max(0, p.total - 1)}
          step={1}
          value={p.idx}
          onChange={(e) => p.onSeek(Number(e.target.value))}
          className="timeline-slider absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <span className="shrink-0 font-mono text-[10.5px] text-t3">
        {p.idx}<span className="text-t5">/{p.total - 1}</span>
      </span>

      <span className="hidden shrink-0 text-[9.5px] uppercase tracking-[0.14em] text-t5 xl:block">
        ← → step · space play · c/v/m jump · r reset · [ ] panels
      </span>
    </div>
  );
}
