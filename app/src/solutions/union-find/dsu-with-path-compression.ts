import type { SolutionDef } from "@/engine/types"

// 7 nodes; edges: 0-1, 1-2, 3-4, 4-5, 5-6
const N = 7
const EDGES: [number, number][] = [[0, 1], [1, 2], [3, 4], [4, 5], [5, 6]]

export const dsuPathCompression: SolutionDef = {
  view: "array",
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// parent[] shown below — starts as [0,1,2,3,4,5,6]
function find(x) {           // path compression
  if (parent[x] !== x)
    parent[x] = find(parent[x]);
  return parent[x];
}
function union(a, b) {       // union by rank
  const ra = find(a), rb = find(b);
  if (ra === rb) return;
  if (rank[ra] < rank[rb]) parent[ra] = rb;
  else if (rank[ra] > rank[rb]) parent[rb] = ra;
  else { parent[rb] = ra; rank[ra]++; }
}`,
  codeJava: `// int[] parent, rank — parent[i]=i initially
int find(int x) {            // path compression
  if (parent[x] != x)
    parent[x] = find(parent[x]);
  return parent[x];
}
void union(int a, int b) {   // union by rank
  int ra = find(a), rb = find(b);
  if (ra == rb) return;
  if (rank[ra] < rank[rb]) parent[ra] = rb;
  else if (rank[ra] > rank[rb]) parent[rb] = ra;
  else { parent[rb] = ra; rank[ra]++; }
}`,
  inputs: [],
  entry: () => `union edges: 0-1, 1-2, 3-4, 4-5, 5-6`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const rank = Array(N).fill(0)
    const find = fn("find", (x: number): number => {
      line(2, `find(${x}): parent[${x}] = ${parent[x]}${parent[x] !== x ? " — not root, recurse up." : " — root found."}`)
      if (parent[x] !== x) {
        const root = find(parent[x])
        parent[x] = root
        aset(x, root)
        line(3, `Path compression: parent[${x}] → ${root} (flat shortcut to root).`)
        return root
      }
      return x
    }, 1)
    const unionFn = fn("union", (a: number, b: number): void => {
      const ra = find(a), rb = find(b)
      vars({ a, b, ra, rb })
      if (ra === rb) {
        mark("bad", [a, b])
        line(7, `find(${a})=find(${b})=${ra} — already in the same set, skip.`)
        return
      }
      if (rank[ra] < rank[rb]) {
        parent[ra] = rb; aset(ra, rb)
        line(9, `rank[${ra}]=${rank[ra]} < rank[${rb}]=${rank[rb]} — attach ${ra} under ${rb}.`)
      } else if (rank[ra] > rank[rb]) {
        parent[rb] = ra; aset(rb, ra)
        line(10, `rank[${ra}]=${rank[ra]} > rank[${rb}]=${rank[rb]} — attach ${rb} under ${ra}.`)
      } else {
        parent[rb] = ra; aset(rb, ra)
        rank[ra]++
        line(11, `Equal ranks — attach ${rb} under ${ra}, bump rank[${ra}] to ${rank[ra]}.`)
      }
      mark("good", parent.map((p, i) => (p === i ? i : -1)).filter(i => i >= 0))
    }, 6)
    const go = fn("main", (): number => {
      let components = N
      heap("rank", [...rank])
      line(0, `parent[i]=i for all ${N} nodes — ${N} singleton components. Array below IS the parent table.`)
      for (const [a, b] of EDGES) {
        mark("focus", [a, b])
        vars({ edge: `${a}-${b}`, components })
        line(6, `Union(${a}, ${b}): find roots, then attach the shorter tree under the taller.`)
        const raBefore = find(a), rbBefore = find(b)
        if (raBefore !== rbBefore) components--
        unionFn(a, b)
        heap("rank", [...rank])
        vars({ edge: `${a}-${b}`, components })
        line(11, `Components remaining: <b>${components}</b>.`)
      }
      mark("focus", [])
      line(11, `Done. <b>${components}</b> connected component${components > 1 ? "s" : ""}.`)
      return components
    }, 0)
    narrate("Path compression flattens every find path to 1 hop; union by rank keeps trees shallow. Together: near-O(1) per operation.")
    return go()
  },
}
