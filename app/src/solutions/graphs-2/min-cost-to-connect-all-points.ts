import type { SolutionDef } from "@/engine/types"

// 5 points (LeetCode's example): (0,0) (2,2) (3,10) (5,2) (7,0).
// Cost of an edge = Manhattan distance. MST total = 20.
const POINTS: [number, number][] = [
  [0, 0],
  [2, 2],
  [3, 10],
  [5, 2],
  [7, 0],
]
const N = POINTS.length

export const minCostConnectPoints: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table (one slot per point)
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// points: (0,0) (2,2) (3,10) (5,2) (7,0) — cost = |Δx|+|Δy|
function minCostConnectPoints(points) {
  const edges = [];                  // every pair [cost, i, j]
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      edges.push([manhattan(i, j), i, j]);
  edges.sort((p, q) => p[0] - q[0]); // cheapest first — Kruskal
  let total = 0, used = 0;
  for (const [w, i, j] of edges) {
    const ri = find(i), rj = find(j);
    if (ri === rj) continue;         // would close a cycle — skip
    parent[rj] = ri;                 // union the two clusters
    total += w; used++;
    if (used === n - 1) break;       // spanning tree complete
  }
  return total;
}
function find(x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// points: (0,0) (2,2) (3,10) (5,2) (7,0) — cost = |Δx|+|Δy|
int minCostConnectPoints(int[][] points) {
  List<int[]> edges = new ArrayList<>();  // every pair {cost, i, j}
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
      edges.add(new int[]{manhattan(i, j), i, j});
  edges.sort((p, q) -> p[0] - q[0]); // cheapest first — Kruskal
  int total = 0, used = 0;
  for (int[] e : edges) { int w = e[0], i = e[1], j = e[2];
    int ri = find(i), rj = find(j);
    if (ri == rj) continue;          // would close a cycle — skip
    parent[rj] = ri;                 // union the two clusters
    total += w; used++;
    if (used == n - 1) break;        // spanning tree complete
  }
  return total;
}
int find(int x) {
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [],
  entry: () => `minCostConnectPoints([(0,0),(2,2),(3,10),(5,2),(7,0)])`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const man = (i: number, j: number) =>
      Math.abs(POINTS[i][0] - POINTS[j][0]) + Math.abs(POINTS[i][1] - POINTS[j][1])
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(18, `find(${x}): parent[${cur}] = ${parent[cur]} — climb.`)
          cur = parent[cur]
        }
        line(19, `find(${x}) = <b>${cur}</b>.`)
        return cur
      },
      17,
    )
    const go = fn(
      "minCostConnectPoints",
      (): number => {
        const edges: [number, number, number][] = []
        for (let i = 0; i < N; i++)
          for (let j = i + 1; j < N; j++) edges.push([man(i, j), i, j])
        line(5, `All ${edges.length} pairwise edges built — e.g. P1(2,2)↔P3(5,2): |2−5|+|2−2| = <b>3</b>.`)
        edges.sort((p, q) => p[0] - q[0])
        heap("sortedEdges", edges.map(([w, i, j]) => `${i}-${j}:$${w}`))
        line(6, `Sorted cheapest-first: ${edges.slice(0, 3).map(([w, i, j]) => `${i}-${j}($${w})`).join(", ")}, … Kruskal eats them in this order.`)
        let total = 0
        let used = 0
        const mst: string[] = []
        for (const [w, i, j] of edges) {
          mark("focus", [i, j])
          line(9, `Edge ${i}-${j} ($${w}): are point ${i} and point ${j} already in one cluster?`)
          const ri = find(i)
          const rj = find(j)
          if (ri === rj) {
            mark("bad", [i, j])
            line(10, `Same root ${ri} — adding ${i}-${j} would close a <b>cycle</b>. $${w} saved: skip.`)
            continue
          }
          parent[rj] = ri
          aset(rj, ri)
          total += w
          used++
          mst.push(`${i}-${j}:$${w}`)
          heap("mstEdges", mst)
          vars({ total, used })
          line(11, `Different roots (${ri} ≠ ${rj}) — union: parent[${rj}] = ${ri}. Edge ${i}-${j} joins the MST, total = <b>$${total}</b>.`)
          if (used === N - 1) {
            line(13, `${N - 1} edges connect ${N} points — the spanning tree is <b>complete</b>, ignore the rest.`)
            break
          }
        }
        mark("focus", [])
        line(15, `Minimum wiring cost = <b>$${total}</b>.`)
        return total
      },
      1,
    )
    narrate(`Kruskal on a complete graph: sort the O(n²) Manhattan edges, let union-find reject cycle-closers, stop at n−1 accepted edges.`)
    return go()
  },
}
