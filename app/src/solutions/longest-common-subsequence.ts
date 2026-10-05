import type { SolutionDef } from "@/engine/types"

export const longestCommonSubsequence: SolutionDef = {
  code: `// a and b are editable below
function lcs(i, j) {
  if (i === a.length || j === b.length) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = 1 + lcs(i + 1, j + 1);
  else
    memo[key] = Math.max(lcs(i + 1, j), lcs(i, j + 1));
  return memo[key];
}`,
  codeJava: `// String a, b editable below; Map<String,Integer> memo
int lcs(int i, int j) {
  if (i == a.length() || j == b.length()) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a.charAt(i) == b.charAt(j))
    memo.put(key, 1 + lcs(i + 1, j + 1));
  else
    memo.put(key, Math.max(lcs(i + 1, j), lcs(i, j + 1)));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "a", label: "a", default: "abcde", maxLen: 7 },
    { kind: "string", name: "b", label: "b", default: "ace", maxLen: 7 },
  ],
  entry: (a) => `lcs(0, 0)  // a="${a.a}", b="${a.b}"`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const lcs = fn(
      "lcs",
      (i: number, j: number): number => {
        line(2, `lcs(${i},${j}): ran off either string? (${i === a.length || j === b.length ? "<b>yes — 0</b>" : "no"})`)
        if (i === a.length || j === b.length) return 0
        const key = i + "," + j
        line(4, `lcs(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(6, `'${a[i]}' == '${b[j]}' → <b>match!</b> 1 + move both pointers.`)
          memo[key] = 1 + lcs(i + 1, j + 1)
        } else {
          line(8, `'${a[i]}' ≠ '${b[j]}' → best of skipping a char on either side.`)
          memo[key] = Math.max(lcs(i + 1, j), lcs(i, j + 1))
        }
        line(9, `lcs(${i},${j}) = ${memo[key]}.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Match → move both pointers diagonally. Mismatch → best of skipping a char on either side.")
    return lcs(0, 0)
  },
}
