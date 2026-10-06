import type { SolutionDef } from "@/engine/types"

// edge list [u, v, w] — one negative edge, no negative cycle
const EDGES: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 5],
  [1, 3, 3],
  [2, 1, -3],
  [3, 4, 2],
  [1, 2, 6],
]
const V = 5

export const bellmanFord: SolutionDef = {
  view: "array",
  array: () => EDGES.map(([u, v, w]) => `${u}→${v}:${w}`),
  code: `// edges: 0→1:4 0→2:5 1→3:3 2→1:-3 3→4:2 1→2:6
function bellmanFord(src) {
  dist[src] = 0;
  for (let round = 1; round <= V - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {   // relax edge u→v
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;             // already settled — stop
  }
  return dist;                       // still improving now ⇒ negative cycle
}`,
  codeJava: `// int[][] edges = {u, v, w} — one negative edge: 2→1:-3
int[] bellmanFord(int src) {
  dist[src] = 0;
  for (int round = 1; round <= V - 1; round++) {
    boolean changed = false;
    for (int[] e : edges) { int u = e[0], v = e[1], w = e[2];
      if (dist[u] + w < dist[v]) {   // relax edge u→v
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;             // already settled — stop
  }
  return dist;                      // still improving now ⇒ negative cycle
}`,
  inputs: [],
  entry: () => `bellmanFord(0)`,
  run({ fn, heap, line, vars, ptr, mark, narrate }) {
    const go = fn(
      "bellmanFord",
      (src: number): string => {
        const dist = [Infinity, Infinity, Infinity, Infinity, Infinity]
        const snap = () => dist.map((d) => (d === Infinity ? "∞" : d))
        const fmtD = (d: number) => (d === Infinity ? "∞" : String(d))
        dist[src] = 0
        heap("dist", snap())
        line(2, `dist[${src}] = 0; everything else ∞. A shortest path visits each node at most once, so it uses at most V−1 = ${V - 1} edges — that's why ${V - 1} rounds always suffice.`)
        const improvedEver: number[] = []
        for (let round = 1; round <= V - 1; round++) {
          let changed = false
          vars({ round })
          line(3, `<b>Round ${round}</b>: relax all ${EDGES.length} edges. After round ${round}, every shortest path using ≤ ${round} edges is locked in.`)
          for (let e = 0; e < EDGES.length; e++) {
            const [u, v, w] = EDGES[e]
            vars({ u, v })
            ptr("e", e)
            mark("focus", [e])
            if (dist[u] + w < dist[v]) {
              const old = fmtD(dist[v])
              dist[v] = dist[u] + w
              changed = true
              heap("dist", snap())
              if (!improvedEver.includes(e)) improvedEver.push(e)
              mark("good", [...improvedEver])
              line(7, `Relax ${u}→${v} (w=${w}): dist[${v}] ${old} → <b>${dist[v]}</b> via ${u}.`)
            } else {
              line(6, `Edge ${u}→${v} (w=${w}): ${fmtD(dist[u])} + ${w} ≥ dist[${v}] = ${fmtD(dist[v])} — nothing to improve.`)
            }
          }
          if (!changed) {
            line(11, `Round ${round} relaxed <b>nothing</b> — the distances are settled. Stop early (a change in round V would have meant a negative cycle).`)
            break
          }
        }
        ptr("e", -1)
        mark("focus", [])
        line(13, `dist = [${snap().join(", ")}]. The path 0→2→1→3→4 uses 4 edges — node 4's answer only appeared in round 2, exactly why one round isn't enough.`)
        return JSON.stringify(snap())
      },
      1,
    )
    narrate(`Bellman-Ford relaxes EVERY edge, round after round. Round k locks in all shortest paths of ≤ k edges — negative weights (like 2→1:-3) are fine as long as there's no negative cycle.`)
    return go(0)
  },
}
