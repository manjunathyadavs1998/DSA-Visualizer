import type { SolutionDef } from "@/engine/types"

export const combinationSumIV: SolutionDef = {
  code: `// ORDERED sequences from nums summing to target
function count(rem) {
  if (rem === 0) return 1;
  if (memo[rem] !== undefined) return memo[rem];
  let total = 0;
  for (const x of nums) {
    if (x <= rem) total += count(rem - x);
  }
  memo[rem] = total;
  return total;
}`,
  codeJava: `// int[] nums; Integer[] memo
int count(int rem) {
  if (rem == 0) return 1;
  if (memo[rem] != null) return memo[rem];
  int total = 0;
  for (int x : nums) {
    if (x <= rem) total += count(rem - x);
  }
  memo[rem] = total;
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3], maxLen: 5 },
    { kind: "number", name: "target", label: "target", default: 5, min: 0, max: 12 },
  ],
  entry: (a) => `count(${a.target})`,
  run({ fn, memo, line, vars, narrate }, args) {
    // zero/negative values never shrink rem → infinite recursion
    const nums = [...new Set((args.nums as number[]).map(Math.trunc).filter((x) => x > 0))]
    if (!nums.length) nums.push(1, 2, 3)
    const target = Math.max(0, Math.min(12, Math.trunc(args.target as number) || 0))
    const count = fn(
      "count",
      (rem: number): number => {
        line(2, `count(${rem}): hit the target exactly? (${rem === 0 ? "<b>yes — one valid sequence</b>" : "no"})`)
        if (rem === 0) return 1
        line(3, `count(${rem}): checking the memo…`)
        if (memo[rem] !== undefined) return memo[rem] as number
        let total = 0
        for (const x of nums) {
          line(6, x <= rem ? `count(${rem}): FIRST element ${x} → add count(${rem - x}) sequences for the rest.` : `count(${rem}): ${x} > ${rem}, it cannot start a sequence here.`)
          if (x <= rem) {
            total += count(rem - x)
            vars({ rem, x, total })
          }
        }
        line(8, `count(${rem}) = <b>${total}</b> ordered sequences → memo[${rem}].`)
        memo[rem] = total
        return total
      },
      1,
    )
    narrate("Despite the name this counts PERMUTATIONS: branching on the first element means (1,2) and (2,1) are different paths.")
    return count(target)
  },
}
