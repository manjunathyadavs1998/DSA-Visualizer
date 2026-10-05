import type { SolutionDef } from "@/engine/types"

export const coinChange: SolutionDef = {
  code: `// coins and amount are editable below
function minCoins(amount) {
  if (amount === 0) return 0;
  if (amount < 0) return Infinity;
  if (memo[amount] !== undefined) return memo[amount];
  let best = Infinity;
  for (const c of coins) {
    best = Math.min(best, 1 + minCoins(amount - c));
  }
  memo[amount] = best;
  return best;
}`,
  codeJava: `// int[] coins; int INF = 1_000_000; Integer[] memo
int minCoins(int amount) {
  if (amount == 0) return 0;
  if (amount < 0) return INF;
  if (memo[amount] != null) return memo[amount];
  int best = INF;
  for (int c : coins) {
    best = Math.min(best, 1 + minCoins(amount - c));
  }
  memo[amount] = best;
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "coins", label: "coins", default: [1, 3, 4], maxLen: 5 },
    { kind: "number", name: "amount", label: "amount", default: 6, min: 0, max: 20 },
  ],
  entry: (a) => `minCoins(${a.amount})`,
  run({ fn, memo, line, narrate }, args) {
    // a coin of 0 (or negative) would never shrink the amount → infinite recursion
    const coins = [...new Set((args.coins as number[]).map(Math.trunc).filter((c) => c > 0))]
    if (!coins.length) coins.push(1, 3, 4)
    const minCoins = fn(
      "minCoins",
      (amount: number): number => {
        line(2, `minCoins(${amount}): exact zero? (${amount === 0 ? "<b>yes — 0 coins needed</b>" : "no"})`)
        if (amount === 0) return 0
        line(3, `minCoins(${amount}): overshot below zero? (${amount < 0 ? "<b>yes — dead end, Infinity</b>" : "no"})`)
        if (amount < 0) return Infinity
        line(4, `minCoins(${amount}): checking the memo…`)
        if (memo[amount] !== undefined) return memo[amount] as number
        let best = Infinity
        for (const c of coins) {
          line(7, `minCoins(${amount}): try coin ${c} → need minCoins(${amount - c}).`)
          best = Math.min(best, 1 + minCoins(amount - c))
        }
        line(9, `minCoins(${amount}): best over all coins = ${best === Infinity ? "Infinity (impossible)" : best}.`)
        memo[amount] = best
        return best
      },
      1,
    )
    narrate("Try every coin from the current amount; the memo turns an exponential tree into one row of answers.")
    return minCoins(args.amount as number)
  },
}
