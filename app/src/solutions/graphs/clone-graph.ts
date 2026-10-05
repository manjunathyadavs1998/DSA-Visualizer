import type { SolutionDef } from "@/engine/types"

// 4-node cycle (the classic LeetCode square): 1-2-3-4-1
const ADJ: Record<number, number[]> = { 1: [2, 4], 2: [1, 3], 3: [2, 4], 4: [1, 3] }

export const cloneGraph: SolutionDef = {
  code: `// adj = {1:[2,4], 2:[1,3], 3:[2,4], 4:[1,3]} — a square
function clone(u) {
  if (cloned[u]) return cloned[u];  // cache hit: already built
  const copy = new Node(u);
  cloned[u] = copy;                 // register BEFORE recursing!
  for (const v of adj[u]) {
    copy.neighbors.push(clone(v));  // follow edge u→v
  }
  return copy;
}`,
  codeJava: `// Map<Integer,List<Integer>> adj; Map<Integer,Node> cloned
Node clone(int u) {
  if (cloned.containsKey(u)) return cloned.get(u);
  Node copy = new Node(u);
  cloned.put(u, copy);              // register BEFORE recursing!
  for (int v : adj.get(u)) {
    copy.neighbors.add(clone(v));   // follow edge u→v
  }
  return copy;
}`,
  inputs: [{ kind: "number", name: "start", label: "start node", default: 1, min: 1, max: 4 }],
  entry: (a) => `clone(${a.start})`,
  run({ fn, memo, heap, line, narrate }, args) {
    const start = args.start as number
    const clones: Record<number, number[]> = {}
    const rep = () => {
      const o: Record<string, string> = {}
      for (const k of Object.keys(clones)) o[`Node ${k}`] = `→ [${clones[Number(k)].join(",")}]`
      return o
    }
    const clone = fn(
      "clone",
      (u: number): string => {
        const hit = memo[u] !== undefined
        line(2, `clone(${u}): already in the map? (${hit ? "<b>yes — reuse that copy; recursing again would loop around the cycle forever</b>" : "no — first time here"})`)
        if (hit) return `Node ${u}`
        line(3, `Make a fresh copy of node ${u} — empty neighbor list for now.`)
        clones[u] = []
        line(4, `Register ${u} → copy in the map <b>before</b> visiting neighbors. This early registration is the whole trick.`)
        memo[u] = `Node ${u}`
        heap("cloned", rep())
        for (const v of ADJ[u]) {
          line(6, `Edge ${u}→${v}: the copy of ${u} needs the <b>copy</b> of ${v} — ask clone(${v}).`)
          clone(v)
          clones[u].push(v)
          heap("cloned", rep())
        }
        line(8, `Node ${u} fully wired: copy-neighbors [${clones[u].join(",")}]. Hand the copy back.`)
        return `Node ${u}`
      },
      1,
    )
    narrate(`The graph is a cycle — without the old→new map, clone(${start}) would call itself forever. Watch the map stop the loop.`)
    heap("cloned", rep())
    const root = clone(start)
    return `${root} cloned; map = ${JSON.stringify(rep())}`
  },
}
