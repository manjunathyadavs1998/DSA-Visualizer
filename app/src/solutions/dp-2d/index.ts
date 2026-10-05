import type { Problem } from "@/engine/types"
import { longestPalindromicSubsequence } from "./longest-palindromic-subsequence"
import { regularExpressionMatching } from "./regular-expression-matching"
import { wildcardMatching } from "./wildcard-matching"
import { interleavingString } from "./interleaving-string"
import { distinctSubsequences } from "./distinct-subsequences"
import { triangle } from "./triangle"
import { maximalSquare } from "./maximal-square"
import { dungeonGame } from "./dungeon-game"
import { targetSum } from "./target-sum"
import { onesAndZeroes } from "./ones-and-zeroes"
import { lastStoneWeightII } from "./last-stone-weight-ii"
import { stoneGame } from "./stone-game"
import { predictTheWinner } from "./predict-the-winner"
import { countSquareSubmatricesWithAllOnes } from "./count-square-submatrices-with-all-ones"
import { knightProbabilityInChessboard } from "./knight-probability-in-chessboard"
import { minimumFallingPathSum } from "./minimum-falling-path-sum"
import { uniquePathsII } from "./unique-paths-ii"
import { deleteOperationForTwoStrings } from "./delete-operation-for-two-strings"
import { minimumAsciiDeleteSum } from "./minimum-ascii-delete-sum"
import { uncrossedLines } from "./uncrossed-lines"
import { shortestCommonSupersequence } from "./shortest-common-supersequence"
import { longestPalindromicSubstring } from "./longest-palindromic-substring"
import { palindromicSubstrings } from "./palindromic-substrings"
import { maximumLengthOfRepeatedSubarray } from "./maximum-length-of-repeated-subarray"
import { burstBalloons } from "./burst-balloons"
import { minimumInsertionStepsToMakeAStringPalindrome } from "./minimum-insertion-steps-to-make-a-string-palindrome"

