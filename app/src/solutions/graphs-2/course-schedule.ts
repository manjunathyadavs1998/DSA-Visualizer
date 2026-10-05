import type { SolutionDef } from "@/engine/types"

// 6 courses. "unlocks" adjacency: finishing u unlocks each v in UNLOCKS[u].
//   0 → 1, 2;  1 → 3;  2 → 3;  3 → 4;  4 → 5   (a DAG)
// Optional toggle adds 5 → 0, closing the cycle 0→1→3→4→5→0.
const N = 6
const UNLOCKS: number[][] = [
  [1, 2], // 0
  [3], // 1
  [3], // 2
  [4], // 3
  [5], // 4
  [], // 5
]

export const courseSchedule: SolutionDef = {
  view: "array",
  // the array below shows indegree[c] — prerequisites still missing per course
  array: (a) => {
    const indeg = Array(N).fill(0)
    for (const u of UNLOCKS.keys()) for (const v of UNLOCKS[u]) indeg[v]++
    if ((a.cycle as number) >= 1) indeg[0]++
    return indeg
  },
  code: `// unlocks: 0→[1,2] 1→[3] 2→[3] 3→[4] 4→[5] (+5→[0] if cycle)
function canFinish(n, prereqs) {
  const queue = [];
  for (let c = 0; c < n; c++)
    if (indegree[c] === 0) queue.push(c); // no prereqs — take now
  let taken = 0;
  while (queue.length > 0) {
    const c = queue.shift();
    taken++;                              // course c is done
    for (const next of unlocks[c]) {
      indegree[next]--;                   // one prereq satisfied
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return taken === n;    // leftovers are trapped in a cycle
}`,
  codeJava: `// unlocks: 0→[1,2] 1→[3] 2→[3] 3→[4] 4→[5] (+5→[0] if cycle)
boolean canFinish(int n, int[][] prereqs) {
  Deque<Integer> queue = new ArrayDeque<>();
  for (int c = 0; c < n; c++)
    if (indegree[c] == 0) queue.add(c);   // no prereqs — take now
  int taken = 0;
  while (!queue.isEmpty()) {
    int c = queue.poll();
    taken++;                              // course c is done
    for (int next : unlocks[c]) {
      indegree[next]--;                   // one prereq satisfied
      if (indegree[next] == 0) queue.add(next);
    }
  }
  return taken == n;     // leftovers are trapped in a cycle
}`,
  inputs: [{ kind: "number", name: "cycle", label: "add edge 5→0 (cycle)? (0/1)", default: 0, min: 0, max: 1 }],
  entry: (a) => `canFinish(6, prereqs${(a.cycle as number) >= 1 ? " + cycle 5→0" : ""})`,
  run({ fn, line, vars, aset, mark, heap, narrate }, args) {
    const cycle = (args.cycle as number) >= 1
    const unlocks = UNLOCKS.map((x) => [...x])
    if (cycle) unlocks[5] = [0]
    const indegree = Array(N).fill(0)
    for (const u of unlocks.keys()) for (const v of unlocks[u]) indegree[v]++
    const go = fn(
      "canFinish",
      (): string => {
        const queue: number[] = []
        line(2, `Kahn's algorithm: the array below is <b>indegree[c]</b> — how many prerequisites course c still needs.`)
        for (let c = 0; c < N; c++) {
          mark("focus", [c])
          if (indegree[c] === 0) {
            queue.push(c)
            heap("queue", queue)
            line(4, `Course ${c} has indegree <b>0</b> — nothing blocks it. Into the queue.`)
          } else {
            line(4, `Course ${c} needs ${indegree[c]} prereq${indegree[c] === 1 ? "" : "s"} — not ready yet.`)
          }
        }
        mark("focus", [])
        let taken = 0
        const done: number[] = []
        vars({ taken })
        while (queue.length > 0) {
          const c = queue.shift() as number
          heap("queue", queue)
          taken++
          done.push(c)
          heap("order", done)
          mark("done", [...done])
          vars({ taken, course: c })
          line(8, `Take course <b>${c}</b> (${taken}/${N} done).`)
          for (const next of unlocks[c]) {
            indegree[next]--
            aset(next, indegree[next])
            if (indegree[next] === 0) {
              queue.push(next)
              heap("queue", queue)
              line(11, `Finishing ${c} satisfied the last prereq of <b>${next}</b> — indegree hits 0, enqueue it.`)
            } else {
              line(10, `Finishing ${c} drops indegree[${next}] to ${indegree[next]} — ${next} still waits.`)
            }
          }
        }
        if (taken === N) {
          line(14, `All <b>${N}</b> courses taken — the prerequisite graph is a DAG: <b>true</b>.`)
          return "true"
        }
        const stuck = indegree.map((d, i) => (d > 0 ? i : -1)).filter((i) => i >= 0)
        mark("bad", stuck)
        line(14, `Queue dried up with only ${taken}/${N} taken. Courses {${stuck.join(",")}} all wait on each other — a <b>cycle</b>: <b>false</b>.`)
        return "false"
      },
      1,
    )
    narrate(`Topological sort as cycle detector: a cycle has no indegree-0 member, so Kahn's peeling can never reach it.`)
    return go()
  },
}
