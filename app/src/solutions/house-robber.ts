import type { SolutionDef } from "@/engine/types"

export const houseRobber: SolutionDef = {
  code: `// nums = each house's loot (editable below)
function rob(i) {
  if (i >= nums.length) return 0;
  if (memo[i] !== undefined) return memo[i];
  // rob house i and skip one, or skip house i
  memo[i] = Math.max(nums[i] + rob(i + 2), rob(i + 1));
  return memo[i];
}`,
  codeJava: `// int[] nums = each house's loot; Integer[] memo
int rob(int i) {
  if (i >= nums.length) return 0;
  if (memo[i] != null) return memo[i];
  // rob house i and skip one, or skip house i
  memo[i] = Math.max(nums[i] + rob(i + 2), rob(i + 1));
  return memo[i];
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [2, 7, 9, 3, 1], maxLen: 10 }],
  entry: () => `rob(0)`,
  run({ fn, memo, line, narrate }, args) {
    const nums = args.nums as number[]
    const rob = fn(
      "rob",
      (i: number): number => {
        line(2, `rob(${i}): past the last house? (${i >= nums.length ? "<b>yes — nothing left, 0</b>" : "no"})`)
        if (i >= nums.length) return 0
        line(3, `rob(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(5, `rob(${i}): TAKE house ${i} (loot ${nums[i]}, skip to ${i + 2}) or SKIP to house ${i + 1}?`)
        memo[i] = Math.max(nums[i] + rob(i + 2), rob(i + 1))
        line(6, `rob(${i}): best from here onward = ${memo[i]}.`)
        return memo[i] as number
      },
      1,
    )
    narrate("rob(i) = best loot from house i onward. Each house: take it (skip next) or leave it.")
    return rob(0)
  },
}
