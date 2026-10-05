import type { Problem } from "@/engine/types"
import { containsDuplicate } from "./contains-duplicate"
import { productOfArrayExceptSelf } from "./product-of-array-except-self"
import { subarraySumEqualsK } from "./subarray-sum-equals-k"
import { firstMissingPositive } from "./first-missing-positive"
import { plusOne } from "./plus-one"
import { summaryRanges } from "./summary-ranges"
import { degreeOfAnArray } from "./degree-of-an-array"
import { rearrangeArrayElementsBySign } from "./rearrange-array-elements-by-sign"
import { maximumSumCircularSubarray } from "./maximum-sum-circular-subarray"
import { rangeSumQueryImmutable } from "./range-sum-query-immutable"
import { findPivotIndex } from "./find-pivot-index"
import { maximumSwap } from "./maximum-swap"
import { moveZeroes } from "./move-zeroes"
import { rotateArray } from "./rotate-array"

const CAT = "Arrays & Hashing"
const ah = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: CAT, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const ARRAYS_C_PROBLEMS: Problem[] = [
  ah("contains-duplicate", "Contains Duplicate", "Easy", "contains-duplicate",
    "The hello-world of hashing: a set makes 'have I seen this?' an O(1) question.",
    containsDuplicate, "O(n)", "O(n)"),
  ah("product-of-array-except-self", "Product of Array Except Self", "Medium", "product-of-array-except-self",
    "No division allowed: sweep prefix products left-to-right, then suffix products back.",
    productOfArrayExceptSelf, "O(n)", "O(1)"),
  ah("subarray-sum-equals-k", "Subarray Sum Equals K", "Medium", "subarray-sum-equals-k",
    "Prefix sums + a hash map: every subarray ending here is an earlier prefix equal to sum − k.",
    subarraySumEqualsK, "O(n)", "O(n)"),
  ah("first-missing-positive", "First Missing Positive", "Hard", "first-missing-positive",
    "Cyclic sort: park value v at index v−1, then the first mismatch IS the answer — O(n), O(1).",
    firstMissingPositive, "O(n)", "O(1)"),
  ah("plus-one", "Plus One", "Easy", "plus-one",
    "Grade-school addition from the right: the only drama is a run of 9s rolling over.",
    plusOne, "O(n)", "O(1)"),
  ah("summary-ranges", "Summary Ranges", "Easy", "summary-ranges",
    "Anchor the start, race ahead while values stay consecutive, emit one range per run.",
    summaryRanges, "O(n)", "O(1)"),
  ah("degree-of-an-array", "Degree of an Array", "Easy", "degree-of-an-array",
    "Track each value's first index and count — the winning window runs first-to-last occurrence.",
    degreeOfAnArray, "O(n)", "O(n)"),
  ah("rearrange-array-elements-by-sign", "Rearrange Array Elements by Sign", "Medium", "rearrange-array-elements-by-sign",
    "Positives own the even slots, negatives the odd ones — two cursors, one pass.",
    rearrangeArrayElementsBySign, "O(n)", "O(n)"),
  ah("maximum-sum-circular-subarray", "Maximum Sum Circular Subarray", "Medium", "maximum-sum-circular-subarray",
    "A wrapping subarray is the total minus a middle 'hole' — so run Kadane for max AND min.",
    maximumSumCircularSubarray, "O(n)", "O(1)"),
  ah("range-sum-query-immutable", "Range Sum Query — Immutable", "Easy", "range-sum-query-immutable",
    "Pay O(n) once for prefix sums; every range query afterwards is one subtraction.",
    rangeSumQueryImmutable, "O(n) build, O(1) query", "O(n)"),
  ah("find-pivot-index", "Find Pivot Index", "Easy", "find-pivot-index",
    "Total up front, running left sum as you walk — the right sum comes for free.",
    findPivotIndex, "O(n)", "O(1)"),
  ah("maximum-swap", "Maximum Swap", "Medium", "maximum-swap",
    "Greedy with a last-index table: upgrade the leftmost digit using the rightmost bigger one.",
    maximumSwap, "O(n)", "O(1)"),
  ah("move-zeroes", "Move Zeroes", "Easy", "move-zeroes",
    "Read/write pointer compaction: non-zeros slide forward in order, zeroes sink to the back.",
    moveZeroes, "O(n)", "O(1)"),
  ah("rotate-array", "Rotate Array", "Medium", "rotate-array",
    "Reverse all, reverse the first k, reverse the rest — rotation with zero extra memory.",
    rotateArray, "O(n)", "O(1)"),
]
