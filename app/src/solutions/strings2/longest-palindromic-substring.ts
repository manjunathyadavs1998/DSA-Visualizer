import type { SolutionDef } from "@/engine/types"

export const longestPalindromicSubstring: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below (expand around center)
function longestPalindrome(s) {
  let best = "";
  for (let c = 0; c < s.length; c++) {
    for (const [l0, r0] of [[c, c], [c, c + 1]]) {
      let l = l0, r = r0;
      while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
      if (r - l - 1 > best.length) best = s.slice(l + 1, r);
    }
  }
  return best;
}`,
  codeJava: `// String s editable below (expand around center)
String longestPalindrome(String s) {
  String best = "";
  for (int c = 0; c < s.length(); c++) {
    for (int[] p : new int[][]{{c, c}, {c, c + 1}}) {
      int l = p[0], r = p[1];
      while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
      if (r - l - 1 > best.length()) best = s.substring(l + 1, r);
    }
  }
  return best;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "babad", maxLen: 12 }],
  entry: (a) => `longestPalindrome("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const go = fn(
      "longestPalindrome",
      (): string => {
        let best = ""
        let bestL = 0, bestR = -1
        line(2, `Every palindrome has a center — try all ${s.length} odd and ${Math.max(s.length - 1, 0)} even centers.`)
        for (let c = 0; c < s.length; c++) {
          for (const [l0, r0] of [[c, c], [c, c + 1]] as [number, number][]) {
            const kind = l0 === r0 ? "odd" : "even"
            let l = l0, r = r0
            ptr("l", l); ptr("r", Math.min(r, s.length - 1)); vars({ c, l, r, center: kind, best: `"${best}"` })
            if (kind === "odd") {
              line(5, `<b>Odd</b> center at index ${c} ('${s[c]}') — l and r both start there.`)
            } else {
              line(5, `<b>Even</b> center between ${c} and ${c + 1} — l = ${l}, r = ${r}.`)
            }
            if (kind === "even" && (r >= s.length || s[l] !== s[r])) {
              line(6, `s[${l}]='${s[l]}' ${r < s.length ? `≠ s[${r}]='${s[r]}'` : "has no right twin"} — no even palindrome here.`)
              continue
            }
            while (l >= 0 && r < s.length && s[l] === s[r]) {
              mark("window", Array.from({ length: r - l + 1 }, (_, x) => l + x))
              line(6, `s[${l}]='${s[l]}' equals s[${r}]='${s[r]}' — "<b>${s.slice(l, r + 1)}</b>" is a palindrome, expand outward.`)
              l--; r++
              ptr("l", Math.max(l, 0)); ptr("r", Math.min(r, s.length - 1))
            }
            if (l >= 0 && r < s.length) {
              line(6, `s[${l}]='${s[l]}' ≠ s[${r}]='${s[r]}' — expansion stops.`)
            }
            if (r - l - 1 > best.length) {
              best = s.slice(l + 1, r)
              bestL = l + 1; bestR = r - 1
              mark("good", Array.from({ length: bestR - bestL + 1 }, (_, x) => bestL + x))
              line(7, `"${best}" (length ${best.length}) beats the previous best — <b>new best!</b>`)
            }
            mark("window", [])
            vars({ c, l, r, best: `"${best}"` })
          }
        }
        mark("good", Array.from({ length: bestR - bestL + 1 }, (_, x) => bestL + x))
        line(10, `Longest palindromic substring: "<b>${best}</b>" (green).`)
        return best
      },
      1,
    )
    return go()
  },
}
