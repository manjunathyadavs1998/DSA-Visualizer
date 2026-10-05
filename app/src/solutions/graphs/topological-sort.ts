import type { SolutionDef } from "@/engine/types"

// DAG: 5→0, 5→2, 4→0, 4→1, 2→3, 3→1
const ADJ: number[][] = [
  [], // 0
  [], // 1
  [3], // 2
  [1], // 3
  [0, 1], // 4
  [0, 2], // 5
]

export const topologicalSort: SolutionDef = {
  code: `// DAG: 5→0  5→2  4→0  4→1  2→3  3→1
function topoSort() {
  const indeg = countIncomingEdges();
  const queue = nodesWhere(indeg, 0);   // no prerequisites
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);                      // u's prereqs all done
    for (const v of adj[u]) {
      indeg[v]--;                       // edge u→v satisfied
      if (indeg[v] === 0) queue.push(v);
    }
  }
  return order;                         // cycle ⇔ order.length < V
}`,
  codeJava: `// DAG: 5→0  5→2  4→0  4→1  2→3  3→1
List<Integer> topoSort() {
  int[] indeg = countIncomingEdges();
  Deque<Integer> queue = nodesWhere(indeg, 0);  // no prerequisites
  List<Integer> order = new ArrayList<>();
  while (!queue.isEmpty()) {
    int u = queue.poll();
    order.add(u);                       // u's prereqs all done
    for (int v : adj.get(u)) {
      indeg[v]--;                       // edge u→v satisfied
      if (indeg[v] == 0) queue.add(v);
    }
  }
  return order;                       // cycle ⇔ order.size() < V
}`,
  inputs: [],
  entry: () => `topoSort()`,
  run({ fn, heap, line, vars, narrate }) {
    const topoSort = fn(
      "topoSort",
      (): string => {
        const V = 6
        const indeg = [0, 0, 0, 0, 0, 0]
        for (let u = 0; u < V; u++) for (const v of ADJ[u]) indeg[v]++
        heap("indegree", indeg)
        line(2, `Count incoming edges: indeg = [${indeg.join(",")}] — a node with indeg 0 has <b>no prerequisites</b>.`)
        const queue: number[] = []
        for (let u = 0; u < V; u++) if (indeg[u] === 0) queue.push(u)
        heap("queue", queue)
        line(3, `Nodes ${queue.join(" and ")} start with indegree 0 — they can go first, in any order.`)
        const order: number[] = []
        heap("order", order)
        while (queue.length > 0) {
          const u = queue.shift() as number
          heap("queue", queue)
          order.push(u)
          heap("order", order)
          vars({ u, placed: order.length })
          line(7, `Place ${u} — every edge into ${u} came from a node already placed, so ${u} is safe at position ${order.length}.`)
          for (const v of ADJ[u]) {
            indeg[v]--
            heap("indegree", indeg)
            line(9, `Edge ${u}→${v} satisfied — indeg[${v}] drops to ${indeg[v]}.`)
            if (indeg[v] === 0) {
              queue.push(v)
              heap("queue", queue)
              line(10, `indeg[${v}] hit 0 — <b>all of ${v}'s prerequisites are placed</b>, enqueue ${v}.`)
            }
          }
        }
        line(13, `All ${order.length} of ${V} nodes placed → [${order.join(",")}]. (If a cycle existed, its nodes would never reach indegree 0 and the order would come up short.)`)
        return JSON.stringify(order)
      },
      1,
    )
    narrate(`Kahn's algorithm peels the DAG like an onion: repeatedly remove a node with no remaining prerequisites.`)
    return topoSort()
  },
}
