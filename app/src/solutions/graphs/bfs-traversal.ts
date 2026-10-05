import type { SolutionDef } from "@/engine/types"

// connected 6-node undirected graph (same as DFS Traversal)
const ADJ: number[][] = [
  [1, 2], // 0
  [0, 3, 4], // 1
  [0, 5], // 2
  [1], // 3
  [1, 5], // 4
  [2, 4], // 5
]

export const bfsTraversal: SolutionDef = {
  code: `// adj: 0:[1,2] 1:[0,3,4] 2:[0,5] 3:[1] 4:[1,5] 5:[2,4]
function bfs(start) {
  const queue = [start], visited = new Set([start]);
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();       // pop the oldest — FIFO
    order.push(u);
    for (const v of adj[u]) {
      if (visited.has(v)) continue;
      visited.add(v);              // mark when ENQUEUED
      queue.push(v);               // v waits in the next ring
    }
  }
  return order;
}`,
  codeJava: `// List<List<Integer>> adj — same 6-node graph
List<Integer> bfs(int start) {
  Deque<Integer> queue = new ArrayDeque<>(List.of(start));
  Set<Integer> visited = new HashSet<>(List.of(start)); List<Integer> order = new ArrayList<>();
  while (!queue.isEmpty()) {
    int u = queue.poll();          // pop the oldest — FIFO
    order.add(u);
    for (int v : adj.get(u)) {
      if (visited.contains(v)) continue;
      visited.add(v);              // mark when ENQUEUED
      queue.add(v);                // v waits in the next ring
    }
  }
  return order;
}`,
  inputs: [{ kind: "number", name: "start", label: "start node", default: 0, min: 0, max: 5 }],
  entry: (a) => `bfs(${a.start})`,
  run({ fn, heap, line, vars, narrate }, args) {
    const start = args.start as number
    const bfs = fn(
      "bfs",
      (s: number): string => {
        const queue: number[] = [s]
        const visited = new Set<number>([s])
        const order: number[] = []
        const ring: Record<number, number> = { [s]: 0 }
        heap("queue", queue)
        heap("order", order)
        line(2, `Seed the queue with ${s} and mark it visited — ring 0, distance 0.`)
        while (queue.length > 0) {
          const u = queue.shift() as number
          heap("queue", queue)
          order.push(u)
          heap("order", order)
          vars({ u, ring: ring[u] })
          line(5, `Pop ${u} — it sits in <b>ring ${ring[u]}</b> (${ring[u]} edge${ring[u] === 1 ? "" : "s"} from ${s}). FIFO guarantees ring ${ring[u]} empties before ring ${ring[u] + 1} starts.`)
          for (const v of ADJ[u]) {
            if (visited.has(v)) {
              line(8, `Edge ${u}→${v}: ${v} already seen — skip.`)
              continue
            }
            visited.add(v)
            queue.push(v)
            ring[v] = ring[u] + 1
            heap("queue", queue)
            line(10, `Edge ${u}→${v}: ${v} is new — enqueue it into <b>ring ${ring[v]}</b>. Marking at enqueue time stops duplicates.`)
          }
        }
        line(13, `Queue drained — order [${order.join(",")}] visits ring by ring: everything at distance d before anything at d+1.`)
        heap("order", order)
        return JSON.stringify(order)
      },
      1,
    )
    narrate(`BFS spreads like a wave: the queue always holds one full ring (plus the next one forming behind it).`)
    return bfs(start)
  },
}
