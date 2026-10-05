import type { SolutionDef } from "@/engine/types"

export const bestTimeToBuyAndSellStock: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// one buy, one sell later — maximize the profit
function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice)
      minPrice = prices[i];        // new cheapest buy day
    else
      best = Math.max(best, prices[i] - minPrice);
  }
  return best;
}`,
  codeJava: `// one buy, one sell later — maximize the profit
int maxProfit(int[] prices) {
  int minPrice = Integer.MAX_VALUE, best = 0;
  for (int i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice)
      minPrice = prices[i];        // new cheapest buy day
    else
      best = Math.max(best, prices[i] - minPrice);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "prices", default: [7, 1, 5, 3, 6, 4], maxLen: 12 }],
  entry: () => `maxProfit(prices)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const prices = args.nums as number[]
    const go = fn(
      "maxProfit",
      (): number => {
        let minPrice = Infinity, best = 0
        let buyIdx = -1, bestBuy = -1, bestSell = -1
        line(2, `Track two things: the cheapest price seen so far, and the best profit so far.`)
        for (let i = 0; i < prices.length; i++) {
          ptr("i", i)
          if (prices[i] < minPrice) {
            minPrice = prices[i]
            buyIdx = i
            mark("focus", [i])
            line(5, `Day ${i}: price ${prices[i]} is a new LOW — the best buy day so far.`)
          } else {
            const profit = prices[i] - minPrice
            if (profit > best) {
              best = profit
              bestBuy = buyIdx
              bestSell = i
              mark("good", [bestBuy, bestSell])
              line(7, `Day ${i}: sell now → ${prices[i]} − ${minPrice} = <b>${profit}</b> — a new best profit!`)
            } else {
              line(7, `Day ${i}: sell now → ${prices[i]} − ${minPrice} = ${profit} — not better than ${best}.`)
            }
          }
          vars({ i, minPrice, best })
        }
        ptr("i", -1)
        line(9, best > 0
          ? `Answer: buy at ${prices[bestBuy]} (day ${bestBuy}), sell at ${prices[bestSell]} (day ${bestSell}) → profit <b>${best}</b>.`
          : `Prices never rose after any low — no profitable trade, answer 0.`)
        return best
      },
      1,
    )
    narrate("One pass: every day either becomes the new cheapest buy, or tries to sell at today's price.")
    return go()
  },
}
