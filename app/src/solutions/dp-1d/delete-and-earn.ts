import type { SolutionDef } from "@/engine/types"

export const deleteAndEarn: SolutionDef = {
  code: `// points[v] = v * count(v); taking v deletes all v-1 and v+1
function earn(v) {
  if (v <= 0) return 0;
  if (memo[v] !== undefined) return memo[v];
  const take = points[v] + earn(v - 2);
  const skip = earn(v - 1);
  memo[v] = Math.max(take, skip);
  return memo[v];
}`,
  codeJava: `// int[] points; Integer[] memo
int earn(int v) {
  if (v <= 0) return 0;
  if (memo[v] != null) return memo[v];
  int take = points[v] + earn(v - 2);
  int skip = earn(v - 1);
  memo[v] = Math.max(take, skip);
  return memo[v];
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [2, 2, 3, 3, 3, 4], maxLen: 10 }],
  entry: (a) => {
    const nums = (a.nums as number[]).map(Math.trunc).filter((x) => x >= 1 && x <= 9)
    return `earn(${nums.length ? Math.max(...nums) : 4})`
  },
  run({ fn, memo, line, vars, heap, narrate }, args) {
    // values > 9 or < 1 would stretch the value axis — clamp to the teaching range
    let nums = (args.nums as number[]).map(Math.trunc).filter((x) => x >= 1 && x <= 9)
    if (!nums.length) nums = [2, 2, 3, 3, 3, 4]
    const maxV = Math.max(...nums)
    const points: number[] = Array(maxV + 1).fill(0)
    for (const x of nums) points[x] += x
    heap("points", points)
    narrate(`Bucket by value: points[v] = v·count(v) = [${points.join(", ")}]. Taking v kills v−1 → this is House Robber on the value line.`)
    const earn = fn(
      "earn",
      (v: number): number => {
        line(2, `earn(${v}): below value 1? (${v <= 0 ? "<b>yes — nothing left to earn</b>" : "no"})`)
        if (v <= 0) return 0
        line(3, `earn(${v}): checking the memo…`)
        if (memo[v] !== undefined) return memo[v] as number
        line(4, `earn(${v}): TAKE all ${v}s for <b>${points[v]}</b> pts — that deletes every ${v - 1} → jump to earn(${v - 2}).`)
        const take = points[v] + earn(v - 2)
        line(5, `earn(${v}): or SKIP value ${v} → earn(${v - 1}).`)
        const skip = earn(v - 1)
        vars({ v, take, skip })
        line(6, `earn(${v}): max(take ${take}, skip ${skip}) = <b>${Math.max(take, skip)}</b> → memo[${v}].`)
        memo[v] = Math.max(take, skip)
        return Math.max(take, skip)
      },
      1,
    )
    return earn(maxV)
  },
}
