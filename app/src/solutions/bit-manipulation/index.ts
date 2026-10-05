import type { Problem } from "@/engine/types"
import { singleNumber } from "@/solutions/bit-manipulation/single-number"
import { singleNumberII } from "@/solutions/bit-manipulation/single-number-ii"
import { singleNumberIII } from "@/solutions/bit-manipulation/single-number-iii"
import { numberOf1Bits } from "@/solutions/bit-manipulation/number-of-1-bits"
import { countingBits } from "@/solutions/bit-manipulation/counting-bits"
import { reverseBits } from "@/solutions/bit-manipulation/reverse-bits"
import { missingNumber } from "@/solutions/bit-manipulation/missing-number"
import { powerOfTwo } from "@/solutions/bit-manipulation/power-of-two"
import { sumOfTwoIntegers } from "@/solutions/bit-manipulation/sum-of-two-integers"
import { bitwiseAndOfNumbersRange } from "@/solutions/bit-manipulation/bitwise-and-of-numbers-range"
import { findTheDifference } from "@/solutions/bit-manipulation/find-the-difference"
import { totalHammingDistance } from "@/solutions/bit-manipulation/total-hamming-distance"
import { complementOfBase10Integer } from "@/solutions/bit-manipulation/complement-of-base-10-integer"
import { xorOperationInAnArray } from "@/solutions/bit-manipulation/xor-operation-in-an-array"
import { minimumBitFlips } from "@/solutions/bit-manipulation/minimum-bit-flips-to-convert-number"
import { powerOfFour } from "@/solutions/bit-manipulation/power-of-four"

const BM = "Bit Manipulation"
const bm = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: BM, pattern: "recursion", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const BIT_PROBLEMS: Problem[] = [
  bm("single-number", "Single Number", "Easy", "single-number",
    "x ^ x = 0, so XOR-ing everything makes the pairs vanish — the loner survives.", singleNumber, "O(n)", "O(1)"),
  bm("single-number-ii", "Single Number II", "Medium", "single-number-ii",
    "Two registers count each bit mod 3 — the third sighting erases it from both.", singleNumberII, "O(n)", "O(1)"),
  bm("single-number-iii", "Single Number III", "Medium", "single-number-iii",
    "XOR all → a^b; its lowest 1-bit splits the array so each half is Single Number I.", singleNumberIII, "O(n)", "O(1)"),
  bm("number-of-1-bits", "Number of 1 Bits", "Easy", "number-of-1-bits",
    "n & (n−1) deletes the lowest set bit — loop once per 1, never per bit.", numberOf1Bits, "O(k)", "O(1)"),
  bm("counting-bits", "Counting Bits", "Easy", "counting-bits",
    "popcount(i) = popcount(i >> 1) + (i & 1): chop the last binary digit, reuse the answer.", countingBits, "O(n)", "O(n)"),
  bm("reverse-bits", "Reverse Bits", "Easy", "reverse-bits",
    "Peel the low bit off n and push it into res — w shifts mirror the whole word.", reverseBits, "O(1)", "O(1)"),
  bm("missing-number", "Missing Number", "Easy", "missing-number",
    "XOR indices 0..n against the values: every present number cancels its own index.", missingNumber, "O(n)", "O(1)"),
  bm("power-of-two", "Power of Two", "Easy", "power-of-two",
    "One set bit ⇔ n & (n−1) == 0 — erasing the lowest 1 must erase everything.", powerOfTwo, "O(1)", "O(1)"),
  bm("sum-of-two-integers", "Sum of Two Integers", "Medium", "sum-of-two-integers",
    "XOR adds without carrying; AND<<1 is the carry — loop until the carry dies.", sumOfTwoIntegers, "O(log n)", "O(1)"),
  bm("bitwise-and-of-numbers-range", "Bitwise AND of Numbers Range", "Medium", "bitwise-and-of-numbers-range",
    "Every low bit flips to 0 somewhere in the range — only the common prefix survives.", bitwiseAndOfNumbersRange, "O(log n)", "O(1)"),
  bm("find-the-difference", "Find the Difference", "Easy", "find-the-difference",
    "Chars are numbers: XOR both strings and the shuffled pairs cancel to the extra char.", findTheDifference, "O(n)", "O(1)"),
  bm("total-hamming-distance", "Total Hamming Distance", "Medium", "total-hamming-distance",
    "Per bit column: k ones × (n−k) zeros pairs differ — sum columns, skip the O(n²) pairs.", totalHammingDistance, "O(32·n)", "O(1)"),
  bm("complement-of-base-10-integer", "Complement of Base 10 Integer", "Easy", "complement-of-base-10-integer",
    "Grow an all-ones mask to n's width, then one XOR flips every bit inside it.", complementOfBase10Integer, "O(log n)", "O(1)"),
  bm("xor-operation-in-an-array", "XOR Operation in an Array", "Easy", "xor-operation-in-an-array",
    "Generate start + 2i on the fly and fold with XOR — the array never materializes.", xorOperationInAnArray, "O(n)", "O(1)"),
  bm("minimum-bit-flips-to-convert-number", "Minimum Bit Flips to Convert Number", "Easy", "minimum-bit-flips-to-convert-number",
    "start ^ goal lights up exactly the disagreeing columns — popcount is the answer.", minimumBitFlips, "O(log n)", "O(1)"),
  bm("power-of-four", "Power of Four", "Easy", "power-of-four",
    "Power of two first (one set bit), then mask 0x55555555 checks the bit sits on an even slot.", powerOfFour, "O(1)", "O(1)"),
]
