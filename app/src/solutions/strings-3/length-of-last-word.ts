import type { SolutionDef } from "@/engine/types"

export const lengthOfLastWord: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// walk backward: skip spaces, then count letters
function lengthOfLastWord(s) {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let len = 0;
  while (i >= 0 && s[i] !== " ") {
    len++;
    i--;
  }
  return len;
}`,
  codeJava: `// walk backward: skip spaces, then count letters
int lengthOfLastWord(String s) {
  int i = s.length() - 1;
  while (i >= 0 && s.charAt(i) == ' ') i--;
  int len = 0;
  while (i >= 0 && s.charAt(i) != ' ') {
    len++;
    i--;
  }
  return len;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "fly me to moon", maxLen: 14 }],
  entry: (a) => `lengthOfLastWord("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const go = fn(
      "lengthOfLastWord",
      (): number => {
        let i = s.length - 1
        ptr("i", i)
        line(2, `Start at the <b>last index ${i}</b> — scanning backward avoids splitting the whole string.`)
        if (s[i] !== " ") {
          line(3, `s[${i}] = '${s[i]}' is not a space — no trailing spaces to skip this time.`)
        }
        while (i >= 0 && s[i] === " ") {
          mark("bad", [i])
          line(3, `s[${i}] is a <b>space</b> — trailing spaces don't count, step left.`)
          i--
          ptr("i", i)
        }
        mark("bad", [])
        let len = 0
        line(4, `s[${i}] = '${s[i] ?? ""}' is the last word's <b>final letter</b>. Now count leftward until a space (or the start).`)
        const good: number[] = []
        while (i >= 0 && s[i] !== " ") {
          good.push(i)
          mark("good", [...good])
          len++
          line(6, `s[${i}] = '<b>${s[i]}</b>' belongs to the last word → len = <b>${len}</b>.`)
          i--
          ptr("i", i)
          vars({ i, len })
        }
        line(5, `${i < 0 ? "Reached the start of the string" : `s[${i}] is a space`} — the word boundary. Stop counting.`)
        line(9, `The last word "<b>${s.trimEnd().slice(s.trimEnd().length - len)}</b>" (green) has <b>${len}</b> letters — one backward pass, O(1) space.`)
        return len
      },
      1,
    )
    return go()
  },
}
