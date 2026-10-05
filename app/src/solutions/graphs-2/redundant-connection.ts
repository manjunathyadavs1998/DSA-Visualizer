import type { SolutionDef } from "@/engine/types"

// 5 nodes; the first four edges build a path 0-1-2-3-4,
// the last edge 1-4 closes a cycle → it is the redundant one.
const N = 5
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 4],
]

export const redundantConnection: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// edges arrive in order: 0-1, 1-2, 2-3, 3-4, 1-4
function findRedundantConnection(edges) {
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return [a, b];   // already connected → this
    parent[rb] = ra;                // edge closes a cycle!
  }
  return [];                        // a real tree has no extra edge
}
function find(x) {                  // walk up to the root
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// edges arrive in order: 0-1, 1-2, 2-3, 3-4, 1-4
int[] findRedundantConnection(int[][] edges) {
  for (int[] e : edges) {
    int ra = find(e[0]), rb = find(e[1]);
    if (ra == rb) return e;         // already connected → this
    parent[rb] = ra;                // edge closes a cycle!
  }
  return new int[0];                // a real tree has no extra edge
}
int find(int x) {                   // walk up to the root
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [],
  entry: () => `findRedundantConnection([0-1, 1-2, 2-3, 3-4, 1-4])`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(10, `find(${x}): parent[${cur}] = ${parent[cur]} — keep climbing.`)
          cur = parent[cur]
        }
        line(11, `find(${x}) = <b>${cur}</b> (its own parent → root).`)
        return cur
      },
      9,
    )
    const go = fn(
      "findRedundantConnection",
      (): string => {
        const accepted: string[] = []
        heap("accepted", accepted)
        for (const [a, b] of EDGES) {
          mark("focus", [a, b])
          vars({ edge: `${a}-${b}` })
          line(2, `Edge ${a}-${b} arrives. If ${a} and ${b} already share a root, this edge is the cycle-maker.`)
          const ra = find(a)
          const rb = find(b)
          if (ra === rb) {
            mark("bad", [a, b])
            line(4, `find(${a}) = find(${b}) = ${ra} — a path between them <b>already exists</b>, so ${a}-${b} is a second route: the <b>redundant edge</b>.`)
            return `[${a},${b}]`
          }
          parent[rb] = ra
          aset(rb, ra)
          accepted.push(`${a}-${b}`)
          heap("accepted", accepted)
          line(5, `Roots ${ra} ≠ ${rb} — safe edge. Union: parent[${rb}] = ${ra} (cell ${rb} just changed below).`)
        }
        line(7, `All edges fit a tree — no redundancy (can't happen for n edges on n nodes).`)
        return "[]"
      },
      1,
    )
    narrate(`n nodes + n edges = exactly one cycle. Union-find spots it the instant an edge connects two nodes that are already in the same set.`)
    return go()
  },
}
