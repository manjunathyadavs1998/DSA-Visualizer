import type { SolutionDef } from "@/engine/types"

export const ransomNote: SolutionDef = {
  view: "array",
  array: (a) => [...(a.note as string).split(""), "|", ...(a.magazine as string).split("")],
  code: `// count the magazine letters, then spend them on the note
function canConstruct(note, magazine) {
  for (const c of magazine) memo[c] = (memo[c] || 0) + 1;
  for (const c of note) {
    memo[c] = (memo[c] || 0) - 1;
    if (memo[c] < 0) return false;  // ran out of c
  }
  return true;
}`,
  codeJava: `// count the magazine letters, then spend them on the note
boolean canConstruct(String note, String magazine) {
  for (char c : magazine.toCharArray()) memo.merge(c, 1, Integer::sum);
  for (char c : note.toCharArray()) {
    memo.merge(c, -1, Integer::sum);
    if (memo.get(c) < 0) return false; // ran out of c
  }
  return true;
}`,
  inputs: [
    { kind: "string", name: "note", label: "ransomNote", default: "aab", maxLen: 6 },
    { kind: "string", name: "magazine", label: "magazine", default: "abcba", maxLen: 7 },
  ],
  entry: (a) => `canConstruct("${a.note}", "${a.magazine}")`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const note = args.note as string
    const magazine = args.magazine as string
    const off = note.length + 1 // magazine starts after the "|" cell
    const go = fn(
      "canConstruct",
      (): boolean => {
        for (let i = 0; i < magazine.length; i++) {
          const c = magazine[i]
          ptr("i", off + i)
          mark("focus", [off + i])
          memo[c] = ((memo[c] as number) || 0) + 1
          line(2, `Magazine supplies '<b>${c}</b>' → stock['${c}'] = <b>${memo[c]}</b>.`)
          vars({ i, c })
        }
        line(3, `Stock counted. Now spend letters on the note — each note char costs one from stock.`)
        for (let i = 0; i < note.length; i++) {
          const c = note[i]
          ptr("i", i)
          mark("focus", [i])
          memo[c] = ((memo[c] as number) || 0) - 1
          if ((memo[c] as number) < 0) {
            mark("focus", [])
            mark("bad", [i])
            line(5, `Spending '<b>${c}</b>' drops stock['${c}'] to <b>${memo[c]} — negative!</b> The magazine ran out → <b>false</b>.`)
            return false
          }
          line(4, `Spend '<b>${c}</b>' → stock['${c}'] = <b>${memo[c]}</b> left.`)
          vars({ i, c })
        }
        mark("focus", [])
        mark("good", Array.from({ length: note.length }, (_, x) => x))
        line(7, `Every note letter was paid for without going negative → <b>true</b>.`)
        return true
      },
      1,
    )
    return go()
  },
}
