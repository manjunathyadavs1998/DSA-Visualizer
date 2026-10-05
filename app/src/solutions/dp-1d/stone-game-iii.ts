import type { SolutionDef } from "@/engine/types"

export const stoneGameIII: SolutionDef = {
  code: `// diff(i) = (my score − yours) playing optimally from pile i
function diff(i) {
  if (i === n) return 0;
  if (memo[i] !== undefined) return memo[i];
  let take = 0, best = -Infinity;
  for (let k = 0; k < 3 && i + k < n; k++) {
    take += stones[i + k];
    best = Math.max(best, take - diff(i + k + 1));
  }
  memo[i] = best;
  return best;
}
// diff(0) > 0 → "Alice", < 0 → "Bob", else "Tie"`,
  codeJava: `// int[] stones; Integer[] memo
int diff(int i) {
  if (i == n) return 0;
  if (memo[i] != null) return memo[i];
  int take = 0, best = Integer.MIN_VALUE;
  for (int k = 0; k < 3 && i + k < n; k++) {
    take += stones[i + k];
    best = Math.max(best, take - diff(i + k + 1));
  }
  memo[i] = best;
  return best;
}
// diff(0) > 0 → "Alice", < 0 → "Bob", else "Tie"`,
  inputs: [{ kind: "numbers", name: "stones", label: "stone values", default: [1, 2, 3, 7], maxLen: 8 }],
  entry: () => `diff(0)`,
  run({ fn, memo, line, vars, narrate }, args) {
    let stones = (args.stones as number[]).map((x) => Math.max(-9, Math.min(9, Math.trunc(x))))
    if (!stones.length) stones = [1, 2, 3, 7]
    const n = stones.length
    const diff = fn(
      "diff",
      (i: number): number => {
        line(2, `diff(${i}): stones exhausted? (${i === n ? "<b>yes — score difference 0</b>" : "no"})`)
        if (i === n) return 0
        line(3, `diff(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        let take = 0
        let best = -Infinity
        for (let k = 0; k < 3 && i + k < n; k++) {
          take += stones[i + k]
          line(7, `diff(${i}): grab ${k + 1} stone${k ? "s" : ""} worth <b>${take}</b>; opponent then leads with diff(${i + k + 1}) — my margin = ${take} − diff(${i + k + 1}).`)
          best = Math.max(best, take - diff(i + k + 1))
          vars({ i, k: k + 1, take, best })
        }
        line(9, `diff(${i}) = <b>${best}</b> → memo[${i}].`)
        memo[i] = best
        return best
      },
      1,
    )
    narrate("One function for BOTH players: diff(i) is the margin for whoever moves — subtracting the opponent's diff flips perspective.")
    const d = diff(0)
    narrate(`diff(0) = ${d} → ${d > 0 ? "<b>Alice</b> wins" : d < 0 ? "<b>Bob</b> wins" : "<b>Tie</b>"}.`)
    return d > 0 ? "Alice" : d < 0 ? "Bob" : "Tie"
  },
}
