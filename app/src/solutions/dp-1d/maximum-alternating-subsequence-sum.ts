import type { SolutionDef } from "@/engine/types"

export const maximumAlternatingSubsequenceSum: SolutionDef = {
  code: `// signs alternate +,−,+,…; memo key = 2*i + (plus ? 0 : 1)
function best(i, plus) {
  if (i === n) return 0;
  const key = 2 * i + (plus ? 0 : 1);
  if (memo[key] !== undefined) return memo[key];
  const signed = plus ? nums[i] : -nums[i];
  const take = signed + best(i + 1, !plus);
  const skip = best(i + 1, plus);
  memo[key] = Math.max(take, skip);
  return memo[key];
}`,
  codeJava: `// int[] nums; Integer[] memo = new Integer[2 * n]
int best(int i, boolean plus) {
  if (i == n) return 0;
  int key = 2 * i + (plus ? 0 : 1);
  if (memo[key] != null) return memo[key];
  int signed = plus ? nums[i] : -nums[i];
  int take = signed + best(i + 1, !plus);
  int skip = best(i + 1, plus);
  memo[key] = Math.max(take, skip);
  return memo[key];
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 2, 5, 3], maxLen: 8 }],
  entry: () => `best(0, +)`,
  run({ fn, memo, line, vars, narrate }, args) {
    let nums = (args.nums as number[]).map((x) => Math.max(0, Math.trunc(x)))
    if (!nums.length) nums = [4, 2, 5, 3]
    const n = nums.length
    const best = fn(
      "best",
      (i: number, plus: boolean): number => {
        line(2, `best(${i}, ${plus ? "+" : "−"}): array exhausted? (${i === n ? "<b>yes — sum 0</b>" : "no"})`)
        if (i === n) return 0
        const key = 2 * i + (plus ? 0 : 1)
        line(3, `key = 2·${i} + ${plus ? 0 : 1} = <b>${key}</b> (even = next pick is +, odd = next pick is −).`)
        line(4, `best(${i}, ${plus ? "+" : "−"}): checking memo[${key}]…`)
        if (memo[key] !== undefined) return memo[key] as number
        const signed = plus ? nums[i] : -nums[i]
        line(6, `TAKE nums[${i}] = ${nums[i]} with sign ${plus ? "+" : "−"} → ${signed} + best(${i + 1}, ${plus ? "−" : "+"}) (sign flips).`)
        const take = signed + best(i + 1, !plus)
        line(7, `or SKIP nums[${i}] → best(${i + 1}, ${plus ? "+" : "−"}) (sign unchanged).`)
        const skip = best(i + 1, plus)
        vars({ i, take, skip })
        line(8, `best(${i}, ${plus ? "+" : "−"}) = max(take ${take}, skip ${skip}) = <b>${Math.max(take, skip)}</b> → memo[${key}].`)
        memo[key] = Math.max(take, skip)
        return Math.max(take, skip)
      },
      1,
    )
    narrate("Pick a subsequence; its 1st, 3rd, 5th… picks are added, the rest subtracted. State = (index, which sign is next).")
    return best(0, true)
  },
}
