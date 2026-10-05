import type { Problem } from "@/engine/types"
import { minimumWindowSubstring } from "./minimum-window-substring"
import { findAllAnagramsInAString } from "./find-all-anagrams-in-a-string"
import { fruitIntoBaskets } from "./fruit-into-baskets"
import { longestSubarrayOf1sAfterDeletingOneElement } from "./longest-subarray-of-1s-after-deleting-one-element"
import { maximumAverageSubarrayI } from "./maximum-average-subarray-i"
import { subarrayProductLessThanK } from "./subarray-product-less-than-k"
import { binarySubarraysWithSum } from "./binary-subarrays-with-sum"
import { countNumberOfNiceSubarrays } from "./count-number-of-nice-subarrays"
import { grumpyBookstoreOwner } from "./grumpy-bookstore-owner"
import { maximumPointsYouCanObtainFromCards } from "./maximum-points-you-can-obtain-from-cards"
import { defuseTheBomb } from "./defuse-the-bomb"
import { minimumRecolorsToGetKConsecutiveBlackBlocks } from "./minimum-recolors-to-get-k-consecutive-black-blocks"
import { longestSubstringWithAtMostKDistinctCharacters } from "./longest-substring-with-at-most-k-distinct-characters"
import { maximumNumberOfVowelsInASubstringOfGivenLength } from "./maximum-number-of-vowels-in-a-substring-of-given-length"
import { minimumSwapsToGroupAll1sTogether } from "./minimum-swaps-to-group-all-1s-together"
import { frequencyOfTheMostFrequentElement } from "./frequency-of-the-most-frequent-element"
import { minimumOperationsToReduceXToZero } from "./minimum-operations-to-reduce-x-to-zero"
import { numberOfSubstringsContainingAllThreeCharacters } from "./number-of-substrings-containing-all-three-characters"
import { maximumErasureValue } from "./maximum-erasure-value"
import { containsDuplicateII } from "./contains-duplicate-ii"

