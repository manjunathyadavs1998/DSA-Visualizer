import type { SolutionDef } from "@/engine/types"

export const nthTribonacciNumber: SolutionDef = {
  code: `// T(0)=0, T(1)=T(2)=1, then sum of the previous THREE
function trib(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = trib(n - 1) + trib(n - 2) + trib(n - 3);
  return memo[n];
}`,
  codeJava: `// Integer[] memo
int trib(int n) {
  if (n == 0) return 0;
  if (n <= 2) return 1;
  if (memo[n] != null) return memo[n];
  memo[n] = trib(n - 1) + trib(n - 2) + trib(n - 3);
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 10, min: 0, max: 15 }],
  entry: (a) => `trib(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(0, Math.min(15, Math.trunc(args.n as number) || 0))
    const trib = fn(
      "trib",
      (n: number): number => {
        line(2, `trib(${n}): n = 0? (${n === 0 ? "<b>yes — T(0) = 0</b>" : "no"})`)
        if (n === 0) return 0
        line(3, `trib(${n}): n ≤ 2? (${n <= 2 ? `<b>yes — T(${n}) = 1</b>` : "no"})`)
        if (n <= 2) return 1
        line(4, `trib(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        line(5, `trib(${n}): need the previous THREE: trib(${n - 1}) + trib(${n - 2}) + trib(${n - 3}).`)
        const v = trib(n - 1) + trib(n - 2) + trib(n - 3)
        vars({ n, v })
        line(5, `trib(${n}) = <b>${v}</b> → memo[${n}]. Watch the second and third calls hit the memo instantly.`)
        memo[n] = v
        return v
      },
      1,
    )
    narrate("Like Fibonacci but with THREE parents per value — without the memo the tree would triple at every level.")
    return trib(N)
  },
}
