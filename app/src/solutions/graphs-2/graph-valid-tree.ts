import type { SolutionDef } from "@/engine/types"

// 5 nodes; base edges form a tree rooted at 0:
//      0            With the optional extra edge 3-4 (default ON),
//     / \           nodes 3 and 4 get a SECOND path between them
//    1   2          (3-1-4) → cycle → not a tree.
//   / \
//  3   4
const N = 5
const BASE_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
]

export const graphValidTree: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// n = 5; edges 0-1, 0-2, 1-3, 1-4 (+ optional 3-4)
function validTree(n, edges) {
  let components = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;  // 2nd path = cycle → not a tree
    parent[rb] = ra;              // union
    components--;
  }
  return components === 1;        // acyclic AND connected = tree
}
function find(x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// n = 5; edges 0-1, 0-2, 1-3, 1-4 (+ optional 3-4)
boolean validTree(int n, int[][] edges) {
  int components = n;
  for (int[] e : edges) {
    int ra = find(e[0]), rb = find(e[1]);
    if (ra == rb) return false;   // 2nd path = cycle → not a tree
    parent[rb] = ra;              // union
    components--;
  }
  return components == 1;         // acyclic AND connected = tree
}
int find(int x) {
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [{ kind: "number", name: "extra", label: "add extra edge 3-4? (0/1)", default: 1, min: 0, max: 1 }],
  entry: (a) => `validTree(5, [0-1, 0-2, 1-3, 1-4${(a.extra as number) >= 1 ? ", 3-4" : ""}])`,
  run({ fn, line, vars, aset, mark, heap, narrate }, args) {
    const extra = (args.extra as number) >= 1
    const edges: [number, number][] = extra ? [...BASE_EDGES, [3, 4]] : BASE_EDGES
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(12, `find(${x}): parent[${cur}] = ${parent[cur]} — climb.`)
          cur = parent[cur]
        }
        line(13, `find(${x}) = <b>${cur}</b> — root reached.`)
        return cur
      },
      11,
    )
    const go = fn(
      "validTree",
      (): string => {
        let components = N
        heap("edges", edges.map(([a, b]) => `${a}-${b}`))
        vars({ components })
        line(2, `A tree on ${N} nodes = no cycles + one single component. Start: <b>${N}</b> loose components (parent[i] = i below).`)
        for (const [a, b] of edges) {
          mark("focus", [a, b])
          line(4, `Edge ${a}-${b}: find both roots to see if it connects two different components.`)
          const ra = find(a)
          const rb = find(b)
          vars({ components, edge: `${a}-${b}`, ra, rb })
          if (ra === rb) {
            mark("bad", [a, b])
            line(5, `Both roots are ${ra} — ${a} and ${b} were already connected, so ${a}-${b} adds a <b>second path → cycle</b>. Not a tree: <b>false</b>.`)
            return "false"
          }
          parent[rb] = ra
          aset(rb, ra)
          components--
          vars({ components, edge: `${a}-${b}` })
          line(6, `Roots differ (${ra} ≠ ${rb}) — union: parent[${rb}] = ${ra}.`)
          line(7, `components-- → <b>${components}</b> left.`)
        }
        mark("focus", [])
        if (components === 1) {
          mark("good", Array.from({ length: N }, (_, i) => i))
          line(9, `No cycle found and components = <b>1</b> — every node reachable from every other: a <b>valid tree</b>.`)
          return "true"
        }
        line(9, `No cycle, but <b>${components}</b> components remain — the graph is a forest, not one tree: <b>false</b>.`)
        return "false"
      },
      1,
    )
    narrate(`The two tree properties map 1:1 onto union-find: a rejected union = cycle; final component count = connectivity. (Shortcut: a tree must have exactly n−1 edges.)`)
    return go()
  },
}
