import type { Problem } from "@/engine/types"
import { articulationPoints } from "./articulation-points"
import { multiSourceBFS } from "./multi-source-bfs"
import { alienDictionary } from "./alien-dictionary"

const T = "Graphs"
const g = (
  slug: string, title: string, difficulty: Problem["difficulty"],
  lc: string, summary: string, solution: Problem["solution"],
  time: string, space: string,
): Problem => ({
  slug, title, neetcodeCategory: T, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const GRAPHS_3_PROBLEMS: Problem[] = [
  g("articulation-points", "Articulation Points (Bridges)", "Hard",
    "https://www.google.com/search?q=articulation+points+tarjan+algorithm",
    "Tarjan's: low[child] ≥ disc[u] means removing u disconnects the child's subtree — u is a cut vertex.",
    articulationPoints, "O(V+E)", "O(V)"),
  g("multi-source-bfs-rotting-oranges", "Multi-Source BFS (Rotting Oranges)", "Medium",
    "rotting-oranges",
    "Seed BFS with all rotten oranges at time 0 — BFS waves spread simultaneously from every source.",
    multiSourceBFS, "O(R·C)", "O(R·C)"),
  g("alien-dictionary", "Alien Dictionary", "Hard",
    "https://leetcode.com/problems/alien-dictionary/",
    "Extract ordering edges from adjacent word pairs, then topological sort the character DAG.",
    alienDictionary, "O(N·L)", "O(1)"),
]
