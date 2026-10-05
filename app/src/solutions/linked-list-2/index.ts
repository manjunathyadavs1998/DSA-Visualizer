import type { Problem } from "@/engine/types"
import { swapNodesInPairs } from "@/solutions/linked-list-2/swap-nodes-in-pairs"
import { removeDuplicatesFromSortedList } from "@/solutions/linked-list-2/remove-duplicates-from-sorted-list"
import { removeDuplicatesFromSortedListII } from "@/solutions/linked-list-2/remove-duplicates-from-sorted-list-ii"
import { partitionList } from "@/solutions/linked-list-2/partition-list"
import { oddEvenLinkedList } from "@/solutions/linked-list-2/odd-even-linked-list"
import { reorderList } from "@/solutions/linked-list-2/reorder-list"
import { sortList } from "@/solutions/linked-list-2/sort-list"
import { insertionSortList } from "@/solutions/linked-list-2/insertion-sort-list"
import { removeLinkedListElements } from "@/solutions/linked-list-2/remove-linked-list-elements"
import { mergeInBetweenLinkedLists } from "@/solutions/linked-list-2/merge-in-between-linked-lists"
import { swappingNodesInALinkedList } from "@/solutions/linked-list-2/swapping-nodes-in-a-linked-list"
import { deleteTheMiddleNodeOfALinkedList } from "@/solutions/linked-list-2/delete-the-middle-node-of-a-linked-list"
import { mergeKSortedLists } from "@/solutions/linked-list-2/merge-k-sorted-lists"
import { splitLinkedListInParts } from "@/solutions/linked-list-2/split-linked-list-in-parts"

const LL = "Linked List"
const ll = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: LL, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const LINKED_LIST_2_PROBLEMS: Problem[] = [
  ll("swap-nodes-in-pairs", "Swap Nodes in Pairs", "Medium", "swap-nodes-in-pairs",
    "prev sits before each pair; three rewires swap it without touching values.", swapNodesInPairs, "O(n)", "O(1)"),
  ll("remove-duplicates-from-sorted-list", "Remove Duplicates from Sorted List", "Easy", "remove-duplicates-from-sorted-list",
    "Sorted means copies are adjacent — cur.next skips them, cur waits for a new value.", removeDuplicatesFromSortedList, "O(n)", "O(1)"),
  ll("remove-duplicates-from-sorted-list-ii", "Remove Duplicates from Sorted List II", "Medium", "remove-duplicates-from-sorted-list-ii",
    "Even the first copy dies — prev lags on the last certain survivor and splices whole runs.", removeDuplicatesFromSortedListII, "O(n)", "O(1)"),
  ll("partition-list", "Partition List", "Medium", "partition-list",
    "Deal every node onto a <x pile or a ≥x pile, then stitch — stable by construction.", partitionList, "O(n)", "O(1)"),
  ll("odd-even-linked-list", "Odd Even Linked List", "Medium", "odd-even-linked-list",
    "Two leapfrogging chains — odd and even positions untangle in one pass, O(1) space.", oddEvenLinkedList, "O(n)", "O(1)"),
  ll("reorder-list", "Reorder List", "Medium", "reorder-list",
    "Three classics chained: find the middle, reverse the back half, weave the halves.", reorderList, "O(n)", "O(1)"),
  ll("sort-list", "Sort List", "Medium", "sort-list",
    "Merge sort is THE list sort: slow/fast splits for free, merge needs no random access.", sortList, "O(n log n)", "O(log n)"),
  ll("insertion-sort-list", "Insertion Sort List", "Medium", "insertion-sort-list",
    "Pull each node off and rescan from the dummy for its slot — the sorted prefix grows.", insertionSortList, "O(n²)", "O(1)"),
  ll("remove-linked-list-elements", "Remove Linked List Elements", "Easy", "remove-linked-list-elements",
    "A dummy head makes deleting even the head uniform: prev.next just skips the victim.", removeLinkedListElements, "O(n)", "O(1)"),
  ll("merge-in-between-linked-lists", "Merge In Between Linked Lists", "Medium", "merge-in-between-linked-lists",
    "Find the node before a and the node after b — two rewires splice list2 into the gap.", mergeInBetweenLinkedLists, "O(n + m)", "O(1)"),
  ll("swapping-nodes-in-a-linked-list", "Swapping Nodes in a Linked List", "Medium", "swapping-nodes-in-a-linked-list",
    "A probe k ahead of second keeps a fixed gap — when it hits the tail, swap the values.", swappingNodesInALinkedList, "O(n)", "O(1)"),
  ll("delete-the-middle-node-of-a-linked-list", "Delete the Middle Node of a Linked List", "Medium", "delete-the-middle-node-of-a-linked-list",
    "Give fast a 2-node head start so slow stops just BEFORE the middle — then skip it.", deleteTheMiddleNodeOfALinkedList, "O(n)", "O(1)"),
  ll("merge-k-sorted-lists", "Merge k Sorted Lists", "Hard", "merge-k-sorted-lists",
    "Merge the lists pairwise, halving k each round — every node moves only log k times.", mergeKSortedLists, "O(N log k)", "O(1)"),
  ll("split-linked-list-in-parts", "Split Linked List in Parts", "Medium", "split-linked-list-in-parts",
    "n = base·k + extra — the first extra parts take one bonus node, then cut and move on.", splitLinkedListInParts, "O(n + k)", "O(k)"),
]