const DP2D = "2-D DP"
const d = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: DP2D, pattern: "dp", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const DP_2D_PROBLEMS: Problem[] = [
  d("longest-palindromic-subsequence", "Longest Palindromic Subsequence", "Medium", "longest-palindromic-subsequence",
    "Matching ends shrink inward for +2; mismatched ends drop one side — LCS with the reversed string, done directly.",
    longestPalindromicSubsequence, "O(n²)", "O(n²)"),
  d("regular-expression-matching", "Regular Expression Matching", "Hard", "regular-expression-matching",
    "'x*' is a fork, not a loop: match zero (jump the pattern) or one more x (advance the text).",
    regularExpressionMatching, "O(m·n)", "O(m·n)"),
  d("wildcard-matching", "Wildcard Matching", "Hard", "wildcard-matching",
    "'*' swallows nothing or one more char — two tiny choices the memo keeps from exploding.",
    wildcardMatching, "O(m·n)", "O(m·n)"),
  d("interleaving-string", "Interleaving String", "Medium", "interleaving-string",
    "After i chars of s1 and j of s2, the next s3 slot is FORCED at i+j — the state is just (i, j).",
    interleavingString, "O(m·n)", "O(m·n)"),
  d("distinct-subsequences", "Distinct Subsequences", "Hard", "distinct-subsequences",
    "On a match, ADD two worlds: spend this char on t[j], or save t[j] for a later copy. Counting = sum, not max.",
    distinctSubsequences, "O(m·n)", "O(m·n)"),
  d("triangle", "Triangle", "Medium", "triangle",
    "Each cell asks only its two children below; paths that re-meet reuse the memo instead of recomputing subtrees.",
    triangle, "O(n²)", "O(n²)"),
  d("maximal-square", "Maximal Square", "Medium", "maximal-square",
    "Define side(r,c) = biggest square ENDING at (r,c) — the weakest of three neighbors caps it.",
    maximalSquare, "O(m·n)", "O(m·n)"),
  d("dungeon-game", "Dungeon Game", "Hard", "dungeon-game",
    "Forward DP dies early; solve backward — how much health must the knight carry INTO each cell?",
    dungeonGame, "O(m·n)", "O(m·n)"),
  d("target-sum", "Target Sum", "Medium", "target-sum",
    "2ⁿ sign choices, but prefixes collide on the same running sum — memoize (index, sum).",
    targetSum, "O(n·S)", "O(n·S)"),
  d("ones-and-zeroes", "Ones and Zeroes", "Medium", "ones-and-zeroes",
    "0/1 knapsack with TWO budgets: take the string (pay its 0s and 1s) or skip it.",
    onesAndZeroes, "O(k·m·n)", "O(k·m·n)"),
  d("last-stone-weight-ii", "Last Stone Weight II", "Medium", "last-stone-weight-ii",
    "Every smash sequence ends at |sumA − sumB| for some two-pile split — so partition the stones, minimize the gap.",
    lastStoneWeightII, "O(n·S)", "O(n·S)"),
  d("stone-game", "Stone Game", "Medium", "stone-game",
    "Minimax in one number: gain = my stones minus yours, and the opponent is just the same function subtracted.",
    stoneGame, "O(n²)", "O(n²)"),
  d("predict-the-winner", "Predict the Winner", "Medium", "predict-the-winner",
    "Stone Game without the even-count safety net — player 1 wins iff the optimal margin is ≥ 0.",
    predictTheWinner, "O(n²)", "O(n²)"),
  d("count-square-submatrices-with-all-ones", "Count Square Submatrices with All Ones", "Medium",
    "count-square-submatrices-with-all-ones",
    "side(r,c)=3 means squares of size 1, 2 AND 3 end there — summing side over all cells counts each square once.",
    countSquareSubmatricesWithAllOnes, "O(m·n)", "O(m·n)"),
  d("knight-probability-in-chessboard", "Knight Probability in Chessboard", "Medium", "knight-probability-in-chessboard",
    "A cell's survival chance is the average of its 8 children one move later — (moves, square) memo kills 8^k.",
    knightProbabilityInChessboard, "O(k·n²)", "O(k·n²)"),
  d("minimum-falling-path-sum", "Minimum Falling Path Sum", "Medium", "minimum-falling-path-sum",
    "Fall ↙ ↓ ↘ and take the cheapest; any start column is allowed, so the driver races them over a shared memo.",
    minimumFallingPathSum, "O(n²)", "O(n²)"),
  d("unique-paths-ii", "Unique Paths II", "Medium", "unique-paths-ii",
    "Unique Paths plus one twist: an obstacle is a cell whose count is 0 — the recurrence routes around it for free.",
    uniquePathsII, "O(m·n)", "O(m·n)"),
  d("delete-operation-for-two-strings", "Delete Operation for Two Strings", "Medium", "delete-operation-for-two-strings",
    "Edit Distance with only deletes: on a mismatch someone must die — equivalently m + n − 2·LCS.",
    deleteOperationForTwoStrings, "O(m·n)", "O(m·n)"),
  d("minimum-ascii-delete-sum", "Minimum ASCII Delete Sum for Two Strings", "Medium",
    "minimum-ascii-delete-sum-for-two-strings",
    "The same delete recurrence, weighted — each deletion costs its ASCII code, so cheap letters die first.",
    minimumAsciiDeleteSum, "O(m·n)", "O(m·n)"),
  d("uncrossed-lines", "Uncrossed Lines", "Medium", "uncrossed-lines",
    "'No crossings' forces matches into the same order in both arrays — it's LCS wearing a costume.",
    uncrossedLines, "O(m·n)", "O(m·n)"),
  d("shortest-common-supersequence", "Shortest Common Supersequence", "Hard", "shortest-common-supersequence",
    "The mirror of LCS: shared chars are written once, so the length is m + n − LCS; the table rebuilds the string.",
    shortestCommonSupersequence, "O(m·n)", "O(m·n)"),
  d("longest-palindromic-substring", "Longest Palindromic Substring", "Medium", "longest-palindromic-substring",
    "A window is a palindrome iff its ends match AND its inside already was — pal(i,j) is the whole table.",
    longestPalindromicSubstring, "O(n²)", "O(n²)"),
  d("palindromic-substrings", "Palindromic Substrings", "Medium", "palindromic-substrings",
    "Build the same pal(i,j) table — then just count the 1s instead of keeping the widest.",
    palindromicSubstrings, "O(n²)", "O(n²)"),
  d("maximum-length-of-repeated-subarray", "Maximum Length of Repeated Subarray", "Medium",
    "maximum-length-of-repeated-subarray",
    "LCS's evil twin: contiguity means a mismatch resets to 0 (no skipping), and the answer is the max cell.",
    maximumLengthOfRepeatedSubarray, "O(m·n)", "O(m·n)"),
  d("burst-balloons", "Burst Balloons", "Hard", "burst-balloons",
    "Don't pick the first burst — pick the LAST survivor of each interval, so its neighbors are the fixed borders.",
    burstBalloons, "O(n³)", "O(n²)"),
  d("minimum-insertion-steps-to-make-a-string-palindrome", "Minimum Insertions to Make a String Palindrome", "Hard",
    "minimum-insertion-steps-to-make-a-string-palindrome",
    "Chars in the longest palindromic subsequence stay; every other char needs one inserted twin: n − LPS.",
    minimumInsertionStepsToMakeAStringPalindrome, "O(n²)", "O(n²)"),
]
