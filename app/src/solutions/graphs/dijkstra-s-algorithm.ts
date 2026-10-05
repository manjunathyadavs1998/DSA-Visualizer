import type { SolutionDef } from "@/engine/types"

// weighted directed graph: adj[u] = [v, w] pairs
const ADJ: [number, number][][] = [
  [[1, 4], [2, 1]], // 0
  [[3, 1]], // 1
  [[1, 2], [3, 5]], // 2
  [[4, 3]], // 3
  [], // 4
]

export const dijkstra: SolutionDef = {
  code: `// weighted: 0→1:4 0→2:1 2→1:2 1→3:1 2→3:5 3→4:3
function dijkstra(src) {
  dist[src] = 0;
  const pq = [[0, src]];               // [distance, node]
  while (pq.length > 0) {
    const [d, u] = popMin(pq);         // closest unsettled node
    if (d > dist[u]) continue;         // stale entry — skip
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {     // shorter path via u?
        dist[v] = dist[u] + w;         // relax edge u→v
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
  codeJava: `// int[][] adj[u] = {v, w} pairs — same weighted graph
int[] dijkstra(int src) {
  dist[src] = 0;
  PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]); pq.add(new int[]{0, src});
  while (!pq.isEmpty()) {
    int[] t = pq.poll(); int d = t[0], u = t[1];
    if (d > dist[u]) continue;         // stale entry — skip
    for (int[] e : adj[u]) { int v = e[0], w = e[1];
      if (dist[u] + w < dist[v]) {     // shorter path via u?
        dist[v] = dist[u] + w;         // relax edge u→v
        pq.add(new int[]{dist[v], v});
      }
    }
  }
  return dist;
}`,
  inputs: [{ kind: "number", name: "src", label: "source node", default: 0, min: 0, max: 4 }],
  entry: (a) => `dijkstra(${a.src})`,
  run({ fn, heap, line, vars, narrate }, args) {
    const src = args.src as number
    const go = fn(
      "dijkstra",
      (s: number): string => {
        const dist = [Infinity, Infinity, Infinity, Infinity, Infinity]
        const distSnap = () => dist.map((d) => (d === Infinity ? "∞" : d))
        const pq: [number, number][] = []
        const pqSnap = () => pq.map(([d, u]) => `node ${u} @ ${d}`)
        dist[s] = 0
        heap("dist", distSnap())
        line(2, `dist[${s}] = 0 — the source is 0 away from itself. Everything else starts at ∞.`)
        pq.push([0, s])
        heap("pq", pqSnap())
        line(3, `Seed the priority queue with (0, ${s}).`)
        while (pq.length > 0) {
          pq.sort((a, b) => a[0] - b[0])
          const [d, u] = pq.shift() as [number, number]
          heap("pq", pqSnap())
          if (d > dist[u]) {
            line(6, `Pop (${d}, ${u}) — but dist[${u}] is already ${dist[u]} < ${d}. Stale leftover, skip it.`)
            continue
          }
          vars({ u, "dist[u]": d })
          line(5, `Pop node ${u} at distance ${d} — the <b>closest</b> unsettled node. No other path can undercut it (all weights ≥ 0), so ${u} is settled for good.`)
          for (const [v, w] of ADJ[u]) {
            if (dist[u] + w < dist[v]) {
              const old = dist[v] === Infinity ? "∞" : dist[v]
              dist[v] = dist[u] + w
              heap("dist", distSnap())
              line(9, `Relax ${u}→${v} (weight ${w}): dist[${v}] ${old} → <b>${dist[v]}</b> via ${u}.`)
              pq.push([dist[v], v])
              heap("pq", pqSnap())
            } else {
              line(8, `Edge ${u}→${v} (weight ${w}): ${dist[u]} + ${w} = ${dist[u] + w} ≥ dist[${v}] = ${dist[v]} — no improvement.`)
            }
          }
        }
        line(14, `PQ empty — final dist = [${distSnap().join(", ")}].`)
        return JSON.stringify(distSnap())
      },
      1,
    )
    narrate(`Dijkstra is greedy BFS with weights: always settle the closest frontier node. Non-negative weights are what make the greedy pick safe.`)
    return go(src)
  },
}
