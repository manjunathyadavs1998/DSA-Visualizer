import type { SolutionDef } from "@/engine/types"

// 5 nodes; directed, weighted edges [u, v, w] (signal travel times):
//   0→1:2   0→2:5   1→2:1   1→3:4   2→3:1   3→4:3
// From node 0: dist = [0, 2, 3, 4, 7] → the whole network hears it at t = 7.
const N = 5
const EDGES: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 5],
  [1, 2, 1],
  [1, 3, 4],
  [2, 3, 1],
  [3, 4, 3],
]
const ADJ: [number, number][][] = Array.from({ length: N }, () => [])
for (const [u, v, w] of EDGES) ADJ[u].push([v, w])

export const networkDelayTime: SolutionDef = {
  view: "array",
  // the array below is dist[v] — earliest time the signal reaches v
  array: () => Array.from({ length: N }, (_, i) => (i === 0 ? 0 : "∞")),
  code: `// edges u→v:w — 0→1:2 0→2:5 1→2:1 1→3:4 2→3:1 3→4:3
function networkDelayTime(k) {        // k = source node
  dist[k] = 0;                        // all other dist = Infinity
  for (let i = 0; i < n; i++) {
    let u = -1;                       // Dijkstra: pick the closest
    for (let x = 0; x < n; x++)       //   unvisited node
      if (!seen[x] && (u === -1 || dist[x] < dist[u])) u = x;
    if (dist[u] === Infinity) break;  // the rest is unreachable
    seen[u] = true;                   // dist[u] is FINAL now
    for (const [v, w] of adj[u])
      if (dist[u] + w < dist[v])
        dist[v] = dist[u] + w;        // relax edge u→v
  }
  const ans = Math.max(...dist);
  return ans === Infinity ? -1 : ans;
}`,
  codeJava: `// edges u→v:w — 0→1:2 0→2:5 1→2:1 1→3:4 2→3:1 3→4:3
int networkDelayTime(int k) {         // k = source node
  dist[k] = 0;                        // all other dist = INF
  for (int i = 0; i < n; i++) {
    int u = -1;                       // Dijkstra: pick the closest
    for (int x = 0; x < n; x++)       //   unvisited node
      if (!seen[x] && (u == -1 || dist[x] < dist[u])) u = x;
    if (dist[u] == INF) break;        // the rest is unreachable
    seen[u] = true;                   // dist[u] is FINAL now
    for (int[] e : adj[u]) { int v = e[0], w = e[1];
      if (dist[u] + w < dist[v])
        dist[v] = dist[u] + w;        // relax edge u→v
    }
  }
  int ans = Arrays.stream(dist).max().getAsInt();
  return ans == INF ? -1 : ans;
}`,
  inputs: [{ kind: "number", name: "k", label: "source node k", default: 0, min: 0, max: 4 }],
  entry: (a) => `networkDelayTime(k = ${a.k})`,
  run({ fn, line, vars, aset, mark, heap, narrate }, args) {
    const k = Math.max(0, Math.min(N - 1, Math.trunc(args.k as number)))
    const show = (x: number) => (x === Infinity ? "∞" : String(x))
    const go = fn(
      "networkDelayTime",
      (): number => {
        const dist: number[] = Array(N).fill(Infinity)
        const seen: boolean[] = Array(N).fill(false)
        dist[k] = 0
        for (let i = 0; i < N; i++) aset(i, i === k ? 0 : "∞")
        line(2, `The signal starts at node ${k}: dist[${k}] = <b>0</b>, every other node ∞.`)
        const settled: number[] = []
        for (let i = 0; i < N; i++) {
          let u = -1
          for (let x = 0; x < N; x++) if (!seen[x] && (u === -1 || dist[x] < dist[u])) u = x
          mark("focus", [u])
          line(6, `Closest unvisited node: <b>${u}</b> at dist ${show(dist[u])}.`)
          if (dist[u] === Infinity) {
            line(7, `dist[${u}] = ∞ — nothing left is reachable. Stop early.`)
            break
          }
          seen[u] = true
          settled.push(u)
          heap("visited", settled)
          mark("done", [...settled])
          vars({ u, dist: `[${dist.map(show).join(",")}]` })
          line(8, `Settle <b>${u}</b>: with no negative weights, no later route can beat ${show(dist[u])} — it's final.`)
          for (const [v, w] of ADJ[u]) {
            if (dist[u] + w < dist[v]) {
              const old = dist[v]
              dist[v] = dist[u] + w
              aset(v, dist[v])
              line(11, `Relax ${u}→${v} (w=${w}): ${dist[u]} + ${w} = <b>${dist[v]}</b> beats ${show(old)}.`)
            } else {
              line(10, `Relax ${u}→${v} (w=${w}): ${dist[u]} + ${w} = ${dist[u] + w} ≥ ${show(dist[v])} — keep the old time.`)
            }
          }
        }
        mark("focus", [])
        const ans = Math.max(...dist)
        if (ans === Infinity) {
          mark("bad", dist.map((d, i) => (d === Infinity ? i : -1)).filter((i) => i >= 0))
          line(14, `Some node never got the signal → <b>-1</b>.`)
          return -1
        }
        const last = dist.indexOf(ans)
        mark("good", [last])
        line(14, `The LAST node to hear the signal is ${last} at t = <b>${ans}</b> — that's the network delay.`)
        return ans
      },
      1,
    )
    narrate(`Dijkstra's one rule: always settle the globally closest frontier node — safe only because weights are non-negative. The answer is the max of all shortest paths.`)
    return go()
  },
}
