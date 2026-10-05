import type { SolutionDef } from "@/engine/types"

export const longestIncreasingSubsequence: SolutionDef = {
  code: `// a is editable below
function LIS() {
  let best = 0;
  for (let i = 0; i < a.length; i++)
    best = Math.max(best, lis(i));
  return best;
}
function lis(i) { // longest increasing run starting at i
  if (memo[i] !== undefined) return memo[i];
  let len = 1;
  for (let j = i + 1; j < a.length; j++)
    if (a[j] > a[i]) len = Math.max(len, 1 + lis(j));
  memo[i] = len;
  return len;
}`,
  codeJava: `// int[] a editable below; Integer[] memo
int LIS() {
  int best = 0;
  for (int i = 0; i < a.length; i++)
    best = Math.max(best, lis(i));
  return best;
}
int lis(int i) { // longest increasing run starting at i
  if (memo[i] != null) return memo[i];
  int len = 1;
  for (int j = i + 1; j < a.length; j++)
    if (a[j] > a[i]) len = Math.max(len, 1 + lis(j));
  memo[i] = len;
  return len;
}`,
  inputs: [{ kind: "numbers", name: "a", label: "a", default: [10, 9, 2, 5, 3, 7, 101], maxLen: 7 }],
  entry: (a) => `LIS()  // a=[${(a.a as number[]).join(", ")}]`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as number[]
    const lis = fn(
      "lis",
      (i: number): number => {
        line(8, `lis(${i}): checking memo[${i}]…`)
        if (memo[i] !== undefined) return memo[i] as number
        let len = 1
        for (let j = i + 1; j < a.length; j++) {
          if (a[j] > a[i]) {
            line(11, `a[${j}]=${a[j]} > a[${i}]=${a[i]} → the chain can continue: try 1 + lis(${j}).`)
            len = Math.max(len, 1 + lis(j))
          }
        }
        line(12, `lis(${i}) = <b>${len}</b>: longest increasing chain starting at a[${i}]=${a[i]}.`)
        memo[i] = len
        return len
      },
      7,
    )
    const LIS = fn(
      "LIS",
      (): number => {
        let best = 0
        for (let i = 0; i < a.length; i++) {
          line(4, `A chain can start anywhere — how long is the best one starting at index ${i} (value ${a[i]})?`)
          best = Math.max(best, lis(i))
        }
        line(5, `Longest increasing subsequence = <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("lis(i) = 1 + the best chain after a strictly bigger number; the memo answers repeats instantly.")
    return LIS()
  },
}
