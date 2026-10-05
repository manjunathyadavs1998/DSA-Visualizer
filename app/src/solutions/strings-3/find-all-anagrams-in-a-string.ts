import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const findAllAnagramsInAString: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string).split(""), "|", ...(a.p as string).split("")],
  code: `// slide a window of |p| over s; counts cancel to zero
function findAnagrams(s, p) {
  if (p.length > s.length) return [];
  const need = {};
  for (const c of p) need[c] = (need[c] || 0) + 1;
  let missing = p.length;
  const res = [];
  for (let r = 0; r < s.length; r++) {
    if ((need[s[r]] || 0) > 0) missing--;   // useful char
    need[s[r]] = (need[s[r]] || 0) - 1;
    if (r >= p.length) {                    // slide: drop l = r - |p|
      const l = r - p.length;
      need[s[l]] = (need[s[l]] || 0) + 1;
      if (need[s[l]] > 0) missing++;        // we lost a needed char
    }
    if (missing === 0) res.push(r - p.length + 1);
  }
  return res;
}`,
  codeJava: `// slide a window of |p| over s; counts cancel to zero
List<Integer> findAnagrams(String s, String p) {
  if (p.length() > s.length()) return new ArrayList<>();
  Map<Character, Integer> need = new HashMap<>();
  for (char c : p.toCharArray()) need.merge(c, 1, Integer::sum);
  int missing = p.length();
  List<Integer> res = new ArrayList<>();
  for (int r = 0; r < s.length(); r++) {
    if (need.getOrDefault(s.charAt(r), 0) > 0) missing--; // useful
    need.merge(s.charAt(r), -1, Integer::sum);
    if (r >= p.length()) {                  // slide: drop l = r - |p|
      int l = r - p.length();
      need.merge(s.charAt(l), 1, Integer::sum);
      if (need.get(s.charAt(l)) > 0) missing++; // lost a needed char
    }
    if (missing == 0) res.add(r - p.length() + 1);
  }
  return res;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "cbaebabacd", maxLen: 12 },
    { kind: "string", name: "p", label: "p", default: "abc", maxLen: 4 },
  ],
  entry: (a) => `findAnagrams("${a.s}", "${a.p}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const p = args.p as string
    const go = fn(
      "findAnagrams",
      (): string => {
        if (p.length > s.length) {
          line(2, `p is longer than s — no window can hold an anagram → [].`)
          return "[]"
        }
        const need: Record<string, number> = {}
        for (const c of p) need[c] = (need[c] || 0) + 1
        heap("need", { ...need })
        line(4, `Count p's letters: ${JSON.stringify(need)}. A window is an anagram when all these counts cancel to 0.`)
        let missing = p.length
        const res: number[] = []
        heap("res", [...res])
        line(5, `missing = <b>${missing}</b> — how many useful characters the window still lacks.`)
        const found: number[] = []
        for (let r = 0; r < s.length; r++) {
          ptr("r", r)
          mark("focus", [r])
          const useful = (need[s[r]] || 0) > 0
          if (useful) missing--
          need[s[r]] = (need[s[r]] || 0) - 1
          heap("need", { ...need })
          line(9, useful ? `s[${r}] = '<b>${s[r]}</b>' was still needed → missing = <b>${missing}</b>.` : `s[${r}] = '${s[r]}' is surplus (need['${s[r]}'] goes to ${need[s[r]]}) — missing stays ${missing}.`)
          if (r >= p.length) {
            const l = r - p.length
            need[s[l]] = (need[s[l]] || 0) + 1
            heap("need", { ...need })
            if (need[s[l]] > 0) {
              missing++
              line(13, `Slide: drop s[${l}] = '<b>${s[l]}</b>' — it was needed, so missing = <b>${missing}</b>.`)
            } else {
              line(13, `Slide: drop s[${l}] = '${s[l]}' — it was surplus, missing stays ${missing}.`)
            }
          }
          const l0 = Math.max(0, r - p.length + 1)
          mark("window", rng(l0, r))
          if (missing === 0) {
            res.push(r - p.length + 1)
            heap("res", [...res])
            found.push(...rng(r - p.length + 1, r))
            mark("good", [...found])
            line(15, `missing = 0 → window s[${r - p.length + 1}..${r}] = "<b>${s.slice(r - p.length + 1, r + 1)}</b>" is an anagram of "${p}" — record index <b>${r - p.length + 1}</b>.`)
          }
          vars({ r, missing, res: `[${res.join(",")}]` })
        }
        mark("focus", [])
        mark("window", [])
        line(17, `All windows checked in one O(n) pass → starts at <b>[${res.join(", ")}]</b>.`)
        return JSON.stringify(res)
      },
      1,
    )
    return go()
  },
}
