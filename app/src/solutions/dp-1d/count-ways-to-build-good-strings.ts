import type { SolutionDef } from "@/engine/types"

export const countWaysToBuildGoodStrings: SolutionDef = {
  code: `// append zero '0's or one '1's; f(len) = ways to hit EXACTLY len
function build(len) {
  if (len === 0) return 1;
  if (memo[len] !== undefined) return memo[len];
  let ways = 0;
  if (len >= zero) ways += build(len - zero);
  if (len >= one) ways += build(len - one);
  memo[len] = ways;
  return ways;
}
// answer = build(low) + build(low+1) + ... + build(high)`,
  codeJava: `// int zero, one; Integer[] memo
int build(int len) {
  if (len == 0) return 1;
  if (memo[len] != null) return memo[len];
  int ways = 0;
  if (len >= zero) ways += build(len - zero);
  if (len >= one) ways += build(len - one);
  memo[len] = ways;
  return ways;
}
// answer = build(low) + build(low+1) + ... + build(high)`,
  inputs: [
    { kind: "number", name: "low", label: "low", default: 2, min: 1, max: 8 },
    { kind: "number", name: "high", label: "high", default: 4, min: 1, max: 10 },
    { kind: "number", name: "zero", label: "zero-block length", default: 1, min: 1, max: 3 },
    { kind: "number", name: "one", label: "one-block length", default: 2, min: 1, max: 3 },
  ],
  entry: (a) => `goodStrings(${a.low}..${a.high})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const zero = Math.max(1, Math.min(3, Math.trunc(args.zero as number) || 1))
    const one = Math.max(1, Math.min(3, Math.trunc(args.one as number) || 1))
    let low = Math.max(1, Math.min(8, Math.trunc(args.low as number) || 1))
    let high = Math.max(1, Math.min(10, Math.trunc(args.high as number) || 1))
    if (low > high) [low, high] = [high, low]
    const build = fn(
      "build",
      (len: number): number => {
        line(2, `build(${len}): the empty string? (${len === 0 ? "<b>yes — exactly 1 way to build it</b>" : "no"})`)
        if (len === 0) return 1
        line(3, `build(${len}): checking the memo…`)
        if (memo[len] !== undefined) return memo[len] as number
        let ways = 0
        line(5, len >= zero ? `build(${len}): LAST block was "${"0".repeat(zero)}" (${zero} zero${zero > 1 ? "s" : ""}) → add build(${len - zero}).` : `build(${len}): too short for a ${zero}-char zero-block.`)
        if (len >= zero) ways += build(len - zero)
        line(6, len >= one ? `build(${len}): LAST block was "${"1".repeat(one)}" (${one} one${one > 1 ? "s" : ""}) → add build(${len - one}).` : `build(${len}): too short for a ${one}-char one-block.`)
        if (len >= one) ways += build(len - one)
        vars({ len, ways })
        line(7, `build(${len}) = <b>${ways}</b> good strings of exactly ${len} chars → memo[${len}].`)
        memo[len] = ways
        return ways
      },
      1,
    )
    const goodStrings = fn("goodStrings", (): number => {
      narrate("Climbing Stairs in disguise: every good string ends in a zero-block or a one-block — peel it off and recurse on the length.")
      let ans = 0
      for (let len = low; len <= high; len++) {
        const b = build(len)
        ans += b
        vars({ len, buildLen: b, ans })
        line(10, `lengths ${low}..${len}: answer += build(${len}) = ${b} → <b>${ans}</b>.`)
      }
      return ans
    })
    return goodStrings()
  },
}
