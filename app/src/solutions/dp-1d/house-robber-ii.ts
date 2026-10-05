import type { SolutionDef } from "@/engine/types"

export const houseRobberII: SolutionDef = {
  code: `// circular street → rob a straight line twice
// round A = houses [0..n-2], round B = houses [1..n-1]
function rob(i, end, base) {
  if (i > end) return 0;
  if (memo[base + i] !== undefined) return memo[base + i];
  const take = nums[i] + rob(i + 2, end, base);
  const skip = rob(i + 1, end, base);
  memo[base + i] = Math.max(take, skip);
  return memo[base + i];
}
// answer = max(rob(0, n-2, 0), rob(1, n-1, n))`,
  codeJava: `// int[] nums; Integer[] memo = new Integer[2 * n]
// round A = houses [0..n-2], round B = houses [1..n-1]
int rob(int i, int end, int base) {
  if (i > end) return 0;
  if (memo[base + i] != null) return memo[base + i];
  int take = nums[i] + rob(i + 2, end, base);
  int skip = rob(i + 1, end, base);
  memo[base + i] = Math.max(take, skip);
  return memo[base + i];
}
// answer = max(rob(0, n-2, 0), rob(1, n-1, n))`,
  inputs: [{ kind: "numbers", name: "nums", label: "houses", default: [2, 3, 2, 5], maxLen: 10 }],
  entry: (a) => `robCircle([${(a.nums as number[]).join(", ")}])`,
  run({ fn, memo, line, vars, narrate }, args) {
    let nums = (args.nums as number[]).map((x) => Math.max(0, Math.trunc(x)))
    if (!nums.length) nums = [2, 3, 2, 5]
    const n = nums.length
    const rob = fn(
      "rob",
      (i: number, end: number, base: number): number => {
        line(3, `rob(${i}): past house ${end}, the last allowed in this round? (${i > end ? "<b>yes — 0</b>" : "no"})`)
        if (i > end) return 0
        line(4, `rob(${i}): checking memo slot ${base + i} (${base ? "round B" : "round A"})…`)
        if (memo[base + i] !== undefined) return memo[base + i] as number
        line(5, `rob(${i}): TAKE house ${i} worth <b>${nums[i]}</b>, skip the neighbor → rob(${i + 2}).`)
        const take = nums[i] + rob(i + 2, end, base)
        line(6, `rob(${i}): or SKIP house ${i} → rob(${i + 1}).`)
        const skip = rob(i + 1, end, base)
        vars({ i, take, skip })
        line(7, `rob(${i}): max(take ${take}, skip ${skip}) = <b>${Math.max(take, skip)}</b> → memo[${base + i}].`)
        memo[base + i] = Math.max(take, skip)
        return Math.max(take, skip)
      },
      2,
    )
    const robCircle = fn("robCircle", (): number => {
      if (n === 1) {
        line(10, `Only one house — rob it for <b>${nums[0]}</b>.`)
        return nums[0]
      }
      narrate(`House 0 and house ${n - 1} are neighbors on the circle — they can never BOTH be robbed. Split into two straight-line rounds.`)
      line(10, `Round A: rob houses [0..${n - 2}] (last house off-limits). Memo slots 0..${n - 2}.`)
      const a = rob(0, n - 2, 0)
      line(10, `Round A nets <b>${a}</b>. Round B: rob houses [1..${n - 1}] (first house off-limits). Memo slots ${n + 1}..${2 * n - 1}.`)
      const b = rob(1, n - 1, n)
      vars({ roundA: a, roundB: b })
      line(10, `answer = max(round A ${a}, round B ${b}) = <b>${Math.max(a, b)}</b>.`)
      return Math.max(a, b)
    })
    return robCircle()
  },
}
