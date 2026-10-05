import type { Problem } from "@/engine/types"
import { kClosestPointsToOrigin } from "@/solutions/heap-2/k-closest-points-to-origin"
import { lastStoneWeight } from "@/solutions/heap-2/last-stone-weight"
import { relativeRanks } from "@/solutions/heap-2/relative-ranks"
import { theKWeakestRowsInAMatrix } from "@/solutions/heap-2/the-k-weakest-rows-in-a-matrix"
import { sortCharactersByFrequency } from "@/solutions/heap-2/sort-characters-by-frequency"
import { taskScheduler } from "@/solutions/heap-2/task-scheduler"
import { reorganizeString } from "@/solutions/heap-2/reorganize-string"
import { longestHappyString } from "@/solutions/heap-2/longest-happy-string"
import { kthSmallestElementInASortedMatrix } from "@/solutions/heap-2/kth-smallest-element-in-a-sorted-matrix"
import { kPairsWithSmallestSums } from "@/solutions/heap-2/k-pairs-with-smallest-sums"
import { uglyNumberII } from "@/solutions/heap-2/ugly-number-ii"
import { meetingRoomsII } from "@/solutions/heap-2/meeting-rooms-ii"
import { minimumCostToConnectSticks } from "@/solutions/heap-2/minimum-cost-to-connect-sticks"
import { furthestBuildingYouCanReach } from "@/solutions/heap-2/furthest-building-you-can-reach"
import { removeStonesToMinimizeTheTotal } from "@/solutions/heap-2/remove-stones-to-minimize-the-total"
import { smallestNumberInInfiniteSet } from "@/solutions/heap-2/smallest-number-in-infinite-set"
import { seatReservationManager } from "@/solutions/heap-2/seat-reservation-manager"
import { singleThreadedCPU } from "@/solutions/heap-2/single-threaded-cpu"
import { totalCostToHireKWorkers } from "@/solutions/heap-2/total-cost-to-hire-k-workers"
import { maximumSubsequenceScore } from "@/solutions/heap-2/maximum-subsequence-score"
import { ipo } from "@/solutions/heap-2/ipo"
import { minimumNumberOfRefuelingStops } from "@/solutions/heap-2/minimum-number-of-refueling-stops"

