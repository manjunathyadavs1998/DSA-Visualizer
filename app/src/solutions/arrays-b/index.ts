import type { Problem } from "@/engine/types"
import { reversePairs } from "@/solutions/arrays-b/reverse-pairs"
import { twoSum } from "@/solutions/arrays-b/two-sum"
import { threeSum } from "@/solutions/arrays-b/3sum"
import { fourSum } from "@/solutions/arrays-b/4sum"
import { longestConsecutive } from "@/solutions/arrays-b/longest-consecutive-sequence"
import { largestSubarrayZeroSum } from "@/solutions/arrays-b/largest-subarray-with-0-sum"
import { countSubarraysXorK } from "@/solutions/arrays-b/count-subarrays-with-xor-k"
import { trappingRainWater } from "@/solutions/arrays-b/trapping-rain-water"
import { removeDuplicates } from "@/solutions/arrays-b/remove-duplicates-from-sorted-array"
import { maxConsecutiveOnes } from "@/solutions/arrays-b/max-consecutive-ones"

export const ARRAYS_B_PROBLEMS: Problem[] = [
  {
    slug: "reverse-pairs",
    title: "Reverse Pairs",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/reverse-pairs/",
    summary: "Merge sort with a bonus: count a[i] > 2·a[j] pairs across sorted halves before each merge.",
    solution: reversePairs,
  },
  {
    slug: "two-sum",
    title: "Two Sum",
    neetcodeCategory: "Arrays",
    pattern: "dp",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    summary: "One pass with a seen-map — a cache hit on target − current IS the answer.",
    solution: twoSum,
  },
  {
    slug: "3sum",
    title: "3Sum",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    summary: "Sort, fix one number, squeeze two pointers — and skip duplicates as you go.",
    solution: threeSum,
  },
  {
    slug: "4sum",
    title: "4Sum",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/4sum/",
    summary: "3Sum one level deeper: two fixed pointers plus the l/r squeeze on a sorted array.",
    solution: fourSum,
  },
  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/",
    summary: "Only sequence starts (n−1 missing from the set) expand — every number is walked at most twice.",
    solution: longestConsecutive,
  },
  {
    slug: "largest-subarray-with-0-sum",
    title: "Largest Subarray with 0 Sum",
    neetcodeCategory: "Arrays",
    pattern: "dp",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=Largest+Subarray+with+0+Sum+striver",
    summary: "Same prefix sum seen twice → everything in between sums to zero.",
    solution: largestSubarrayZeroSum,
  },
  {
    slug: "count-subarrays-with-xor-k",
    title: "Count Subarrays with XOR = K",
    neetcodeCategory: "Arrays",
    pattern: "dp",
    difficulty: "Hard",
    leetcodeUrl: "https://www.google.com/search?q=Count+Subarrays+with+XOR+K+striver",
    summary: "XOR undoes itself: count earlier prefixes equal to xr ^ k to close each k-XOR subarray.",
    solution: countSubarraysXorK,
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
    summary: "Water above each bar = min(leftMax, rightMax) − height — the shorter side always settles first.",
    solution: trappingRainWater,
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    summary: "Slow pointer builds the unique prefix in place; fast pointer scouts ahead.",
    solution: removeDuplicates,
  },
  {
    slug: "max-consecutive-ones",
    title: "Max Consecutive Ones",
    neetcodeCategory: "Arrays",
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones/",
    summary: "Extend the run on 1, reset on 0 — the gentlest sliding window there is.",
    solution: maxConsecutiveOnes,
  },
]
