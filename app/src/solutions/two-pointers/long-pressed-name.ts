import type { SolutionDef } from "@/engine/types"

export const longPressedName: SolutionDef = {
  view: "array",
  // show name and typed side by side: [ name… | typed… ]
  array: (a) => [...(a.name as string), "|", ...(a.typed as string)],
  code: `// typed must replay name; extra repeats of the current char are OK
function isLongPressedName(name, typed) {
  let i = 0;                      // pointer into name
  for (let j = 0; j < typed.length; j++) {
    if (i < name.length && name[i] === typed[j]) {
      i++;                        // a genuine next character
    } else if (j === 0 || typed[j] !== typed[j - 1]) {
      return false;               // can't be a long-press of anything
    }
  }
  return i === name.length;       // all of name must get typed
}`,
  codeJava: `// typed must replay name; extra repeats of the current char are OK
boolean isLongPressedName(String name, String typed) {
  int i = 0;                      // pointer into name
  for (int j = 0; j < typed.length(); j++) {
    if (i < name.length() && name.charAt(i) == typed.charAt(j)) {
      i++;                        // a genuine next character
    } else if (j == 0 || typed.charAt(j) != typed.charAt(j - 1)) {
      return false;               // can't be a long-press of anything
    }
  }
  return i == name.length();      // all of name must get typed
}`,
  inputs: [
    { kind: "string", name: "name", label: "name", default: "alex", maxLen: 8 },
    { kind: "string", name: "typed", label: "typed", default: "aaleex", maxLen: 12 },
  ],
  entry: (a) => `isLongPressedName("${a.name}", "${a.typed}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const name = args.name as string
    const typed = args.typed as string
    const off = name.length + 1 // typed starts after the "|" separator
    const go = fn(
      "isLongPressedName",
      (): boolean => {
        let i = 0
        ptr("i", name.length ? 0 : -1)
        line(2, `i tracks how much of "name" we've matched (left of |); j walks "typed" (right of |).`)
        for (let j = 0; j < typed.length; j++) {
          ptr("j", off + j)
          mark("focus", [off + j])
          if (i < name.length && name[i] === typed[j]) {
            mark("good", Array.from({ length: i + 1 }, (_, x) => x))
            line(4, `typed[${j}] = '<b>${typed[j]}</b>' matches name[${i}] — a real keystroke.`)
            i++
            ptr("i", i < name.length ? i : -1)
            line(5, `i → ${i}${i < name.length ? ` (now waiting for '${name[i]}')` : " — all of name matched"}.`)
          } else if (j === 0 || typed[j] !== typed[j - 1]) {
            mark("bad", [off + j])
            line(6, `typed[${j}] = '${typed[j]}' ${j === 0 ? "is the very first key" : `≠ previous key '${typed[j - 1]}'`} and ≠ ${i < name.length ? `name[${i}] = '${name[i]}'` : "anything (name is done)"}…`)
            line(7, `…so it is neither the next real character nor a long-press echo → <b>false</b>.`)
            return false
          } else {
            mark("window", [off + j])
            line(6, `typed[${j}] = '<b>${typed[j]}</b>' repeats the previous key — the '${typed[j - 1]}' key was held down. Forgiven.`)
          }
          vars({ i, j })
        }
        mark("focus", [])
        const ok = i === name.length
        line(9, `typed is spent; matched <b>${i}</b>/${name.length} of name → <b>${ok}</b>${ok ? "" : " (name has unmatched letters left)"}.`)
        return ok
      },
      1,
    )
    return go()
  },
}
