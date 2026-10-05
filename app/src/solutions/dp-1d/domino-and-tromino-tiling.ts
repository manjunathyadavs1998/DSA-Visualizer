import type { SolutionDef } from "@/engine/types"

export const dominoAndTrominoTiling: SolutionDef = {
  code: `// tile a 2×n board with 2×1 dominoes and L-trominoes
function tilings(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 5;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = 2 * tilings(n - 1) + tilings(n - 3);
  return memo[n];
}`,
  codeJava: `// Integer[] memo
int tilings(int n) {
  if (n == 1) return 1;
  if (n == 2) return 2;
  if (n == 3) return 5;
  if (memo[n] != null) return memo[n];
  memo[n] = 2 * tilings(n - 1) + tilings(n - 3);
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "board width n", default: 6, min: 1, max: 12 }],
  entry: (a) => `tilings(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(1, Math.min(12, Math.trunc(args.n as number) || 1))
    const tilings = fn(
      "tilings",
      (n: number): number => {
        line(2, `tilings(${n}): 2×1 board? (${n === 1 ? "<b>yes — one vertical domino, 1 way</b>" : "no"})`)
        if (n === 1) return 1
        line(3, `tilings(${n}): 2×2 board? (${n === 2 ? "<b>yes — two vertical or two horizontal, 2 ways</b>" : "no"})`)
        if (n === 2) return 2
        line(4, `tilings(${n}): 2×3 board? (${n === 3 ? "<b>yes — 3 all-domino + 2 tromino pairs = 5 ways</b>" : "no"})`)
        if (n === 3) return 5
        line(5, `tilings(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        line(6, `tilings(${n}) = 2·tilings(${n - 1}) + tilings(${n - 3}): double the (n−1) tilings (flat or jagged last column) plus a fresh tromino pair over the last 3 columns.`)
        const v = 2 * tilings(n - 1) + tilings(n - 3)
        vars({ n, v })
        line(6, `tilings(${n}) = <b>${v}</b> → memo[${n}].`)
        memo[n] = v
        return v
      },
      1,
    )
    narrate("The famous shortcut: f(n) = 2·f(n−1) + f(n−3) — derived by tracking boards with a jagged edge.")
    return tilings(N)
  },
}
