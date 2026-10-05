import type { Problem } from "@/engine/types"
import { groupAnagrams } from "@/solutions/strings-3/group-anagrams"
import { integerToRoman } from "@/solutions/strings-3/integer-to-roman"
import { repeatedSubstringPattern } from "@/solutions/strings-3/repeated-substring-pattern"
import { stringCompression } from "@/solutions/strings-3/string-compression"
import { multiplyStrings } from "@/solutions/strings-3/multiply-strings"
import { addStrings } from "@/solutions/strings-3/add-strings"
import { isomorphicStrings } from "@/solutions/strings-3/isomorphic-strings"
import { wordPattern } from "@/solutions/strings-3/word-pattern"
import { firstUniqueCharacterInAString } from "@/solutions/strings-3/first-unique-character-in-a-string"
import { ransomNote } from "@/solutions/strings-3/ransom-note"
import { excelSheetColumnTitle } from "@/solutions/strings-3/excel-sheet-column-title"
import { lengthOfLastWord } from "@/solutions/strings-3/length-of-last-word"
import { largestOddNumberInString } from "@/solutions/strings-3/largest-odd-number-in-string"
import { mergeStringsAlternately } from "@/solutions/strings-3/merge-strings-alternately"
import { greatestCommonDivisorOfStrings } from "@/solutions/strings-3/greatest-common-divisor-of-strings"
import { findAllAnagramsInAString } from "@/solutions/strings-3/find-all-anagrams-in-a-string"
import { palindromicSubstrings } from "@/solutions/strings-3/palindromic-substrings"
import { decodeString } from "@/solutions/strings-3/decode-string"

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
  slug, title, neetcodeCategory: "Strings", pattern, difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const STRINGS_3_PROBLEMS: Problem[] = [
  p("group-anagrams", "Group Anagrams", "Medium", "group-anagrams",
    "Sort each word into a signature — anagrams collide into the same bucket.",
    groupAnagrams, "O(n·k log k)", "O(n·k)"),
  p("integer-to-roman", "Integer to Roman", "Medium", "integer-to-roman",
    "Greedy over a 13-entry table — the subtractive pairs (CM, XL, IV) ARE table entries.",
    integerToRoman, "O(1)", "O(1)"),
  p("repeated-substring-pattern", "Repeated Substring Pattern", "Easy", "repeated-substring-pattern",
    "Only divisor-length prefixes can tile the string — test each with s[i] vs s[i−len].",
    repeatedSubstringPattern, "O(n²)", "O(1)"),
  p("string-compression", "String Compression", "Medium", "string-compression",
    "Read runs with one pointer, overwrite char + count with another — in place.",
    stringCompression, "O(n)", "O(1)"),
  p("multiply-strings", "Multiply Strings", "Medium", "multiply-strings",
    "Grade-school multiply: digit i × digit j always lands in result slot i+j+1.",
    multiplyStrings, "O(m·n)", "O(m+n)"),
  p("add-strings", "Add Strings", "Easy", "add-strings",
    "Paper addition: walk both numbers from the right, carry in hand — no BigInt.",
    addStrings, "O(max(m,n))", "O(max(m,n))"),
  p("isomorphic-strings", "Isomorphic Strings", "Easy", "isomorphic-strings",
    "Two maps, one per direction — 'badc' vs 'baba' is why one map isn't enough.",
    isomorphicStrings, "O(n)", "O(k)"),
  p("word-pattern", "Word Pattern", "Easy", "word-pattern",
    "Isomorphic strings, but letter ↔ word — the same bijection check both ways.",
    wordPattern, "O(n + m)", "O(n + m)"),
  p("first-unique-character-in-a-string", "First Unique Character in a String", "Easy",
    "first-unique-character-in-a-string",
    "Count everything first, then rescan in order — the first count-1 char wins.",
    firstUniqueCharacterInAString, "O(n)", "O(1)", "dp"),
  p("ransom-note", "Ransom Note", "Easy", "ransom-note",
    "Stock up letter counts from the magazine, spend them on the note — never go negative.",
    ransomNote, "O(m + n)", "O(1)", "dp"),
  p("excel-sheet-column-title", "Excel Sheet Column Title", "Easy", "excel-sheet-column-title",
    "Base 26 with no zero: subtract 1 before every digit — that's the whole puzzle.",
    excelSheetColumnTitle, "O(log₂₆ n)", "O(log₂₆ n)"),
  p("length-of-last-word", "Length of Last Word", "Easy", "length-of-last-word",
    "Walk backward: skip trailing spaces, then count letters until the next space.",
    lengthOfLastWord, "O(n)", "O(1)"),
  p("largest-odd-number-in-string", "Largest Odd Number in String", "Easy", "largest-odd-number-in-string",
    "Odd ⇔ last digit odd, so the answer is a prefix — find the rightmost odd digit.",
    largestOddNumberInString, "O(n)", "O(1)"),
  p("merge-strings-alternately", "Merge Strings Alternately", "Easy", "merge-strings-alternately",
    "Zip two strings char by char; whoever is longer just drains at the end.",
    mergeStringsAlternately, "O(m + n)", "O(m + n)"),
  p("greatest-common-divisor-of-strings", "Greatest Common Divisor of Strings", "Easy",
    "greatest-common-divisor-of-strings",
    "s+t === t+s proves a common unit exists — then Euclid's gcd on the lengths finds it.",
    greatestCommonDivisorOfStrings, "O(m + n)", "O(m + n)"),
  p("find-all-anagrams-in-a-string", "Find All Anagrams in a String", "Medium",
    "find-all-anagrams-in-a-string",
    "Slide a |p|-sized window; a missing-counter hits 0 exactly when counts cancel.",
    findAllAnagramsInAString, "O(n)", "O(k)"),
  p("palindromic-substrings", "Palindromic Substrings", "Medium", "palindromic-substrings",
    "Expand around all 2n−1 centers — every palindrome is counted at its own center.",
    palindromicSubstrings, "O(n²)", "O(1)"),
  p("decode-string", "Decode String", "Medium", "decode-string",
    "Two stacks save the outer world at '['; ']' pops, repeats, and reattaches.",
    decodeString, "O(n·k)", "O(n)"),
]
