import type { SolutionDef } from "@/engine/types"

export const coinChangeII: SolutionDef = {
  code: `// combinations, not permutations: fix the coin ORDER by index i
// memo key packs (i, remaining r) into i*W + r, W = amount + 1
function count(i, r) {
  if (r === 0) return 1;
  if (i === coins.length || r < 0) return 0;
  const key = i * W + r;
  if (memo[key] !== undefined) return memo[key];
  const take = count(i, r - coins[i]);
  const skip = count(i + 1, r);
  memo[key] = take + skip;
  return memo[key];
}`,
  codeJava: `// int[] coins; int W = amount + 1;
// Integer[] memo = new Integer[coins.length * W + W]
int count(int i, int r) {
  if (r == 0) return 1;
  if (i == coins.length || r < 0) return 0;
  int key = i * W + r;
  if (memo[key] != null) return memo[key];
  int take = count(i, r - coins[i]);
  int skip = count(i + 1, r);
  memo[key] = take + skip;
  return memo[key];
}`,
  inputs: [
    { kind: "numbers", name: "coins", label: "coins", default: [1, 2, 5], maxLen: 4 },
    { kind: "number", name: "amount", label: "amount", default: 5, min: 0, max: 10 },
  ],
  entry: (a) => `count(0, ${a.amount})`,
  run({ fn, memo, line, vars, narrate }, args) {
    // zero/negative coins never shrink r → infinite recursion
    const coins = [...new Set((args.coins as number[]).map(Math.trunc).filter((c) => c > 0))]
    if (!coins.length) coins.push(1, 2, 5)
    const amount = Math.max(0, Math.min(10, Math.trunc(args.amount as number) || 0))
    const W = amount + 1
    const count = fn(
      "count",
      (i: number, r: number): number => {
        line(3, `count(${i}, ${r}): remainder zero? (${r === 0 ? "<b>yes — one valid combination</b>" : "no"})`)
        if (r === 0) return 1
        line(4, `count(${i}, ${r}): ${i === coins.length ? "<b>out of coin types — 0 ways</b>" : r < 0 ? "<b>overshot — 0 ways</b>" : `coin[${i}] = ${coins[i]} is available`}`)
        if (i === coins.length || r < 0) return 0
        const key = i * W + r
        line(5, `key = ${i}·${W} + ${r} = <b>${key}</b> — one memo slot per (coin index, remainder) pair.`)
        line(6, `count(${i}, ${r}): checking memo[${key}]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(7, `count(${i}, ${r}): TAKE another coin ${coins[i]} (stay at index ${i}) → count(${i}, ${r - coins[i]}).`)
        const take = count(i, r - coins[i])
        line(8, `count(${i}, ${r}): or SKIP coin ${coins[i]} forever → count(${i + 1}, ${r}).`)
        const skip = count(i + 1, r)
        vars({ i, r, take, skip })
        line(9, `count(${i}, ${r}) = take ${take} + skip ${skip} = <b>${take + skip}</b> → memo[${key}].`)
        memo[key] = take + skip
        return take + skip
      },
      2,
    )
    narrate("Take-or-skip per coin TYPE: once you skip a coin you never return to it — that is what makes {1,2,2} and {2,1,2} count once.")
    return count(0, amount)
  },
}
