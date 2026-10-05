import type { Problem } from "@/engine/types"
import { dailyTemperatures } from "./daily-temperatures"
import { evaluateReversePolishNotation } from "./evaluate-reverse-polish-notation"
import { carFleet } from "./car-fleet"
import { asteroidCollision } from "./asteroid-collision"
import { removeAllAdjacentDuplicatesInString } from "./remove-all-adjacent-duplicates-in-string"
import { decodeString } from "./decode-string"
import { simplifyPath } from "./simplify-path"
import { pattern132 } from "./132-pattern"
import { sumOfSubarrayMinimums } from "./sum-of-subarray-minimums"
import { nextGreaterElementII } from "./next-greater-element-ii"
import { baseballGame } from "./baseball-game"
import { minimumAddToMakeParenthesesValid } from "./minimum-add-to-make-parentheses-valid"
import { maximumNestingDepth } from "./maximum-nesting-depth"
import { removeKDigits } from "./remove-k-digits"
import { validateStackSequences } from "./validate-stack-sequences"
import { removeDuplicateLetters } from "./remove-duplicate-letters"
import { numberOfRecentCalls } from "./number-of-recent-calls"

const SQ = "Stack & Queue"
const sq = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: SQ, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const STACK_QUEUE_2_PROBLEMS: Problem[] = [
  sq("daily-temperatures", "Daily Temperatures", "Medium", "daily-temperatures",
    "Days wait on a stack until a warmer day pops them — the next-greater template in disguise.",
    dailyTemperatures, "O(n)", "O(n)"),
  sq("evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "Medium",
    "evaluate-reverse-polish-notation",
    "Numbers wait, operators consume the two most recent — the stack IS the evaluator.",
    evaluateReversePolishNotation, "O(n)", "O(n)"),
  sq("car-fleet", "Car Fleet", "Medium", "car-fleet",
    "Sort by position, scan toward the target: a car arriving no later than the fleet ahead merges into it.",
    carFleet, "O(n log n)", "O(n)"),
  sq("asteroid-collision", "Asteroid Collision", "Medium", "asteroid-collision",
    "The stack is the hallway of survivors; only a left-mover meeting a right-mover top collides.",
    asteroidCollision, "O(n)", "O(n)"),
  sq("remove-all-adjacent-duplicates-in-string", "Remove All Adjacent Duplicates in String", "Easy",
    "remove-all-adjacent-duplicates-in-string",
    "Push survivors; a char equal to the top annihilates both — deletions cascade for free.",
    removeAllAdjacentDuplicatesInString, "O(n)", "O(n)"),
  sq("decode-string", "Decode String", "Medium", "decode-string",
    "Two stacks save (multiplier, prefix) at every '[' and expand the inner block at ']'.",
    decodeString, "O(n·k)", "O(n)"),
  sq("simplify-path", "Simplify Path", "Medium", "simplify-path",
    "A path is a stack of directories: names push, '..' pops, '.' and '//' do nothing.",
    simplifyPath, "O(n)", "O(n)"),
  sq("132-pattern", "132 Pattern", "Medium", "132-pattern",
    "Scan right-to-left: the stack holds '3' candidates, popped values certify the best '2'.",
    pattern132, "O(n)", "O(n)"),
  sq("sum-of-subarray-minimums", "Sum of Subarray Minimums", "Medium", "sum-of-subarray-minimums",
    "Flip the question: for how many subarrays is each element the min? A monotonic stack counts the spans.",
    sumOfSubarrayMinimums, "O(n)", "O(n)"),
  sq("next-greater-element-ii", "Next Greater Element II", "Medium", "next-greater-element-ii",
    "Circular array → scan two laps with i = t mod n; only the first lap pushes.",
    nextGreaterElementII, "O(n)", "O(n)"),
  sq("baseball-game", "Baseball Game", "Easy", "baseball-game",
    "Every op ('+', 'D', 'C') is defined relative to the most recent scores — a stack by definition.",
    baseballGame, "O(n)", "O(n)"),
  sq("minimum-add-to-make-parentheses-valid", "Minimum Add to Make Parentheses Valid", "Medium",
    "minimum-add-to-make-parentheses-valid",
    "Valid-parentheses, but count the failures instead of returning false: unmatched ')' plus leftover '('.",
    minimumAddToMakeParenthesesValid, "O(n)", "O(1)"),
  sq("maximum-nesting-depth", "Maximum Nesting Depth of the Parentheses", "Easy",
    "maximum-nesting-depth-of-the-parentheses",
    "The string is guaranteed valid, so the stack's height is all that matters — track its peak.",
    maximumNestingDepth, "O(n)", "O(1)"),
  sq("remove-k-digits", "Remove K Digits", "Medium", "remove-k-digits",
    "Greedy monotonic stack: pop any digit bigger than the one after it, k times, then trim the tail.",
    removeKDigits, "O(n)", "O(n)"),
  sq("validate-stack-sequences", "Validate Stack Sequences", "Medium", "validate-stack-sequences",
    "Simulate: push in order, greedily pop whenever the top matches the next expected pop.",
    validateStackSequences, "O(n)", "O(n)"),
  sq("remove-duplicate-letters", "Remove Duplicate Letters", "Medium", "remove-duplicate-letters",
    "Pop a bigger top only if it reappears later — remove-k-digits with a 'every letter survives' constraint.",
    removeDuplicateLetters, "O(n)", "O(1)"),
  sq("number-of-recent-calls", "Number of Recent Calls", "Easy", "number-of-recent-calls",
    "Times only increase, so pings expire in FIFO order — a queue gives amortized O(1) per ping.",
    numberOfRecentCalls, "O(1) amortized", "O(W)"),
]
