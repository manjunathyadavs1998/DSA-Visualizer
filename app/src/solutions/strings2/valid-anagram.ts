import type { SolutionDef } from "@/engine/types"

export const validAnagram: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string).split(""), "|", ...(a.t as string).split("")],
  code: `// s and t are editable below
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  for (const c of s) memo[c] = (memo[c] || 0) + 1;
  for (const c of t) {
    memo[c] = (memo[c] || 0) - 1;
    if (memo[c] < 0) return false;  // t has an extra c
  }
  return true;                      // every count balanced to 0
}`,
  codeJava: `// String s and t editable below
boolean isAnagram(String s, String t) {
  if (s.length() != t.length()) return false;
  for (char c : s.toCharArray()) memo.merge(c, 1, Integer::sum);
  for (char c : t.toCharArray()) {
    memo.merge(c, -1, Integer::sum);
    if (memo.get(c) < 0) return false; // t has an extra c
  }
  return true;                     // every count balanced to 0
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "listen", maxLen: 6 },
    { kind: "string", name: "t", label: "t", default: "silent", maxLen: 6 },
  ],
  entry: (a) => `isAnagram("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const s = args.s as string
    const t = args.t as string
    const go = fn(
      "isAnagram",
      (): boolean => {
        if (s.length !== t.length) {
          line(2, `Lengths differ (${s.length} vs ${t.length}) — they can't be anagrams.`)
          return false
        }
        line(2, `Same length (${s.length}) — now count letters: <b>+1</b> for each char of s, <b>−1</b> for each char of t.`)
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i); mark("focus", [i])
          memo[c] = ((memo[c] as number) || 0) + 1
          line(3, `'${c}' from s → count['${c}'] rises to <b>${memo[c]}</b>.`)
          vars({ i, c })
        }
        const off = s.length + 1
        for (let i = 0; i < t.length; i++) {
          const c = t[i]
          ptr("i", off + i); mark("focus", [off + i])
          memo[c] = ((memo[c] as number) || 0) - 1
          if ((memo[c] as number) < 0) {
            mark("bad", [off + i]); mark("focus", [])
            line(6, `'${c}' from t drops count['${c}'] to <b>${memo[c]} — negative!</b> t uses '${c}' more often than s → <b>not an anagram</b>.`)
            return false
          }
          line(5, `'${c}' from t → count['${c}'] falls to <b>${memo[c]}</b>.`)
          vars({ i, c })
        }
        mark("focus", [])
        mark("good", Array.from({ length: off + t.length }, (_, x) => x).filter((x) => x !== s.length))
        line(8, `Same length and no count ever went negative — every count is exactly 0. <b>Anagram!</b>`)
        return true
      },
      1,
    )
    return go()
  },
}
