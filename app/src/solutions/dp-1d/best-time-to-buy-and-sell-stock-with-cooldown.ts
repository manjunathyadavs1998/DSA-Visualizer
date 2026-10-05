import type { SolutionDef } from "@/engine/types"

export const bestTimeToBuyAndSellStockWithCooldown: SolutionDef = {
  code: `// state = (day i, holding?); memo key = 2*i + holding
function profit(i, holding) {
  if (i >= n) return 0;
  const key = 2 * i + (holding ? 1 : 0);
  if (memo[key] !== undefined) return memo[key];
  let best;
  if (holding) {
    const sell = prices[i] + profit(i + 2, false);
    best = Math.max(sell, profit(i + 1, true));
  } else {
    const buy = -prices[i] + profit(i + 1, true);
    best = Math.max(buy, profit(i + 1, false));
  }
  memo[key] = best;
  return best;
}`,
  codeJava: `// int[] prices; Integer[] memo = new Integer[2 * n]
int profit(int i, boolean holding) {
  if (i >= n) return 0;
  int key = 2 * i + (holding ? 1 : 0);
  if (memo[key] != null) return memo[key];
  int best;
  if (holding) {
    int sell = prices[i] + profit(i + 2, false);
    best = Math.max(sell, profit(i + 1, true));
  } else {
    int buy = -prices[i] + profit(i + 1, true);
    best = Math.max(buy, profit(i + 1, false));
  }
  memo[key] = best;
  return best;
}`,
  inputs: [{ kind: "numbers", name: "prices", label: "prices", default: [1, 2, 3, 0, 2], maxLen: 8 }],
  entry: () => `profit(0, false)`,
  run({ fn, memo, line, vars, narrate }, args) {
    let prices = (args.prices as number[]).map((x) => Math.max(0, Math.trunc(x)))
    if (!prices.length) prices = [1, 2, 3, 0, 2]
    const n = prices.length
    const profit = fn(
      "profit",
      (i: number, holding: boolean): number => {
        line(2, `profit(${i}, ${holding ? "holding" : "free"}): past the last day? (${i >= n ? "<b>yes — 0</b>" : "no"})`)
        if (i >= n) return 0
        const key = 2 * i + (holding ? 1 : 0)
        line(3, `key = 2·${i} + ${holding ? 1 : 0} = <b>${key}</b> (even slots = free, odd = holding).`)
        line(4, `profit(${i}, ${holding ? "holding" : "free"}): checking memo[${key}]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let best: number
        if (holding) {
          line(7, `day ${i}: SELL at <b>${prices[i]}</b> → cooldown day ${i + 1}, resume FREE on day ${i + 2}.`)
          const sell = prices[i] + profit(i + 2, false)
          line(8, `day ${i}: or keep HOLDING → profit(${i + 1}, holding).`)
          best = Math.max(sell, profit(i + 1, true))
          vars({ i, sell, best })
        } else {
          line(10, `day ${i}: BUY at <b>${prices[i]}</b> (profit −${prices[i]}) → profit(${i + 1}, holding).`)
          const buy = -prices[i] + profit(i + 1, true)
          line(11, `day ${i}: or WAIT → profit(${i + 1}, free).`)
          best = Math.max(buy, profit(i + 1, false))
          vars({ i, buy, best })
        }
        line(13, `profit(${i}, ${holding ? "holding" : "free"}) = <b>${best}</b> → memo[${key}].`)
        memo[key] = best
        return best
      },
      1,
    )
    narrate("Two states per day — holding or free. Selling jumps i+2: day i+1 is the forced cooldown.")
    return profit(0, false)
  },
}
