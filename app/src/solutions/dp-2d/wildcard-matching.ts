import type { SolutionDef } from "@/engine/types"

export const wildcardMatching: SolutionDef = {
  code: `// s = text, p = pattern ('?' one char, '*' any sequence)
function isMatch(i, j) {
  if (j === p.length) return i === s.length;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (p[j] === "*")
    memo[key] = isMatch(i, j + 1) || (i < s.length && isMatch(i + 1, j));
  else
    memo[key] = i < s.length && (p[j] === s[i] || p[j] === "?") && isMatch(i + 1, j + 1);
  return memo[key];
}`,
  codeJava: `// String s = text, p = pattern ('?' one char, '*' any sequence)
boolean isMatch(int i, int j) {
  if (j == p.length()) return i == s.length();
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (p.charAt(j) == '*')
    memo.put(key, isMatch(i, j + 1) || (i < s.length() && isMatch(i + 1, j)));
  else
    memo.put(key, i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '?') && isMatch(i + 1, j + 1));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (text)", default: "adceb", maxLen: 7 },
    { kind: "string", name: "p", label: "p (pattern)", default: "*a*b", maxLen: 7 },
  ],
  entry: (a) => `isMatch(0, 0)  // s="${a.s}", p="${a.p}"`,
  run({ fn, memo, line, narrate }, args) {
    const s = args.s as string
    // consecutive '*'s are equivalent to one — collapse them so the state space stays tight
    const p = (args.p as string).replace(/\*{2,}/g, "*")
    const isMatch = fn(
      "isMatch",
      (i: number, j: number): boolean => {
        line(2, `isMatch(${i},${j}): pattern used up? (${j === p.length ? `<b>yes — text ${i === s.length ? "too → true" : "left over → false"}</b>` : "no"})`)
        if (j === p.length) return i === s.length
        const key = i + "," + j
        line(4, `isMatch(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as boolean
        if (p[j] === "*") {
          line(6, `p[${j}]='*' → it swallows <b>nothing</b> (j→${j + 1}) or <b>one more char</b> '${i < s.length ? s[i] : "∅"}' (i→${i + 1}).`)
          memo[key] = isMatch(i, j + 1) || (i < s.length && isMatch(i + 1, j))
        } else {
          const ok = i < s.length && (p[j] === s[i] || p[j] === "?")
          line(8, `p[${j}]='${p[j]}' vs s[${i}]=${i < s.length ? `'${s[i]}'` : "∅"} → ${ok ? "<b>match</b>, consume both" : "<b>mismatch — fail</b>"}.`)
          memo[key] = ok && isMatch(i + 1, j + 1)
        }
        line(9, `isMatch(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as boolean
      },
      1,
    )
    narrate("'*' is a fork, not a loop: swallow nothing and move the pattern, or swallow one char and stay — the memo stops the blow-up.")
    return isMatch(0, 0)
  },
}
