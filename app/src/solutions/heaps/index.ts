import type { Problem } from "@/engine/types"
import { kthLargestElementInAnArray } from "@/solutions/heaps/kth-largest-element-in-an-array"
import { maximumSumCombination } from "@/solutions/heaps/maximum-sum-combination"
import { findMedianFromDataStream } from "@/solutions/heaps/find-median-from-data-stream"
import { mergeKSortedLists } from "@/solutions/heaps/merge-k-sorted-lists"
import { topKFrequentElements } from "@/solutions/heaps/top-k-frequent-elements"
import { kthLargestElementInAStream } from "@/solutions/heaps/kth-largest-element-in-a-stream"

const HEAPS = "Heaps"
const hp = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug, title, neetcodeCategory: HEAPS, pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const HEAPS_PROBLEMS: Problem[] = [
  hp("kth-largest-element-in-a-stream", "Kth Largest Element in a Stream", "Easy", "kth-largest-element-in-a-stream", "Keep only the k largest ever seen — the heap root is the running answer.", kthLargestElementInAStream),
  hp("kth-largest-element-in-an-array", "Kth Largest Element in an Array", "Medium", "kth-largest-element-in-an-array", "A size-k min-heap: anything smaller than its root can never be the answer.", kthLargestElementInAnArray),
  hp("top-k-frequent-elements", "Top K Frequent Elements", "Medium", "top-k-frequent-elements", "Count everything, then let a size-k min-heap evict the rare ones.", topKFrequentElements, "dp"),
  hp("maximum-sum-combination", "Maximum Sum Combination", "Medium", "https://www.google.com/search?q=Maximum+Sum+Combination+striver", "Best-first over index pairs — each popped pair unlocks only its two neighbors.", maximumSumCombination),
  hp("merge-k-sorted-lists", "Merge k Sorted Lists", "Hard", "merge-k-sorted-lists", "k heads compete in a min-heap; the winner advances its own list.", mergeKSortedLists),
  hp("find-median-from-data-stream", "Find Median from Data Stream", "Hard", "find-median-from-data-stream", "Two heaps split the stream in half — the median lives at their touching roots.", findMedianFromDataStream),
]
