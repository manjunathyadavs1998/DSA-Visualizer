import type { SolutionDef } from "@/engine/types"

/** The input must be a valid-parentheses string (VPS) — repair anything else. */
function vps(args: Record<string, unknown>): string {
  const s = String(args.s ?? "").replace(/[^a-z0-9+\-*/()]/gi, "").slice(0, 14)
  let depth = 0
  for (const c of s) {
    if (c === "(") depth++
    else if (c === ")") depth--
    if (depth < 0) return "((1)+((2)))"
  }
  return depth === 0 && s.length ? s : "((1)+((2)))"
}

export const maximumNestingDepth: SolutionDef = {
  view: "array",
  array: (a) => vps(a).split(""),
  code: `// deepest nesting of a valid parentheses string
function maxDepth(s) {
  let depth = 0;   // current stack height
  let best = 0;    // deepest the stack ever got
  for (const c of s) {
    if (c === "(") {
      depth++;                        // push
      best = Math.max(best, depth);
    } else if (c === ")") {
      depth--;                        // pop
    }
  }
  return best;
}`,
  codeJava: `// deepest nesting of a valid parentheses string
int maxDepth(String s) {
  int depth = 0;   // current stack height
  int best = 0;    // deepest the stack ever got
  for (char c : s.toCharArray()) {
    if (c == '(') {
      depth++;                        // push
      best = Math.max(best, depth);
    } else if (c == ')') {
      depth--;                        // pop
    }
  }
  return best;
}`,
  inputs: [{ kind: "string", name: "s", label: "s (valid parens expr)", default: "((1)+((2)))", maxLen: 14 }],
  entry: (a) => `maxDepth("${vps(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = vps(args)
    const go = fn(
      "maxDepth",
      (): number => {
        let depth = 0
        let best = 0
        const stack: string[] = []
        line(2, `Because the string is <b>guaranteed valid</b>, we never need the stack's contents — only its <b>height</b>. depth is that height.`)
        heap("stack", [])
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          if (c === "(") {
            depth++
            stack.push("(")
            heap("stack", [...stack])
            vars({ depth, best })
            line(6, `'(' → push, depth = <b>${depth}</b>.`)
            if (depth > best) {
              best = depth
              vars({ depth, best })
              line(7, `New record! best = <b>${best}</b> — the deepest the stack has ever been.`)
            } else {
              line(7, `best stays ${best} (depth ${depth} isn't deeper).`)
            }
          } else if (c === ")") {
            depth--
            stack.pop()
            heap("stack", [...stack])
            vars({ depth, best })
            line(9, `')' → pop, depth = <b>${depth}</b>. The peak was already recorded in best.`)
          } else {
            line(4, `'${c}' is not a parenthesis — digits and operators don't change the nesting. Skip.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        heap("output", best)
        line(12, `Maximum nesting depth = <b>${best}</b>. One counter instead of a real stack: O(n) time, O(1) space.`)
        return best
      },
      1,
    )
    return go()
  },
}
