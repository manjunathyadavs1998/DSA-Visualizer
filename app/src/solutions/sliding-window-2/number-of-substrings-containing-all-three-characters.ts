import type { SolutionDef } from "@/engine/types"

const clean = (s: string) =>
  s.toLowerCase().split("").map((c, i) => ("abc".includes(c) ? c : "abc"[i % 3])).join("")

export const numberOfSubstringsContainingAllThreeCharacters: SolutionDef = {
  view: "array",
  array: (a) => clean(a.s as string).split(""),
  code: `// substrings ending at right: 1 + min(last a, last b, last c)
function numberOfSubstrings(s) {
  let la = -1, lb = -1, lc = -1, count = 0;
  for (let right = 0; right < s.length; right++) {
    if (s[right] === 'a') la = right;
    else if (s[right] === 'b') lb = right;
    else lc = right;
    count += 1 + Math.min(la, lb, lc);  // every start <= min works
  }
  return count;
}`,
  codeJava: `// substrings ending at right: 1 + min(last a, last b, last c)
int numberOfSubstrings(String s) {
  int la = -1, lb = -1, lc = -1, count = 0;
  for (int right = 0; right < s.length(); right++) {
    if (s.charAt(right) == 'a') la = right;
    else if (s.charAt(right) == 'b') lb = right;
    else lc = right;
    count += 1 + Math.min(la, Math.min(lb, lc));
  }
  return count;
}`,
  inputs: [{ kind: "string", name: "s", label: "s (a/b/c)", default: "aabcbcabc", maxLen: 14 }],
  entry: (a) => `numberOfSubstrings("${clean(a.s as string)}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = clean(args.s as string)
    const go = fn(
      "numberOfSubstrings",
      (): number => {
        let la = -1
        let lb = -1
        let lc = -1
        let count = 0
        line(2, `Track the <b>last index</b> of each letter. A substring ending at right is valid iff it starts at or before min(la, lb, lc).`)
        for (let right = 0; right < s.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          if (s[right] === "a") {
            la = right
            line(4, `'a' at ${right} → last a = <b>${la}</b>.`)
          } else if (s[right] === "b") {
            lb = right
            line(5, `'b' at ${right} → last b = <b>${lb}</b>.`)
          } else {
            lc = right
            line(6, `'c' at ${right} → last c = <b>${lc}</b>.`)
          }
          const m = Math.min(la, lb, lc)
          mark("window", m >= 0 ? Array.from({ length: right - m + 1 }, (_, i) => m + i) : [])
          ptr("minLast", m)
          count += 1 + m
          if (m >= 0) {
            line(7, `min(last a=${la}, b=${lb}, c=${lc}) = ${m} → <b>${m + 1}</b> valid starts (0..${m}) → count = <b>${count}</b>.`)
          } else {
            line(7, `Some letter is still unseen (min = −1) → +0. count = ${count}.`)
          }
          vars({ right, la, lb, lc, count })
        }
        mark("focus", [])
        mark("window", [])
        line(9, `Total substrings containing all of a, b, c: <b>${count}</b> — counted in one pass with no shrinking loop at all.`)
        return count
      },
      1,
    )
    return go()
  },
}
