import type { Problem } from "@/engine/types"
import { weightedJobScheduling } from "./weighted-job-scheduling"
import { minMeetingRooms } from "./minimum-meeting-rooms"
import { eraseOverlapIntervals } from "./erase-overlap-intervals"

const T = "Intervals"
const iv = (
  slug: string, title: string, difficulty: Problem["difficulty"],
  lc: string, summary: string, solution: Problem["solution"],
  time: string, space: string,
): Problem => ({
  slug, title, neetcodeCategory: T, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const INTERVALS_PROBLEMS: Problem[] = [
  iv("erase-overlap-intervals-greedy", "Non-Overlapping Intervals", "Medium",
    "non-overlapping-intervals",
    "Sort by end time, greedily keep the earliest-ending interval — minimum removals to eliminate all overlaps.",
    eraseOverlapIntervals, "O(n log n)", "O(1)"),
  iv("minimum-meeting-rooms-sweep", "Meeting Rooms II (Sweep Line)", "Medium",
    "meeting-rooms-ii",
    "Two sorted arrays (starts, ends) — sweep with two pointers to count peak concurrent meetings.",
    minMeetingRooms, "O(n log n)", "O(n)"),
  iv("weighted-job-scheduling-dp", "Weighted Job Scheduling", "Hard",
    "job-scheduling-in-one-machine",
    "Sort by end time, binary search for latest compatible job, DP: skip or take each job.",
    weightedJobScheduling, "O(n log n)", "O(n)"),
]
