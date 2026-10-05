import type { Problem } from "@/engine/types"
import { implementStackUsingArrays } from "@/solutions/stack-queue/implement-stack-using-arrays"
import { implementQueueUsingArrays } from "@/solutions/stack-queue/implement-queue-using-arrays"
import { implementStackUsingQueues } from "@/solutions/stack-queue/implement-stack-using-queues"
import { implementQueueUsingStacks } from "@/solutions/stack-queue/implement-queue-using-stacks"
import { validParentheses } from "@/solutions/stack-queue/valid-parentheses"
import { nextGreaterElement } from "@/solutions/stack-queue/next-greater-element"
import { sortAStack } from "@/solutions/stack-queue/sort-a-stack"
import { nextSmallerElement } from "@/solutions/stack-queue/next-smaller-element"
import { lruCache } from "@/solutions/stack-queue/lru-cache"
import { lfuCache } from "@/solutions/stack-queue/lfu-cache"
import { largestRectangleInHistogram } from "@/solutions/stack-queue/largest-rectangle-in-histogram"
import { slidingWindowMaximum } from "@/solutions/stack-queue/sliding-window-maximum"
import { minStack } from "@/solutions/stack-queue/min-stack"
import { onlineStockSpan } from "@/solutions/stack-queue/online-stock-span"

const SQ = "Stack & Queue"
const sq = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug, title, neetcodeCategory: SQ, pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const STACK_QUEUE_PROBLEMS: Problem[] = [
  sq("implement-stack-using-arrays", "Implement Stack using Arrays", "Easy",
    "https://www.google.com/search?q=implement+stack+using+arrays+striver",
    "One array, one index — push writes at ++top, pop just steps back.",
    implementStackUsingArrays),
  sq("implement-queue-using-arrays", "Implement Queue using Arrays", "Easy",
    "https://www.google.com/search?q=implement+queue+using+arrays+striver",
    "front and rear chase each other around a ring — % cap makes the wrap.",
    implementQueueUsingArrays),
  sq("implement-stack-using-queues", "Implement Stack using Queues", "Easy",
    "implement-stack-using-queues",
    "Rotate on push: the newest element muscles its way to the queue's front.",
    implementStackUsingQueues),
  sq("implement-queue-using-stacks", "Implement Queue using Stacks", "Easy",
    "implement-queue-using-stacks",
    "Two stacks, one lazy flip — each element moves at most twice, so pop is O(1) amortized.",
    implementQueueUsingStacks),
  sq("valid-parentheses", "Valid Parentheses", "Easy",
    "valid-parentheses",
    "Openers wait on the stack; every closer must match the most recent one.",
    validParentheses),
  sq("next-greater-element", "Next Greater Element", "Medium",
    "next-greater-element-i",
    "A falling stack of the still-waiting — each new number answers everyone it beats.",
    nextGreaterElement),
  sq("sort-a-stack", "Sort a Stack", "Easy",
    "https://www.google.com/search?q=sort+a+stack+striver",
    "Recursion empties the stack, then insertSorted sinks each value to its depth.",
    sortAStack),
  sq("next-smaller-element", "Next Smaller Element", "Medium",
    "https://www.google.com/search?q=next+smaller+element+striver",
    "The mirror trick: keep the stack increasing and pop whoever you undercut.",
    nextSmallerElement),
  sq("lru-cache", "LRU Cache", "Medium",
    "lru-cache",
    "A recency list plus a map — every touch jumps to the front, the back gets evicted.",
    lruCache, "dp"),
  sq("lfu-cache", "LFU Cache", "Hard",
    "lfu-cache",
    "Count the touches: the least-used key leaves first, ties broken by who's idled longest.",
    lfuCache),
  sq("largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "Hard",
    "largest-rectangle-in-histogram",
    "A bar pops when a shorter one arrives — exactly the moment its widest rectangle is known.",
    largestRectangleInHistogram),
  sq("sliding-window-maximum", "Sliding Window Maximum", "Hard",
    "sliding-window-maximum",
    "A deque of possible champions — stale and smaller indices are thrown out, the front is always the max.",
    slidingWindowMaximum),
  sq("min-stack", "Min Stack", "Medium",
    "min-stack",
    "A twin stack carries the min-so-far — pop rewinds the minimum's history for free.",
    minStack),
  sq("online-stock-span", "Online Stock Span", "Medium",
    "online-stock-span",
    "Pop every cheaper day and absorb its span whole — each day is pushed and popped once.",
    onlineStockSpan),
]