const HEAP = "Heap / Priority Queue"
const hp = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: HEAP, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const HEAPS_2_PROBLEMS: Problem[] = [
  hp("last-stone-weight", "Last Stone Weight", "Easy", "last-stone-weight",
    "Smash the two heaviest until one survives — the max-heap serves them in O(log n).", lastStoneWeight, "O(n log n)", "O(n)"),
  hp("relative-ranks", "Relative Ranks", "Easy", "relative-ranks",
    "Pop athletes from a max-heap and count as you go — the heap IS the ranking.", relativeRanks, "O(n log n)", "O(n)"),
  hp("the-k-weakest-rows-in-a-matrix", "The K Weakest Rows in a Matrix", "Easy", "the-k-weakest-rows-in-a-matrix",
    "Row strength = position of the first 0; a (soldiers, row) heap bakes in the tie-break.", theKWeakestRowsInAMatrix, "O(mn + m log m)", "O(m)"),
  hp("k-closest-points-to-origin", "K Closest Points to Origin", "Medium", "k-closest-points-to-origin",
    "A size-k MAX-heap on d²: the farthest kept point guards the door.", kClosestPointsToOrigin, "O(n log k)", "O(k)"),
  hp("kth-smallest-element-in-a-sorted-matrix", "Kth Smallest Element in a Sorted Matrix", "Medium", "kth-smallest-element-in-a-sorted-matrix",
    "n sorted rows compete in a min-heap — pop k times, advancing only the popped row.", kthSmallestElementInASortedMatrix, "O(k log n)", "O(n)"),
  hp("k-pairs-with-smallest-sums", "Find K Pairs with Smallest Sums", "Medium", "find-k-pairs-with-smallest-sums",
    "Best-first over the pair grid: each popped (i, j) unlocks only its right neighbor.", kPairsWithSmallestSums, "O(k log k)", "O(k)"),
  hp("sort-characters-by-frequency", "Sort Characters by Frequency", "Medium", "sort-characters-by-frequency",
    "Count into piles, then a max-heap empties the piles biggest-first.", sortCharactersByFrequency, "O(n + u log u)", "O(n)"),
  hp("task-scheduler", "Task Scheduler", "Medium", "task-scheduler",
    "Fill each cooldown window greedily from the biggest piles; idles appear only when the heap runs dry.", taskScheduler, "O(n)", "O(1)"),
  hp("reorganize-string", "Reorganize String", "Medium", "reorganize-string",
    "Spend the biggest pile unless it just played — then the runner-up breaks the double.", reorganizeString, "O(n log 26)", "O(26)"),
  hp("longest-happy-string", "Longest Happy String", "Medium", "longest-happy-string",
    "Reorganize String with early exit: when only the blocked leader remains, the string just ends.", longestHappyString, "O(a+b+c)", "O(1)"),
  hp("ugly-number-ii", "Ugly Number II", "Medium", "ugly-number-ii",
    "Best-first generation: pop the smallest ugly, breed it with 2, 3, 5 — a seen-set stops twins.", uglyNumberII, "O(n log n)", "O(n)"),
  hp("meeting-rooms-ii", "Meeting Rooms II", "Medium", "meeting-rooms-ii",
    "Heap of end times = rooms in use; a meeting steals the earliest-freeing room or opens a new one.", meetingRoomsII, "O(n log n)", "O(n)"),
  hp("minimum-cost-to-connect-sticks", "Minimum Cost to Connect Sticks", "Medium", "minimum-cost-to-connect-sticks",
    "Huffman's exchange argument: the two cheapest sticks must merge first, every time.", minimumCostToConnectSticks, "O(n log n)", "O(n)"),
  hp("furthest-building-you-can-reach", "Furthest Building You Can Reach", "Medium", "furthest-building-you-can-reach",
    "Give every climb a ladder, then let the min-heap demote the cheapest ladder-user to bricks.", furthestBuildingYouCanReach, "O(n log n)", "O(n)"),
  hp("remove-stones-to-minimize-the-total", "Remove Stones to Minimize the Total", "Medium", "remove-stones-to-minimize-the-total",
    "k times: halve whatever is biggest NOW — the heap keeps that an O(log n) question.", removeStonesToMinimizeTheTotal, "O(n + k log n)", "O(n)"),
  hp("smallest-number-in-infinite-set", "Smallest Number in Infinite Set", "Medium", "smallest-number-in-infinite-set",
    "Never store infinity: a counter owns the pristine tail, a tiny heap owns the returned numbers.", smallestNumberInInfiniteSet, "O(log n) per op", "O(n)"),
  hp("seat-reservation-manager", "Seat Reservation Manager", "Medium", "seat-reservation-manager",
    "Recycled seats wait in a min-heap below the frontier counter — reserve() compares their fronts.", seatReservationManager, "O(log n) per op", "O(n)"),
  hp("single-threaded-cpu", "Single-Threaded CPU", "Medium", "single-threaded-cpu",
    "Time releases tasks into the heap; the heap serves shortest-job-first — and idles jump the clock.", singleThreadedCPU, "O(n log n)", "O(n)"),
  hp("total-cost-to-hire-k-workers", "Total Cost to Hire K Workers", "Medium", "total-cost-to-hire-k-workers",
    "Two candidate windows creep inward; each round the cheaper heap-root gets hired.", totalCostToHireKWorkers, "O((k + c) log c)", "O(c)"),
  hp("maximum-subsequence-score", "Maximum Subsequence Score", "Medium", "maximum-subsequence-score",
    "Fix the minimum multiplier by scanning high → low; a size-k min-heap keeps the best values.", maximumSubsequenceScore, "O(n log n)", "O(n)"),
  hp("ipo", "IPO", "Hard", "ipo",
    "Capital unlocks projects into a max-heap of profits; always run the best unlocked one.", ipo, "O(n log n)", "O(n)"),
  hp("minimum-number-of-refueling-stops", "Minimum Number of Refueling Stops", "Hard", "minimum-number-of-refueling-stops",
    "Pass every station, bank its fuel — refuel retroactively from the biggest banked tank.", minimumNumberOfRefuelingStops, "O(n log n)", "O(n)"),
]
