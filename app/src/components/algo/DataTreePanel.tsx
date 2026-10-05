interface TN {
  val: number;
  left: TN | null;
  right: TN | null;
}

/** Standard LeetCode level-order build; -1 means a missing child
 *  (mirrors the builder inside the tree solutions exactly). */
function build(vals: number[]): TN | null {
  if (!vals.length || vals[0] === -1) return null;
  const root: TN = { val: vals[0], left: null, right: null };
  const q: TN[] = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const node = q.shift()!;
    if (i < vals.length && vals[i] !== -1) q.push((node.left = { val: vals[i], left: null, right: null }));
    i++;
    if (i < vals.length && vals[i] !== -1) q.push((node.right = { val: vals[i], left: null, right: null }));
    i++;
  }
  return root;
}

const R = 13;
const X_GAP = 38;
const Y_GAP = 46;

function nodeStyle(state: 'current' | 'frontier' | 'done' | 'idle'): React.CSSProperties {
  if (state === 'current')
    return { fill: 'color-mix(in srgb, var(--c-am) 15%, transparent)', stroke: 'var(--c-am)', strokeWidth: 1.6 };
  if (state === 'frontier')
    return { fill: 'color-mix(in srgb, var(--c-cy) 12%, transparent)', stroke: 'var(--c-cy)' };
  if (state === 'done')
    return { fill: 'color-mix(in srgb, var(--c-gr) 12%, transparent)', stroke: 'var(--c-gr)' };
  return { fill: 'color-mix(in srgb, var(--c-panel) 95%, transparent)', stroke: 'var(--c-line)' };
}

/** The problem's input binary tree, lit up as the trace walks it. */
export default function DataTreePanel({
  label,
  values,
  current,
  done,
  frontier,
}: {
  label: string;
  values: number[];
  current: number | null;
  done: Set<number>;
  frontier: Set<number>;
}) {
  const root = build(values);
  if (!root)
    return <p className="px-2 text-[10px] uppercase tracking-[0.14em] text-t4">{label}: empty tree</p>;

  // inorder x-slot, depth y — plus edges parent→child
  const coord = new Map<TN, { x: number; y: number }>();
  let ix = 0;
  let maxD = 0;
  const place = (n: TN, d: number) => {
    maxD = Math.max(maxD, d);
    if (n.left) place(n.left, d + 1);
    coord.set(n, { x: ix++, y: d });
    if (n.right) place(n.right, d + 1);
  };
  place(root, 0);
  const edges: [TN, TN][] = [];
  const walk = (n: TN) => {
    for (const c of [n.left, n.right]) {
      if (c) {
        edges.push([n, c]);
        walk(c);
      }
    }
  };
  walk(root);

  const px = (x: number) => 22 + x * X_GAP;
  const py = (y: number) => 22 + y * Y_GAP;
  const w = 44 + (ix - 1) * X_GAP;
  const h = 44 + maxD * Y_GAP;
  const stateOf = (v: number) =>
    v === current ? 'current' : frontier.has(v) ? 'frontier' : done.has(v) ? 'done' : 'idle';

  return (
    <div className="shrink-0">
      <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-t4">{label}</p>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: '100%', height: 'auto' }}>
        {edges.map(([p, c], i) => {
          const a = coord.get(p)!;
          const b = coord.get(c)!;
          return (
            <line
              key={i}
              x1={px(a.x)}
              y1={py(a.y)}
              x2={px(b.x)}
              y2={py(b.y)}
              style={{ stroke: 'var(--c-line)' }}
              strokeWidth={1.2}
            />
          );
        })}
        {[...coord.entries()].map(([n, p], i) => {
          const s = stateOf(n.val);
          return (
            <g key={i}>
              <circle
                cx={px(p.x)}
                cy={py(p.y)}
                r={R}
                style={nodeStyle(s)}
                className={s === 'current' ? 'node-current' : undefined}
              />
              <text
                x={px(p.x)}
                y={py(p.y) + 3.5}
                textAnchor="middle"
                fontSize={10.5}
                fontFamily="'JetBrains Mono', monospace"
                style={{ fill: s === 'idle' ? 'var(--c-t2)' : 'var(--c-t2)' }}
              >
                {n.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
