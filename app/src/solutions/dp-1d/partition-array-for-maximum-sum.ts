import type { SolutionDef } from "@/engine/types"

export const partitionArrayForMaximumSum: SolutionDef = {
  code: `// cut a block of length ≤ k off the front; lift it to its max
function best(i) {
  if (i === n) return 0;
  if (memo[i] !== undefined) return memo[i];
  let mx = 0, ans = 0;
  for (let j = i; j < Math.min(n, i + k); j++) {
    mx = Math.max(mx, arr[j]);
    ans = Math.max(ans, mx * (j - i + 1) + best(j + 1));
  }
  memo[i] = ans;
  return ans;
}`,
  codeJava: `// int[] arr; Integer[] memo
int best(int i) {
  if (i == n) return 0;
  if (memo[i] != null) return memo[i];
  int mx = 0, ans = 0;
  for (int j = i; j < Math.min(n, i + k); j++) {
    mx = Math.max(mx, arr[j]);
    ans = Math.max(ans, mx * (j - i + 1) + best(j + 1));
  }
  memo[i] = ans;
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "arr", label: "arr", default: [1, 15, 7, 9, 2], maxLen: 8 },
    { kind: "number", name: "k", label: "max block length k", default: 3, min: 1, max: 4 },
  ],
  entry: () => `best(0)`,
  run({ fn, memo, line, vars, narrate }, args) {
    let arr = (args.arr as number[]).map((x) => Math.max(0, Math.trunc(x)))
    if (!arr.length) arr = [1, 15, 7, 9, 2]
    const n = arr.length
    const k = Math.max(1, Math.min(4, Math.trunc(args.k as number) || 1))
    const best = fn(
      "best",
      (i: number): number => {
        line(2, `best(${i}): nothing left to partition? (${i === n ? "<b>yes — sum 0</b>" : "no"})`)
        if (i === n) return 0
        line(3, `best(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        let mx = 0
        let ans = 0
        for (let j = i; j < Math.min(n, i + k); j++) {
          mx = Math.max(mx, arr[j])
          line(7, `best(${i}): block [${i}..${j}] (len ${j - i + 1}), every cell lifted to max <b>${mx}</b> → ${mx}·${j - i + 1} = ${mx * (j - i + 1)}, plus best(${j + 1}).`)
          ans = Math.max(ans, mx * (j - i + 1) + best(j + 1))
          vars({ i, j, mx, ans })
        }
        line(9, `best(${i}) = <b>${ans}</b> → memo[${i}].`)
        memo[i] = ans
        return ans
      },
      1,
    )
    narrate("Only the FIRST block needs a decision — its length (≤ k). Everything after is the same problem, so one memo slot per start index.")
    return best(0)
  },
}
