import type { Problem } from "@/engine/types"
import { reverseWordsInAString } from "@/solutions/strings2/reverse-words-in-a-string"
import { longestPalindromicSubstring } from "@/solutions/strings2/longest-palindromic-substring"
import { romanToInteger } from "@/solutions/strings2/roman-to-integer"
import { stringToIntegerAtoi } from "@/solutions/strings2/string-to-integer-atoi"
import { longestCommonPrefix } from "@/solutions/strings2/longest-common-prefix"
import { rabinKarpRepeatedStringMatch } from "@/solutions/strings2/rabin-karp-repeated-string-match"
import { zAlgorithm } from "@/solutions/strings2/z-algorithm"
import { kmpImplementStrstr } from "@/solutions/strings2/kmp-implement-strstr"
import { minimumCharactersForPalindrome } from "@/solutions/strings2/minimum-characters-for-palindrome"
import { validAnagram } from "@/solutions/strings2/valid-anagram"
import { countAndSay } from "@/solutions/strings2/count-and-say"
import { compareVersionNumbers } from "@/solutions/strings2/compare-version-numbers"

const p = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug, title, neetcodeCategory: "Strings", pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution,
})

export const STRINGS_PROBLEMS: Problem[] = [
  p("reverse-words-in-a-string", "Reverse Words in a String", "Medium", "reverse-words-in-a-string",
    "Scan out each word, push it, reverse the list — spaces collapse for free.", reverseWordsInAString),
  p("longest-palindromic-substring", "Longest Palindromic Substring", "Medium", "longest-palindromic-substring",
    "Grow outward from every center — odd and even — and keep the widest match.", longestPalindromicSubstring),
  p("roman-to-integer", "Roman to Integer", "Easy", "roman-to-integer",
    "Add every symbol — unless a bigger one follows, then subtract. That's IV.", romanToInteger),
  p("string-to-integer-atoi", "String to Integer (atoi)", "Medium", "string-to-integer-atoi",
    "Four phases in one pass: skip spaces, read the sign, eat digits, clamp to 32-bit.", stringToIntegerAtoi),
  p("longest-common-prefix", "Longest Common Prefix", "Easy", "longest-common-prefix",
    "Words stacked as rows, one column at a time — the first disagreeing column ends the prefix.", longestCommonPrefix),
  p("rabin-karp-repeated-string-match", "Rabin-Karp (Repeated String Match)", "Medium", "repeated-string-match",
    "Hash the pattern once, roll the window's hash in O(1) — and see a hash collision lie.", rabinKarpRepeatedStringMatch),
  p("z-algorithm", "Z Algorithm", "Medium", "https://www.google.com/search?q=Z+Algorithm+striver",
    "z[i] = prefix match starting at i — reuse answers inside the Z-box, compare only past its edge.", zAlgorithm),
  p("kmp-implement-strstr", "KMP / Implement strStr", "Medium", "find-the-index-of-the-first-occurrence-in-a-string",
    "The LPS table lets a mismatch fall back with j = lps[j−1] — the haystack pointer never rewinds.", kmpImplementStrstr),
  p("minimum-characters-for-palindrome", "Minimum Characters for Palindrome", "Hard", "https://www.google.com/search?q=Minimum+Characters+for+Palindrome+striver",
    "Build s + '#' + reverse(s); its last LPS value is the palindromic prefix — add the rest in front.", minimumCharactersForPalindrome),
  p("valid-anagram", "Valid Anagram", "Easy", "valid-anagram",
    "One counter map: +1 over s, −1 over t — any dip below zero ends it.", validAnagram, "dp"),
  p("count-and-say", "Count and Say", "Medium", "count-and-say",
    "Read the previous term aloud, run by run — \"two 1s\" becomes 21.", countAndSay),
  p("compare-version-numbers", "Compare Version Numbers", "Medium", "compare-version-numbers",
    "Chunk both versions between dots and compare numerically — a missing chunk counts as 0.", compareVersionNumbers),
]
