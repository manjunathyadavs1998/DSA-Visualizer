import type { Problem } from "@/engine/types"
import { decodeWays } from "./decode-ways"
import { perfectSquares } from "./perfect-squares"
import { integerBreak } from "./integer-break"
import { deleteAndEarn } from "./delete-and-earn"
import { houseRobberII } from "./house-robber-ii"
import { minimumCostForTickets } from "./minimum-cost-for-tickets"
import { nthTribonacciNumber } from "./nth-tribonacci-number"
import { bestTimeToBuyAndSellStockWithCooldown } from "./best-time-to-buy-and-sell-stock-with-cooldown"
import { coinChangeII } from "./coin-change-ii"
import { arithmeticSlices } from "./arithmetic-slices"
import { dominoAndTrominoTiling } from "./domino-and-tromino-tiling"
import { countWaysToReachNthStairDistinct } from "./count-ways-to-reach-nth-stair-distinct"
import { frogJump } from "./frog-jump"
import { maximumAlternatingSubsequenceSum } from "./maximum-alternating-subsequence-sum"
import { numberOfWaysToPaintFence } from "./number-of-ways-to-paint-fence"
import { knightDialer } from "./knight-dialer"
import { countWaysToBuildGoodStrings } from "./count-ways-to-build-good-strings"
import { combinationSumIV } from "./combination-sum-iv"
import { countNumbersWithUniqueDigits } from "./count-numbers-with-unique-digits"
import { solvingQuestionsWithBrainpower } from "./solving-questions-with-brainpower"
import { partitionArrayForMaximumSum } from "./partition-array-for-maximum-sum"
import { fillingBookcaseShelves } from "./filling-bookcase-shelves"
import { divisorGame } from "./divisor-game"
import { bestTimeToBuyAndSellStockWithTransactionFee } from "./best-time-to-buy-and-sell-stock-with-transaction-fee"
import { stoneGameIII } from "./stone-game-iii"
import { checkIfThereIsAValidPartition } from "./check-if-there-is-a-valid-partition"
import { longestArithmeticSubsequenceOfGivenDifference } from "./longest-arithmetic-subsequence-of-given-difference"
import { minimumNumberOfCoinsForFruits } from "./minimum-number-of-coins-for-fruits"

const CAT = "1-D DP"
const dp = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug, title, neetcodeCategory: CAT, pattern: "dp", difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary, solution, time, space,
})

