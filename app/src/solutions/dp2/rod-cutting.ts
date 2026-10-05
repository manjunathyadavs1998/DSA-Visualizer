import type { SolutionDef } from "@/engine/types"

export const rodCutting: SolutionDef = {
  code: `// price[len-1] = price of a piece of length len (editable)
function cut(n) {
  if (n === 0) return 0;  // nothing left to sell
  if (memo[n] !== undefined) return memo[n];
  let best = 0;
  for (let len = 1; len <= n && len <= price.length; len++)
    best = Math.max(best,
      price[len - 1] + cut(n - len)); // first piece = len
  memo[n] = best;
  return best;
}`,
  codeJava: `// price[len-1] = price of piece of length len; Integer[] memo
int cut(int n) {
  if (n == 0) return 0;   // nothing left to sell
  if (memo[n] != null) return memo[n];
  int best = 0;
  for (int len = 1; len <= n && len <= price.length; len++)
    best = Math.max(best,
      price[len - 1] + cut(n - len)); // first piece = len
  memo[n] = best;
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "price", label: "price[1..]", default: [1, 5, 8, 9, 10, 17], maxLen: 6 },
    { kind: "number", name: "n", label: "rod length", default: 6, min: 1, max: 6 },
  ],
  entry: (a) => `cut(${a.n})`,
  run({ fn, memo, line, narrate }, args) {
    const price = args.price as number[]
    const cut = fn(
      "cut",
      (n: number): number => {
        line(2, `cut(${n}): rod used up? (${n === 0 ? "<b>yes — nothing left to sell, 0</b>" : "no, " + n + " left"})`)
        if (n === 0) return 0
        line(3, `cut(${n}): checking memo[${n}]…`)
        if (memo[n] !== undefined) return memo[n] as number
        let best = 0
        for (let len = 1; len <= n && len <= price.length; len++) {
          line(7, `First piece of length ${len} sells for ${price[len - 1]}; the remaining ${n - len} is a fresh subproblem: cut(${n - len}).`)
          best = Math.max(best, price[len - 1] + cut(n - len))
        }
        line(8, `cut(${n}) = <b>${best}</b> — best revenue for a rod of length ${n}.`)
        memo[n] = best
        return best
      },
      1,
    )
    narrate("Choose the FIRST piece's length, sell it, and recurse on the rest — the memo holds one answer per rod length.")
    return cut(args.n as number)
  },
}
