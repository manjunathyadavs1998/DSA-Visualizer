import type { Problem } from "@/engine/types"
import { reverseLinkedList } from "@/solutions/linked-list/reverse-linked-list"
import { middleOfTheLinkedList } from "@/solutions/linked-list/middle-of-the-linked-list"
import { mergeTwoSortedLists } from "@/solutions/linked-list/merge-two-sorted-lists"
import { removeNthNodeFromEnd } from "@/solutions/linked-list/remove-nth-node-from-end"
import { addTwoNumbers } from "@/solutions/linked-list/add-two-numbers"
import { deleteNodeInALinkedList } from "@/solutions/linked-list/delete-node-in-a-linked-list"
import { intersectionOfTwoLinkedLists } from "@/solutions/linked-list/intersection-of-two-linked-lists"
import { linkedListCycle } from "@/solutions/linked-list/linked-list-cycle"
import { reverseNodesInKGroup } from "@/solutions/linked-list/reverse-nodes-in-k-group"
import { palindromeLinkedList } from "@/solutions/linked-list/palindrome-linked-list"
import { linkedListCycleII } from "@/solutions/linked-list/linked-list-cycle-ii-cycle-start"
import { flatteningALinkedList } from "@/solutions/linked-list/flattening-a-linked-list"
import { rotateList } from "@/solutions/linked-list/rotate-list"
import { copyListWithRandomPointer } from "@/solutions/linked-list/copy-list-with-random-pointer"

const LL = "Linked List"
const ll = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug, title, neetcodeCategory: LL, pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const LINKED_LIST_PROBLEMS: Problem[] = [
  ll("reverse-linked-list", "Reverse Linked List", "Easy", "reverse-linked-list", "Three pointers walk the list — every step flips one arrow backwards.", reverseLinkedList),
  ll("middle-of-the-linked-list", "Middle of the Linked List", "Easy", "middle-of-the-linked-list", "fast moves 2× — when it hits the end, slow is standing on the middle.", middleOfTheLinkedList),
  ll("merge-two-sorted-lists", "Merge Two Sorted Lists", "Easy", "merge-two-sorted-lists", "Always take the smaller front — the merged list builds itself sorted.", mergeTwoSortedLists),
  ll("remove-nth-node-from-end", "Remove Nth Node From End", "Medium", "remove-nth-node-from-end-of-list", "Give lead a head start of n — when it falls off, trail is right before the victim.", removeNthNodeFromEnd),
  ll("add-two-numbers", "Add Two Numbers", "Medium", "add-two-numbers", "Reversed digits mean grade-school addition — the carry rides node to node.", addTwoNumbers),
  ll("delete-node-in-a-linked-list", "Delete Node in a Linked List", "Medium", "delete-node-in-a-linked-list", "No pointer back? Become your successor, then skip it — O(1) deletion.", deleteNodeInALinkedList),
  ll("intersection-of-two-linked-lists", "Intersection of Two Linked Lists", "Easy", "intersection-of-two-linked-lists", "Switch heads at the end — a+c+b = b+c+a, so the pointers meet at the join.", intersectionOfTwoLinkedLists),
  ll("linked-list-cycle", "Linked List Cycle", "Easy", "linked-list-cycle", "If there's a loop, the 2× runner must lap the 1× runner — meeting proves it.", linkedListCycle),
  ll("reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "Hard", "reverse-nodes-in-k-group", "Probe k ahead, reverse the block, stitch it onto the already-reversed rest.", reverseNodesInKGroup),
  ll("palindrome-linked-list", "Palindrome Linked List", "Easy", "palindrome-linked-list", "Reverse the back half, walk both halves in lockstep, then restore the list.", palindromeLinkedList),
  ll("linked-list-cycle-ii-cycle-start", "Linked List Cycle II (cycle start)", "Medium", "linked-list-cycle-ii", "After the runners meet, restart slow at head — a = m·c − b lands both on the entry.", linkedListCycleII),
  ll("flattening-a-linked-list", "Flattening a Linked List", "Medium", "https://www.google.com/search?q=flattening+a+linked+list+striver", "Fold each sorted sub-list into flat, one two-list merge at a time.", flatteningALinkedList),
  ll("rotate-list", "Rotate List", "Medium", "rotate-list", "k mod n cuts the last k nodes free and stitches them onto the front.", rotateList),
  ll("copy-list-with-random-pointer", "Copy List with Random Pointer", "Medium", "copy-list-with-random-pointer", "Clone every node into a map first — then every random is a cache-hit lookup.", copyListWithRandomPointer, "dp"),
]
