import type { SolutionDef } from "@/engine/types"

export const firstUniqueCharacterInAString: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// two passes: count all, then find the first count-1
function firstUniqChar(s) {
  for (const c of s) memo[c] = (memo[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (memo[s[i]] === 1) return i;
  }
  return -1;
}`,
  codeJava: `// two passes: count all, then find the first count-1
int firstUniqChar(String s) {
  for (char c : s.toCharArray()) memo.merge(c, 1, Integer::sum);
  for (int i = 0; i < s.length(); i++) {
    if (memo.get(s.charAt(i)) == 1) return i;
  }
  return -1;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "leetcode", maxLen: 14 }],
  entry: (a) => `firstUniqChar("${a.s}")`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const s = args.s as string
    const go = fn(
      "firstUniqChar",
      (): number => {
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          memo[c] = ((memo[c] as number) || 0) + 1
          line(2, `Pass 1: count '<b>${c}</b>' → ${memo[c]} occurrence${(memo[c] as number) > 1 ? "s" : ""} so far.`)
          vars({ i, c })
        }
        line(3, `Counts done. Pass 2: rescan <b>in order</b> — the first char whose count is exactly 1 wins.`)
        for (let i = 0; i < s.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (memo[s[i]] === 1) {
            mark("focus", [])
            mark("good", [i])
            line(4, `'${s[i]}' has count <b>1</b> — it is the first unique character → return index <b>${i}</b>.`)
            return i
          }
          line(4, `'${s[i]}' has count ${memo[s[i]]} — repeated, keep scanning.`)
          vars({ i })
        }
        mark("focus", [])
        line(6, `Every character repeats → return <b>-1</b>.`)
        return -1
      },
      1,
    )
    return go()
  },
}
