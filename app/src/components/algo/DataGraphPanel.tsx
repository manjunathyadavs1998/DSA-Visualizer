import type { GraphSpec } from '@/data/graphData';

const R = 14;

function nodeStyle(state: 'current' | 'frontier' | 'done' | 'idle'): React.CSSProperties {
  if (state === 'current')
    return { fill: 'color-mix(in srgb, var(--c-am) 15%, transparent)', stroke: 'var(--c-am)', strokeWidth: 1.6 };
  if (state === 'frontier')
    return { fill: 'color-mix(in srgb, var(--c-cy) 12%, transparent)', stroke: 'var(--c-cy)' };
  if (state === 'done')
    return { fill: 'color-mix(in srgb, var(--c-gr) 12%, transparent)', stroke: 'var(--c-gr)' };
  return { fill: 'color-mix(in srgb, var(--c-panel) 95%, transparent)', stroke: 'var(--c-line)' };
}

/** The problem's input graph (circle layout), lit up as the trace explores it. */
export default function DataGraphPanel({
  data,
  current,
  done,
  frontier,
}: {
  data: GraphSpec;
  current: number | null;
  done: Set<number>;
  frontier: Set<number>;
}) {
  const n = data.nodes.length;
  const W = 300;
  const H = 210;
  const cx = W / 2;
  const cy = H / 2;
  const rx = W / 2 - 34;
  const ry = H / 2 - 30;
  const pos = new Map<number, { x: number; y: number }>();
  data.nodes.forEach((node, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    pos.set(node, { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  });

  const stateOf = (v: number) =>
    v === current ? 'current' : frontier.has(v) ? 'frontier' : done.has(v) ? 'done' : 'idle';

  return (
    <div className="shrink-0">
      <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-t4">
        input graph · {data.directed ? 'directed' : 'undirected'}
      </p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }}>
        <defs>
          <marker
            id="g-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--c-t4)' }} />
          </marker>
        </defs>
        {data.edges.map(([u, v, w], i) => {
          const a = pos.get(u)!;
          const b = pos.get(v)!;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const pad = data.directed ? R + 4 : R + 1;
          const x1 = a.x + ux * (R + 1);
          const y1 = a.y + uy * (R + 1);
          const x2 = b.x - ux * pad;
          const y2 = b.y - uy * pad;
          const mx = (x1 + x2) / 2 - uy * 9;
          const my = (y1 + y2) / 2 + ux * 9;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ stroke: 'var(--c-line)' }}
                strokeWidth={1.3}
                markerEnd={data.directed ? 'url(#g-arrow)' : undefined}
              />
              {w !== undefined && (
                <text
                  x={mx}
                  y={my}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ fill: 'var(--c-amt)' }}
                >
                  {w}
                </text>
              )}
            </g>
          );
        })}
        {data.nodes.map((node) => {
          const p = pos.get(node)!;
          const s = stateOf(node);
          return (
            <g key={node}>
              <circle
                cx={p.x}
                cy={p.y}
                r={R}
                style={nodeStyle(s)}
                className={s === 'current' ? 'node-current' : undefined}
              />
              <text
                x={p.x}
                y={p.y + 3.5}
                textAnchor="middle"
                fontSize={11}
                fontFamily="'JetBrains Mono', monospace"
                style={{ fill: 'var(--c-t2)' }}
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
