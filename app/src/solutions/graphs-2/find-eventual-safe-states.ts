import type { SolutionDef } from "@/engine/types"

// Directed graph, 6 nodes:
//   0 → 1, 2    1 → 2, 3    2 → 5    3 → 0    4 → 5    5 → (terminal)
// Cycle 0 → 1 → 3 → 0 traps those three nodes; 2, 4, 5 are safe.
const ADJ: number[][] = [
  [1, 2], // 0
  [2, 3], // 1
  [5], // 2
  [0], // 3
  [5], // 4
  [], // 5
]
const N = ADJ.length

export const findEventualSafeStates: SolutionDef = {
  view: "array",
  // the array below is color[v]: W=white (unseen), G=gray (on current
  // path), S=safe (black), C=cycle (bad)
  array: () => Array(N).fill("W"),
  code: `// adj: 0→[1,2] 1→[2,3] 2→[5] 3→[0] 4→[5] 5→[]
function eventualSafeNodes(graph) {
  const safeList = [];
  for (let u = 0; u < n; u++)
    if (isSafe(u)) safeList.push(u);
  return safeList;
}
function isSafe(u) {   // true ⇔ every walk from u must terminate
  if (color[u] === GRAY) return false;  // u is on the path: cycle!
  if (color[u] !== WHITE) return color[u] === SAFE; // memoized
  color[u] = GRAY;                      // u joins the current path
  for (const v of graph[u])
    if (!isSafe(v)) { color[u] = BAD; return false; }
  color[u] = SAFE;                      // every route out terminates
  return true;
}`,
  codeJava: `// adj: 0→[1,2] 1→[2,3] 2→[5] 3→[0] 4→[5] 5→[]
List<Integer> eventualSafeNodes(int[][] graph) {
  List<Integer> safeList = new ArrayList<>();
  for (int u = 0; u < n; u++)
    if (isSafe(u)) safeList.add(u);
  return safeList;
}
boolean isSafe(int u) { // true ⇔ every walk from u must terminate
  if (color[u] == GRAY) return false;   // u is on the path: cycle!
  if (color[u] != WHITE) return color[u] == SAFE; // memoized
  color[u] = GRAY;                      // u joins the current path
  for (int v : graph[u])
    if (!isSafe(v)) { color[u] = BAD; return false; }
  color[u] = SAFE;                      // every route out terminates
  return true;
}`,
  inputs: [],
  entry: () => `eventualSafeNodes(graph)  // cycle: 0→1→3→0`,
  run({ fn, line, aset, mark, heap, narrate }) {
    const W = "W", G = "G", S = "S", B = "C"
    const color: string[] = Array(N).fill(W)
    const isSafe = fn(
      "isSafe",
      (u: number): boolean => {
        mark("focus", [u])
        if (color[u] === G) {
          line(8, `isSafe(${u}): node ${u} is <b>gray — it's on the path we walked in on</b>. We've looped back: cycle, unsafe.`)
          return false
        }
        if (color[u] !== W) {
          line(9, `isSafe(${u}): already colored <b>${color[u] === S ? "safe" : "bad"}</b> from an earlier start — reuse the verdict.`)
          return color[u] === S
        }
        color[u] = G
        aset(u, G)
        line(10, `Paint ${u} <b>gray</b> — it's on the current walk. Any edge back into gray = a cycle.`)
        for (const v of ADJ[u]) {
          line(11, `From ${u}, follow edge ${u}→${v}.`)
          if (!isSafe(v)) {
            color[u] = B
            aset(u, B)
            mark("focus", [u])
            line(12, `${u}→${v} can get stuck → <b>${u} is unsafe too</b> (painted C).`)
            return false
          }
        }
        color[u] = S
        aset(u, S)
        line(13, `Every edge out of ${u} leads somewhere safe → paint ${u} <b>S (safe)</b>.`)
        return true
      },
      7,
    )
    const go = fn(
      "eventualSafeNodes",
      (): string => {
        const safeList: number[] = []
        line(2, `A node is "eventually safe" if <b>no</b> walk from it can run forever. Terminal node 5 is trivially safe.`)
        for (let u = 0; u < N; u++) {
          line(4, `Start a check from node ${u}.`)
          if (isSafe(u)) {
            safeList.push(u)
            heap("safeList", safeList)
          }
        }
        mark("focus", [])
        mark("good", safeList)
        mark("bad", Array.from({ length: N }, (_, i) => i).filter((i) => !safeList.includes(i)))
        line(5, `Safe nodes (ascending): <b>[${safeList.join(", ")}]</b> — the cycle 0→1→3→0 doomed the rest.`)
        return JSON.stringify(safeList)
      },
      1,
    )
    narrate(`Three colors do all the work: gray = "on the current recursion path" (hitting it = back edge = cycle), and black memoizes safe/bad so each node is solved once.`)
    return go()
  },
}
