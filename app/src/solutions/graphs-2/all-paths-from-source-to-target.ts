import type { SolutionDef } from "@/engine/types"

// DAG on 5 nodes (target = 4):
//   0 → 1, 2    1 → 3    2 → 3, 4    3 → 4    4 → (target)
// Paths 0→4: [0,1,3,4], [0,2,3,4], [0,2,4]
const GRAPH: number[][] = [
  [1, 2], // 0
  [3], // 1
  [3, 4], // 2
  [4], // 3
  [], // 4
]
const TARGET = GRAPH.length - 1

export const allPathsFromSourceToTarget: SolutionDef = {
  // tree view (default): the recursion tree below IS the path exploration
  code: `// DAG: 0→[1,2] 1→[3] 2→[3,4] 3→[4] — target = 4
function allPathsSourceTarget(graph) {
  dfs(0);
  return paths;
}
function dfs(u) {
  path.push(u);              // u joins the current path
  if (u === target) {
    paths.push([...path]);   // snapshot! path keeps mutating
  } else {
    for (const v of graph[u]) dfs(v);
  }
  path.pop();                // backtrack — un-choose u
}`,
  codeJava: `// DAG: 0→[1,2] 1→[3] 2→[3,4] 3→[4] — target = 4
List<List<Integer>> allPathsSourceTarget(int[][] graph) {
  dfs(0);
  return paths;
}
void dfs(int u) {
  path.add(u);               // u joins the current path
  if (u == target) {
    paths.add(new ArrayList<>(path)); // snapshot! path mutates
  } else {
    for (int v : graph[u]) dfs(v);
  }
  path.remove(path.size() - 1); // backtrack — un-choose u
}`,
  inputs: [],
  entry: () => `allPathsSourceTarget(graph)  // 0 ⇝ 4`,
  run({ fn, line, heap, vars, narrate }) {
    const path: number[] = []
    const paths: number[][] = []
    const dfs = fn(
      "dfs",
      (u: number): string => {
        path.push(u)
        heap("path", path)
        vars({ u, path: `[${path.join("→")}]` })
        line(6, `Extend the walk: path = [${path.join(" → ")}].`)
        if (u === TARGET) {
          paths.push([...path])
          heap("output", paths.map((p) => p.join("→")))
          line(8, `Reached target ${TARGET} — <b>snapshot path #${paths.length}: [${path.join(", ")}]</b>. (Copy it! The live path backtracks.)`)
        } else {
          for (const v of GRAPH[u]) {
            line(10, `From ${u}, branch to neighbor ${v} — a DAG means no cycles, so no visited-set is needed.`)
            dfs(v)
          }
        }
        path.pop()
        heap("path", path)
        line(12, `Backtrack: remove ${u} — path shrinks to [${path.join(" → ")}], freeing ${u} for other branches.`)
        return u === TARGET ? "hit" : `${GRAPH[u].length} branches`
      },
      5,
    )
    const go = fn(
      "allPathsSourceTarget",
      (): string => {
        line(2, `Enumerate EVERY route 0 ⇝ ${TARGET}: depth-first, with one shared path that grows and shrinks.`)
        dfs(0)
        line(3, `Exploration done — <b>${paths.length}</b> paths found: ${paths.map((p) => `[${p.join(",")}]`).join(" ")}.`)
        return JSON.stringify(paths)
      },
      1,
    )
    narrate(`Classic backtracking shape: choose (push u), explore (recurse on neighbors), un-choose (pop u). The recursion tree you see below is exactly the set of walks.`)
    return go()
  },
}
