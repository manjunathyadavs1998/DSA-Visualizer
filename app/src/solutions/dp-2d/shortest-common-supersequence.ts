import type { SolutionDef } from "@/engine/types"

export const shortestCommonSupersequence: SolutionDef = {
  code: `// scs(i,j) = shortest string containing both a[i..] and b[j..]
function scs(i, j) {
  if (i === a.length) return b.length - j;
  if (j === b.length) return a.length - i;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = 1 + scs(i + 1, j + 1);
  else
    memo[key] = 1 + Math.min(scs(i + 1, j), scs(i, j + 1));
  return memo[key];
}`,
  codeJava: `// scs(i,j) = shortest string containing both a[i..] and b[j..]
int scs(int i, int j) {
  if (i == a.length()) return b.length() - j;
  if (j == b.length()) return a.length() - i;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a.charAt(i) == b.charAt(j))
    memo.put(key, 1 + scs(i + 1, j + 1));
  else
    memo.put(key, 1 + Math.min(scs(i + 1, j), scs(i, j + 1)));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "a", label: "str1", default: "abac", maxLen: 7 },
    { kind: "string", name: "b", label: "str2", default: "cab", maxLen: 7 },
  ],
  entry: (a) => `scs(0, 0)  // a="${a.a}", b="${a.b}"`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const scs = fn(
      "scs",
      (i: number, j: number): number => {
        line(2, `scs(${i},${j}): a exhausted? (${i === a.length ? `<b>yes — just append b's last ${b.length - j} char(s)</b>` : "no"})`)
        if (i === a.length) return b.length - j
        line(3, `scs(${i},${j}): b exhausted? (${j === b.length ? `<b>yes — just append a's last ${a.length - i} char(s)</b>` : "no"})`)
        if (j === b.length) return a.length - i
        const key = i + "," + j
        line(5, `scs(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(7, `'${a[i]}' == '${b[j]}' → write it <b>once</b>, it serves both strings.`)
          memo[key] = 1 + scs(i + 1, j + 1)
        } else {
          line(9, `'${a[i]}' ≠ '${b[j]}' → one char must be written now: emit a[${i}] or b[${j}], keep the shorter future.`)
          memo[key] = 1 + Math.min(scs(i + 1, j), scs(i, j + 1))
        }
        line(10, `scs(${i},${j}) = <b>${memo[key]}</b> chars.`)
        return memo[key] as number
      },
      1,
    )
    narrate("The mirror image of LCS: shared chars are written once (len = n + m − LCS). Walk the finished memo table to reconstruct the actual string.")
    return scs(0, 0)
  },
}
