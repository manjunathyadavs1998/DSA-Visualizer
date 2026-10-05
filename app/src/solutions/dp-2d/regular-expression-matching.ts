import type { SolutionDef } from "@/engine/types"

export const regularExpressionMatching: SolutionDef = {
  code: `// s = text, p = pattern ('.' any char, '*' zero+ of prev)
function isMatch(i, j) {
  if (j === p.length) return i === s.length;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  const first = i < s.length && (p[j] === s[i] || p[j] === ".");
  if (j + 1 < p.length && p[j + 1] === "*")
    memo[key] = isMatch(i, j + 2) || (first && isMatch(i + 1, j));
  else
    memo[key] = first && isMatch(i + 1, j + 1);
  return memo[key];
}`,
  codeJava: `// String s = text, p = pattern ('.' any char, '*' zero+ of prev)
boolean isMatch(int i, int j) {
  if (j == p.length()) return i == s.length();
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
  if (j + 1 < p.length() && p.charAt(j + 1) == '*')
    memo.put(key, isMatch(i, j + 2) || (first && isMatch(i + 1, j)));
  else
    memo.put(key, first && isMatch(i + 1, j + 1));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (text)", default: "aab", maxLen: 7 },
    { kind: "string", name: "p", label: "p (pattern)", default: "c*a*b", maxLen: 7 },
  ],
  entry: (a) => `isMatch(0, 0)  // s="${a.s}", p="${a.p}"`,
  run({ fn, memo, line, vars, narrate }, args) {
    const s = args.s as string
    // a leading '*' or a '**' run has no preceding token — strip to keep the pattern well-formed
    const p = (args.p as string).replace(/^\*+/, "").replace(/\*{2,}/g, "*")
    const isMatch = fn(
      "isMatch",
      (i: number, j: number): boolean => {
        line(2, `isMatch(${i},${j}): pattern used up? (${j === p.length ? `<b>yes — text ${i === s.length ? "too" : "NOT"} used up → ${i === s.length}</b>` : "no"})`)
        if (j === p.length) return i === s.length
        const key = i + "," + j
        line(4, `isMatch(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as boolean
        const first = i < s.length && (p[j] === s[i] || p[j] === ".")
        line(5, `first: does p[${j}]='${p[j]}' match s[${i}]=${i < s.length ? `'${s[i]}'` : "∅ (text done)"}? → <b>${first}</b>`)
        vars({ i, j, first })
        if (j + 1 < p.length && p[j + 1] === "*") {
          line(7, `p[${j + 1}]='*' → '${p[j]}*' can match <b>zero</b> (skip to j=${j + 2}) or <b>one more</b> '${p[j]}' (i→${i + 1}).`)
          memo[key] = isMatch(i, j + 2) || (first && isMatch(i + 1, j))
        } else {
          line(9, `no '*' follows → must consume one char: first=${first}${first ? " → recurse (i+1, j+1)" : " → <b>fail</b>"}.`)
          memo[key] = first && isMatch(i + 1, j + 1)
        }
        line(10, `isMatch(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as boolean
      },
      1,
    )
    narrate("The whole problem is the '*' branch: 'x*' either matches zero chars (jump the pattern) or eats one more x (advance the text).")
    return isMatch(0, 0)
  },
}
