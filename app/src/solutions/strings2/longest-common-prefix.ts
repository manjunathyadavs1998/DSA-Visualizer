import type { SolutionDef, Args } from "@/engine/types"

const parseWords = (a: Args): string[] =>
  (a.words as string)
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 4)

export const longestCommonPrefix: SolutionDef = {
  view: "grid",
  grid: (a) => {
    const words = parseWords(a)
    const cols = Math.max(1, ...words.map((w) => w.length))
    return words.length
      ? words.map((w) => Array.from({ length: cols }, (_, c) => w[c] ?? "·"))
      : [["·"]]
  },
  code: `// words are editable below (space/comma separated)
function longestCommonPrefix(words) {
  let prefix = "";
  for (let c = 0; c < words[0].length; c++) {
    const ch = words[0][c];
    for (let r = 1; r < words.length; r++) {
      if (c >= words[r].length || words[r][c] !== ch)
        return prefix;    // first mismatch column
    }
    prefix += ch;         // whole column matched
  }
  return prefix;
}`,
  codeJava: `// words editable below (space/comma separated)
String longestCommonPrefix(String[] words) {
  String prefix = "";
  for (int c = 0; c < words[0].length(); c++) {
    char ch = words[0].charAt(c);
    for (int r = 1; r < words.length; r++) {
      if (c >= words[r].length() || words[r].charAt(c) != ch)
        return prefix; // first mismatch column
    }
    prefix += ch;      // whole column matched
  }
  return prefix;
}`,
  inputs: [{ kind: "string", name: "words", label: "words", default: "cat car care", maxLen: 14 }],
  entry: (a) => `longestCommonPrefix([${parseWords(a).map((w) => `"${w}"`).join(", ")}])`,
  run({ fn, line, gptr, gmark, vars }, args) {
    const words = parseWords(args)
    const go = fn(
      "longestCommonPrefix",
      (): string => {
        if (words.length === 0) return ""
        let prefix = ""
        vars({ prefix: `""` })
        line(2, `Each row is a word — sweep column by column; the prefix grows while a whole column agrees.`)
        for (let c = 0; c < words[0].length; c++) {
          const ch = words[0][c]
          gptr("c", -1, c)
          line(4, `Column ${c}: the first word says '<b>${ch}</b>' — every other row must match it.`)
          for (let r = 1; r < words.length; r++) {
            gptr("r", r, -1)
            if (c >= words[r].length || words[r][c] !== ch) {
              gmark("bad", [[r, c]])
              line(7, c >= words[r].length
                ? `"${words[r]}" is too short — it has no column ${c}. <b>Mismatch</b> → the prefix ends: "<b>${prefix}</b>".`
                : `Row ${r} has '${words[r][c]}' ≠ '${ch}' — <b>first mismatch</b> → the prefix ends: "<b>${prefix}</b>".`)
              return prefix
            }
          }
          prefix += ch
          gmark("good", words.flatMap((_, r) =>
            Array.from({ length: c + 1 }, (_, cc) => [r, cc] as [number, number])))
          vars({ c, prefix: `"${prefix}"` })
          line(9, `Column ${c} agrees everywhere — prefix grows to "<b>${prefix}</b>".`)
        }
        line(11, `The first word ran out — the whole word "<b>${prefix}</b>" is the common prefix.`)
        return prefix
      },
      1,
    )
    return go()
  },
}
