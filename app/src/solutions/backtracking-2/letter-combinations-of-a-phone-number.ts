import type { SolutionDef } from "@/engine/types"

const KEYPAD: Record<string, string> = {
  "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
  "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
}

export const letterCombinationsOfAPhoneNumber: SolutionDef = {
  code: `// digits is editable below (keys 2-9)
const map = { 2:"abc", 3:"def", 4:"ghi", 5:"jkl",
              6:"mno", 7:"pqrs", 8:"tuv", 9:"wxyz" };
function backtrack(i, cur) {
  if (i === digits.length) {
    output.push(cur);        // one full word
    return;
  }
  for (const ch of map[digits[i]]) {
    backtrack(i + 1, cur + ch);
  }
}`,
  codeJava: `// String digits is editable below (keys 2-9)
String[] map = { "", "", "abc", "def", "ghi", "jkl",
                 "mno", "pqrs", "tuv", "wxyz" };
void backtrack(int i, String cur) {
  if (i == digits.length()) {
    output.add(cur);         // one full word
    return;
  }
  for (char ch : map[digits.charAt(i) - '0'].toCharArray()) {
    backtrack(i + 1, cur + ch);
  }
}`,
  inputs: [{ kind: "string", name: "digits", label: "digits", default: "23", maxLen: 3 }],
  entry: () => `backtrack(0, "")`,
  run({ fn, heap, line, vars, narrate }, args) {
    // keep only valid keypad digits; empty input would make the loop meaningless
    let digits = (args.digits as string).split("").filter((d) => KEYPAD[d]).join("")
    if (!digits) digits = "23"
    const output: string[] = []
    const backtrack = fn(
      "backtrack",
      (i: number, cur: string): string => {
        vars({ i, cur: cur || '""' })
        line(4, `backtrack(${i}, "${cur}"): used all ${digits.length} digits? (${i === digits.length ? "<b>yes</b>" : "no"})`)
        if (i === digits.length) {
          line(5, `<b>Leaf!</b> "${cur}" is a complete combination — record it.`)
          output.push(cur)
          heap("output", output)
          return `"${cur}"`
        }
        const letters = KEYPAD[digits[i]]
        for (const ch of letters) {
          line(8, `Digit <b>${digits[i]}</b> offers "${letters}" — branch on <b>'${ch}'</b> → cur becomes "${cur + ch}".`)
          line(9, `Recurse: backtrack(${i + 1}, "${cur + ch}"). Strings are immutable — the undo is free.`)
          backtrack(i + 1, cur + ch)
        }
        return "✓"
      },
      3,
    )
    narrate(`Each digit multiplies the branches: ${digits.split("").map((d) => KEYPAD[d].length).join(" × ")} leaves. The tree IS the cartesian product.`)
    heap("output", output)
    backtrack(0, "")
    return JSON.stringify(output)
  },
}
