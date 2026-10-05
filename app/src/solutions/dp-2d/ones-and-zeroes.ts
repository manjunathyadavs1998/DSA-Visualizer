import type { SolutionDef } from "@/engine/types"

export const onesAndZeroes: SolutionDef = {
  code: `// best(i, m, n): most strings from strs[i..] with m zeros / n ones left
// memo key packs both budgets into one column: m * (N + 1) + n
function best(i, m, n) {
  if (i === strs.length) return 0;
  const key = i + "," + (m * (N + 1) + n);
  if (memo[key] !== undefined) return memo[key];
  const zeros = count0(strs[i]), ones = strs[i].length - zeros;
  let res = best(i + 1, m, n);
  if (zeros <= m && ones <= n)
    res = Math.max(res, 1 + best(i + 1, m - zeros, n - ones));
  memo[key] = res;
  return res;
}`,
  codeJava: `// best(i, m, n): most strings from strs[i..] with m zeros / n ones left
// memo key packs both budgets into one column: m * (N + 1) + n
int best(int i, int m, int n) {
  if (i == strs.length) return 0;
  String key = i + "," + (m * (N + 1) + n);
  if (memo.get(key) != null) return memo.get(key);
  int zeros = count0(strs[i]), ones = strs[i].length() - zeros;
  int res = best(i + 1, m, n);
  if (zeros <= m && ones <= n)
    res = Math.max(res, 1 + best(i + 1, m - zeros, n - ones));
  memo.put(key, res);
  return res;
}`,
  inputs: [
    { kind: "string", name: "strs", label: "strs (comma-separated binary)", default: "10,0,1,1", maxLen: 14 },
    { kind: "number", name: "m", label: "m (zeros budget)", default: 2, min: 0, max: 4 },
    { kind: "number", name: "n", label: "n (ones budget)", default: 2, min: 0, max: 4 },
  ],
  entry: (a) => `best(0, ${a.m}, ${a.n})  // strs=[${a.strs}]`,
  run({ fn, memo, line, vars, narrate }, args) {
    let strs = (args.strs as string).split(",").map((x) => x.trim()).filter((x) => /^[01]+$/.test(x)).slice(0, 5)
    if (!strs.length) strs = ["10", "0", "1", "1"]
    const M = args.m as number
    const N = args.n as number
    const best = fn(
      "best",
      (i: number, m: number, n: number): number => {
        line(3, `best(${i}, m=${m}, n=${n}): strings exhausted? (${i === strs.length ? "<b>yes — 0 more fit</b>" : "no"})`)
        if (i === strs.length) return 0
        const key = i + "," + (m * (N + 1) + n)
        line(5, `checking memo["${key}"] — column ${m}·${N + 1}+${n} = ${m * (N + 1) + n} encodes the (m,n) budget pair.`)
        if (memo[key] !== undefined) return memo[key] as number
        const zeros = strs[i].split("0").length - 1
        const ones = strs[i].length - zeros
        line(6, `"${strs[i]}" costs <b>${zeros} zero(s) + ${ones} one(s)</b>; budget is (${m}, ${n}).`)
        vars({ i, m, n, str: strs[i], zeros, ones })
        line(7, `option A — <b>skip</b> "${strs[i]}": budgets untouched.`)
        let res = best(i + 1, m, n)
        if (zeros <= m && ones <= n) {
          line(9, `option B — it fits! <b>take</b> "${strs[i]}": budgets drop to (${m - zeros}, ${n - ones}).`)
          res = Math.max(res, 1 + best(i + 1, m - zeros, n - ones))
        } else {
          line(8, `option B unavailable: "${strs[i]}" <b>doesn't fit</b> the remaining budget.`)
        }
        memo[key] = res
        line(11, `best(${i}, ${m}, ${n}) = <b>${res}</b> string(s).`)
        return res
      },
      2,
    )
    narrate("0/1 knapsack with TWO capacities. The state is (index, zeros-left, ones-left); we pack both budgets into one memo column to draw it as a 2-D table.")
    return best(0, M, N)
  },
}
