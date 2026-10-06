import type { Problem } from "@/engine/types"
import { lisNLogN } from "./lis-nlogn"
import { tspBitmaskDP } from "./tsp-bitmask-dp"
import { houseRobberTree } from "./house-robber-tree-dp"

const T = "Advanced DP"
const dp = (
  slug: string, title: string, difficulty: Problem["difficulty"],
  lc: string, summary: string, solution: Problem["solution"],
  time: string, space: string,
): Problem => ({
  slug, title, neetcodeCategory: T, pattern: "dp", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const DP_ADVANCED_PROBLEMS: Problem[] = [
  dp("lis-nlogn", "LIS in O(n log n) — Patience Sorting", "Medium",
    "longest-increasing-subsequence",
    "tails[i] = smallest tail of IS of length i+1. Binary search replaces or extends — length in O(n log n).",
    lisNLogN, "O(n log n)", "O(n)"),
  dp("tsp-bitmask-dp", "Travelling Salesman (Bitmask DP)", "Hard",
    "https://www.google.com/search?q=travelling+salesman+bitmask+dp",
    "dp[mask][u] = cheapest tour visiting exactly the cities in mask, ending at u. 2ⁿ·n states.",
    tspBitmaskDP, "O(2ⁿ·n²)", "O(2ⁿ·n)"),
  dp("house-robber-tree-dp", "House Robber III (DP on Tree)", "Medium",
    "house-robber-iii",
    "Each node returns (rob, skip) pair. Rob = val + skip(children). Skip = best(each child). No global array.",
    houseRobberTree, "O(n)", "O(n)"),
]
