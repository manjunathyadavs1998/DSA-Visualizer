import type { GraphSpec } from '@/data/graphData';
import type { DerivedState } from '@/engine/types';

const R = 14;

type NodeExtra = { label?: string; color?: 'done' | 'frontier' | 'accent' | 'idle' };
type EdgeExtra = { highlight?: boolean; label?: string };

function nodeStyle(color: NodeExtra['color']): React.CSSProperties {
  if (color === 'done')
    return { fill: 'color-mix(in srgb, var(--c-gr) 18%, transparent)', stroke: 'var(--c-gr)', strokeWidth: 1.6 };
  if (color === 'frontier')
    return { fill: 'color-mix(in srgb, var(--c-cy) 15%, transparent)', stroke: 'var(--c-cy)', strokeWidth: 1.4 };
  if (color === 'accent')
    return { fill: 'color-mix(in srgb, var(--c-am) 18%, transparent)', stroke: 'var(--c-am)', strokeWidth: 1.6 };
  return { fill: 'color-mix(in srgb, var(--c-panel) 95%, transparent)', stroke: 'var(--c-line)' };
}

/** Derive per-node and per-edge overlays from the final heap state. */
function deriveOverlay(
  slug: string,
  data: GraphSpec,
  heap: Record<string, unknown>,
): { nodes: Map<number, NodeExtra>; edges: Map<string, EdgeExtra>; legend: string } | null {
  const nodes = new Map<number, NodeExtra>();
  const edges = new Map<string, EdgeExtra>();

  // --- Dijkstra / Bellman-Ford: dist[] on nodes ---
  if (slug === 'dijkstra-s-algorithm' || slug === 'bellman-ford') {
    const dist = heap['dist'] as (string | number)[] | undefined;
    if (!dist) return null;
    data.nodes.forEach((n, i) => {
      const d = dist[i];
      nodes.set(n, { label: d === '∞' || d === undefined ? '∞' : String(d), color: d !== '∞' && d !== undefined && d !== Infinity ? 'done' : 'idle' });
    });
    return { nodes, edges, legend: 'node label = shortest dist from src' };
  }

  // --- BFS / DFS / Topological Sort: order[] on nodes ---
  if (slug === 'bfs-traversal' || slug === 'dfs-traversal' || slug === 'topological-sort') {
    const order = heap['order'] as number[] | undefined;
    if (!order || !order.length) return null;
    const pos = new Map(order.map((n, i) => [n, i + 1]));
    data.nodes.forEach((n) => {
      const rank = pos.get(n);
      nodes.set(n, { label: rank !== undefined ? String(rank) : '', color: rank !== undefined ? 'done' : 'idle' });
    });
    return { nodes, edges, legend: 'node label = visit order' };
  }

  // --- MST Kruskal: mstEdges[] highlight ---
  if (slug === 'mst-kruskal-s') {
    const mstEdges = heap['mstEdges'] as string[] | undefined;
    if (!mstEdges || !mstEdges.length) return null;
    const edgeSet = new Set(mstEdges.map((e) => e.split(':')[0]));
    data.edges.forEach(([u, v, w]) => {
      const key = `${u}-${v}`;
      const keyR = `${v}-${u}`;
      if (edgeSet.has(key) || edgeSet.has(keyR)) {
        edges.set(key, { highlight: true, label: w !== undefined ? String(w) : undefined });
      }
    });
    const mstNodes = new Set<number>();
    mstEdges.forEach((e) => {
      const [uv] = e.split(':');
      const [u, v] = uv.split('-').map(Number);
      mstNodes.add(u); mstNodes.add(v);
    });
    data.nodes.forEach((n) => nodes.set(n, { color: mstNodes.has(n) ? 'done' : 'idle' }));
    return { nodes, edges, legend: 'green edges = MST' };
  }

  // --- MST Prim: inMST[] nodes ---
  if (slug === 'mst-prim-s') {
    const inMST = heap['inMST'] as number[] | undefined;
    const key = heap['key'] as (string | number)[] | undefined;
    if (!inMST) return null;
    const mstSet = new Set(inMST);
    data.nodes.forEach((n, i) => {
      const k = key?.[i];
      nodes.set(n, {
        label: mstSet.has(n) ? '✓' : (k !== undefined && k !== '∞' ? String(k) : '∞'),
        color: mstSet.has(n) ? 'done' : 'idle',
      });
    });
    return { nodes, edges, legend: '✓ = in MST · label = key (cheapest edge to tree)' };
  }

  // --- Bipartite: color[] / state[] on nodes ---
  if (slug === 'is-graph-bipartite') {
    const colored = heap['visited'] as Record<number, number> | number[] | undefined;
    if (!colored) return null;
    data.nodes.forEach((n) => {
      const c = Array.isArray(colored) ? colored[n] : (colored as Record<number, number>)[n];
      nodes.set(n, {
        label: c === 0 ? 'A' : c === 1 ? 'B' : '',
        color: c === 0 ? 'done' : c === 1 ? 'frontier' : 'idle',
      });
    });
    return { nodes, edges, legend: 'A / B = 2-coloring groups' };
  }

  // --- All Paths: highlight found paths ---
  if (slug === 'all-paths-from-source-to-target') {
    const output = heap['output'] as string[] | undefined;
    if (!output || !output.length) return null;
    const edgeCount = new Map<string, number>();
    output.forEach((pathStr) => {
      const nodes = pathStr.split('→').map(Number);
      for (let i = 0; i < nodes.length - 1; i++) {
        const k = `${nodes[i]}-${nodes[i + 1]}`;
        edgeCount.set(k, (edgeCount.get(k) ?? 0) + 1);
      }
    });
    edgeCount.forEach((count, k) => edges.set(k, { highlight: true, label: count > 1 ? `×${count}` : undefined }));
    data.nodes.forEach((n) => nodes.set(n, { color: 'idle' }));
    return { nodes, edges, legend: `${output.length} path${output.length > 1 ? 's' : ''} found · green = used edges` };
  }

  // --- SCC Kosaraju: component[] on nodes ---
  if (slug === 'strongly-connected-components-kosaraju') {
    const components = heap['components'] as number[][] | undefined;
    if (!components || !components.length) return null;
    const colors: NodeExtra['color'][] = ['done', 'frontier', 'accent', 'done', 'frontier'];
    components.forEach((comp, ci) => {
      comp.forEach((n) => nodes.set(n, { label: `C${ci + 1}`, color: colors[ci % colors.length] }));
    });
    return { nodes, edges, legend: `${components.length} SCC${components.length > 1 ? 's' : ''} · label = component` };
  }

  return null;
}

