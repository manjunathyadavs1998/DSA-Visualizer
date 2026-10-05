import type { Problem } from "@/engine/types"
import { kokoEatingBananas } from "./koko-eating-bananas"
import { shipWithinDays } from "./capacity-to-ship-packages-within-d-days"
import { splitArrayLargestSum } from "./split-array-largest-sum"
import { findMinInRotatedSortedArray } from "./find-minimum-in-rotated-sorted-array"
import { searchRotatedII } from "./search-in-rotated-sorted-array-ii"
import { findPeakElement } from "./find-peak-element"
import { searchInsertPosition } from "./search-insert-position"
import { searchRange } from "./find-first-and-last-position-of-element-in-sorted-array"
import { sqrtX } from "./sqrt-x"
import { validPerfectSquare } from "./valid-perfect-square"
import { arrangingCoins } from "./arranging-coins"
import { findKClosestElements } from "./find-k-closest-elements"
import { magneticForceBetweenTwoBalls } from "./magnetic-force-between-two-balls"
import { minDaysToMakeBouquets } from "./minimum-number-of-days-to-make-m-bouquets"
import { peakIndexInMountainArray } from "./peak-index-in-a-mountain-array"
import { guessNumber } from "./guess-number-higher-or-lower"
import { firstBadVersion } from "./first-bad-version"
import { kthMissingPositiveNumber } from "./kth-missing-positive-number"
import { nextGreatestLetter } from "./find-smallest-letter-greater-than-target"
import { smallestDivisor } from "./find-the-smallest-divisor-given-a-threshold"
import { cuttingRibbons } from "./cutting-ribbons"

const BS = "Binary Search"
const bs = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: BS, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const BINARY_SEARCH_3_PROBLEMS: Problem[] = [
  bs("search-insert-position", "Search Insert Position", "Easy", "search-insert-position",
    "The lower-bound template: hi starts past the end so 'insert at the back' is a legal answer.",
    searchInsertPosition, "O(log n)", "O(1)"),
  bs("find-first-and-last-position-of-element-in-sorted-array", "Find First and Last Position of Element in Sorted Array", "Medium",
    "find-first-and-last-position-of-element-in-sorted-array",
    "One lower bound finds the first hit; a second at target+1 finds the last — no scanning.",
    searchRange, "O(log n)", "O(1)"),
  bs("sqrt-x", "Sqrt(x)", "Easy", "sqrtx",
    "No array given — binary search the answer space 1..x for the last k with k² ≤ x.",
    sqrtX, "O(log x)", "O(1)"),
  bs("valid-perfect-square", "Valid Perfect Square", "Easy", "valid-perfect-square",
    "Squaring is monotonic, so hunt the exact root in 1..num and reject in log time.",
    validPerfectSquare, "O(log n)", "O(1)"),
  bs("arranging-coins", "Arranging Coins", "Easy", "arranging-coins",
    "k rows cost k(k+1)/2 coins — binary search the last k the budget covers.",
    arrangingCoins, "O(log n)", "O(1)"),
  bs("guess-number-higher-or-lower", "Guess Number Higher or Lower", "Easy", "guess-number-higher-or-lower",
    "The guessing game IS binary search — every -1/1 reply kills half the candidates.",
    guessNumber, "O(log n)", "O(1)"),
  bs("first-bad-version", "First Bad Version", "Easy", "first-bad-version",
    "Good…good…bad…bad is a sorted boolean array — find the first true with log₂(n) CI runs.",
    firstBadVersion, "O(log n)", "O(1)"),
  bs("peak-index-in-a-mountain-array", "Peak Index in a Mountain Array", "Medium", "peak-index-in-a-mountain-array",
    "No target needed — the slope at mid tells you which side of the summit you're on.",
    peakIndexInMountainArray, "O(log n)", "O(1)"),
  bs("find-peak-element", "Find Peak Element", "Medium", "find-peak-element",
    "Unsorted yet binary-searchable: follow any rising slope and a peak is guaranteed ahead.",
    findPeakElement, "O(log n)", "O(1)"),
  bs("find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "Medium",
    "find-minimum-in-rotated-sorted-array",
    "Compare mid with the right end to tell which sorted run you're in — the minimum hides at the seam.",
    findMinInRotatedSortedArray, "O(log n)", "O(1)"),
  bs("search-in-rotated-sorted-array-ii", "Search in Rotated Sorted Array II", "Medium",
    "search-in-rotated-sorted-array-ii",
    "Duplicates can hide which half is sorted — shed one from each end and the worst case slips to O(n).",
    searchRotatedII, "O(log n) avg, O(n) worst", "O(1)"),
  bs("find-k-closest-elements", "Find K Closest Elements", "Medium", "find-k-closest-elements",
    "The answer is a contiguous block — binary search its START by dueling the window's two edges.",
    findKClosestElements, "O(log(n−k) + k)", "O(1)"),
  bs("kth-missing-positive-number", "Kth Missing Positive Number", "Easy", "kth-missing-positive-number",
    "arr[i] − (i+1) counts the missing numbers before index i — a sorted quantity you can binary search.",
    kthMissingPositiveNumber, "O(log n)", "O(1)"),
  bs("find-smallest-letter-greater-than-target", "Find Smallest Letter Greater Than Target", "Easy",
    "find-smallest-letter-greater-than-target",
    "Upper bound with a wrap-around: if nothing beats the target, the alphabet circles back to letters[0].",
    nextGreatestLetter, "O(log n)", "O(1)"),
  bs("koko-eating-bananas", "Koko Eating Bananas", "Medium", "koko-eating-bananas",
    "Binary search the SPEED, not the piles — faster always finishes sooner, so feasibility is monotonic.",
    kokoEatingBananas, "O(n log m)", "O(1)"),
  bs("capacity-to-ship-packages-within-d-days", "Capacity to Ship Packages Within D Days", "Medium",
    "capacity-to-ship-packages-within-d-days",
    "Binary search the ship's capacity; every guess gets a greedy one-pass loading simulation.",
    shipWithinDays, "O(n log(sum))", "O(1)"),
  bs("split-array-largest-sum", "Split Array Largest Sum", "Hard", "split-array-largest-sum",
    "Flip the question: given a cap on part-sums, greedy-count the parts — then binary search the cap.",
    splitArrayLargestSum, "O(n log(sum))", "O(1)"),
  bs("magnetic-force-between-two-balls", "Magnetic Force Between Two Balls", "Medium",
    "magnetic-force-between-two-balls",
    "Aggressive Cows in disguise — maximize the minimum gap with a bias-up mid and greedy placement.",
    magneticForceBetweenTwoBalls, "O(n log(range))", "O(1)"),
  bs("minimum-number-of-days-to-make-m-bouquets", "Minimum Number of Days to Make m Bouquets", "Medium",
    "minimum-number-of-days-to-make-m-bouquets",
    "Waiting longer never hurts — binary search the day and count adjacent bloomed streaks per guess.",
    minDaysToMakeBouquets, "O(n log(maxDay))", "O(1)"),
  bs("find-the-smallest-divisor-given-a-threshold", "Find the Smallest Divisor Given a Threshold", "Medium",
    "find-the-smallest-divisor-given-a-threshold",
    "Bigger divisor, smaller sum — binary search divisors and pay O(n) ceil-division per guess.",
    smallestDivisor, "O(n log(max))", "O(1)"),
  bs("cutting-ribbons", "Cutting Ribbons", "Medium", "cutting-ribbons",
    "Maximize the piece length whose ⌊r/len⌋ counts still reach k — classic answer-space search from Meta.",
    cuttingRibbons, "O(n log(max))", "O(1)"),
]
