import type { SolutionDef } from "@/engine/types"

export const letterCasePermutation: SolutionDef = {
  code: `// s is editable below (letters & digits)
function backtrack(i, cur) {
  if (i === s.length) {
    output.push(cur);          // one full variant
    return;
  }
  const ch = s[i];
  if (isLetter(ch)) {          // letters fork in two
    backtrack(i + 1, cur + ch.toLowerCase());
    backtrack(i + 1, cur + ch.toUpperCase());
  } else {                     // digits: single branch
    backtrack(i + 1, cur + ch);
  }
}`,
  codeJava: `// String s is editable below (letters & digits)
void backtrack(int i, String cur) {
  if (i == s.length()) {
    output.add(cur);           // one full variant
    return;
  }
  char ch = s.charAt(i);
  if (Character.isLetter(ch)) {  // letters fork in two
    backtrack(i + 1, cur + Character.toLowerCase(ch));
    backtrack(i + 1, cur + Character.toUpperCase(ch));
  } else {                     // digits: single branch
    backtrack(i + 1, cur + ch);
  }
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "a1b2", maxLen: 4 }],
  entry: () => `backtrack(0, "")`,
  run({ fn, heap, line, vars, narrate }, args) {
    const s = (args.s as string) || "a1b2"
    const output: string[] = []
    const isLetter = (ch: string) => ch.toLowerCase() !== ch.toUpperCase()
    const backtrack = fn(
      "backtrack",
      (i: number, cur: string): string => {
        vars({ i, cur: cur || '""' })
        line(2, `backtrack(${i}, "${cur}"): processed all ${s.length} chars? (${i === s.length ? "<b>yes</b>" : "no"})`)
        if (i === s.length) {
          line(3, `<b>Leaf!</b> Record variant "<b>${cur}</b>".`)
          output.push(cur)
          heap("output", output)
          return `"${cur}"`
        }
        const ch = s[i]
        line(7, `s[${i}] = '${ch}': a letter? (${isLetter(ch) ? "<b>yes — the tree forks</b>" : "no — digits have one spelling"})`)
        if (isLetter(ch)) {
          line(8, `Branch 1: lowercase → "${cur + ch.toLowerCase()}".`)
          backtrack(i + 1, cur + ch.toLowerCase())
          line(9, `Branch 2: uppercase → "${cur + ch.toUpperCase()}".`)
          backtrack(i + 1, cur + ch.toUpperCase())
        } else {
          line(11, `Pass '${ch}' through unchanged → "${cur + ch}".`)
          backtrack(i + 1, cur + ch)
        }
        return "✓"
      },
      1,
    )
    const letters = s.split("").filter(isLetter).length
    narrate(`Binary tree on letters only: ${letters} letter(s) → 2^${letters} = ${2 ** letters} variants. Digits are unary nodes that just pass through.`)
    heap("output", output)
    backtrack(0, "")
    return JSON.stringify(output)
  },
}
