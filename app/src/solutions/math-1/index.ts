import type { Problem } from "@/engine/types"
import { palindromeNumber } from "@/solutions/math-1/palindrome-number"
import { reverseInteger } from "@/solutions/math-1/reverse-integer"
import { happyNumber } from "@/solutions/math-1/happy-number"
import { fizzBuzz } from "@/solutions/math-1/fizz-buzz"
import { countPrimes } from "@/solutions/math-1/count-primes"
import { factorialTrailingZeroes } from "@/solutions/math-1/factorial-trailing-zeroes"
import { addDigits } from "@/solutions/math-1/add-digits"
import { nimGame } from "@/solutions/math-1/nim-game"
import { bulbSwitcher } from "@/solutions/math-1/bulb-switcher"
import { perfectNumber } from "@/solutions/math-1/perfect-number"
import { selfDividingNumbers } from "@/solutions/math-1/self-dividing-numbers"
import { greatestCommonDivisorEuclid } from "@/solutions/math-1/greatest-common-divisor-euclid"

const p = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug, title, neetcodeCategory: "Math & Geometry", pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const MATH_PROBLEMS: Problem[] = [
  p("palindrome-number", "Palindrome Number", "Easy", "palindrome-number",
    "Peel the digits with % 10, then squeeze two pointers — no string conversion.",
    palindromeNumber, "O(log₁₀ n)", "O(log₁₀ n)"),
  p("reverse-integer", "Reverse Integer", "Medium", "reverse-integer",
    "Pop the last digit, push it onto rev — and guard the 32-bit cliff before it overflows.",
    reverseInteger, "O(log₁₀ n)", "O(1)"),
  p("happy-number", "Happy Number", "Easy", "happy-number",
    "Square-and-sum the digits; a seen-set turns 'runs forever?' into cycle detection.",
    happyNumber, "O(log n)", "O(log n)"),
  p("fizz-buzz", "Fizz Buzz", "Easy", "fizz-buzz",
    "Divisibility branching in the right order — test 15 before 3 or 5 steals it.",
    fizzBuzz, "O(n)", "O(n)"),
  p("count-primes", "Count Primes", "Medium", "count-primes",
    "Sieve of Eratosthenes: each prime crosses out its multiples from p² — survivors are prime.",
    countPrimes, "O(n log log n)", "O(n)"),
  p("factorial-trailing-zeroes", "Factorial Trailing Zeroes", "Medium", "factorial-trailing-zeroes",
    "Zeros come from 5s, not 10s: count n/5 + n/25 + n/125 + … by recursing on n/5.",
    factorialTrailingZeroes, "O(log₅ n)", "O(log₅ n)"),
  p("add-digits", "Add Digits", "Easy", "add-digits",
    "Collapse digit sums to the digital root — then see why 1 + (n−1) % 9 does it in O(1).",
    addDigits, "O(log n)", "O(log n)"),
  p("nim-game", "Nim Game", "Easy", "nim-game",
    "Win if ANY move leaves the opponent losing — the memo exposes the multiples-of-4 pattern.",
    nimGame, "O(n)", "O(n)", "dp"),
  p("bulb-switcher", "Bulb Switcher", "Medium", "bulb-switcher",
    "Bulb i flips once per divisor of i — only perfect squares end up on, so answer = ⌊√n⌋.",
    bulbSwitcher, "O(n log n)", "O(n)"),
  p("perfect-number", "Perfect Number", "Easy", "perfect-number",
    "Divisors pair up as (d, n/d) — sweep d only to √n and add both ends of each pair.",
    perfectNumber, "O(√n)", "O(1)"),
  p("self-dividing-numbers", "Self Dividing Numbers", "Easy", "self-dividing-numbers",
    "For each n, every digit must divide n — and one 0 digit disqualifies instantly.",
    selfDividingNumbers, "O(n log n)", "O(1)"),
  p("greatest-common-divisor-euclid", "Greatest Common Divisor (Euclid)", "Easy",
    "https://www.google.com/search?q=euclidean+algorithm+greatest+common+divisor",
    "gcd(a, b) = gcd(b, a mod b): the remainder keeps every common divisor but shrinks fast.",
    greatestCommonDivisorEuclid, "O(log min(a,b))", "O(log min(a,b))"),
]
