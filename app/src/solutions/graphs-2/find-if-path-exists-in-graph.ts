import type { SolutionDef } from "@/engine/types"

// 6 nodes; edges 0-1, 1-2, 3-4 → groups {0,1,2}, {3,4}, {5}.
// Default query 0→2 is true; try source 0, destination 4 for false.
const N = 6
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [3, 4],
]

export const findIfPathExists: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// 6 nodes; edges: 0-1, 1-2, 3-4 (node 5 is isolated)
function validPath(n, edges, source, destination) {
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[rb] = ra;  // merge the two groups
  }
  // connected ⇔ same root in the disjoint-set forest
  return find(source) === find(destination);
}
function find(x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// 6 nodes; edges: 0-1, 1-2, 3-4 (node 5 is isolated)
boolean validPath(int n, int[][] edges, int source, int destination) {
  for (int[] e : edges) {
    int ra = find(e[0]), rb = find(e[1]);
    if (ra != rb) parent[rb] = ra;   // merge the two groups
  }
  // connected ⇔ same root in the disjoint-set forest
  return find(source) == find(destination);
}
int find(int x) {
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [
    { kind: "number", name: "source", label: "source", default: 0, min: 0, max: 5 },
    { kind: "number", name: "destination", label: "destination", default: 2, min: 0, max: 5 },
  ],
  entry: (a) => `validPath(6, edges, ${a.source}, ${a.destination})`,
  run({ fn, line, vars, aset, mark, heap, narrate }, args) {
    const clamp = (v: number) => Math.max(0, Math.min(N - 1, Math.trunc(v)))
    const source = clamp(args.source as number)
    const destination = clamp(args.destination as number)
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(10, `find(${x}): parent[${cur}] = ${parent[cur]} — climb toward the root.`)
          cur = parent[cur]
        }
        line(11, `find(${x}) = <b>${cur}</b>.`)
        return cur
      },
      9,
    )
    const go = fn(
      "validPath",
      (): string => {
        heap("edges", EDGES.map(([a, b]) => `${a}-${b}`))
        line(2, `Phase 1 — build the groups: union each edge into the parent[] table below.`)
        for (const [a, b] of EDGES) {
          mark("focus", [a, b])
          line(3, `Edge ${a}-${b}: find both roots.`)
          const ra = find(a)
          const rb = find(b)
          if (ra !== rb) {
            parent[rb] = ra
            aset(rb, ra)
            line(4, `Union: parent[${rb}] = ${ra} — groups of ${a} and ${b} merge.`)
          } else {
            line(4, `Already the same root (${ra}) — nothing to merge.`)
          }
        }
        mark("focus", [])
        line(6, `Phase 2 — the query: ${source} and ${destination} are connected ⇔ they share a root.`)
        const rs = find(source)
        const rd = find(destination)
        vars({ source, destination, rootS: rs, rootD: rd })
        const ok = rs === rd
        mark(ok ? "good" : "bad", [source, destination])
        line(7, `find(${source}) = ${rs}, find(${destination}) = ${rd} → ${ok ? `same root — a path <b>exists</b>: <b>true</b>` : `different roots — different islands: <b>false</b>`}.`)
        return String(ok)
      },
      1,
    )
    narrate(`BFS/DFS answers one reachability query; union-find pre-merges the graph so ANY number of queries after that cost near-O(1) each.`)
    return go()
  },
}
