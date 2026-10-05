import type { SolutionDef } from "@/engine/types"

export const integerBreak: SolutionDef = {
  code: `// split n into ≥ 2 positive ints, maximize the product
function maxProduct(n) {
  if (n <= 2) return 1;
  if (memo[n] !== undefined) return memo[n];
  let best = 0;
  for (let j = 1; j < n; j++) {
    const keep = j * (n - j);
    const split = j * maxProduct(n - j);
    best = Math.max(best, keep, split);
  }
  memo[n] = best;
  return best;
}`,
  codeJava: `// Integer[] memo
int maxProduct(int n) {
  if (n <= 2) return 1;
  if (memo[n] != null) return memo[n];
  int best = 0;
  for (int j = 1; j < n; j++) {
    int keep = j * (n - j);
    int split = j * maxProduct(n - j);
    best = Math.max(Math.max(best, keep), split);
  }
  memo[n] = best;
  return best;
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 8, min: 2, max: 12 }],
  entry: (a) => `maxProduct(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(2, Math.min(12, Math.trunc(args.n as number) || 2))
    const maxProduct = fn(
      "maxProduct",
      (n: number): number => {
        line(2, `maxProduct(${n}): base? (${n <= 2 ? `<b>yes — ${n} only splits as 1 + ${n - 1} → product 1</b>` : "no"})`)
        if (n <= 2) return 1
        line(3, `maxProduct(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        let best = 0
        for (let j = 1; j < n; j++) {
          const keep = j * (n - j)
          line(7, `maxProduct(${n}): first piece ${j} → stop at ${j}·${n - j} = <b>${keep}</b>, or keep splitting: ${j} · maxProduct(${n - j}).`)
          const split = j * maxProduct(n - j)
          best = Math.max(best, keep, split)
          vars({ n, j, keep, split, best })
        }
        line(10, `maxProduct(${n}): best split product = <b>${best}</b> → memo[${n}].`)
        memo[n] = best
        return best
      },
      1,
    )
    narrate("Pick the first piece j, then either sell the remainder whole (j·(n−j)) or break it further (j·f(n−j)).")
    return maxProduct(N)
  },
}
