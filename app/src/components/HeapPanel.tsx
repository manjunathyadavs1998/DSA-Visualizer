import type { HeapEntry } from '@/types/trace';
import PanelToggle from './PanelToggle';

/* Theme-following disk colors (CSS vars defined in index.css) */
const DISK_COLORS = ['var(--c-cy)', 'var(--c-gr)', 'var(--c-am)', 'var(--c-pk)', 'var(--c-pu)'];

function ArrayView({ e }: { e: HeapEntry }) {
  const highlight = new Set(e.highlight ?? []);
  const faded = new Set(e.faded ?? []);
  const pointersAt = (i: number) => (e.pointers ?? []).filter((p) => p.index === i);
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[9.5px] uppercase tracking-[0.18em] text-t3">{e.label}</p>
      <div className="flex flex-wrap gap-1 font-mono">
        {(e.values ?? []).map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center border text-[11px] transition-all duration-150 ${
                highlight.has(i)
                  ? 'border-am bg-am/15 text-amt'
                  : faded.has(i)
                    ? 'border-line2 text-t5'
                    : 'border-line bg-panel text-t2'
              }`}
            >
              {v}
            </div>
            <span className="mt-0.5 text-[8px] text-t5">{i}</span>
            <span className="h-3 text-[8px] leading-3 text-cy">
              {pointersAt(i).map((p) => p.name).join(' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TowersView({ e }: { e: HeapEntry }) {
  const pegs = e.towers ?? [];
  const maxN = Math.max(1, ...pegs.flat());
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[9.5px] uppercase tracking-[0.18em] text-t3">{e.label}</p>
      <div className="grid grid-cols-3 gap-2">
        {pegs.map((peg, pi) => (
          <div key={pi} className="flex flex-col items-center">
            <div className="relative flex h-28 w-full flex-col-reverse items-center justify-start border-b-2 border-mid">
              <div className="absolute bottom-0 top-1 w-[3px] bg-mid/60" />
              {peg.map((d) => (
                <div
                  key={d}
                  className="disk-in relative z-10 mb-[2px] h-4 border border-black/30"
                  style={{
                    width: `${(d / maxN) * 82 + 14}%`,
                    background: DISK_COLORS[(d - 1) % DISK_COLORS.length],
                    boxShadow: `0 0 10px color-mix(in srgb, ${DISK_COLORS[(d - 1) % DISK_COLORS.length]} 27%, transparent)`,
                  }}
                />
              ))}
            </div>
            <span className="mt-1 font-mono text-[10px] tracking-widest text-t3">
              {e.pegNames?.[pi] ?? String.fromCharCode(65 + pi)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BinTreeView({ e }: { e: HeapEntry }) {
  const data = e.treeData;
  if (!data) return null;
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[9.5px] uppercase tracking-[0.18em] text-t3">{e.label}</p>
      <svg viewBox="0 0 232 152" className="w-full">
        {data.nodes.map((n) => {
          if (!n.parentId) return null;
          const p = byId.get(n.parentId)!;
          return (
            <line
              key={`l-${n.id}`}
              x1={p.x}
              y1={p.y}
              x2={n.x}
              y2={n.y}
              style={{ stroke: 'var(--c-line)' }}
              strokeWidth={1.2}
            />
          );
        })}
        {data.nodes.map((n) => {
          const cur = n.id === data.current;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={14}
                strokeWidth={cur ? 1.6 : 1}
                style={{
                  fill: cur
                    ? 'color-mix(in srgb, var(--c-am) 15%, transparent)'
                    : 'color-mix(in srgb, var(--c-panel) 95%, transparent)',
                  stroke: cur ? 'var(--c-am)' : 'color-mix(in srgb, var(--c-cy) 33%, transparent)',
                }}
                className={cur ? 'node-current' : undefined}
              />
              <text
                x={n.x}
                y={n.y + 3.5}
                textAnchor="middle"
                fontSize={11}
                style={{ fill: cur ? 'var(--c-amt)' : 'var(--c-t2)' }}
                fontFamily="'JetBrains Mono', monospace"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HeapPanel({
  heap,
  collapsed = false,
  onToggle,
}: {
  heap: HeapEntry[];
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gr pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Heap / Memory
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
        <div className="flex-1 overflow-y-auto p-3">
          {heap.map((e) => {
            if (e.kind === 'array') return <ArrayView key={e.id} e={e} />;
            if (e.kind === 'towers') return <TowersView key={e.id} e={e} />;
            if (e.kind === 'bintree') return <BinTreeView key={e.id} e={e} />;
            return (
              <p key={e.id} className="border-l-2 border-line pl-3 text-[10.5px] leading-relaxed text-t3">
                {e.note}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
