import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const repeatedSubstringPattern: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// can s be built by repeating a shorter prefix?
function repeatedSubstringPattern(s) {
  const n = s.length;
  for (let len = 1; len <= n / 2; len++) {
    if (n % len !== 0) continue;
    let ok = true;
    for (let i = len; i < n; i++) {
      if (s[i] !== s[i - len]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}`,
  codeJava: `// can s be built by repeating a shorter prefix?
boolean repeatedSubstringPattern(String s) {
  int n = s.length();
  for (int len = 1; len <= n / 2; len++) {
    if (n % len != 0) continue;
    boolean ok = true;
    for (int i = len; i < n; i++) {
      if (s.charAt(i) != s.charAt(i - len)) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "abcabcabc", maxLen: 14 }],
  entry: (a) => `repeatedSubstringPattern("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const n = s.length
    const go = fn(
      "repeatedSubstringPattern",
      (): boolean => {
        line(2, `n = <b>${n}</b>. A repeating unit must have a length that <b>divides n</b> and is at most n/2.`)
        for (let len = 1; len <= n / 2; len++) {
          if (n % len !== 0) {
            line(4, `len = ${len}: ${n} % ${len} = ${n % len} ≠ 0 — a unit of length ${len} can't tile ${n} chars. Skip.`)
            continue
          }
          mark("window", rng(0, len - 1))
          line(5, `len = <b>${len}</b> divides ${n} — test the prefix "<b>${s.slice(0, len)}</b>" (blue) as the repeating unit.`)
          let ok = true
          for (let i = len; i < n; i++) {
            ptr("i", i)
            ptr("i-len", i - len)
            mark("focus", [i])
            if (s[i] !== s[i - len]) {
              ok = false
              mark("bad", [i])
              line(7, `s[${i}] = '${s[i]}' ≠ s[${i - len}] = '${s[i - len]}' — <b>mismatch</b>, this unit fails.`)
              break
            }
            line(7, `s[${i}] = '${s[i]}' = s[${i - len}] — still copying the unit faithfully.`)
            vars({ len, i })
          }
          mark("bad", [])
          mark("focus", [])
          ptr("i", -1)
          ptr("i-len", -1)
          if (ok) {
            mark("good", rng(0, n - 1))
            line(9, `Every char equals the one <b>len=${len}</b> back → s = "<b>${s.slice(0, len)}</b>" × ${n / len}. Return <b>true</b>.`)
            return true
          }
        }
        mark("window", [])
        line(11, `No divisor length up to n/2 tiles the string → return <b>false</b>.`)
        return false
      },
      1,
    )
    return go()
  },
}
