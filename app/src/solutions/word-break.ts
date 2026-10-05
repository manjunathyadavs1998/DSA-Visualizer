import type { SolutionDef } from "@/engine/types"

export const wordBreak: SolutionDef = {
  code: `// s and dictionary editable below
function canBreak(start) {
  if (start === s.length) return true;   // consumed all of s
  if (memo[start] !== undefined) return memo[start];
  for (const w of dict) {
    if (s.startsWith(w, start) && canBreak(start + w.length)) {
      memo[start] = true; return true;
    }
  }
  memo[start] = false;                   // no word fits here
  return false;
}`,
  codeJava: `// String s, List<String> dict; Boolean[] memo
boolean canBreak(int start) {
  if (start == s.length()) return true;  // consumed all of s
  if (memo[start] != null) return memo[start];
  for (String w : dict) {
    if (s.startsWith(w, start) && canBreak(start + w.length())) {
      memo[start] = true; return true;
    }
  }
  memo[start] = false;                   // no word fits here
  return false;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "catsanddog", maxLen: 14 },
    { kind: "string", name: "dict", label: "dict (comma-sep)", default: "cats,cat,sand,and,dog", maxLen: 40 },
  ],
  entry: (a) => `canBreak(0)  // s = "${a.s}"`,
  run({ fn, line, memo, narrate }, args) {
    const s = args.s as string
    const dict = (args.dict as string).split(",").map((w) => w.trim()).filter(Boolean)
    const canBreak = fn(
      "canBreak",
      (start: number): boolean => {
        line(2, `start = ${start} ("${s.slice(start)}" left): all consumed? (${start === s.length ? "<b>yes!</b>" : "no"})`)
        if (start === s.length) return true
        line(3, `Checking the memo for position ${start}…`)
        if (memo[start] !== undefined) return memo[start] as boolean
        for (const w of dict) {
          if (s.startsWith(w, start)) {
            line(5, `"${w}" matches at ${start} → can we break the rest, "${s.slice(start + w.length)}"?`)
            if (canBreak(start + w.length)) {
              memo[start] = true
              return true
            }
            line(5, `"${w}" matched but the rest failed → try another word.`)
          }
        }
        line(9, `No dictionary word works at position ${start} → remember that and give up here.`)
        memo[start] = false
        return false
      },
      1,
    )
    narrate("Backtracking + memo: each failing start position is recorded once — no re-exploration.")
    return canBreak(0)
  },
}
