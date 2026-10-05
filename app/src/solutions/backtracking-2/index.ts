import type { Problem } from "@/engine/types"
import { letterCombinationsOfAPhoneNumber } from "./letter-combinations-of-a-phone-number"
import { generateParentheses } from "./generate-parentheses"
import { combinations } from "./combinations"
import { permutationsII } from "./permutations-ii"
import { combinationSumIII } from "./combination-sum-iii"
import { restoreIpAddresses } from "./restore-ip-addresses"
import { beautifulArrangement } from "./beautiful-arrangement"
import { matchsticksToSquare } from "./matchsticks-to-square"
import { partitionToKEqualSumSubsets } from "./partition-to-k-equal-sum-subsets"
import { grayCode } from "./gray-code"
import { letterCasePermutation } from "./letter-case-permutation"
import { letterTilePossibilities } from "./letter-tile-possibilities"
import { binaryWatch } from "./binary-watch"

const BT = "Recursion & Backtracking"
const bt = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: BT, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const BACKTRACKING_2_PROBLEMS: Problem[] = [
  bt("letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", "Medium",
    "letter-combinations-of-a-phone-number",
    "One digit per level, one letter per branch — the cartesian-product tree.",
    letterCombinationsOfAPhoneNumber, "O(n·4ⁿ)", "O(n)"),
  bt("generate-parentheses", "Generate Parentheses", "Medium", "generate-parentheses",
    "Two guards — open < n, close < open — make every leaf valid with zero checking.",
    generateParentheses, "O(4ⁿ/√n)", "O(n)"),
  bt("combinations", "Combinations", "Medium", "combinations",
    "The 'start' index is the whole trick: only pick larger numbers, and {2,1} can never happen.",
    combinations, "O(k·C(n,k))", "O(k)"),
  bt("permutations-ii", "Permutations II", "Medium", "permutations-ii",
    "Sort, then among equal values only ever pick the leftmost unused one — duplicates die at the branch.",
    permutationsII, "O(n·n!)", "O(n)"),
  bt("combination-sum-iii", "Combination Sum III", "Medium", "combination-sum-iii",
    "Combinations plus a sum budget: 'x > left → break' prunes whole suffixes in one stroke.",
    combinationSumIII, "O(k·C(9,k))", "O(k)"),
  bt("restore-ip-addresses", "Restore IP Addresses", "Medium", "restore-ip-addresses",
    "Cut 1–3 digits per level, 4 levels deep — leading-zero and >255 prunes use break, not continue.",
    restoreIpAddresses, "O(3⁴·n)", "O(1)"),
  bt("beautiful-arrangement", "Beautiful Arrangement", "Medium", "beautiful-arrangement",
    "Permutation search where a divisibility check at each position prunes most of n! away.",
    beautifulArrangement, "O(k) ≪ O(n!)", "O(n)"),
  bt("matchsticks-to-square", "Matchsticks to Square", "Medium", "matchsticks-to-square",
    "Bucket-filling: every stick tries all 4 sides; sort descending and skip equal sides to survive 4ⁿ.",
    matchsticksToSquare, "O(4ⁿ)", "O(n)"),
  bt("partition-to-k-equal-sum-subsets", "Partition to K Equal Sum Subsets", "Medium",
    "partition-to-k-equal-sum-subsets",
    "Matchsticks generalized to k buckets — the same overflow and equal-bucket prunes carry over.",
    partitionToKEqualSumSubsets, "O(kⁿ)", "O(n)"),
  bt("gray-code", "Gray Code", "Medium", "gray-code",
    "Reflect the (n−1)-bit list and prefix 1 — the mirror makes the seam differ by exactly one bit.",
    grayCode, "O(2ⁿ)", "O(2ⁿ)"),
  bt("letter-case-permutation", "Letter Case Permutation", "Medium", "letter-case-permutation",
    "Letters fork lower/UPPER, digits pass through — a binary tree on just the letters.",
    letterCasePermutation, "O(n·2ⁿ)", "O(n)"),
  bt("letter-tile-possibilities", "Letter Tile Possibilities", "Medium", "letter-tile-possibilities",
    "Every tree node is one distinct sequence — loop over letter counts, not positions, and just count nodes.",
    letterTilePossibilities, "O(n·n!)", "O(n)"),
  bt("binary-watch", "Binary Watch", "Easy", "binary-watch",
    "Choose k of 10 LEDs with on/off branching — impossible times and unreachable counts prune the tree.",
    binaryWatch, "O(2¹⁰)", "O(1)"),
]
