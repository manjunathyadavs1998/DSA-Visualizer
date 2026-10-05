import type { SolutionDef } from "@/engine/types"

export const minimumInsertionStepsToMakeAStringPalindrome: SolutionDef = {
  code: `// ins(i,j) = fewest inserts to make s[i..j] a palindrome
function ins(i, j) {
  if (i >= j) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (s[i] === s[j])
    memo[key] = ins(i + 1, j - 1);
  else
    memo[key] = 1 + Math.min(ins(i + 1, j), ins(i, j - 1));
  return memo[key];
}`,
  codeJava: `// ins(i,j) = fewest inserts to make s[i..j] a palindrome
int ins(int i, int j) {
  if (i >= j) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (s.charAt(i) == s.charAt(j))
    memo.put(key, ins(i + 1, j - 1));
  else
    memo.put(key, 1 + Math.min(ins(i + 1, j), ins(i, j - 1)));
  return memo.get(key);
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "mbadm", maxLen: 7 }],
  entry: (a) => `ins(0, ${(a.s as string).length - 1})  // s="${a.s}"`,
  run({ fn, memo, line, narrate }, args) {
    const s = args.s as string
    const ins = fn(
      "ins",
      (i: number, j: number): number => {
        line(2, `ins(${i},${j}): window of ≤ 1 char? (${i >= j ? "<b>yes — already a palindrome, 0 inserts</b>" : "no"})`)
        if (i >= j) return 0
        const key = i + "," + j
        line(4, `ins(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (s[i] === s[j]) {
          line(6, `'${s[i]}' == '${s[j]}' → the ends already mirror, <b>fix only the inside</b>.`)
          memo[key] = ins(i + 1, j - 1)
        } else {
          line(8, `'${s[i]}' ≠ '${s[j]}' → <b>insert a mirror</b> for one end: copy '${s[i]}' after j, or '${s[j]}' before i.`)
          memo[key] = 1 + Math.min(ins(i + 1, j), ins(i, j - 1))
        }
        line(9, `ins(${i},${j}) = <b>${memo[key]}</b> insert(s)  ("${s.slice(i, j + 1)}").`)
        return memo[key] as number
      },
      1,
    )
    narrate("Mirror the LPS insight: chars already in a palindromic subsequence stay; every other char needs one inserted twin. Answer = n − LPS(s).")
    return ins(0, s.length - 1)
  },
}
