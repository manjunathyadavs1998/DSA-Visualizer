import type { SolutionDef } from "@/engine/types"

export const numberOfWaysToPaintFence: SolutionDef = {
  code: `// k colors; at most 2 adjacent posts may share a color
function paint(i) {
  if (i === 1) return k;
  if (i === 2) return k * k;
  if (memo[i] !== undefined) return memo[i];
  memo[i] = (k - 1) * (paint(i - 1) + paint(i - 2));
  return memo[i];
}`,
  codeJava: `// Integer[] memo
int paint(int i) {
  if (i == 1) return k;
  if (i == 2) return k * k;
  if (memo[i] != null) return memo[i];
  memo[i] = (k - 1) * (paint(i - 1) + paint(i - 2));
  return memo[i];
}`,
  inputs: [
    { kind: "number", name: "n", label: "posts n", default: 5, min: 1, max: 10 },
    { kind: "number", name: "k", label: "colors k", default: 3, min: 1, max: 5 },
  ],
  entry: (a) => `paint(${a.n}) with k=${a.k}`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(1, Math.min(10, Math.trunc(args.n as number) || 1))
    const K = Math.max(1, Math.min(5, Math.trunc(args.k as number) || 1))
    const paint = fn(
      "paint",
      (i: number): number => {
        line(2, `paint(${i}): single post? (${i === 1 ? `<b>yes — any of the ${K} colors</b>` : "no"})`)
        if (i === 1) return K
        line(3, `paint(${i}): two posts? (${i === 2 ? `<b>yes — any pair, ${K}·${K} = ${K * K} ways (two in a row is allowed)</b>` : "no"})`)
        if (i === 2) return K * K
        line(4, `paint(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(5, `paint(${i}): post ${i} must differ from a run — differ-from-last on paint(${i - 1}) ways, or match-last which forces differ-from-${i - 2}: (k−1)·(paint(${i - 1}) + paint(${i - 2})).`)
        const v = (K - 1) * ((paint(i - 1) as number) + (paint(i - 2) as number))
        vars({ i, v })
        line(5, `paint(${i}) = ${K - 1}·(…) = <b>${v}</b> → memo[${i}].`)
        memo[i] = v
        return v
      },
      1,
    )
    narrate("Classify by the LAST two posts: end in a different color ((k−1)·f(i−1)) or end in a matched pair ((k−1)·f(i−2)).")
    return paint(N)
  },
}
