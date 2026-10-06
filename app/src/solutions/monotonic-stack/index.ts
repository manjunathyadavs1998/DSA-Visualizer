import type { Problem } from "@/engine/types"
import { dailyTemperatures } from "./daily-temperatures"
import { largestRectangleHistogram } from "./largest-rectangle-histogram"
import { sumOfSubarrayMinimums } from "./sum-of-subarray-minimums"
import { trappingRainWaterMonotonic } from "./trapping-rain-water-stack"

const T = "Monotonic Stack"
const m = (
  slug: string, title: string, difficulty: Problem["difficulty"],
  lc: string, summary: string, solution: Problem["solution"],
  time: string, space: string,
): Problem => ({
  slug, title, neetcodeCategory: T, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const MONOTONIC_STACK_PROBLEMS: Problem[] = [
  m("daily-temperatures-mono", "Daily Temperatures", "Medium", "daily-temperatures",
    "Decreasing stack of indices — a warmer day pops and answers everyone colder than it.",
    dailyTemperatures, "O(n)", "O(n)"),
  m("largest-rectangle-histogram-mono", "Largest Rectangle in Histogram", "Hard",
    "largest-rectangle-in-histogram",
    "Increasing stack: a shorter bar pops taller ones and computes their max-width rectangles.",
    largestRectangleHistogram, "O(n)", "O(n)"),
  m("sum-of-subarray-minimums-mono", "Sum of Subarray Minimums", "Medium",
    "sum-of-subarray-minimums",
    "For each element, count subarrays where it is the minimum using left/right monotonic passes.",
    sumOfSubarrayMinimums, "O(n)", "O(n)"),
  m("trapping-rain-water-stack", "Trapping Rain Water (Stack)", "Hard", "trapping-rain-water",
    "Decreasing stack: a taller right wall creates a basin — compute water layer by layer.",
    trappingRainWaterMonotonic, "O(n)", "O(n)"),
]
