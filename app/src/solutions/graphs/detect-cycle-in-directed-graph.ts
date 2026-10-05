import type { SolutionDef } from "@/engine/types"

// directed: 0→1, 1→2, 2→4, 2→3, 3→1 → cycle 1→2→3→1
const ADJ: number[][] = [
  [1], // 0
  [2], // 1
  [4, 3], // 2
  [1], // 3
  [], // 4
]

export const detectCycleDirected: SolutionDef = {
  code: `// directed: 0→1  1→2  2→4  2→3  3→1   (cycle 1→2→3→1)
function hasCycle(u) {
  state[u] = GRAY;               // u is ON the current path
  for (const v of adj[u]) {
    if (state[v] === GRAY) return true;   // back edge u→v!
    if (state[v] === WHITE && hasCycle(v)) return true;
  }
  state[u] = BLACK;              // done — u leads to no cycle
  return false;
}`,
  codeJava: `// directed: 0→1  1→2  2→4  2→3  3→1   (cycle 1→2→3→1)
boolean hasCycle(int u) {
  state[u] = GRAY;               // u is ON the current path
  for (int v : adj.get(u)) {
    if (state[v] == GRAY) return true;    // back edge u→v!
    if (state[v] == WHITE && hasCycle(v)) return true;
  }
  state[u] = BLACK;              // done — u leads to no cycle
  return false;
}`,
  inputs: [],
  entry: () => `hasCycle(0)`,
  run({ fn, heap, line, narrate }) {
    const state: string[] = ["white", "white", "white", "white", "white"]
    const snap = () => ({ 0: state[0], 1: state[1], 2: state[2], 3: state[3], 4: state[4] })
    const hasCycle = fn(
      "hasCycle",
      (u: number): boolean => {
        state[u] = "gray"
        heap("state", snap())
        line(2, `Paint ${u} <b>gray</b> — it is on the recursion path right now.`)
        for (const v of ADJ[u]) {
          if (state[v] === "gray") {
            line(4, `Edge ${u}→${v}: ${v} is <b>gray — still on the current path below me</b>. This is a back edge: following it closes the loop ${v}→…→${u}→${v}. Cycle!`)
            return true
          }
          if (state[v] === "white") {
            line(5, `Edge ${u}→${v}: ${v} is white (untouched) — explore it.`)
            if (hasCycle(v)) return true
          } else {
            line(5, `Edge ${u}→${v}: ${v} is <b>black</b> — fully explored earlier and proven cycle-free. Safe to ignore.`)
          }
        }
        state[u] = "black"
        heap("state", snap())
        line(7, `Every path out of ${u} is exhausted — repaint ${u} <b>black</b> (finished, harmless).`)
        return false
      },
      1,
    )
    narrate(`Three colors: white = untouched, gray = on the CURRENT path, black = finished. Only a gray→gray edge means a cycle — an edge to black is just a reused, safe subgraph.`)
    heap("state", snap())
    return hasCycle(0)
  },
}