export default function ResultGraphPanel({
  data,
  slug,
  dstate,
}: {
  data: GraphSpec;
  slug: string;
  dstate: DerivedState;
}) {
  const overlay = deriveOverlay(slug, data, dstate.heap);
  if (!overlay) return null;

  const n = data.nodes.length;
  const W = 300, H = 210;
  const cx = W / 2, cy = H / 2;
  const rx = W / 2 - 34, ry = H / 2 - 30;
  const pos = new Map<number, { x: number; y: number }>();
  data.nodes.forEach((node, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    pos.set(node, { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  });

  return (
    <div className="shrink-0 border-t border-line px-3 py-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gr" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-t3">
          Result · {data.directed ? 'Directed' : 'Undirected'} Graph
        </span>
      </div>
      <p className="mb-2 text-[9px] uppercase tracking-[0.12em] text-t4">{overlay.legend}</p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }}>
        <defs>
          <marker id="rg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--c-t4)' }} />
          </marker>
          <marker id="rg-arrow-hl" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: 'var(--c-gr)' }} />
          </marker>
        </defs>

        {/* edges */}
        {data.edges.map(([u, v, w], i) => {
          const a = pos.get(u)!, b = pos.get(v)!;
          const dx = b.x - a.x, dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len;
          const pad = data.directed ? R + 4 : R + 1;
          const x1 = a.x + ux * (R + 1), y1 = a.y + uy * (R + 1);
          const x2 = b.x - ux * pad, y2 = b.y - uy * pad;
          const mx = (x1 + x2) / 2 - uy * 9, my = (y1 + y2) / 2 + ux * 9;
          const ekey = `${u}-${v}`;
          const edata = overlay.edges.get(ekey);
          const hl = edata?.highlight ?? false;
          const elabel = edata?.label ?? (w !== undefined ? String(w) : undefined);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                strokeWidth={hl ? 2.2 : 1.3}
                style={{ stroke: hl ? 'var(--c-gr)' : 'var(--c-line)' }}
                markerEnd={data.directed ? (hl ? 'url(#rg-arrow-hl)' : 'url(#rg-arrow)') : undefined}
              />
              {elabel && (
                <text x={mx} y={my} textAnchor="middle" fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ fill: hl ? 'var(--c-grt)' : 'var(--c-amt)' }}>
                  {elabel}
                </text>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {data.nodes.map((node) => {
          const p = pos.get(node)!;
          const extra = overlay.nodes.get(node) ?? { color: 'idle' };
          const hasLabel = extra.label && extra.label.length > 0;
          return (
            <g key={node}>
              <circle cx={p.x} cy={p.y} r={R} style={nodeStyle(extra.color)} />
              {/* node id — smaller, top-left of circle */}
              <text x={p.x - (hasLabel ? 4 : 0)} y={p.y + (hasLabel ? 1 : 4)}
                textAnchor="middle" fontSize={hasLabel ? 9 : 11}
                fontFamily="'JetBrains Mono', monospace"
                style={{ fill: 'var(--c-t3)' }}>
                {node}
              </text>
              {/* result label — bottom-right of circle */}
              {hasLabel && (
                <text x={p.x + 5} y={p.y + 6} textAnchor="middle" fontSize={9}
                  fontFamily="'JetBrains Mono', monospace" fontWeight="600"
                  style={{ fill: extra.color === 'done' ? 'var(--c-grt)' : extra.color === 'frontier' ? 'var(--c-cyt)' : extra.color === 'accent' ? 'var(--c-amt)' : 'var(--c-t2)' }}>
                  {extra.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
