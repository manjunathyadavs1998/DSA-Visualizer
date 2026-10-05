import type { SolutionDef } from "@/engine/types"

const INF = Infinity
// 4-node directed weighted graph: 0→1:3, 1→2:1, 2→3:2, 3→0:4, 0→3:10
const D0: number[][] = [
  [0, 3, INF, 10],
  [INF, 0, 1, INF],
  [INF, INF, 0, 2],
  [4, INF, INF, 0],
]
const V = 4

export const floydWarshall: SolutionDef = {
  view: "grid",
  grid: () => D0.map((row) => row.map((d) => (d === INF ? "∞" : d))),
  code: `// dist = adjacency matrix of a 4-node graph; ∞ = no edge
function floydWarshall() {
  for (let k = 0; k < V; k++)          // allow k as a stopover
    for (let i = 0; i < V; i++)
      for (let j = 0; j < V; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];  // i→k→j shortcut
  return dist;
}`,
  codeJava: `// int[][] dist = adjacency matrix; INF = no edge
int[][] floydWarshall() {
  for (int k = 0; k < V; k++)          // allow k as a stopover
    for (int i = 0; i < V; i++)
      for (int j = 0; j < V; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];  // i→k→j shortcut
  return dist;
}`,
  inputs: [],
  entry: () => `floydWarshall()`,
  run({ fn, line, vars, gptr, gmark, gset, narrate }) {
    const go = fn(
      "floydWarshall",
      (): string => {
        const dist = D0.map((row) => [...row])
        const fmtD = (d: number) => (d === INF ? "∞" : String(d))
        for (let k = 0; k < V; k++) {
          gptr("k", k, k)
          vars({ k })
          line(2, `<b>k = ${k}</b>: from now on, paths may stop over at node ${k}. Cell (i,j) asks: is i→${k} plus ${k}→j shorter than what I have?`)
          for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
              if (i === j || i === k || j === k) continue
              if (dist[i][k] === INF || dist[k][j] === INF) continue // no route through k
              gptr("i", i, -1)
              gptr("j", -1, j)
              gmark("focus", [[i, k], [k, j]])
              const via = dist[i][k] + dist[k][j]
              if (via < dist[i][j]) {
                const old = fmtD(dist[i][j])
                dist[i][j] = via
                gset(i, j, via)
                line(6, `dist[${i}][${j}]: ${i}→${k}→${j} costs ${fmtD(dist[i][k])} + ${fmtD(dist[k][j])} = ${via} &lt; ${old} — <b>take the shortcut via ${k}</b>.`)
              } else {
                line(5, `dist[${i}][${j}]: via ${k} costs ${via}, current is ${fmtD(dist[i][j])} — keep it.`)
              }
            }
          }
        }
        gmark("focus", [])
        gptr("i", -2, -2)
        gptr("j", -2, -2)
        line(7, `All ${V} stopovers considered — the matrix now holds ALL-pairs shortest paths. Note dist[0][3] fell 10 → 6 by routing 0→1→2→3.`)
        return JSON.stringify(dist)
      },
      1,
    )
    narrate(`Floyd-Warshall is DP on the matrix itself: after round k, dist[i][j] is the shortest path using only stopovers from {0..k}. Watch the ∞ cells fill in and the direct edge 0→3:10 get beaten.`)
    return go()
  },
}
