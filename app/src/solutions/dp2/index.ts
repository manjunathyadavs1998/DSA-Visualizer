import type { Problem } from "@/engine/types"
import { maximumProductSubarray } from "@/solutions/dp2/maximum-product-subarray"
import { longestIncreasingSubsequence } from "@/solutions/dp2/longest-increasing-subsequence"
import { knapsack01 } from "@/solutions/dp2/0-1-knapsack"
import { editDistance } from "@/solutions/dp2/edit-distance"
import { maximumSumIncreasingSubsequence } from "@/solutions/dp2/maximum-sum-increasing-subsequence"
import { matrixChainMultiplication } from "@/solutions/dp2/matrix-chain-multiplication"
import { partitionEqualSubsetSum } from "@/solutions/dp2/partition-equal-subset-sum"
import { rodCutting } from "@/solutions/dp2/rod-cutting"
import { eggDroppingPuzzle } from "@/solutions/dp2/egg-dropping-puzzle"
import { palindromePartitioningII } from "@/solutions/dp2/palindrome-partitioning-ii"
import { maximumProfitInJobScheduling } from "@/solutions/dp2/maximum-profit-in-job-scheduling"

const DP = "DP"
const dp = (
  slug: string,
  title: string,
  pattern: Problem["pattern"],
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
): Problem => ({
  slug, title, neetcodeCategory: DP, pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const DP_PROBLEMS: Problem[] = [
  dp("maximum-product-subarray", "Maximum Product Subarray", "recursion", "Medium", "maximum-product-subarray",
    "Track the biggest AND smallest product — one negative flips the loser into the winner.", maximumProductSubarray),
  dp("longest-increasing-subsequence", "Longest Increasing Subsequence", "dp", "Medium", "longest-increasing-subsequence",
    "lis(i) = 1 + the best chain after a bigger number; the memo kills re-exploration.", longestIncreasingSubsequence),
  dp("0-1-knapsack", "0/1 Knapsack", "dp", "Medium", "https://www.google.com/search?q=0-1+knapsack+striver",
    "Every item: take it (pay its weight) or skip it — a 2-D memo over (item, capacity).", knapsack01),
  dp("edit-distance", "Edit Distance", "dp", "Hard", "edit-distance",
    "Matches walk the diagonal free; mismatches pay 1 for insert, delete, or replace.", editDistance),
  dp("maximum-sum-increasing-subsequence", "Maximum Sum Increasing Subsequence", "dp", "Medium",
    "https://www.google.com/search?q=maximum+sum+increasing+subsequence+striver",
    "LIS, but greed is by sum not length — a short heavy chain can beat a long light one.", maximumSumIncreasingSubsequence),
  dp("matrix-chain-multiplication", "Matrix Chain Multiplication", "dp", "Hard",
    "https://www.google.com/search?q=matrix+chain+multiplication+striver",
    "Try every split point: cost = left chain + right chain + the glue multiply.", matrixChainMultiplication),
  dp("partition-equal-subset-sum", "Partition Equal Subset Sum", "dp", "Medium", "partition-equal-subset-sum",
    "Odd total? Impossible. Otherwise it's subset-sum to half — take or skip each number.", partitionEqualSubsetSum),
  dp("rod-cutting", "Rod Cutting", "dp", "Medium", "https://www.google.com/search?q=rod+cutting+striver",
    "Choose the first piece's length, sell it, recurse on the rest — one memo slot per rod length.", rodCutting),
  dp("egg-dropping-puzzle", "Egg Dropping Puzzle", "dp", "Hard", "super-egg-drop",
    "Drop at floor x: the adversary picks the worse of break vs survive — minimize that maximum.", eggDroppingPuzzle),
  dp("palindrome-partitioning-ii", "Palindrome Partitioning II", "dp", "Hard", "palindrome-partitioning-ii",
    "Peel every palindromic prefix, pay one cut, recurse on the rest of the string.", palindromePartitioningII),
  dp("maximum-profit-in-job-scheduling", "Maximum Profit in Job Scheduling", "dp", "Hard", "maximum-profit-in-job-scheduling",
    "Sorted by start: skip job i, or take its profit and jump to the next compatible start.", maximumProfitInJobScheduling),
]
