import type { Problem } from "@/engine/types"
import { dsuPathCompression } from "./dsu-with-path-compression"
import { accountsMerge } from "./accounts-merge"
import { numberOfConnectedComponents } from "./number-of-connected-components"
import { smallestStringWithSwaps } from "./smallest-string-with-swaps"

const T = "Union-Find"
const u = (
  slug: string, title: string, difficulty: Problem["difficulty"],
  lc: string, summary: string, solution: Problem["solution"],
  time: string, space: string,
): Problem => ({
  slug, title, neetcodeCategory: T, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const UNION_FIND_PROBLEMS: Problem[] = [
  u("dsu-with-path-compression", "DSU — Path Compression + Union by Rank", "Medium",
    "https://www.google.com/search?q=union+find+path+compression+union+by+rank",
    "Path compression flattens every find path; union by rank keeps trees shallow — together near-O(1) per op.",
    dsuPathCompression, "O(α(n))", "O(n)"),
  u("number-of-connected-components", "Number of Connected Components", "Medium",
    "number-of-connected-components-in-an-undirected-graph",
    "Union edges one by one; count = n minus successful unions. Path halving keeps it iterative.",
    numberOfConnectedComponents, "O(E·α(V))", "O(V)"),
  u("accounts-merge", "Accounts Merge", "Medium", "accounts-merge",
    "Shared emails are edges between account indices — union them, then group emails by root.",
    accountsMerge, "O(N·α(N))", "O(N)"),
  u("smallest-string-with-swaps", "Smallest String With Swaps", "Medium",
    "smallest-string-with-swaps",
    "Swappable indices form components — sort each component's chars and place them back in order.",
    smallestStringWithSwaps, "O(N log N)", "O(N)"),
]
