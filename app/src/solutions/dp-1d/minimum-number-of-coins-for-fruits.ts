import type { SolutionDef } from "@/engine/types"

export const minimumNumberOfCoinsForFruits: SolutionDef = {
  code: `// 1-indexed: BUYING fruit i gets fruits i+1 .. 2i for free
function minCoins(i) {
  if (i > n) return 0;
  if (memo[i] !== undefined) return memo[i];
  let best = Infinity;
  const hi = Math.min(2 * i + 1, n + 1);
  for (let j = i + 1; j <= hi; j++) {
    best = Math.min(best, minCoins(j));
  }
  memo[i] = prices[i - 1] + best;
  return memo[i];
}`,
  codeJava: `// int[] prices; Integer[] memo; int INF = 1_000_000
int minCoins(int i) {
  if (i > n) return 0;
  if (memo[i] != null) return memo[i];
  int best = INF;
  int hi = Math.min(2 * i + 1, n + 1);
  for (int j = i + 1; j <= hi; j++) {
    best = Math.min(best, minCoins(j));
  }
  memo[i] = prices[i - 1] + best;
  return memo[i];
}`,
  inputs: [{ kind: "numbers", name: "prices", label: "fruit prices", default: [1, 10, 1, 1], maxLen: 8 }],
  entry: () => `minCoins(1)`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    let prices = (args.prices as number[]).map((x) => Math.max(1, Math.trunc(x)))
    if (!prices.length) prices = [1, 10, 1, 1]
    const n = prices.length
    heap("prices", prices)
    const minCoins = fn(
      "minCoins",
      (i: number): number => {
        line(2, `minCoins(${i}): past the last fruit ${n}? (${i > n ? "<b>yes — basket complete, 0 coins</b>" : "no"})`)
        if (i > n) return 0
        line(3, `minCoins(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        let best = Infinity
        const hi = Math.min(2 * i + 1, n + 1)
        line(5, `minCoins(${i}): BUY fruit ${i} for <b>${prices[i - 1]}</b> → fruits ${i + 1}..${Math.min(2 * i, n)} come free; next PURCHASE is any of ${i + 1}..${hi}.`)
        for (let j = i + 1; j <= hi; j++) {
          line(7, `minCoins(${i}): make the next purchase at fruit ${j} → minCoins(${j})${j > 2 * i ? " (first fruit outside the free window — must buy)" : " (buying a free fruit early, for its OWN freebies)"}.`)
          best = Math.min(best, minCoins(j))
          vars({ i, j, best })
        }
        line(9, `minCoins(${i}) = ${prices[i - 1]} + ${best} = <b>${prices[i - 1] + best}</b> → memo[${i}].`)
        memo[i] = prices[i - 1] + best
        return memo[i] as number
      },
      1,
    )
    narrate("Counter-intuitive: it can pay to BUY a fruit you'd get free (see price 10 at fruit 2) — buying resets a bigger free window.")
    return minCoins(1)
  },
}
