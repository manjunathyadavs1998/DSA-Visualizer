import type { SolutionDef } from "@/engine/types"

export const deleteOperationForTwoStrings: SolutionDef = {
  code: `// del(i,j) = fewest deletions to make a[i..] and b[j..] equal
function del(i, j) {
  if (i === a.length) return b.length - j;
  if (j === b.length) return a.length - i;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = del(i + 1, j + 1);
  else
    memo[key] = 1 + Math.min(del(i + 1, j), del(i, j + 1));
  return memo[key];
}`,
  codeJava: `// del(i,j) = fewest deletions to make a[i..] and b[j..] equal
int del(int i, int j) {
  if (i == a.length()) return b.length() - j;
  if (j == b.length()) return a.length() - i;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a.charAt(i) == b.charAt(j))
    memo.put(key, del(i + 1, j + 1));
  else
    memo.put(key, 1 + Math.min(del(i + 1, j), del(i, j + 1)));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "a", label: "word1", default: "sea", maxLen: 7 },
    { kind: "string", name: "b", label: "word2", default: "eat", maxLen: 7 },
  ],
  entry: (a) => `del(0, 0)  // a="${a.a}", b="${a.b}"`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const del = fn(
      "del",
      (i: number, j: number): number => {
        line(2, `del(${i},${j}): a exhausted? (${i === a.length ? `<b>yes — delete b's remaining ${b.length - j} char(s)</b>` : "no"})`)
        if (i === a.length) return b.length - j
        line(3, `del(${i},${j}): b exhausted? (${j === b.length ? `<b>yes — delete a's remaining ${a.length - i} char(s)</b>` : "no"})`)
        if (j === b.length) return a.length - i
        const key = i + "," + j
        line(5, `del(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(7, `'${a[i]}' == '${b[j]}' → <b>both survive free</b>, advance both pointers.`)
          memo[key] = del(i + 1, j + 1)
        } else {
          line(9, `'${a[i]}' ≠ '${b[j]}' → <b>someone must die</b>: pay 1 to delete a[${i}] or b[${j}], keep the cheaper future.`)
          memo[key] = 1 + Math.min(del(i + 1, j), del(i, j + 1))
        }
        line(10, `del(${i},${j}) = <b>${memo[key]}</b> deletion(s).`)
        return memo[key] as number
      },
      1,
    )
    narrate("Edit Distance with only deletes — equivalently len(a)+len(b) − 2·LCS: everything outside the common subsequence must go.")
    return del(0, 0)
  },
}
