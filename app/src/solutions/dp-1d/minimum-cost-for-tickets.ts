import type { SolutionDef } from "@/engine/types"

export const minimumCostForTickets: SolutionDef = {
  code: `// days sorted; costs = [1-day, 7-day, 30-day] passes
function minCost(i) {
  if (i >= days.length) return 0;
  if (memo[i] !== undefined) return memo[i];
  const d = days[i];
  const c1 = costs[0] + minCost(next(i, d + 1));
  const c7 = costs[1] + minCost(next(i, d + 7));
  const c30 = costs[2] + minCost(next(i, d + 30));
  memo[i] = Math.min(c1, c7, c30);
  return memo[i];
}
// next(i, d) = first index j ≥ i with days[j] >= d`,
  codeJava: `// int[] days, costs; Integer[] memo
int minCost(int i) {
  if (i >= days.length) return 0;
  if (memo[i] != null) return memo[i];
  int d = days[i];
  int c1 = costs[0] + minCost(next(i, d + 1));
  int c7 = costs[1] + minCost(next(i, d + 7));
  int c30 = costs[2] + minCost(next(i, d + 30));
  memo[i] = Math.min(c1, Math.min(c7, c30));
  return memo[i];
}
// next(i, d) = first index j >= i with days[j] >= d`,
  inputs: [
    { kind: "numbers", name: "days", label: "travel days", default: [1, 4, 6, 7, 8, 20], maxLen: 12 },
    { kind: "numbers", name: "costs", label: "costs [1d, 7d, 30d]", default: [2, 7, 15], maxLen: 3 },
  ],
  entry: () => `minCost(0)`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    let days = [...new Set((args.days as number[]).map(Math.trunc).filter((d) => d >= 1 && d <= 365))].sort((a, b) => a - b)
    if (!days.length) days = [1, 4, 6, 7, 8, 20]
    const rawCosts = (args.costs as number[]).map((c) => Math.max(1, Math.trunc(c)))
    const costs = [rawCosts[0] ?? 2, rawCosts[1] ?? 7, rawCosts[2] ?? 15]
    const next = (i: number, d: number) => {
      let j = i
      while (j < days.length && days[j] < d) j++
      return j
    }
    heap("days", days)
    heap("costs", costs)
    narrate("At each travel day, buy one of three passes; a longer pass lets you LEAP over every covered day.")
    const minCost = fn(
      "minCost",
      (i: number): number => {
        line(2, `minCost(${i}): all travel days covered? (${i >= days.length ? "<b>yes — cost 0</b>" : `no, day ${days[i]} still needs a pass`})`)
        if (i >= days.length) return 0
        line(3, `minCost(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        const d = days[i]
        line(5, `minCost(${i}): 1-day pass ($${costs[0]}) covers day ${d} → next uncovered index ${next(i, d + 1)}.`)
        const c1 = costs[0] + minCost(next(i, d + 1))
        line(6, `minCost(${i}): 7-day pass ($${costs[1]}) covers days ${d}–${d + 6} → next index ${next(i, d + 7)}.`)
        const c7 = costs[1] + minCost(next(i, d + 7))
        line(7, `minCost(${i}): 30-day pass ($${costs[2]}) covers days ${d}–${d + 29} → next index ${next(i, d + 30)}.`)
        const c30 = costs[2] + minCost(next(i, d + 30))
        vars({ i, day: d, c1, c7, c30 })
        line(8, `minCost(${i}): min($${c1}, $${c7}, $${c30}) = <b>$${Math.min(c1, c7, c30)}</b> → memo[${i}].`)
        memo[i] = Math.min(c1, c7, c30)
        return Math.min(c1, c7, c30)
      },
      1,
    )
    return minCost(0)
  },
}
