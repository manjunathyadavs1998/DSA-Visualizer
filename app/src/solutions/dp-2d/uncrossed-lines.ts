import type { SolutionDef } from "@/engine/types"

export const uncrossedLines: SolutionDef = {
  code: `// lines(i,j) = max non-crossing connect-the-equal-numbers lines
function lines(i, j) {
  if (i === a.length || j === b.length) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = 1 + lines(i + 1, j + 1);
  else
    memo[key] = Math.max(lines(i + 1, j), lines(i, j + 1));
  return memo[key];
}`,
  codeJava: `// lines(i,j) = max non-crossing connect-the-equal-numbers lines
int lines(int i, int j) {
  if (i == a.length || j == b.length) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a[i] == b[j])
    memo.put(key, 1 + lines(i + 1, j + 1));
  else
    memo.put(key, Math.max(lines(i + 1, j), lines(i, j + 1)));
  return memo.get(key);
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "nums1", default: [1, 4, 2], maxLen: 5 },
    { kind: "numbers", name: "b", label: "nums2", default: [1, 2, 4], maxLen: 5 },
  ],
  entry: (x) => `lines(0, 0)  // a=[${(x.a as number[]).join(",")}], b=[${(x.b as number[]).join(",")}]`,
  run({ fn, memo, line, narrate }, args) {
    const a = (args.a as number[]).map((v) => Math.trunc(v))
    const b = (args.b as number[]).map((v) => Math.trunc(v))
    const lines = fn(
      "lines",
      (i: number, j: number): number => {
        line(2, `lines(${i},${j}): ran off either array? (${i === a.length || j === b.length ? "<b>yes — 0 lines</b>" : "no"})`)
        if (i === a.length || j === b.length) return 0
        const key = i + "," + j
        line(4, `lines(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(6, `a[${i}]=${a[i]} == b[${j}]=${b[j]} → <b>draw the line</b>; anything after it can't cross, so recurse past both.`)
          memo[key] = 1 + lines(i + 1, j + 1)
        } else {
          line(8, `${a[i]} ≠ ${b[j]} → one of them stays unmatched: skip a[${i}] or skip b[${j}], keep the better.`)
          memo[key] = Math.max(lines(i + 1, j), lines(i, j + 1))
        }
        line(9, `lines(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("'No two lines cross' forces matched pairs to appear in the same order in both arrays — which makes this exactly LCS in disguise.")
    return lines(0, 0)
  },
}
