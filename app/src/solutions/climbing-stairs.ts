import type { SolutionDef } from "@/engine/types"

export const climbingStairs: SolutionDef = {
  code: `function climb(n) {
  if (n <= 2) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = climb(n - 1) + climb(n - 2);
  return memo[n];
}`,
  codeJava: `int climb(int n) {   // Integer[] memo
  if (n <= 2) return n;
  if (memo[n] != null) return memo[n];
  memo[n] = climb(n - 1) + climb(n - 2);
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 8, min: 1, max: 20 }],
  entry: (a) => `climb(${a.n})`,
  run({ fn, memo, line }, args) {
    const climb = fn(
      "climb",
      (n: number): number => {
        line(1, `climb(${n}): base case? (${n <= 2 ? "<b>yes</b> — " + n + " ways" : "no"})`)
        if (n <= 2) return n
        line(2, `climb(${n}): checking the memo for a stored answer…`)
        if (memo[n] !== undefined) return memo[n] as number
        line(3, `climb(${n}) = climb(${n - 1}) + climb(${n - 2}) — recursing.`)
        memo[n] = climb(n - 1) + climb(n - 2)
        line(4, `climb(${n}): returning the freshly stored ${memo[n]}.`)
        return memo[n] as number
      },
      0,
    )
    return climb(args.n as number)
  },
}
