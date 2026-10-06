/** Renders a binary tree from a level-order number array.
 *  Used to visualise the OUTPUT tree for construct / invert problems. */

interface TN { val: number; left: TN | null; right: TN | null }

function build(vals: number[]): TN | null {
  if (!vals.length || vals[0] === -1) return null;
  const root: TN = { val: vals[0], left: null, right: null };
  const q: TN[] = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const node = q.shift()!;
    if (vals[i] !== -1) q.push((node.left = { val: vals[i], left: null, right: null }));
    i++;
    if (i < vals.length && vals[i] !== -1) q.push((node.right = { val: vals[i], left: null, right: null }));
    i++;
  }
  return root;
}

const R = 13;
const X_GAP = 38;
const Y_GAP = 46;

function TreeSVG({ root, label }: { root: TN; label: string }) {
  const coord = new Map<TN, { x: number; y: number }>();
  let ix = 0, maxD = 0;
  const place = (n: TN, d: number) => {
    maxD = Math.max(maxD, d);
    if (n.left) place(n.left, d + 1);
    coord.set(n, { x: ix++, y: d });
    if (n.right) place(n.right, d + 1);
  };
  place(root, 0);

  const edges: [TN, TN][] = [];
  const walk = (n: TN) => {
    for (const c of [n.left, n.right]) { if (c) { edges.push([n, c]); walk(c); } }
  };
  walk(root);

  const px = (x: number) => 22 + x * X_GAP;
  const py = (y: number) => 22 + y * Y_GAP;
  const w = 44 + (ix - 1) * X_GAP;
  const h = 44 + maxD * Y_GAP;

  return (
    <div className="shrink-0">
      <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-t4">{label}</p>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: '100%', height: 'auto' }}>
        {edges.map(([p, c], i) => {
          const a = coord.get(p)!;
          const b = coord.get(c)!;
          return (
            <line key={i}
              x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)}
              style={{ stroke: 'var(--c-line)' }} strokeWidth={1.2}
            />
          );
        })}
        {[...coord.entries()].map(([n, p], i) => (
          <g key={i}>
            <circle cx={px(p.x)} cy={py(p.y)} r={R}
              style={{ fill: 'color-mix(in srgb, var(--c-gr) 12%, transparent)', stroke: 'var(--c-gr)', strokeWidth: 1.4 }}
            />
            <text x={px(p.x)} y={py(p.y) + 3.5} textAnchor="middle"
              fontSize={10.5} fontFamily="'JetBrains Mono', monospace"
              style={{ fill: 'var(--c-t1)' }}
            >
              {n.val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Parse the result string into a level-order number array, or return null. */
export function parseLevelOrder(result: unknown): number[] | null {
  if (typeof result !== 'string') return null;
  try {
    const parsed = JSON.parse(result);
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every((v) => typeof v === 'number')
    ) return parsed as number[];
  } catch { /* not JSON */ }
  return null;
}

export default function ResultTreePanel({
  result,
  inputVals,
  inputLabel,
}: {
  result: unknown;
  /** Optional: original input tree level-order (for before/after). */
  inputVals?: number[];
  inputLabel?: string;
}) {
  const outVals = parseLevelOrder(result);
  if (!outVals) return null;

  const outRoot = build(outVals);
  if (!outRoot) return null;

  const inRoot = inputVals && inputVals.length ? build(inputVals) : null;
  const showBoth = inRoot && inputLabel;

  return (
    <div className="shrink-0 border-t border-line px-3 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gr" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-t3">
          {showBoth ? 'Input → Output Tree' : 'Output Tree'}
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        {showBoth && inRoot && (
          <>
            <TreeSVG root={inRoot} label={inputLabel!} />
            <div className="flex flex-col items-center justify-center self-center">
              <span className="text-[18px] text-t4">→</span>
            </div>
          </>
        )}
        <TreeSVG root={outRoot} label="output tree" />
      </div>
    </div>
  );
}
