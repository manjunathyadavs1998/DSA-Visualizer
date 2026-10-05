import type { Problem } from "@/engine/types"
import { nMeetingsInOneRoom } from "./n-meetings-in-one-room"
import { minimumPlatforms } from "./minimum-platforms"
import { jobSequencingProblem } from "./job-sequencing-problem"
import { fractionalKnapsack } from "./fractional-knapsack"
import { minimumCoinsGreedy } from "./minimum-coins-greedy"
import { assignCookies } from "./assign-cookies"

const GREEDY = "Greedy"
const g = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
): Problem => ({
  slug,
  title,
  neetcodeCategory: GREEDY,
  pattern: "recursion",
  difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
})

export const GREEDY_PROBLEMS: Problem[] = [
  g(
    "n-meetings-in-one-room",
    "N Meetings in One Room",
    "Easy",
    "https://www.google.com/search?q=N+Meetings+in+One+Room+striver",
    "Sort by end time — the meeting that frees the room first can never hurt.",
    nMeetingsInOneRoom,
  ),
  g(
    "minimum-platforms",
    "Minimum Platforms",
    "Medium",
    "https://www.google.com/search?q=Minimum+Platforms+striver",
    "Sweep sorted arrivals vs departures — the answer is the peak overlap.",
    minimumPlatforms,
  ),
  g(
    "job-sequencing-problem",
    "Job Sequencing Problem",
    "Medium",
    "https://www.google.com/search?q=Job+Sequencing+Problem+striver",
    "Richest job first, parked in the latest slot before its deadline.",
    jobSequencingProblem,
  ),
  g(
    "fractional-knapsack",
    "Fractional Knapsack",
    "Medium",
    "https://www.google.com/search?q=Fractional+Knapsack+striver",
    "Densest value/weight first — cutting items is what makes greedy optimal.",
    fractionalKnapsack,
  ),
  g(
    "minimum-coins-greedy",
    "Minimum Coins (greedy)",
    "Easy",
    "https://www.google.com/search?q=Minimum+Coins+greedy+striver",
    "Biggest coin that fits, repeatedly — safe because ₹ denominations are canonical.",
    minimumCoinsGreedy,
  ),
  g(
    "assign-cookies",
    "Assign Cookies",
    "Easy",
    "assign-cookies",
    "Smallest cookie that satisfies each kid — save the big ones for the greedy.",
    assignCookies,
  ),
]
