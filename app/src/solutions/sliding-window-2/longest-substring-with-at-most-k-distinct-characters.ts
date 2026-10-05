import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const longestSubstringWithAtMostKDistinctCharacters: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// longest substring using at most k distinct characters
function lengthOfLongestSubstringKDistinct(s, k) {
  const count = new Map();    // char -> count in window
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);
    while (count.size > k) {          // too many kinds: shrink
      count.set(s[left], count.get(s[left]) - 1);
      if (count.get(s[left]) === 0) count.delete(s[left]);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// longest substring using at most k distinct characters
int lengthOfLongestSubstringKDistinct(String s, int k) {
  Map<Character, Integer> count = new HashMap<>();
  int left = 0, best = 0;
  for (int right = 0; right < s.length(); right++) {
    count.merge(s.charAt(right), 1, Integer::sum);
    while (count.size() > k) {        // too many kinds: shrink
      count.merge(s.charAt(left), -1, Integer::sum);
      if (count.get(s.charAt(left)) == 0) count.remove(s.charAt(left));
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "aabacbebebe", maxLen: 14 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 14 },
  ],
  entry: (a) => `lengthOfLongestSubstringKDistinct("${a.s}", ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const k = Math.max(1, Math.trunc(args.k as number))
    const go = fn(
      "lengthOfLongestSubstringKDistinct",
      (): number => {
        const count = new Map<string, number>()
        let left = 0
        let best = 0
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(3, `Grow the window; the moment it holds <b>${k + 1}</b> distinct chars, shrink until one kind dies out.`)
        for (let right = 0; right < s.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          count.set(s[right], (count.get(s[right]) || 0) + 1)
          heap("count", Object.fromEntries(count))
          mark("window", win(left, right))
          line(5, `'${s[right]}' enters → {${[...count].map(([c, n]) => `${c}:${n}`).join(", ")}} (${count.size} distinct).`)
          while (count.size > k) {
            line(6, `${count.size} distinct > k = ${k} — shrink.`)
            count.set(s[left], (count.get(s[left]) || 0) - 1)
            if (count.get(s[left]) === 0) {
              count.delete(s[left])
              line(8, `Drop '${s[left]}' at ${left} — its count hits 0, so '<b>${s[left]}</b>' vanishes from the window.`)
            } else {
              line(8, `Drop '${s[left]}' at ${left} — ${count.get(s[left])} cop${count.get(s[left]) === 1 ? "y" : "ies"} remain.`)
            }
            heap("count", Object.fromEntries(count))
            left++
            ptr("left", left)
            mark("window", win(left, right))
            line(9, `left → ${left}.`)
          }
          if (right - left + 1 > best) {
            best = right - left + 1
            bestRange = [left, right]
            line(11, `Window "${s.slice(left, right + 1)}" has ${count.size} distinct, length <b>${best}</b> — new best!`)
          } else {
            line(11, `Window length ${right - left + 1} — best stays ${best}.`)
          }
          vars({ left, right, best, distinct: count.size })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestRange[0], bestRange[1]))
        line(13, `Longest ≤${k}-distinct substring: "<b>${s.slice(bestRange[0], bestRange[1] + 1)}</b>" (length ${best}).`)
        return best
      },
      1,
    )
    return go()
  },
}
