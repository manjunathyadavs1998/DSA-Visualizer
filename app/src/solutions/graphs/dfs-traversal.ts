import type { SolutionDef } from "@/engine/types"

// connected 6-node undirected graph
const ADJ: number[][] = [
  [1, 2], // 0
  [0, 3, 4], // 1
  [0, 5], // 2
  [1], // 3
  [1, 5], // 4
  [2, 4], // 5
]

export const dfsTraversal: SolutionDef = {
  code: `// adj: 0:[1,2] 1:[0,3,4] 2:[0,5] 3:[1] 4:[1,5] 5:[2,4]
function dfs(u) {
  visited.add(u);
  order.push(u);
  for (const v of adj[u]) {
    if (visited.has(v)) continue;  // v already seen — skip
    dfs(v);                        // dive along edge u→v
  }
}`,
  codeJava: `// List<List<Integer>> adj — same 6-node graph
void dfs(int u) {
  visited.add(u);
  order.add(u);
  for (int v : adj.get(u)) {
    if (visited.contains(v)) continue;  // v already seen — skip
    dfs(v);                             // dive along edge u→v
  }
}`,
  inputs: [{ kind: "number", name: "start", label: "start node", default: 0, min: 0, max: 5 }],
  entry: (a) => `dfs(${a.start})`,
  run({ fn, heap, line, narrate }, args) {
    const start = args.start as number
    const visited = new Set<number>()
    const order: number[] = []
    const dfs = fn(
      "dfs",
      (u: number): string => {
        line(2, `Visit ${u}: mark it so no edge can bring us back in.`)
        visited.add(u)
        order.push(u)
        heap("visited", [...visited])
        heap("order", order)
        line(3, `Record ${u} — position ${order.length} in DFS order.`)
        for (const v of ADJ[u]) {
          if (visited.has(v)) {
            line(5, `Edge ${u}→${v}: ${v} is already visited — <b>skip</b>. This edge would only take us backwards.`)
            continue
          }
          line(6, `Edge ${u}→${v}: ${v} is new — <b>go deep</b> before trying ${u}'s other neighbors.`)
          dfs(v)
        }
        return `done ${u}`
      },
      1,
    )
    narrate(`DFS goes as deep as possible before backtracking — the recursion tree below IS the DFS tree of the graph.`)
    heap("visited", [])
    heap("order", order)
    dfs(start)
    return JSON.stringify(order)
  },
}
