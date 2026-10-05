import type { SolutionDef } from "@/engine/types"

export const minCostClimbingStairs: SolutionDef = {
  code: `// cost per step is editable below
function minCost(i) {
  if (i <= 1) return 0;
  if (memo[i] !== undefined) return memo[i];
  memo[i] = Math.min(
    minCost(i - 1) + cost[i - 1],
    minCost(i - 2) + cost[i - 2]
  );
  return memo[i];
}`,
  codeJava: `// int[] cost is editable below; Integer[] memo
int minCost(int i) {
  if (i <= 1) return 0;
  if (memo[i] != null) return memo[i];
  memo[i] = Math.min(
    minCost(i - 1) + cost[i - 1],
    minCost(i - 2) + cost[i - 2]
  );
  return memo[i];
}`,
  inputs: [{ kind: "numbers", name: "cost", label: "cost", default: [10, 15, 20, 1, 5, 30], maxLen: 12 }],
  entry: (a) => `minCost(${(a.cost as number[]).length})`,
  run({ fn, memo, line, narrate }, args) {
    const cost = args.cost as number[]
    const minCost = fn(
      "minCost",
      (i: number): number => {
        line(2, `minCost(${i}): the ground and step 1 are free starts${i <= 1 ? " — <b>base case</b>" : "… not here"}.`)
        if (i <= 1) return 0
        line(3, `minCost(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(4, `minCost(${i}): cheaper via step ${i - 1} (pay ${cost[i - 1]}) or step ${i - 2} (pay ${cost[i - 2]})?`)
        memo[i] = Math.min(minCost(i - 1) + cost[i - 1], minCost(i - 2) + cost[i - 2])
        line(8, `minCost(${i}): best price to stand here is ${memo[i]}.`)
        return memo[i] as number
      },
      1,
    )
    narrate(`minCost(i) = cheapest way to reach step i. Answer: minCost(${cost.length}), one past the last step.`)
    return minCost(cost.length)
  },
}
