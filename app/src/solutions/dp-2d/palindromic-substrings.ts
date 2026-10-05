import type { SolutionDef } from "@/engine/types"

export const palindromicSubstrings: SolutionDef = {
  code: `// pal(i,j) = 1 if s[i..j] is a palindrome; count every window that is
function pal(i, j) {
  if (i >= j) return 1;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = s[i] === s[j] ? pal(i + 1, j - 1) : 0;
  return memo[key];
}
function countSubstrings() {
  let count = 0;
  for (let i = 0; i < s.length; i++)
    for (let j = i; j < s.length; j++)
      if (pal(i, j)) count++;
  return count;
}`,
  codeJava: `// pal(i,j) = 1 if s[i..j] is a palindrome; count every window that is
int pal(int i, int j) {
  if (i >= j) return 1;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, s.charAt(i) == s.charAt(j) ? pal(i + 1, j - 1) : 0);
  return memo.get(key);
}
int countSubstrings() {
  int count = 0;
  for (int i = 0; i < s.length(); i++)
    for (int j = i; j < s.length(); j++)
      if (pal(i, j) == 1) count++;
  return count;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aabaa", maxLen: 7 }],
  entry: (a) => `countSubstrings()  // s="${a.s}"`,
  run({ fn, memo, line, vars, narrate }, args) {
    const s = args.s as string
    const pal = fn(
      "pal",
      (i: number, j: number): number => {
        line(2, `pal(${i},${j}): window of ≤ 1 char? (${i >= j ? "<b>yes — counts as a palindrome</b>" : "no"})`)
        if (i >= j) return 1
        const key = i + "," + j
        line(4, `pal(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `ends '${s[i]}' vs '${s[j]}': ${s[i] === s[j] ? "<b>equal → inherit the inner verdict</b>" : "<b>differ → 0</b>"}.`)
        memo[key] = s[i] === s[j] ? pal(i + 1, j - 1) : 0
        line(6, `pal(${i},${j}) = <b>${memo[key]}</b>  ("${s.slice(i, j + 1)}").`)
        return memo[key] as number
      },
      1,
    )
    const countSubstrings = fn(
      "countSubstrings",
      (): number => {
        let count = 0
        for (let i = 0; i < s.length; i++)
          for (let j = i; j < s.length; j++) {
            line(12, `driver: is s[${i}..${j}] = "${s.slice(i, j + 1)}" a palindrome?`)
            if (pal(i, j)) {
              count++
              line(12, `yes → count = <b>${count}</b>.`)
              vars({ i, j, count })
            }
          }
        line(13, `total palindromic substrings: <b>${count}</b>.`)
        return count
      },
      8,
    )
    narrate("Same pal(i,j) table as Longest Palindromic Substring — but instead of keeping the widest 1, we simply count every 1 in the table.")
    return countSubstrings()
  },
}
