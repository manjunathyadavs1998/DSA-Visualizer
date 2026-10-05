import type { SolutionDef } from "@/engine/types"

export const distinctSubsequences: SolutionDef = {
  code: `// how many distinct subsequences of s equal t?
function count(i, j) {
  if (j === t.length) return 1;
  if (i === s.length) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (s[i] === t[j])
    memo[key] = count(i + 1, j + 1) + count(i + 1, j);
  else
    memo[key] = count(i + 1, j);
  return memo[key];
}`,
  codeJava: `// how many distinct subsequences of s equal t?
int count(int i, int j) {
  if (j == t.length()) return 1;
  if (i == s.length()) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (s.charAt(i) == t.charAt(j))
    memo.put(key, count(i + 1, j + 1) + count(i + 1, j));
  else
    memo.put(key, count(i + 1, j));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (source)", default: "rabbbit", maxLen: 7 },
    { kind: "string", name: "t", label: "t (target)", default: "rabbit", maxLen: 6 },
  ],
  entry: (a) => `count(0, 0)  // s="${a.s}", t="${a.t}"`,
  run({ fn, memo, line, narrate }, args) {
    const s = args.s as string
    const t = args.t as string
    const count = fn(
      "count",
      (i: number, j: number): number => {
        line(2, `count(${i},${j}): all of t matched? (${j === t.length ? "<b>yes — that's 1 way</b>" : "no"})`)
        if (j === t.length) return 1
        line(3, `count(${i},${j}): s exhausted with t unfinished? (${i === s.length ? "<b>yes — 0 ways</b>" : "no"})`)
        if (i === s.length) return 0
        const key = i + "," + j
        line(5, `count(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (s[i] === t[j]) {
          line(7, `s[${i}]='${s[i]}' == t[${j}]='${t[j]}' → <b>use it</b> (both advance) PLUS <b>skip it</b> (only i advances).`)
          memo[key] = count(i + 1, j + 1) + count(i + 1, j)
        } else {
          line(9, `'${s[i]}' ≠ '${t[j]}' → s[${i}] is useless here, skip it.`)
          memo[key] = count(i + 1, j)
        }
        line(10, `count(${i},${j}) = <b>${memo[key]}</b> way(s).`)
        return memo[key] as number
      },
      1,
    )
    narrate("On a character match you ADD two worlds: use this s-char for t[j], or save t[j] for a later copy. Counting = sum, not max.")
    return count(0, 0)
  },
}
