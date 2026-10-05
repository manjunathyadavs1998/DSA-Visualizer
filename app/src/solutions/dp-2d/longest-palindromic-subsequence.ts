import type { SolutionDef } from "@/engine/types"

export const longestPalindromicSubsequence: SolutionDef = {
  code: `// s is editable below
function lps(i, j) {
  if (i > j) return 0;
  if (i === j) return 1;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (s[i] === s[j])
    memo[key] = 2 + lps(i + 1, j - 1);
  else
    memo[key] = Math.max(lps(i + 1, j), lps(i, j - 1));
  return memo[key];
}`,
  codeJava: `// String s editable below; Map<String,Integer> memo
int lps(int i, int j) {
  if (i > j) return 0;
  if (i == j) return 1;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (s.charAt(i) == s.charAt(j))
    memo.put(key, 2 + lps(i + 1, j - 1));
  else
    memo.put(key, Math.max(lps(i + 1, j), lps(i, j - 1)));
  return memo.get(key);
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "bbbab", maxLen: 7 }],
  entry: (a) => `lps(0, ${(a.s as string).length - 1})  // s="${a.s}"`,
  run({ fn, memo, line, narrate }, args) {
    const s = args.s as string
    const lps = fn(
      "lps",
      (i: number, j: number): number => {
        line(2, `lps(${i},${j}): pointers crossed? (${i > j ? "<b>yes — empty window, 0</b>" : "no"})`)
        if (i > j) return 0
        line(3, `lps(${i},${j}): single char '${s[i]}'? (${i === j ? "<b>yes — a 1-char palindrome</b>" : "no"})`)
        if (i === j) return 1
        const key = i + "," + j
        line(5, `lps(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (s[i] === s[j]) {
          line(7, `s[${i}]='${s[i]}' == s[${j}]='${s[j]}' → <b>both ends join the palindrome</b>: 2 + inner window.`)
          memo[key] = 2 + lps(i + 1, j - 1)
        } else {
          line(9, `'${s[i]}' ≠ '${s[j]}' → drop one end: best of lps(${i + 1},${j}) vs lps(${i},${j - 1}).`)
          memo[key] = Math.max(lps(i + 1, j), lps(i, j - 1))
        }
        line(10, `lps(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("LCS of s with its reverse — but done directly: matching ends shrink inward for +2, mismatched ends drop one side.")
    return lps(0, s.length - 1)
  },
}