const SW = "Sliding Window"
const sw = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: SW, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const SLIDING_WINDOW_2_PROBLEMS: Problem[] = [
  sw("minimum-window-substring", "Minimum Window Substring", "Hard", "minimum-window-substring",
    "One `missing` counter tells you the instant the window covers t — then shrink without mercy.",
    minimumWindowSubstring, "O(n + m)", "O(m)"),
  sw("find-all-anagrams-in-a-string", "Find All Anagrams in a String", "Medium", "find-all-anagrams-in-a-string",
    "A fixed window where entering and leaving chars cancel against need-counts — anagram when missing hits 0.",
    findAllAnagramsInAString, "O(n)", "O(k)"),
  sw("fruit-into-baskets", "Fruit Into Baskets", "Medium", "fruit-into-baskets",
    "Two baskets = at most 2 distinct types — the 'at most K distinct' template in disguise.",
    fruitIntoBaskets, "O(n)", "O(1)"),
  sw("longest-subarray-of-1s-after-deleting-one-element", "Longest Subarray of 1's After Deleting One Element",
    "Medium", "longest-subarray-of-1s-after-deleting-one-element",
    "Allow one 0 in the window — it's the deletion — and the answer is window length minus one.",
    longestSubarrayOf1sAfterDeletingOneElement, "O(n)", "O(1)"),
  sw("maximum-average-subarray-i", "Maximum Average Subarray I", "Easy", "maximum-average-subarray-i",
    "Max average over fixed k is just max sum — slide by adding one edge and dropping the other.",
    maximumAverageSubarrayI, "O(n)", "O(1)"),
  sw("subarray-product-less-than-k", "Subarray Product Less Than K", "Medium", "subarray-product-less-than-k",
    "Every valid window ending at right adds (right − left + 1) subarrays — count windows, not elements.",
    subarrayProductLessThanK, "O(n)", "O(1)"),
  sw("binary-subarrays-with-sum", "Binary Subarrays With Sum", "Medium", "binary-subarrays-with-sum",
    "'Exactly k' won't shrink greedily — compute atMost(k) − atMost(k−1) with two easy windows.",
    binarySubarraysWithSum, "O(n)", "O(1)"),
  sw("count-number-of-nice-subarrays", "Count Number of Nice Subarrays", "Medium", "count-number-of-nice-subarrays",
    "Odd numbers are just 1s in disguise — exactly k odds = atMost(k) − atMost(k−1).",
    countNumberOfNiceSubarrays, "O(n)", "O(1)"),
  sw("grumpy-bookstore-owner", "Grumpy Bookstore Owner", "Medium", "grumpy-bookstore-owner",
    "Bank the always-happy customers, then slide a window that competes only for the grumpy minutes.",
    grumpyBookstoreOwner, "O(n)", "O(1)"),
  sw("maximum-points-you-can-obtain-from-cards", "Maximum Points You Can Obtain from Cards", "Medium",
    "maximum-points-you-can-obtain-from-cards",
    "Taking k from the ends leaves a middle window of n−k — minimize what you leave behind.",
    maximumPointsYouCanObtainFromCards, "O(n)", "O(1)"),
  sw("defuse-the-bomb", "Defuse the Bomb", "Easy", "defuse-the-bomb",
    "A circular window rotated n times — modulo indexing keeps each slide O(1).",
    defuseTheBomb, "O(n)", "O(n)"),
  sw("minimum-recolors-to-get-k-consecutive-black-blocks", "Minimum Recolors for K Consecutive Black Blocks",
    "Easy", "minimum-recolors-to-get-k-consecutive-black-blocks",
    "Each window's cost is its white count — slide once and keep the cheapest.",
    minimumRecolorsToGetKConsecutiveBlackBlocks, "O(n)", "O(1)"),
  sw("longest-substring-with-at-most-k-distinct-characters", "Longest Substring with At Most K Distinct Characters",
    "Medium", "longest-substring-with-at-most-k-distinct-characters",
    "A count-map window that shrinks the moment a (k+1)th character kind appears.",
    longestSubstringWithAtMostKDistinctCharacters, "O(n)", "O(k)"),
  sw("maximum-number-of-vowels-in-a-substring-of-given-length", "Maximum Number of Vowels in a Substring of Given Length",
    "Medium", "maximum-number-of-vowels-in-a-substring-of-given-length",
    "Fixed window, one vowel counter — enter on the right, leave on the left.",
    maximumNumberOfVowelsInASubstringOfGivenLength, "O(n)", "O(1)"),
  sw("minimum-swaps-to-group-all-1s-together", "Minimum Swaps to Group All 1's Together", "Medium",
    "minimum-swaps-to-group-all-1s-together",
    "The grouped 1s fill a window of size count(1) — find the window already richest in 1s.",
    minimumSwapsToGroupAll1sTogether, "O(n)", "O(1)"),
  sw("frequency-of-the-most-frequent-element", "Frequency of the Most Frequent Element", "Medium",
    "frequency-of-the-most-frequent-element",
    "Sort, then keep windows where len×max − sum ≤ k — the budget check that makes everything equal.",
    frequencyOfTheMostFrequentElement, "O(n log n)", "O(1)"),
  sw("minimum-operations-to-reduce-x-to-zero", "Minimum Operations to Reduce X to Zero", "Medium",
    "minimum-operations-to-reduce-x-to-zero",
    "Flip it: removing ends summing to x means keeping the longest middle summing to total − x.",
    minimumOperationsToReduceXToZero, "O(n)", "O(1)"),
  sw("number-of-substrings-containing-all-three-characters", "Number of Substrings Containing All Three Characters",
    "Medium", "number-of-substrings-containing-all-three-characters",
    "Every substring ending at right works iff it starts at or before min(last a, last b, last c).",
    numberOfSubstringsContainingAllThreeCharacters, "O(n)", "O(1)"),
  sw("maximum-erasure-value", "Maximum Erasure Value", "Medium", "maximum-erasure-value",
    "The no-repeats window again — but this time you maximize the running sum, not the length.",
    maximumErasureValue, "O(n)", "O(n)"),
  sw("contains-duplicate-ii", "Contains Duplicate II", "Easy", "contains-duplicate-ii",
    "A rolling Set of the last k values — membership hit = duplicate within distance k.",
    containsDuplicateII, "O(n)", "O(k)"),
]
