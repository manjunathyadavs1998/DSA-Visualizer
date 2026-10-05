import type { SolutionDef } from "@/engine/types"

export const longestPalindromicSubstring: SolutionDef = {
  code: `// pal(i,j) = 1 if s[i..j] is a palindrome (the memo IS the table)
function pal(i, j) {
  if (i >= j) return 1;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = s[i] === s[j] ? pal(i + 1, j - 1) : 0;
  return memo[key];
}
function longestPalindrome() {
  let best = "";
  for (let i = 0; i < s.length; i++)
    for (let j = i; j < s.length; j++)
      if (pal(i, j) && j - i + 1 > best.length) best = s.slice(i, j + 1);
  return best;
}`,
  codeJava: `// pal(i,j) = 1 if s[i..j] is a palindrome (the memo IS the table)
int pal(int i, int j) {
  if (i >= j) return 1;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, s.charAt(i) == s.charAt(j) ? pal(i + 1, j - 1) : 0);
  return memo.get(key);
}
String longestPalindrome() {
  String best = "";
  for (int i = 0; i < s.length(); i++)
    for (int j = i; j < s.length(); j++)
      if (pal(i, j) == 1 && j - i + 1 > best.length()) best = s.substring(i, j + 1);
  return best;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "babad", maxLen: 7 }],
  entry: (a) => `longestPalindrome()  // s="${a.s}"`,
  run({ fn, memo, line, vars, narrate }, args) {
    const s = args.s as string
    const pal = fn(
      "pal",
      (i: number, j: number): number => {
        line(2, `pal(${i},${j}): window of ≤ 1 char? (${i >= j ? "<b>yes — trivially a palindrome</b>" : "no"})`)
        if (i >= j) return 1
        const key = i + "," + j
        line(4, `pal(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `ends '${s[i]}' vs '${s[j]}': ${s[i] === s[j] ? "<b>equal → palindrome iff the inside is</b>" : "<b>differ → not a palindrome</b>"}.`)
        memo[key] = s[i] === s[j] ? pal(i + 1, j - 1) : 0
        line(6, `pal(${i},${j}) = <b>${memo[key]}</b>  ("${s.slice(i, j + 1)}").`)
        return memo[key] as number
      },
      1,
    )
    const longestPalindrome = fn(
      "longestPalindrome",
      (): string => {
        let best = ""
        for (let i = 0; i < s.length; i++)
          for (let j = i; j < s.length; j++) {
            line(12, `driver: test window s[${i}..${j}] = "${s.slice(i, j + 1)}"…`)
            if (pal(i, j) && j - i + 1 > best.length) {
              best = s.slice(i, j + 1)
              line(12, `new champion: "<b>${best}</b>" (length ${best.length}).`)
              vars({ i, j, best })
            }
          }
        line(13, `longest palindromic substring: "<b>${best}</b>".`)
        return best
      },
      8,
    )
    narrate("Substrings must be contiguous, so the state is a window (i,j): a window is a palindrome iff its ends match AND its inside already was.")
    return longestPalindrome()
  },
}
