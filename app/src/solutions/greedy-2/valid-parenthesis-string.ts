import type { SolutionDef } from "@/engine/types"

const sanitize = (s: string): string => {
  const t = s.replace(/[^()*]/g, "").slice(0, 14)
  return t.length ? t : "(*))((*)"
}

export const validParenthesisString: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.s as string).split(""),
  code: `// lo..hi = the RANGE of possible open-paren counts
function checkValidString(s) {
  let lo = 0, hi = 0;
  for (const ch of s) {
    if (ch === '(')      { lo++; hi++; }
    else if (ch === ')') { lo--; hi--; }
    else                 { lo--; hi++; }  // '*' = '(' | ')' | ''
    if (hi < 0) return false;  // too many ')' no matter what
    lo = Math.max(lo, 0);      // '*' can be ')' only while lo>0
  }
  return lo === 0;             // some choice closes everything
}`,
  codeJava: `// lo..hi = the RANGE of possible open-paren counts
boolean checkValidString(String s) {
  int lo = 0, hi = 0;
  for (char ch : s.toCharArray()) {
    if (ch == '(')      { lo++; hi++; }
    else if (ch == ')') { lo--; hi--; }
    else                { lo--; hi++; }   // '*' = '(' | ')' | ''
    if (hi < 0) return false;  // too many ')' no matter what
    lo = Math.max(lo, 0);      // '*' can be ')' only while lo>0
  }
  return lo == 0;              // some choice closes everything
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (only ( ) and * — * is a wildcard)", default: "(*))((*)", maxLen: 14 },
  ],
  entry: (a) => `checkValidString("${sanitize(a.s as string)}")`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const s = sanitize(args.s as string)
    const solve = fn(
      "checkValidString",
      (): boolean => {
        let lo = 0
        let hi = 0
        vars({ lo, hi })
        line(2, `Instead of trying every meaning of '*', track the <b>interval [lo, hi]</b> of achievable open-paren counts — it stays contiguous.`)
        for (let i = 0; i < s.length; i++) {
          const ch = s[i]
          ptr("i", i)
          mark("focus", [i])
          if (ch === "(") {
            lo++
            hi++
            line(4, `'(' → one more unclosed paren in every scenario: [lo,hi] = <b>[${lo},${hi}]</b>.`)
          } else if (ch === ")") {
            lo--
            hi--
            line(5, `')' → one fewer in every scenario: [lo,hi] = <b>[${lo},${hi}]</b>.`)
          } else {
            lo--
            hi++
            line(6, `'*' can act as ')' (lo−1), '' (same), or '(' (hi+1) → range widens to <b>[${lo},${hi}]</b>.`)
          }
          if (hi < 0) {
            mark("bad", Array.from({ length: i + 1 }, (_, k) => k))
            line(7, `hi < 0: even treating every '*' as '(' there are too many ')' by index ${i} → <b>false</b>.`)
            return false
          }
          if (lo < 0) {
            lo = 0
            line(8, `lo clamps to 0 — a '*' that would over-close just becomes an empty string instead.`)
          }
          vars({ lo, hi })
        }
        ptr("i", -1)
        mark("focus", [])
        mark(lo === 0 ? "good" : "bad", s.split("").map((_, k) => k))
        line(10, `End of string: 0 ${lo === 0 ? "∈" : "∉"} [${lo},${hi}] → <b>${lo === 0}</b>${lo === 0 ? " — some assignment of the '*'s balances everything." : " — every scenario leaves parens open."}`)
        return lo === 0
      },
      1,
    )
    narrate(`The O(n) trick: all reachable open-counts form one contiguous interval, so two integers replace exponential branching.`)
    return solve()
  },
}
