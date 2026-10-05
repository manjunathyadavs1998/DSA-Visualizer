import type { SolutionDef } from "@/engine/types"

// 6 courses. "unlocks" adjacency (finishing u unlocks v):
//   0 → 2, 3;  1 → 3, 4;  2 → 4;  3 → 5;  4 → 5
// indegree: [0, 0, 1, 2, 2, 2] → valid order: 0, 1, 2, 3, 4, 5
const N = 6
const UNLOCKS: number[][] = [
  [2, 3], // 0
  [3, 4], // 1
  [4], // 2
  [5], // 3
  [5], // 4
  [], // 5
]

export const courseScheduleII: SolutionDef = {
  view: "array",
  // the array below shows indegree[c] — watch each cell count down to 0
  array: () => {
    const indeg = Array(N).fill(0)
    for (const u of UNLOCKS.keys()) for (const v of UNLOCKS[u]) indeg[v]++
    return indeg
  },
  code: `// unlocks: 0→[2,3] 1→[3,4] 2→[4] 3→[5] 4→[5] 5→[]
function findOrder(n, prereqs) {
  const queue = [], order = [];
  for (let c = 0; c < n; c++)
    if (indegree[c] === 0) queue.push(c); // free starters
  while (queue.length > 0) {
    const c = queue.shift();
    order.push(c);                        // c's prereqs all done
    for (const next of unlocks[c]) {
      indegree[next]--;                   // one prereq satisfied
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === n ? order : []; // [] if a cycle exists
}`,
  codeJava: `// unlocks: 0→[2,3] 1→[3,4] 2→[4] 3→[5] 4→[5] 5→[]
int[] findOrder(int n, int[][] prereqs) {
  Deque<Integer> queue = new ArrayDeque<>(); List<Integer> order = new ArrayList<>();
  for (int c = 0; c < n; c++)
    if (indegree[c] == 0) queue.add(c);   // free starters
  while (!queue.isEmpty()) {
    int c = queue.poll();
    order.add(c);                         // c's prereqs all done
    for (int next : unlocks[c]) {
      indegree[next]--;                   // one prereq satisfied
      if (indegree[next] == 0) queue.add(next);
    }
  }
  return order.size() == n ? toArray(order) : new int[0];
}`,
  inputs: [],
  entry: () => `findOrder(6, prereqs)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const indegree = Array(N).fill(0)
    for (const u of UNLOCKS.keys()) for (const v of UNLOCKS[u]) indegree[v]++
    const go = fn(
      "findOrder",
      (): string => {
        const queue: number[] = []
        const order: number[] = []
        line(2, `Same Kahn's peeling as Course Schedule I — but this time we <b>record</b> the order we take courses in.`)
        for (let c = 0; c < N; c++) {
          if (indegree[c] === 0) {
            queue.push(c)
            heap("queue", queue)
            line(4, `Course ${c}: indegree 0 → a <b>free starter</b>, enqueue.`)
          } else {
            line(4, `Course ${c}: still blocked by ${indegree[c]} prereq${indegree[c] === 1 ? "" : "s"}.`)
          }
        }
        while (queue.length > 0) {
          const c = queue.shift() as number
          heap("queue", queue)
          order.push(c)
          heap("order", order)
          mark("done", [...order])
          vars({ course: c, order: `[${order.join(",")}]` })
          line(7, `Pop <b>${c}</b> → slot ${order.length} of the schedule: [${order.join(", ")}].`)
          for (const next of UNLOCKS[c]) {
            indegree[next]--
            aset(next, indegree[next])
            if (indegree[next] === 0) {
              queue.push(next)
              heap("queue", queue)
              line(10, `indegree[${next}] → 0 — every prereq of ${next} appears <b>earlier</b> in the order. Enqueue.`)
            } else {
              line(9, `indegree[${next}] → ${indegree[next]} — course ${next} still waits for another prereq.`)
            }
          }
        }
        mark("good", [...order])
        line(13, `${order.length}/${N} courses placed → valid schedule <b>[${order.join(", ")}]</b>. (An empty [] here would mean a cycle.)`)
        return JSON.stringify(order)
      },
      1,
    )
    narrate(`A topological order is exactly "every arrow points forward in the list" — Kahn's builds it by only ever emitting courses whose arrows-in are all spent.`)
    return go()
  },
}
