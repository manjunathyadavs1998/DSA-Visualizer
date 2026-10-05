import type { SolutionDef } from "@/engine/types"

export const permutationInString: SolutionDef = {
  view: "array",
  array: (a) => (a.s2 as string).split(""),
  code: `// does s2 contain a permutation of s1?
function checkInclusion(s1, s2) {
  const k = s1.length;
  for (const c of s1) memo[c] = (memo[c] || 0) + 1;
  for (let right = 0; right < s2.length; right++) {
    memo[s2[right]] = (memo[s2[right]] || 0) - 1; // take in
    if (right >= k) memo[s2[right - k]] += 1;     // drop out
    if (right >= k - 1 && allZero(memo)) return true;
  }
  return false;
}`,
  codeJava: `// does s2 contain a permutation of s1?
boolean checkInclusion(String s1, String s2) {
  int k = s1.length();                  // int[26] need
  for (char c : s1.toCharArray()) need[c - 'a']++;
  for (int right = 0; right < s2.length(); right++) {
    need[s2.charAt(right) - 'a']--;           // take in
    if (right >= k) need[s2.charAt(right - k) - 'a']++;
    if (right >= k - 1 && allZero(need)) return true;
  }
  return false;
}`,
  inputs: [
    { kind: "string", name: "s1", label: "pattern s1", default: "ab", maxLen: 4 },
    { kind: "string", name: "s2", label: "text s2", default: "eidbaooo", maxLen: 14 },
  ],
  entry: (a) => `checkInclusion("${a.s1}", "${a.s2}")`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const s1 = args.s1 as string
    const s2 = args.s2 as string
    const go = fn(
      "checkInclusion",
      (): boolean => {
        const k = s1.length
        const need: Record<string, number> = {}
        for (const c of s1) need[c] = (need[c] || 0) + 1
        for (const [c, n] of Object.entries(need)) memo[c] = n
        line(3, `Need the letter counts of "${s1}" — a window of length ${k} matches when every need is <b>0</b>.`)
        for (let right = 0; right < s2.length; right++) {
          const c = s2[right]
          ptr("right", right)
          mark("focus", [right])
          need[c] = (need[c] || 0) - 1
          memo[c] = need[c]
          line(5, `Take '${c}' in → need['${c}'] = ${need[c]} (negative = surplus letter).`)
          if (right >= k) {
            const d = s2[right - k]
            need[d] = (need[d] || 0) + 1
            memo[d] = need[d]
            line(6, `'${d}' slid out → need['${d}'] = ${need[d]}.`)
          }
          const left = Math.max(0, right - k + 1)
          ptr("left", left)
          mark("window", Array.from({ length: right - left + 1 }, (_, x) => left + x))
          if (right >= k - 1) {
            const ok = Object.values(need).every((v) => v === 0)
            if (ok) {
              mark("focus", [])
              mark("window", [])
              mark("good", Array.from({ length: k }, (_, x) => left + x))
              line(7, `Every need is zero — "${s2.slice(left, right + 1)}" is a permutation of "${s1}" → <b>true</b>.`)
              return true
            }
            line(7, `Counts not balanced yet — slide on.`)
          }
          vars({ right, window: `"${s2.slice(left, right + 1)}"` })
        }
        mark("focus", [])
        mark("window", [])
        line(9, `No window of length ${k} ever balanced the counts → <b>false</b>.`)
        return false
      },
      1,
    )
    return go()
  },
}
