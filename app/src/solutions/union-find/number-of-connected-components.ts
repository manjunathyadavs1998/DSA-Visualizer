import type { SolutionDef } from "@/engine/types"

// 8 nodes, edges chosen so components are {0,1,2}, {3,4,5}, {6}, {7}
const N = 8
const EDGES: [number, number][] = [[0,1],[1,2],[3,4],[4,5]]

export const numberOfConnectedComponents: SolutionDef = {
  view: "array",
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// parent[] shown below
function countComponents(n, edges) {
  let count = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[rb] = ra; count--; }
  }
  return count;
}
function find(x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]]; // path halving
    x = parent[x];
  }
  return x;
}`,
  codeJava: `int countComponents(int n, int[][] edges) {
  int count = n;
  for (int[] e : edges) {
    int ra = find(e[0]), rb = find(e[1]);
    if (ra != rb) { parent[rb] = ra; count--; }
  }
  return count;
}
int find(int x) {
  while (parent[x] != x) {
    parent[x] = parent[parent[x]]; // path halving
    x = parent[x];
  }
  return x;
}`,
  inputs: [],
  entry: () => `countComponents(8, edges)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn("find", (x: number): number => {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]]
        aset(x, parent[x])
        x = parent[x]
      }
      return x
    }, 9)
    const go = fn("countComponents", (): number => {
      let count = N
      vars({ count })
      line(1, `Start: ${N} nodes, each its own component. parent[i]=i (array below).`)
      for (const [a, b] of EDGES) {
        mark("focus", [a, b])
        vars({ edge: `${a}-${b}`, count })
        const ra = find(a), rb = find(b)
        vars({ edge: `${a}-${b}`, ra, rb, count })
        if (ra !== rb) {
          parent[rb] = ra; aset(rb, ra)
          count--
          vars({ edge: `${a}-${b}`, ra, rb, count })
          line(4, `Roots differ (${ra} ≠ ${rb}) — union. Components: <b>${count}</b>.`)
          mark("good", parent.map((p, i) => (p === i ? i : -1)).filter(i => i >= 0))
        } else {
          line(4, `find(${a})=find(${b})=${ra} — already connected, skip.`)
        }
        heap("parent", [...parent])
      }
      mark("focus", [])
      line(7, `All edges processed. <b>${count}</b> connected components.`)
      return count
    }, 1)
    narrate("Path halving (skip one level on every find) is iterative and nearly as fast as full path compression — no recursion stack needed.")
    return go()
  },
}
