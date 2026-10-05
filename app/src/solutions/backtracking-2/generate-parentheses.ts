import type { SolutionDef } from "@/engine/types"

export const generateParentheses: SolutionDef = {
  code: `// n = number of pairs (editable below)
function backtrack(open, close, cur) {
  if (cur.length === 2 * n) {
    output.push(cur);          // all 2n slots filled
    return;
  }
  if (open < n)                // may still open
    backtrack(open + 1, close, cur + "(");
  if (close < open)            // only close what's open
    backtrack(open, close + 1, cur + ")");
}`,
  codeJava: `// int n = number of pairs (editable below)
void backtrack(int open, int close, String cur) {
  if (cur.length() == 2 * n) {
    output.add(cur);           // all 2n slots filled
    return;
  }
  if (open < n)                // may still open
    backtrack(open + 1, close, cur + "(");
  if (close < open)            // only close what's open
    backtrack(open, close + 1, cur + ")");
}`,
  inputs: [{ kind: "number", name: "n", label: "n (pairs)", default: 3, min: 1, max: 4 }],
  entry: () => `backtrack(0, 0, "")`,
  run({ fn, heap, line, vars, narrate }, args) {
    const n = Math.max(1, Math.min(4, args.n as number))
    const output: string[] = []
    const backtrack = fn(
      "backtrack",
      (open: number, close: number, cur: string): string => {
        vars({ open, close, cur: cur || '""' })
        line(2, `"${cur}" has ${cur.length}/${2 * n} chars — complete? (${cur.length === 2 * n ? "<b>yes</b>" : "no"})`)
        if (cur.length === 2 * n) {
          line(3, `<b>Leaf!</b> "${cur}" is balanced by construction — record it.`)
          output.push(cur)
          heap("output", output)
          return `"${cur}"`
        }
        line(6, `open = ${open} of ${n}: ${open < n ? `can still <b>open</b> → try "${cur}("` : "<b>no '(' left</b> — skip this branch"}.`)
        if (open < n) backtrack(open + 1, close, cur + "(")
        line(8, `close = ${close}, open = ${open}: ${close < open ? `an unmatched '(' exists → try "${cur})"` : "<b>nothing to close</b> — skip this branch"}.`)
        if (close < open) backtrack(open, close + 1, cur + ")")
        return "✓"
      },
      1,
    )
    narrate(`Two guards do all the pruning: never more than ${n} '(' and never more ')' than '('. Every leaf is valid — no checking needed.`)
    heap("output", output)
    backtrack(0, 0, "")
    return JSON.stringify(output)
  },
}
