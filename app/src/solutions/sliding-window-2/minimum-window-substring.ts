import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const minimumWindowSubstring: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// smallest window of s containing all chars of t
function minWindow(s, t) {
  const need = new Map(); let missing = t.length;
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let left = 0, bestLen = Infinity, bestStart = 0;
  for (let right = 0; right < s.length; right++) {
    if ((need.get(s[right]) || 0) > 0) missing--;
    need.set(s[right], (need.get(s[right]) || 0) - 1);
    while (missing === 0) {           // window covers t
      if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
      need.set(s[left], need.get(s[left]) + 1);
      if (need.get(s[left]) > 0) missing++;
      left++;                         // shrink from the left
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}`,
  codeJava: `// smallest window of s containing all chars of t
String minWindow(String s, String t) {
  Map<Character, Integer> need = new HashMap<>(); int missing = t.length();
  for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
  int left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;
  for (int right = 0; right < s.length(); right++) {
    if (need.getOrDefault(s.charAt(right), 0) > 0) missing--;
    need.merge(s.charAt(right), -1, Integer::sum);
    while (missing == 0) {            // window covers t
      if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
      need.merge(s.charAt(left), 1, Integer::sum);
      if (need.get(s.charAt(left)) > 0) missing++;
      left++;                         // shrink from the left
    }
  }
  return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "ADOBECODEBANC", maxLen: 14 },
    { kind: "string", name: "t", label: "t", default: "ABC", maxLen: 6 },
  ],
  entry: (a) => `minWindow("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const t = (args.t as string) || "ABC"
    const go = fn(
      "minWindow",
      (): string => {
        const need = new Map<string, number>()
        let missing = t.length
        for (const c of t) need.set(c, (need.get(c) || 0) + 1)
        heap("need", Object.fromEntries(need))
        line(3, `Count what t needs: ${[...need].map(([c, n]) => `${c}×${n}`).join(", ")} — <b>${missing}</b> required chars missing.`)
        let left = 0
        let bestLen = Infinity
        let bestStart = 0
        ptr("left", 0)
        line(4, `left = 0, bestLen = ∞. Grow right until every char of "${t}" is covered, then shrink hard.`)
        for (let right = 0; right < s.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          const ch = s[right]
          if ((need.get(ch) || 0) > 0) {
            missing--
            line(6, `'${ch}' enters and is still needed → missing drops to <b>${missing}</b>.`)
          } else {
            line(6, `'${ch}' enters but is not needed (need['${ch}'] = ${need.get(ch) || 0}) — missing stays ${missing}.`)
          }
          need.set(ch, (need.get(ch) || 0) - 1)
          heap("need", Object.fromEntries(need))
          mark("window", win(left, right))
          while (missing === 0) {
            if (right - left + 1 < bestLen) {
              bestLen = right - left + 1
              bestStart = left
              line(9, `Window [${left}..${right}] = "${s.slice(left, right + 1)}" covers t — <b>new best, length ${bestLen}</b>!`)
            } else {
              line(9, `Window [${left}..${right}] still covers t (length ${right - left + 1}, best stays ${bestLen}).`)
            }
            const out = s[left]
            need.set(out, (need.get(out) || 0) + 1)
            heap("need", Object.fromEntries(need))
            if ((need.get(out) || 0) > 0) {
              missing++
              line(11, `Dropping '${out}' breaks coverage → missing = <b>${missing}</b>. Stop shrinking.`)
            } else {
              line(11, `'${out}' was surplus — coverage survives, keep shrinking.`)
            }
            left++
            ptr("left", left)
            mark("window", win(left, right))
            line(12, `left → ${left}.`)
          }
          vars({ left, right, missing, best: bestLen === Infinity ? "∞" : `"${s.slice(bestStart, bestStart + bestLen)}"` })
        }
        mark("focus", [])
        mark("window", [])
        if (bestLen === Infinity) {
          line(15, `No window ever covered "${t}" → return <b>""</b>.`)
          return ""
        }
        mark("good", win(bestStart, bestStart + bestLen - 1))
        line(15, `Smallest covering window: "<b>${s.slice(bestStart, bestStart + bestLen)}</b>" at [${bestStart}..${bestStart + bestLen - 1}]. One pass, each pointer moves ≤ n times.`)
        return s.slice(bestStart, bestStart + bestLen)
      },
      1,
    )
    return go()
  },
}
