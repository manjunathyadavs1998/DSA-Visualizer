import type { Problem } from "@/engine/types"
import { containerWithMostWater } from "./container-with-most-water"
import { threeSumClosest } from "./three-sum-closest"
import { removeElement } from "./remove-element"
import { squaresOfASortedArray } from "./squares-of-a-sorted-array"
import { isSubsequence } from "./is-subsequence"
import { backspaceStringCompare } from "./backspace-string-compare"
import { boatsToSavePeople } from "./boats-to-save-people"
import { validPalindromeIi } from "./valid-palindrome-ii"
import { reverseString } from "./reverse-string"
import { reverseVowelsOfAString } from "./reverse-vowels-of-a-string"
import { sortArrayByParity } from "./sort-array-by-parity"
import { partitionArrayAccordingToPivot } from "./partition-array-according-to-pivot"
import { removeDuplicatesFromSortedArrayIi } from "./remove-duplicates-from-sorted-array-ii"
import { stringCompression } from "./string-compression"
import { validTriangleNumber } from "./valid-triangle-number"
import { bagOfTokens } from "./bag-of-tokens"
import { maxNumberOfKSumPairs } from "./max-number-of-k-sum-pairs"
import { duplicateZeros } from "./duplicate-zeros"
import { longPressedName } from "./long-pressed-name"
import { intersectionOfTwoArraysIi } from "./intersection-of-two-arrays-ii"
import { findTheDuplicateNumber } from "./find-the-duplicate-number"
import { partitionLabels } from "./partition-labels"
import { sortArrayByParityIi } from "./sort-array-by-parity-ii"
import { shortestUnsortedContinuousSubarray } from "./shortest-unsorted-continuous-subarray"

