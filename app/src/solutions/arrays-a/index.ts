import type { Problem } from "@/engine/types"
import { pascalsTriangle } from "./pascal-s-triangle"
import { pascalsTriangleII } from "./pascals-triangle-ii"
import { nextPermutation } from "./next-permutation"
import { bestTimeToBuyAndSellStock } from "./best-time-to-buy-and-sell-stock"
import { mergeIntervals } from "./merge-intervals"
import { mergeSortedArrayInPlace } from "./merge-sorted-array-in-place"
import { findTheDuplicateNumber } from "./find-the-duplicate-number"
import { repeatingAndMissingNumber } from "./repeating-and-missing-number"
import { countInversions } from "./count-inversions"
import { powXN } from "./pow-x-n"
import { majorityElement } from "./majority-element-n-2"
import { majorityElementII } from "./majority-element-ii-n-3"

const CAT = "Arrays"
const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`

export const ARRAYS_A_PROBLEMS: Problem[] = [
  {
    slug: "pascal-s-triangle",
    title: "Pascal's Triangle",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: lc("pascals-triangle"),
    summary: "Every inner cell is just its two shoulders above, added together.",
    solution: pascalsTriangle,
  },
  {
    slug: "pascals-triangle-ii",
    title: "Pascal's Triangle II",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: lc("pascals-triangle-ii"),
    summary: "One row without the triangle — plain C(n,k) recursion, each cell summing its two parents.",
    solution: pascalsTriangleII,
  },
  {
    slug: "next-permutation",
    title: "Next Permutation",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("next-permutation"),
    summary: "Pivot, rightmost-bigger swap, reverse the tail — the next order in three moves.",
    solution: nextPermutation,
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: lc("best-time-to-buy-and-sell-stock"),
    summary: "Remember the cheapest day so far; every later day asks 'what if I sell now?'",
    solution: bestTimeToBuyAndSellStock,
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("merge-intervals"),
    summary: "Sort by start — then each interval either stretches the last block or opens a new one.",
    solution: mergeIntervals,
  },
  {
    slug: "merge-sorted-array-in-place",
    title: "Merge Sorted Array (in place)",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("merge-sorted-array"),
    summary: "Merge backwards into the empty tail — nothing unread is ever overwritten.",
    solution: mergeSortedArrayInPlace,
  },
  {
    slug: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("find-the-duplicate-number"),
    summary: "index → value is a hidden linked list; the duplicate is where its cycle begins.",
    solution: findTheDuplicateNumber,
  },
  {
    slug: "repeating-and-missing-number",
    title: "Repeating and Missing Number",
    neetcodeCategory: CAT,
    pattern: "dp",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=repeating+and+missing+number+striver",
    summary: "A count table exposes both: the key hit twice and the key never hit.",
    solution: repeatingAndMissingNumber,
  },
  {
    slug: "count-inversions",
    title: "Count Inversions",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://www.google.com/search?q=count+inversions+striver",
    summary: "When a right element wins a merge, it leaps every remaining left — count them all in one add.",
    solution: countInversions,
  },
  {
    slug: "pow-x-n",
    title: "Pow(x, n)",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("powx-n"),
    summary: "Square the half instead of multiplying n times — the recursion is a log-n chain.",
    solution: powXN,
  },
  {
    slug: "majority-element-n-2",
    title: "Majority Element (> n/2)",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: lc("majority-element"),
    summary: "Pair off different values and cancel — only a true majority survives the brawl.",
    solution: majorityElement,
  },
  {
    slug: "majority-element-ii-n-3",
    title: "Majority Element II (> n/3)",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("majority-element-ii"),
    summary: "Only two values can clear n/3 — run two counters, then verify the survivors.",
    solution: majorityElementII,
  },
]
