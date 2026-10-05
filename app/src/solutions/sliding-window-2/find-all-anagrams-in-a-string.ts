import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const findAllAnagramsInAString: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// all start indices of p's anagrams inside s
function findAnagrams(s, p) {
  const k = p.length, res = [];
  const need = new Map(); let missing = k;
  for (const c of p) need.set(c, (need.get(c) || 0) + 1);
  for (let right = 0; right < s.length; right++) {
    if ((need.get(s[right]) || 0) > 0) missing--;
    need.set(s[right], (need.get(s[right]) || 0) - 1);
    if (right >= k) {                 // slide: s[right-k] leaves
      need.set(s[right - k], need.get(s[right - k]) + 1);
      if (need.get(s[right - k]) > 0) missing++;
    }
    if (missing === 0) res.push(right - k + 1);
  }
  return res;
}`,
  codeJava: `// all start indices of p's anagrams inside s
List<Integer> findAnagrams(String s, String p) {
  int k = p.length(); List<Integer> res = new ArrayList<>();
  Map<Character, Integer> need = new HashMap<>(); int missing = k;
  for (char c : p.toCharArray()) need.merge(c, 1, Integer::sum);
  for (int right = 0; right < s.length(); right++) {
    if (need.getOrDefault(s.charAt(right), 0) > 0) missing--;
    need.merge(s.charAt(right), -1, Integer::sum);
    if (right >= k) {                 // slide: s[right-k] leaves
      need.merge(s.charAt(right - k), 1, Integer::sum);
      if (need.get(s.charAt(right - k)) > 0) missing++;
    }
    if (missing == 0) res.add(right - k + 1);
  }
  return res;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "cbaebabacd", maxLen: 14 },
    { kind: "string", name: "p", label: "p", default: "abc", maxLen: 6 },
  ],
  entry: (a) => `findAnagrams("${a.s}", "${a.p}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const p = (args.p as string) || "abc"
    const go = fn(
      "findAnagrams",
      (): string => {
        const k = p.length
        const res: number[] = []
        const need = new Map<string, number>()
        let missing = k
        for (const c of p) need.set(c, (need.get(c) || 0) + 1)
        heap("need", Object.fromEntries(need))
        heap("res", res)
        line(4, `p = "${p}" needs ${[...need].map(([c, n]) => `${c}×${n}`).join(", ")} — a fixed window of size <b>${k}</b> slides over s.`)
        for (let right = 0; right < s.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          const chIn = s[right]
          if ((need.get(chIn) || 0) > 0) {
            missing--
            line(6, `'${chIn}' enters and was needed → missing = <b>${missing}</b>.`)
          } else {
            line(6, `'${chIn}' enters but is surplus (need['${chIn}'] = ${need.get(chIn) || 0}) — missing stays ${missing}.`)
          }
          need.set(chIn, (need.get(chIn) || 0) - 1)
          heap("need", Object.fromEntries(need))
          if (right >= k) {
            const chOut = s[right - k]
            need.set(chOut, (need.get(chOut) || 0) + 1)
            heap("need", Object.fromEntries(need))
            if ((need.get(chOut) || 0) > 0) {
              missing++
              line(10, `'${chOut}' at index ${right - k} slides out — it was required, so missing = <b>${missing}</b>.`)
            } else {
              line(10, `'${chOut}' at index ${right - k} slides out — it was surplus, missing stays ${missing}.`)
            }
          }
          const start = Math.max(0, right - k + 1)
          ptr("left", start)
          mark("window", win(start, right))
          if (missing === 0) {
            res.push(right - k + 1)
            heap("res", res)
            mark("good", res.flatMap((st) => win(st, st + k - 1)))
            line(12, `missing = 0 → window [${right - k + 1}..${right}] = "${s.slice(right - k + 1, right + 1)}" is an <b>anagram of "${p}"</b>! res = [${res.join(", ")}].`)
          } else {
            line(12, `missing = ${missing} — window "${s.slice(start, right + 1)}" is not an anagram yet.`)
          }
          vars({ right, missing, res: `[${res.join(",")}]` })
        }
        mark("focus", [])
        mark("window", [])
        line(14, `Every window of size ${k} was checked in O(1) each → starts at [<b>${res.join(", ")}</b>].`)
        return `[${res.join(",")}]`
      },
      1,
    )
    return go()
  },
}