export const DP_1D_PROBLEMS: Problem[] = [
  dp("decode-ways", "Decode Ways", "Medium", "decode-ways",
    "Each position: one digit, or a two-digit pair ≤ 26 — ways per suffix, memoized.", decodeWays, "O(n)", "O(n)"),
  dp("perfect-squares", "Perfect Squares", "Medium", "perfect-squares",
    "Greedy fails (12 = 4+4+4) — subtract EVERY square and memoize each remainder.", perfectSquares, "O(n·√n)", "O(n)"),
  dp("integer-break", "Integer Break", "Medium", "integer-break",
    "Pick the first piece, then sell the rest whole or break it further — max of both.", integerBreak, "O(n²)", "O(n)"),
  dp("delete-and-earn", "Delete and Earn", "Medium", "delete-and-earn",
    "Bucket points by value — taking v kills v−1, and it becomes House Robber on the value line.", deleteAndEarn, "O(n + m)", "O(m)"),
  dp("house-robber-ii", "House Robber II", "Medium", "house-robber-ii",
    "First and last house are neighbors on the circle — rob the straight line twice.", houseRobberII, "O(n)", "O(n)"),
  dp("minimum-cost-for-tickets", "Minimum Cost For Tickets", "Medium", "minimum-cost-for-tickets",
    "At each travel day buy a 1/7/30-day pass; longer passes LEAP over covered days.", minimumCostForTickets, "O(n)", "O(n)"),
  dp("nth-tribonacci-number", "N-th Tribonacci Number", "Easy", "n-th-tribonacci-number",
    "Fibonacci with THREE parents per value — the memo collapses a tripling tree to a line.", nthTribonacciNumber, "O(n)", "O(n)"),
  dp("best-time-to-buy-and-sell-stock-with-cooldown", "Best Time to Buy and Sell Stock with Cooldown",
    "Medium", "best-time-to-buy-and-sell-stock-with-cooldown",
    "Two states per day (holding / free); selling jumps i+2 because i+1 is the forced cooldown.",
    bestTimeToBuyAndSellStockWithCooldown, "O(n)", "O(n)"),
  dp("coin-change-ii", "Coin Change II", "Medium", "coin-change-ii",
    "Take-or-skip per coin TYPE — fixing the coin order is what makes {1,2,2} count once.", coinChangeII, "O(n·amount)", "O(n·amount)"),
  dp("arithmetic-slices", "Arithmetic Slices", "Medium", "arithmetic-slices",
    "Count slices ENDING at each index: equal gaps extend every slice from i−1, plus one new triple.", arithmeticSlices, "O(n)", "O(n)"),
  dp("domino-and-tromino-tiling", "Domino and Tromino Tiling", "Medium", "domino-and-tromino-tiling",
    "The famous shortcut f(n) = 2·f(n−1) + f(n−3), earned by tracking jagged-edge boards.", dominoAndTrominoTiling, "O(n)", "O(n)"),
  dp("count-ways-to-reach-nth-stair-distinct", "Count Ways to Reach Nth Stair (1, 2 or 3 Steps)", "Easy",
    "https://www.google.com/search?q=count+ways+to+reach+nth+stair+using+1+2+or+3+steps",
    "Climbing Stairs with a third step size — classify every route by its final hop.", countWaysToReachNthStairDistinct, "O(n)", "O(n)"),
  dp("frog-jump", "Frog Jump (Min Energy)", "Easy",
    "https://www.google.com/search?q=frog+jump+dp+striver+minimum+energy",
    "Hop 1 or leap 2 stones, pay |height diff| — greedy fails, the memo prices every stone once.", frogJump, "O(n)", "O(n)"),
  dp("maximum-alternating-subsequence-sum", "Maximum Alternating Subsequence Sum", "Medium",
    "maximum-alternating-subsequence-sum",
    "Take-or-skip where taking FLIPS the sign of the next pick — state = (index, sign).",
    maximumAlternatingSubsequenceSum, "O(n)", "O(n)"),
  dp("number-of-ways-to-paint-fence", "Number of Ways to Paint Fence", "Medium", "paint-fence",
    "End in a different color or a matched pair — f(i) = (k−1)·(f(i−1) + f(i−2)).", numberOfWaysToPaintFence, "O(n)", "O(n)"),
  dp("knight-dialer", "Knight Dialer", "Medium", "knight-dialer",
    "A chess knight on the keypad: ways per (digit, hops-left) — and key 5 is a dead end.", knightDialer, "O(n)", "O(n)"),
  dp("count-ways-to-build-good-strings", "Count Ways to Build Good Strings", "Medium",
    "count-ways-to-build-good-strings",
    "Climbing Stairs in disguise: peel the last zero-block or one-block off the length.", countWaysToBuildGoodStrings, "O(high)", "O(high)"),
  dp("combination-sum-iv", "Combination Sum IV", "Medium", "combination-sum-iv",
    "Branch on the FIRST element, so (1,2) ≠ (2,1) — it secretly counts permutations.", combinationSumIV, "O(target·n)", "O(target)"),
  dp("count-numbers-with-unique-digits", "Count Numbers with Unique Digits", "Medium",
    "count-numbers-with-unique-digits",
    "Exact-length counts multiply by the unused digits: g(k) = g(k−1)·(11−k), then prefix-sum.", countNumbersWithUniqueDigits, "O(n)", "O(n)"),
  dp("solving-questions-with-brainpower", "Solving Questions With Brainpower", "Medium",
    "solving-questions-with-brainpower",
    "House Robber with a variable gap: solving question i freezes the next brainpower[i].",
    solvingQuestionsWithBrainpower, "O(n)", "O(n)"),
  dp("partition-array-for-maximum-sum", "Partition Array for Maximum Sum", "Medium",
    "partition-array-for-maximum-sum",
    "Only the first block needs a decision — its length ≤ k; every cell lifts to the block max.",
    partitionArrayForMaximumSum, "O(n·k)", "O(n)"),
  dp("filling-bookcase-shelves", "Filling Bookcase Shelves", "Medium", "filling-bookcase-shelves",
    "Books stay in order; choose where each shelf ends — a shelf costs its tallest book.", fillingBookcaseShelves, "O(n²)", "O(n)"),
  dp("divisor-game", "Divisor Game", "Easy", "divisor-game",
    "A position wins iff SOME move sends the opponent to a losing one — game-theory DP 101.", divisorGame, "O(n²)", "O(n)"),
  dp("best-time-to-buy-and-sell-stock-with-transaction-fee", "Best Time to Buy and Sell Stock with Transaction Fee",
    "Medium", "best-time-to-buy-and-sell-stock-with-transaction-fee",
    "Holding/free states again — charging the fee on the sell kills unprofitable tiny bounces.",
    bestTimeToBuyAndSellStockWithTransactionFee, "O(n)", "O(n)"),
  dp("stone-game-iii", "Stone Game III", "Hard", "stone-game-iii",
    "One function for both players: diff(i) = my margin; subtracting the opponent's flips turns.", stoneGameIII, "O(n)", "O(n)"),
  dp("check-if-there-is-a-valid-partition", "Check if There is a Valid Partition", "Medium",
    "check-if-there-is-a-valid-partition",
    "Cut a legal pair/triple off the front and recurse — one boolean memo slot per suffix.",
    checkIfThereIsAValidPartition, "O(n)", "O(n)"),
  dp("longest-arithmetic-subsequence-of-given-difference", "Longest Arithmetic Subsequence of Given Difference",
    "Medium", "longest-arithmetic-subsequence-of-given-difference",
    "chain(i) extends the NEAREST predecessor equal to arr[i] − diff — nearest is never worse.",
    longestArithmeticSubsequenceOfGivenDifference, "O(n²)", "O(n)"),
  dp("minimum-number-of-coins-for-fruits", "Minimum Number of Coins for Fruits", "Medium",
    "minimum-number-of-coins-for-fruits",
    "Buying fruit i opens a free window to 2i — yet buying a free fruit early can still win.", minimumNumberOfCoinsForFruits, "O(n²)", "O(n)"),
]
