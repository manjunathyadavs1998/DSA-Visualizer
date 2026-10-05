import type { SolutionDef } from "@/engine/types"

function parens(args: Record<string, unknown>): string {
  const s = String(args.s ?? "").replace(/[^()]/g, "").slice(0, 14)
  return s.length ? s : "()))(("
}

export const minimumAddToMakeParenthesesValid: SolutionDef = {
  view: "array",
  array: (a) => parens(a).split(""),
  code: `// fewest insertions to make the parentheses valid
function minAddToMakeValid(s) {
  let open = 0;   // unmatched "(" — the stack's height
  let need = 0;   // ")" that arrived to an empty stack
  for (const c of s) {
    if (c === "(") {
      open++;               // push
    } else if (open > 0) {
      open--;               // pop — this ")" is matched
    } else {
      need++;               // unmatched ")" → must insert a "("
    }
  }
  return open + need;       // leftover "(" each need a ")"
}`,
  codeJava: `// fewest insertions to make the parentheses valid
int minAddToMakeValid(String s) {
  int open = 0;   // unmatched "(" — the stack's height
  int need = 0;   // ")" that arrived to an empty stack
  for (char c : s.toCharArray()) {
    if (c == '(') {
      open++;               // push
    } else if (open > 0) {
      open--;               // pop — this ")" is matched
    } else {
      need++;               // unmatched ")" → must insert a "("
    }
  }
  return open + need;       // leftover "(" each need a ")"
}`,
  inputs: [{ kind: "string", name: "s", label: "s (only ( and ))", default: "()))((", maxLen: 14 }],
  entry: (a) => `minAddToMakeValid("${parens(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = parens(args)
    const go = fn(
      "minAddToMakeValid",
      (): number => {
        let open = 0
        let need = 0
        const stack: string[] = []
        line(2, `This is valid-parentheses with a twist: instead of failing on a mismatch, <b>count</b> what we'd have to insert. The stack would only ever hold "(" — so a counter <b>open</b> replaces it.`)
        heap("stack", [])
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          if (c === "(") {
            open++
            stack.push("(")
            heap("stack", [...stack])
            vars({ open, need })
            line(6, `'(' → push. open = <b>${open}</b> unmatched opener${open === 1 ? "" : "s"} waiting for a partner.`)
          } else if (open > 0) {
            open--
            stack.pop()
            heap("stack", [...stack])
            vars({ open, need })
            line(8, `')' meets a waiting '(' → <b>pop, matched</b>. open = ${open}.`)
          } else {
            need++
            mark("bad", [i])
            vars({ open, need })
            line(10, `')' but the stack is <b>empty</b> — nothing can ever match it from the left → we must <b>insert a '('</b>. need = <b>${need}</b>.`)
            mark("bad", [])
          }
        }
        ptr("i", -1)
        mark("focus", [])
        const ans = open + need
        heap("output", ans)
        line(13, `Leftover open = <b>${open}</b> each need an inserted ')', plus need = <b>${need}</b> inserted '(' → minimum additions = ${open} + ${need} = <b>${ans}</b>. O(n) time, O(1) space.`)
        return ans
      },
      1,
    )
    return go()
  },
}
