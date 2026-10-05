import type { Problem } from "@/engine/types"
import { nthRoot } from "./nth-root-of-a-number"
import { matrixMedian } from "./median-in-row-wise-sorted-matrix"
import { singleElement } from "./single-element-in-a-sorted-array"
import { searchRotated } from "./search-in-rotated-sorted-array"
import { medianTwoSorted } from "./median-of-two-sorted-arrays"
import { kthTwoSorted } from "./kth-element-of-two-sorted-arrays"
import { allocatePages } from "./allocate-minimum-pages"
import { aggressiveCows } from "./aggressive-cows"

const BS = "Binary Search"

export const BINARY_SEARCH_PROBLEMS: Problem[] = [
  {
    slug: "nth-root-of-a-number",
    title: "Nth Root of a Number",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=Nth+Root+of+a+Number+striver",
    summary: "No array at all — binary search the answer itself: guess a root, power it up, halve the guesses.",
    solution: nthRoot,
  },
  {
    slug: "median-in-row-wise-sorted-matrix",
    title: "Median in Row-wise Sorted Matrix",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=Median+in+Row-wise+Sorted+Matrix+striver",
    summary: "No merging needed — binary search the value range and count how many cells sit under each guess.",
    solution: matrixMedian,
  },
  {
    slug: "single-element-in-a-sorted-array",
    title: "Single Element in a Sorted Array",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    summary: "Pairs start at even indexes until the loner breaks the rhythm — parity points the search.",
    solution: singleElement,
  },
  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    summary: "One half is always sorted — ask which, check if the target fits it, discard accordingly.",
    solution: searchRotated,
  },
  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    summary: "Don't merge — cut both arrays so every left value ≤ every right value, and the median falls out.",
    solution: medianTwoSorted,
  },
  {
    slug: "kth-element-of-two-sorted-arrays",
    title: "Kth Element of Two Sorted Arrays",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=Kth+Element+of+Two+Sorted+Arrays+striver",
    summary: "The median partition trick, generalized — split so exactly k values land on the left.",
    solution: kthTwoSorted,
  },
  {
    slug: "allocate-minimum-pages",
    title: "Allocate Minimum Pages",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://www.google.com/search?q=Allocate+Minimum+Pages+striver",
    summary: "Binary search the max load — every guess gets a greedy feasibility sweep over the bookshelf.",
    solution: allocatePages,
  },
  {
    slug: "aggressive-cows",
    title: "Aggressive Cows",
    neetcodeCategory: BS,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://www.google.com/search?q=Aggressive+Cows+striver",
    summary: "Binary search the gap — greedily place cows left-to-right and see if the distance survives.",
    solution: aggressiveCows,
  },
]
