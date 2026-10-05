import type { SolutionDef } from "@/engine/types"

// edges already sorted ascending by weight: [u, v, w]
const EDGES: [number, number, number][] = [
  [0, 1, 1],
  [2, 3, 2],
  [1, 2, 3],
  [0, 2, 4],
  [3, 4, 5],
  [1, 4, 6],
]
const V = 5

export const kruskalMST: SolutionDef = {
  view: "array",
  array: () => EDGES.map(([u, v, w]) => `${u}-${v}:${w}`),
  code: `// edges sorted by weight: 0-1:1 2-3:2 1-2:3 0-2:4 3-4:5 1-4:6
function kruskalMST() {
  let total = 0, used = 0;
  for (const [u, v, w] of sortedEdges) {
    const ru = find(u), rv = find(v);   // roots of both sides
    if (ru === rv) continue;            // same tree → cycle, reject
    parent[rv] = ru;                    // union the two trees
    total += w; used++;                 // edge u-v joins the MST
    if (used === V - 1) break;          // tree complete
  }
  return total;
}
function find(x) {                      // walk up to the root
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// int[][] sortedEdges = {u, v, w} sorted ascending by weight
int kruskalMST() {
  int total = 0, used = 0;
  for (int[] e : sortedEdges) { int u = e[0], v = e[1], w = e[2];
    int ru = find(u), rv = find(v);     // roots of both sides
    if (ru == rv) continue;             // same tree → cycle, reject
    parent[rv] = ru;                    // union the two trees
    total += w; used++;                 // edge u-v joins the MST
    if (used == V - 1) break;           // tree complete
  }
  return total;
}
int find(int x) {                       // walk up to the root
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [],
  entry: () => `kruskalMST()`,
  run({ fn, memo, heap, line, vars, ptr, mark, narrate }) {
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        for (;;) {
          const p = memo[cur] as number
          if (p === cur) break
          line(13, `find(${x}): parent[${cur}] = ${p} — not a root, climb up.`)
          cur = p
        }
        return cur
      },
      12,
    )
    const go = fn(
      "kruskalMST",
      (): number => {
        for (let i = 0; i < V; i++) memo[i] = i
        let total = 0
        let used = 0
        const taken: number[] = []
        const rejected: number[] = []
        heap("mstEdges", [])
        line(2, `Every node starts as its own tiny tree (parent[i] = i). Greedily scan edges cheapest-first.`)
        for (let e = 0; e < EDGES.length; e++) {
          const [u, v, w] = EDGES[e]
          ptr("e", e)
          mark("focus", [e])
          const ru = find(u)
          const rv = find(v)
          if (ru === rv) {
            rejected.push(e)
            mark("bad", [...rejected])
            line(5, `Roots are both ${ru} — ${u} and ${v} are <b>already connected</b>. Adding ${u}-${v} would close a cycle. Reject.`)
            continue
          }
          memo[rv] = ru
          taken.push(e)
          mark("good", [...taken])
          total += w
          used++
          heap("mstEdges", taken.map((i) => `${EDGES[i][0]}-${EDGES[i][1]}:${EDGES[i][2]}`))
          vars({ edge: `${u}-${v}`, total, used })
          line(7, `Roots differ (${ru} ≠ ${rv}) — union: parent[${rv}] = ${ru}. Edge ${u}-${v} joins the MST (total ${total}).`)
          if (used === V - 1) {
            line(8, `${V - 1} edges taken — a spanning tree of ${V} nodes is complete. Stop.`)
            break
          }
        }
        ptr("e", -1)
        mark("focus", [])
        line(10, `MST total weight = <b>${total}</b>. Cheapest-first + cycle rejection is all Kruskal is.`)
        return total
      },
      1,
    )
    narrate(`Kruskal sorts edges by weight and takes each one unless it closes a cycle — the DSU (union-find) table below answers "already connected?" in near-constant time.`)
    return go()
  },
}
