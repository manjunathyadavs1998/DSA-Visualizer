import type { SolutionDef } from "@/engine/types"

export const mergeStringsAlternately: SolutionDef = {
  view: "array",
  array: (a) => [...(a.word1 as string).split(""), "|", ...(a.word2 as string).split("")],
  code: `// take one char from each in turn; drain the leftover
function mergeAlternately(word1, word2) {
  let out = "", i = 0, j = 0;
  while (i < word1.length || j < word2.length) {
    if (i < word1.length) out += word1[i++];
    if (j < word2.length) out += word2[j++];
  }
  return out;
}`,
  codeJava: `// take one char from each in turn; drain the leftover
String mergeAlternately(String word1, String word2) {
  StringBuilder out = new StringBuilder(); int i = 0, j = 0;
  while (i < word1.length() || j < word2.length()) {
    if (i < word1.length()) out.append(word1.charAt(i++));
    if (j < word2.length()) out.append(word2.charAt(j++));
  }
  return out.toString();
}`,
  inputs: [
    { kind: "string", name: "word1", label: "word1", default: "abc", maxLen: 6 },
    { kind: "string", name: "word2", label: "word2", default: "pqrst", maxLen: 6 },
  ],
  entry: (a) => `mergeAlternately("${a.word1}", "${a.word2}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const word1 = args.word1 as string
    const word2 = args.word2 as string
    const off = word1.length + 1 // word2 starts after the "|" cell
    const go = fn(
      "mergeAlternately",
      (): string => {
        let out = ""
        let i = 0
        let j = 0
        ptr("i", 0)
        ptr("j", off)
        heap("out", out)
        line(2, `Zip the words together like a merge: word1 goes first on every round.`)
        while (i < word1.length || j < word2.length) {
          if (i < word1.length) {
            mark("focus", [i])
            out += word1[i]
            heap("out", out)
            line(4, `Round ${Math.max(i, j) + 1}: take word1[${i}] = '<b>${word1[i]}</b>' → out = "<b>${out}</b>".`)
            i++
            ptr("i", i < word1.length ? i : -1)
          } else {
            line(4, `word1 is exhausted — only word2 keeps contributing now.`)
          }
          if (j < word2.length) {
            mark("focus", [off + j])
            out += word2[j]
            heap("out", out)
            line(5, `Then word2[${j}] = '<b>${word2[j]}</b>' → out = "<b>${out}</b>".`)
            j++
            ptr("j", j < word2.length ? off + j : -1)
          } else if (i <= word1.length && i - 1 < word1.length) {
            line(5, `word2 is exhausted — the rest of word1 just drains in order.`)
          }
          vars({ i, j, out })
        }
        mark("focus", [])
        mark("good", Array.from({ length: off + word2.length }, (_, x) => x).filter((x) => x !== word1.length))
        line(7, `Both pointers reached the end → "<b>${out}</b>" (${out.length} chars, every input char used exactly once).`)
        return out
      },
      1,
    )
    return go()
  },
}
