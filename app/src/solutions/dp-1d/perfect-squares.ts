import type { SolutionDef } from "@/engine/types"

export const perfectSquares: SolutionDef = {
  code: `// fewest perfect squares summing to n
function numSquares(n) {
  if (n === 0) return 0;
  if (memo[n] !== undefined) return memo[n];
  let best = Infinity;
  for (let s = 1; s * s <= n; s++) {
    best = Math.min(best, 1 + numSquares(n - s * s));
  }
  memo[n] = best;
  return best;
}`,
  codeJava: `// Integer[] memo; int INF = 1_000_000
int numSquares(int n) {
  if (n == 0) return 0;
  if (memo[n] != null) return memo[n];
  int best = INF;
  for (int s = 1; s * s <= n; s++) {
    best = Math.min(best, 1 + numSquares(n - s * s));
  }
  memo[n] = best;
  return best;
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 12, min: 0, max: 12 }],
  entry: (a) => `numSquares(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(0, Math.min(12, Math.trunc(args.n as number) || 0))
    const numSquares = fn(
      "numSquares",
      (n: number): number => {
        line(2, `numSquares(${n}): remainder zero? (${n === 0 ? "<b>yes — 0 squares needed</b>" : "no"})`)
        if (n === 0) return 0
        line(3, `numSquares(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        let best = Infinity
        for (let s = 1; s * s <= n; s++) {
          line(6, `numSquares(${n}): subtract ${s}² = <b>${s * s}</b> → need numSquares(${n - s * s}).`)
          best = Math.min(best, 1 + numSquares(n - s * s))
          vars({ n, s, best })
        }
        line(8, `numSquares(${n}): best over all squares ≤ ${n} is <b>${best}</b> → memo[${n}].`)
        memo[n] = best
        return best
      },
      1,
    )
    narrate("Greedy fails here (12 = 4+4+4, not 9+1+1+1) — try EVERY square and let the memo keep each remainder's answer.")
    return numSquares(N)
  },
}