const TP = "Two Pointers"
const tp = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: TP, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const TWO_POINTERS_PROBLEMS: Problem[] = [
  tp("container-with-most-water", "Container With Most Water", "Medium", "container-with-most-water",
    "Start widest and always move the shorter wall — the only move that can win.",
    containerWithMostWater, "O(n)", "O(1)"),
  tp("three-sum-closest", "3Sum Closest", "Medium", "3sum-closest",
    "Sort, fix an anchor, converge: the sum itself tells each pointer where to go.",
    threeSumClosest, "O(n²)", "O(1)"),
  tp("remove-element", "Remove Element", "Easy", "remove-element",
    "The read/write pointer template: survivors compact to the front in one pass.",
    removeElement, "O(n)", "O(1)"),
  tp("squares-of-a-sorted-array", "Squares of a Sorted Array", "Easy", "squares-of-a-sorted-array",
    "The biggest square hides at an end — fill the result from the back, no sort needed.",
    squaresOfASortedArray, "O(n)", "O(n)"),
  tp("is-subsequence", "Is Subsequence", "Easy", "is-subsequence",
    "Two pointers at different speeds: the pattern pointer only moves on a match.",
    isSubsequence, "O(n)", "O(1)"),
  tp("backspace-string-compare", "Backspace String Compare", "Easy", "backspace-string-compare",
    "Scan backwards so every '#' only erases chars you haven't judged yet.",
    backspaceStringCompare, "O(n + m)", "O(1)"),
  tp("boats-to-save-people", "Boats to Save People", "Medium", "boats-to-save-people",
    "Greedy pairing: the heaviest boards now; only the lightest can possibly join.",
    boatsToSavePeople, "O(n log n)", "O(1)"),
  tp("valid-palindrome-ii", "Valid Palindrome II", "Easy", "valid-palindrome-ii",
    "Converge until the first mismatch — then the one free deletion forks into two plain checks.",
    validPalindromeIi, "O(n)", "O(1)"),
  tp("reverse-string", "Reverse String", "Easy", "reverse-string",
    "The purest two-pointer move: converge-and-swap fixes two cells per step.",
    reverseString, "O(n)", "O(1)"),
  tp("reverse-vowels-of-a-string", "Reverse Vowels of a String", "Easy", "reverse-vowels-of-a-string",
    "Converge-and-swap with a filter: each pointer skips ahead to its next vowel.",
    reverseVowelsOfAString, "O(n)", "O(n)"),
  tp("sort-array-by-parity", "Sort Array By Parity", "Easy", "sort-array-by-parity",
    "Partition in place: a wrong-side pair on both ends is one swap from fixed.",
    sortArrayByParity, "O(n)", "O(1)"),
  tp("partition-array-according-to-pivot", "Partition Array According to Given Pivot", "Medium",
    "partition-array-according-to-given-pivot",
    "Stability is the trap: three order-preserving buckets beat a quicksort-style swap.",
    partitionArrayAccordingToPivot, "O(n)", "O(n)"),
  tp("remove-duplicates-from-sorted-array-ii", "Remove Duplicates from Sorted Array II", "Medium",
    "remove-duplicates-from-sorted-array-ii",
    "Allow two copies by comparing read against the value TWO behind write.",
    removeDuplicatesFromSortedArrayIi, "O(n)", "O(1)"),
  tp("string-compression", "String Compression", "Medium", "string-compression",
    "Read pointer measures runs, write pointer rewrites char+count — write never catches read.",
    stringCompression, "O(n)", "O(1)"),
  tp("valid-triangle-number", "Valid Triangle Number", "Medium", "valid-triangle-number",
    "Fix the largest side; when a + b > c, a whole range of pairs counts at once.",
    validTriangleNumber, "O(n²)", "O(1)"),
  tp("bag-of-tokens", "Bag of Tokens", "Medium", "bag-of-tokens",
    "Buy points with the cheapest tokens, sell the priciest back for power.",
    bagOfTokens, "O(n log n)", "O(1)"),
  tp("max-number-of-k-sum-pairs", "Max Number of K-Sum Pairs", "Medium", "max-number-of-k-sum-pairs",
    "Two Sum II with removal: a too-small smallest or too-big biggest can never pair — discard it.",
    maxNumberOfKSumPairs, "O(n log n)", "O(1)"),
  tp("duplicate-zeros", "Duplicate Zeros", "Easy", "duplicate-zeros",
    "Count the shift first, then walk backwards so nothing is read after it's overwritten.",
    duplicateZeros, "O(n)", "O(1)"),
  tp("long-pressed-name", "Long Pressed Name", "Easy", "long-pressed-name",
    "typed must replay name — each extra key is only forgiven if it echoes the previous one.",
    longPressedName, "O(n + m)", "O(1)"),
  tp("intersection-of-two-arrays-ii", "Intersection of Two Arrays II", "Easy",
    "intersection-of-two-arrays-ii",
    "Sort both and merge-walk: advance the smaller side, harvest on equality.",
    intersectionOfTwoArraysIi, "O(n log n + m log m)", "O(min(n, m))"),
  tp("find-the-duplicate-number", "Find the Duplicate Number", "Medium", "find-the-duplicate-number",
    "i → nums[i] turns the array into a linked list where the duplicate is a cycle — Floyd finds it.",
    findTheDuplicateNumber, "O(n)", "O(1)"),
  tp("partition-labels", "Partition Labels", "Medium", "partition-labels",
    "A window's end chases every letter's last occurrence; it closes the moment i catches it.",
    partitionLabels, "O(n)", "O(1)"),
  tp("sort-array-by-parity-ii", "Sort Array By Parity II", "Easy", "sort-array-by-parity-ii",
    "One pointer patrols even slots, one patrols odd — two wrongs make one swap.",
    sortArrayByParityIi, "O(n)", "O(1)"),
  tp("shortest-unsorted-continuous-subarray", "Shortest Unsorted Continuous Subarray", "Medium",
    "shortest-unsorted-continuous-subarray",
    "Two opposite sweeps: the last element to break the running max/min marks each boundary.",
    shortestUnsortedContinuousSubarray, "O(n)", "O(1)"),
]
