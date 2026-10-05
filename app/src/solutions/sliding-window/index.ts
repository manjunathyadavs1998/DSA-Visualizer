import type { Problem } from "@/engine/types"
import { maxSumSubarraySizeK } from "./max-sum-subarray-size-k"
import { minimumSizeSubarraySum } from "./minimum-size-subarray-sum"
import { longestRepeatingCharacterReplacement } from "./longest-repeating-character-replacement"
import { permutationInString } from "./permutation-in-string"
import { maxConsecutiveOnesIII } from "./max-consecutive-ones-iii"

const SW = "Sliding Window"
const sw = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
): Problem => ({
  slug, title, neetcodeCategory: SW, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const SLIDING_WINDOW_PROBLEMS: Problem[] = [
  sw("max-sum-subarray-size-k", "Max Sum Subarray of Size K", "Easy",
    "https://www.google.com/search?q=maximum+sum+subarray+of+size+k",
    "The fixed-window template: add the right edge, drop the left — never re-sum.", maxSumSubarraySizeK),
  sw("minimum-size-subarray-sum", "Minimum Size Subarray Sum", "Medium", "minimum-size-subarray-sum",
    "Grow until valid, shrink while valid — the variable-window template.", minimumSizeSubarraySum),
  sw("longest-repeating-character-replacement", "Longest Repeating Character Replacement", "Medium",
    "longest-repeating-character-replacement",
    "Window is fixable while (len − maxFreq) ≤ k — and why it never shrinks, only slides.", longestRepeatingCharacterReplacement),
  sw("permutation-in-string", "Permutation in String", "Medium", "permutation-in-string",
    "Fixed window + need-counts that cancel to zero — the anagram-matching template.", permutationInString),
  sw("max-consecutive-ones-iii", "Max Consecutive Ones III", "Medium", "max-consecutive-ones-iii",
    "Reframed: longest window with at most k zeros. The reframe IS the solution.", maxConsecutiveOnesIII),
]
