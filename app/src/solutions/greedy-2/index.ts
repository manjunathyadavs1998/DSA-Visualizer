import type { Problem } from "@/engine/types"
import { insertInterval } from "./insert-interval"
import { nonOverlappingIntervals } from "./non-overlapping-intervals"
import { meetingRooms } from "./meeting-rooms"
import { meetingRoomsII } from "./meeting-rooms-ii"
import { minimumNumberOfArrowsToBurstBalloons } from "./minimum-number-of-arrows-to-burst-balloons"
import { intervalListIntersections } from "./interval-list-intersections"
import { jumpGame } from "./jump-game"
import { jumpGameII } from "./jump-game-ii"
import { gasStation } from "./gas-station"
import { candy } from "./candy"
import { partitionLabels } from "./partition-labels"
import { handOfStraights } from "./hand-of-straights"
import { validParenthesisString } from "./valid-parenthesis-string"
import { lemonadeChange } from "./lemonade-change"
import { twoCityScheduling } from "./two-city-scheduling"
import { carPooling } from "./car-pooling"
import { removeKDigits } from "./remove-k-digits"
import { largestNumber } from "./largest-number"
import { wiggleSubsequence } from "./wiggle-subsequence"
import { taskScheduler } from "./task-scheduler"
import { boatsToSavePeople } from "./boats-to-save-people"
import { queueReconstructionByHeight } from "./queue-reconstruction-by-height"
import { nonDecreasingArray } from "./non-decreasing-array"
import { bagOfTokens } from "./bag-of-tokens"

const GREEDY = "Greedy"
const g = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: GREEDY, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const GREEDY_2_PROBLEMS: Problem[] = [
  g("insert-interval", "Insert Interval", "Medium", "insert-interval",
    "Copy the left zone, swallow the overlap zone into one block, copy the right zone.",
    insertInterval, "O(n)", "O(n)"),
  g("non-overlapping-intervals", "Non-overlapping Intervals", "Medium", "non-overlapping-intervals",
    "Flip it: KEEP the max compatible set (sort by end), remove the rest.",
    nonOverlappingIntervals, "O(n log n)", "O(1)"),
  g("meeting-rooms", "Meeting Rooms", "Easy", "meeting-rooms",
    "Sort by start — then only adjacent meetings can possibly clash.",
    meetingRooms, "O(n log n)", "O(1)"),
  g("meeting-rooms-ii", "Meeting Rooms II", "Medium", "meeting-rooms-ii",
    "Min rooms = peak overlap: sweep sorted starts against sorted ends.",
    meetingRoomsII, "O(n log n)", "O(n)"),
  g("minimum-number-of-arrows-to-burst-balloons", "Minimum Number of Arrows to Burst Balloons", "Medium",
    "minimum-number-of-arrows-to-burst-balloons",
    "Sort by right edge; shoot at each group's smallest right edge — one arrow per group.",
    minimumNumberOfArrowsToBurstBalloons, "O(n log n)", "O(1)"),
  g("interval-list-intersections", "Interval List Intersections", "Medium", "interval-list-intersections",
    "max(starts) ≤ min(ends) is the whole overlap test; retire whichever interval ends first.",
    intervalListIntersections, "O(m + n)", "O(1)"),
  g("jump-game", "Jump Game", "Medium", "jump-game",
    "Never choose a jump — just check the reachable frontier never falls behind you.",
    jumpGame, "O(n)", "O(1)"),
  g("jump-game-ii", "Jump Game II", "Medium", "jump-game-ii",
    "Implicit BFS: count how many times the frontier layer must advance.",
    jumpGameII, "O(n)", "O(1)"),
  g("gas-station", "Gas Station", "Medium", "gas-station",
    "A failed stretch eliminates every start inside it — one pass finds the survivor.",
    gasStation, "O(n)", "O(1)"),
  g("candy", "Candy", "Hard", "candy",
    "Two one-directional sweeps; max() merges the left and right neighbor rules.",
    candy, "O(n)", "O(n)"),
  g("partition-labels", "Partition Labels", "Medium", "partition-labels",
    "A part can close exactly when the scan reaches the max last-occurrence inside it.",
    partitionLabels, "O(n)", "O(1)"),
  g("hand-of-straights", "Hand of Straights", "Medium", "hand-of-straights",
    "The smallest remaining card has no choice: it must open a straight right now.",
    handOfStraights, "O(n log n)", "O(n)"),
  g("valid-parenthesis-string", "Valid Parenthesis String", "Medium", "valid-parenthesis-string",
    "Track the [lo, hi] interval of possible open counts — two ints beat exponential branching.",
    validParenthesisString, "O(n)", "O(1)"),
  g("lemonade-change", "Lemonade Change", "Easy", "lemonade-change",
    "Break a $20 with 10+5, never 5+5+5 — fives are strictly more useful.",
    lemonadeChange, "O(n)", "O(1)"),
  g("two-city-scheduling", "Two City Scheduling", "Medium", "two-city-scheduling",
    "Send everyone to B, then refund the n best a−b differences by moving them to A.",
    twoCityScheduling, "O(n log n)", "O(1)"),
  g("car-pooling", "Car Pooling", "Medium", "car-pooling",
    "Difference array over the stops, then one prefix-sum sweep against capacity.",
    carPooling, "O(n + stops)", "O(stops)"),
  g("remove-k-digits", "Remove K Digits", "Medium", "remove-k-digits",
    "Monotonic stack: a digit bigger than its right neighbor is always the right one to delete.",
    removeKDigits, "O(n)", "O(n)"),
  g("largest-number", "Largest Number", "Medium", "largest-number",
    "Sort by the gluing test ab vs ba — '9' must beat '34' even though 9 < 34.",
    largestNumber, "O(n log n)", "O(n)"),
  g("wiggle-subsequence", "Wiggle Subsequence", "Medium", "wiggle-subsequence",
    "Keep only the turning points: two counters (up/down) replace O(n²) DP.",
    wiggleSubsequence, "O(n)", "O(1)"),
  g("task-scheduler", "Task Scheduler", "Medium", "task-scheduler",
    "Only the most frequent task forces idles: (maxF−1)·(n+1)+maxCount vs total tasks.",
    taskScheduler, "O(n)", "O(1)"),
  g("boats-to-save-people", "Boats to Save People", "Medium", "boats-to-save-people",
    "Pair the heaviest with the lightest; if even the lightest can't join, nobody can.",
    boatsToSavePeople, "O(n log n)", "O(1)"),
  g("queue-reconstruction-by-height", "Queue Reconstruction by Height", "Medium", "queue-reconstruction-by-height",
    "Place tallest first — then each person's k is literally their insertion index.",
    queueReconstructionByHeight, "O(n²)", "O(n)"),
  g("non-decreasing-array", "Non-decreasing Array", "Medium", "non-decreasing-array",
    "At the first dip, lower the peak if the left context allows; raise the valley only when forced.",
    nonDecreasingArray, "O(n)", "O(1)"),
  g("bag-of-tokens", "Bag of Tokens", "Medium", "bag-of-tokens",
    "Buy score at the cheap end, sell it at the expensive end — and remember the best score held.",
    bagOfTokens, "O(n log n)", "O(1)"),
]
