import type { SolutionDef } from "@/engine/types"

export const maximumSumIncreasingSubsequence: SolutionDef = {
  code: `// a is editable below
function MSIS() {
  let best = 0;
  for (let i = 0; i < a.length; i++)
    best = Math.max(best, msis(i));
  return best;
}
function msis(i) { // max increasing-chain sum starting at i
  if (memo[i] !== undefined) return memo[i];
  let sum = a[i];
  for (let j = i + 1; j < a.length; j++)
    if (a[j] > a[i]) sum = Math.max(sum, a[i] + msis(j));
  memo[i] = sum;
  return sum;
}`,
  codeJava: `// int[] a editable below; Integer[] memo
int MSIS() {
  int best = 0;
  for (int i = 0; i < a.length; i++)
    best = Math.max(best, msis(i));
  return best;
}
int msis(int i) { // max increasing-chain sum starting at i
  if (memo[i] != null) return memo[i];
  int sum = a[i];
  for (int j = i + 1; j < a.length; j++)
    if (a[j] > a[i]) sum = Math.max(sum, a[i] + msis(j));
  memo[i] = sum;
  return sum;
}`,
  inputs: [{ kind: "numbers", name: "a", label: "a", default: [1, 101, 2, 3, 100], maxLen: 7 }],
  entry: (a) => `MSIS()  // a=[${(a.a as number[]).join(", ")}]`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as number[]
    const msis = fn(
      "msis",
      (i: number): number => {
        line(8, `msis(${i}): checking memo[${i}]…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(9, `msis(${i}): the chain must include a[${i}]=${a[i]} — start the sum there.`)
        let sum = a[i]
        for (let j = i + 1; j < a.length; j++) {
          if (a[j] > a[i]) {
            line(11, `a[${j}]=${a[j]} > a[${i}]=${a[i]} → extendable: try ${a[i]} + msis(${j}).`)
            sum = Math.max(sum, a[i] + msis(j))
          }
        }
        line(12, `msis(${i}) = <b>${sum}</b>: heaviest increasing chain starting at a[${i}]=${a[i]}.`)
        memo[i] = sum
        return sum
      },
      7,
    )
    const MSIS = fn(
      "MSIS",
      (): number => {
        let best = 0
        for (let i = 0; i < a.length; i++) {
          line(4, `How heavy is the best increasing chain starting at index ${i} (value ${a[i]})?`)
          best = Math.max(best, msis(i))
        }
        line(5, `Maximum sum of an increasing subsequence = <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("Same skeleton as LIS, but greed is by SUM, not length — a short heavy chain can beat a long light one.")
    return MSIS()
  },
}
