import type { SolutionDef } from "@/engine/types"

export const isSubsequence: SolutionDef = {
  view: "array",
  // show s and t side by side: [ s… | t… ]
  array: (a) => [...(a.s as string), "|", ...(a.t as string)],
  code: `// scan t once; advance i in s only on a match
function isSubsequence(s, t) {
  let i = 0;                      // next char of s we still need
  for (let j = 0; j < t.length; j++) {
    if (i < s.length && s[i] === t[j]) {
      i++;                        // matched — now hunt the next one
    }
  }
  return i === s.length;          // did we consume all of s?
}`,
  codeJava: `// scan t once; advance i in s only on a match
boolean isSubsequence(String s, String t) {
  int i = 0;                      // next char of s we still need
  for (int j = 0; j < t.length(); j++) {
    if (i < s.length() && s.charAt(i) == t.charAt(j)) {
      i++;                        // matched — now hunt the next one
    }
  }
  return i == s.length();         // did we consume all of s?
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (pattern)", default: "abcabc", maxLen: 8 },
    { kind: "string", name: "t", label: "t (text)", default: "ahbgdcahbgdc", maxLen: 14 },
  ],
  entry: (a) => `isSubsequence("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const t = args.t as string
    const off = s.length + 1 // t starts after the "|" separator in the display
    const go = fn(
      "isSubsequence",
      (): boolean => {
        let i = 0
        ptr("i", s.length > 0 ? 0 : -1)
        line(2, `i = 0: we need "<b>${s[0] ?? "(nothing — s is empty)"}</b>" next. The cells left of | are s, right of | are t.`)
        for (let j = 0; j < t.length; j++) {
          ptr("j", off + j)
          mark("focus", [off + j])
          line(3, `j = ${j}: compare t[${j}] = '${t[j]}' against the char we need${i < s.length ? `, s[${i}] = '${s[i]}'` : " (none — s done)"}.`)
          if (i < s.length && s[i] === t[j]) {
            mark("good", [...Array.from({ length: i + 1 }, (_, x) => x), ...[off + j]])
            line(5, `t[${j}] = '<b>${t[j]}</b>' matches s[${i}] — lock it in; now hunting '${s[i + 1] ?? "∅ (done!)"}'.`)
            i++
            ptr("i", i < s.length ? i : -1)
          } else if (i < s.length) {
            mark("bad", [off + j])
            line(4, `t[${j}] = '${t[j]}' ≠ s[${i}] = '${s[i]}' — skip it; subsequence chars needn't be adjacent.`)
          } else {
            line(4, `s is fully matched already — the rest of t doesn't matter.`)
          }
          vars({ i, j, need: i < s.length ? `'${s[i]}'` : "—" })
        }
        mark("focus", [])
        mark("bad", [])
        const ok = i === s.length
        line(8, `Matched <b>${i}</b> of ${s.length} chars of s → ${ok ? "<b>true</b>: s is a subsequence of t" : "<b>false</b>: t ran out first"}.`)
        return ok
      },
      1,
    )
    return go()
  },
}
