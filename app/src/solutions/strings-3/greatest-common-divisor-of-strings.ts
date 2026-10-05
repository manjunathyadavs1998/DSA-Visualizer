import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const greatestCommonDivisorOfStrings: SolutionDef = {
  view: "array",
  array: (a) => [...(a.str1 as string).split(""), "|", ...(a.str2 as string).split("")],
  code: `// a common divisor exists iff str1+str2 === str2+str1
function gcdOfStrings(str1, str2) {
  if (str1 + str2 !== str2 + str1) return "";
  const g = gcd(str1.length, str2.length);
  return str1.slice(0, g);
}
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}`,
  codeJava: `// a common divisor exists iff str1+str2 === str2+str1
String gcdOfStrings(String str1, String str2) {
  if (!(str1 + str2).equals(str2 + str1)) return "";
  int g = gcd(str1.length(), str2.length());
  return str1.substring(0, g);
}
int gcd(int a, int b) {
  return b == 0 ? a : gcd(b, a % b);
}`,
  inputs: [
    { kind: "string", name: "str1", label: "str1", default: "ababab", maxLen: 8 },
    { kind: "string", name: "str2", label: "str2", default: "abab", maxLen: 5 },
  ],
  entry: (a) => `gcdOfStrings("${a.str1}", "${a.str2}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const str1 = args.str1 as string
    const str2 = args.str2 as string
    const off = str1.length + 1 // str2 starts after the "|" cell
    const gcd = fn(
      "gcd",
      (a: number, b: number): number => {
        if (b === 0) {
          line(7, `gcd(${a}, 0): b = 0 → the answer is <b>${a}</b>.`)
          return a
        }
        line(7, `gcd(${a}, ${b}): b ≠ 0 → Euclid: recurse on gcd(${b}, ${a} % ${b} = ${a % b}).`)
        return gcd(b, a % b)
      },
      6,
    )
    const go = fn(
      "gcdOfStrings",
      (): string => {
        const ab = str1 + str2
        const ba = str2 + str1
        line(2, `Key insight: if both strings are repeats of one unit u, then str1+str2 and str2+str1 are the <b>same string</b> (|str1|+|str2| copies of u either way).`)
        let mismatch = -1
        for (let k = 0; k < ab.length; k++) {
          const inStr1 = k < str1.length
          mark("focus", [inStr1 ? k : off + (k - str1.length)])
          if (ab[k] !== ba[k]) {
            mismatch = k
            line(2, `Compare position ${k}: "${ab}"[${k}] = '${ab[k]}' vs "${ba}"[${k}] = '<b>${ba[k]}</b>' — mismatch!`)
            break
          }
          line(2, `Compare position ${k}: both concatenations have '<b>${ab[k]}</b>' — still equal.`)
        }
        mark("focus", [])
        if (mismatch >= 0) {
          line(2, `str1+str2 ≠ str2+str1 → the strings are not repeats of one unit → <b>no common divisor</b>, return "".`)
          mark("bad", rng(0, str1.length - 1))
          return ""
        }
        line(2, `str1+str2 = str2+str1 = "${ab}" — a common unit <b>exists</b>; the largest has length gcd(|str1|, |str2|).`)
        vars({ m: str1.length, n: str2.length })
        line(3, `Compute gcd(${str1.length}, ${str2.length}) with Euclid's algorithm (watch the call stack).`)
        const g = gcd(str1.length, str2.length)
        mark("good", rng(0, g - 1))
        mark("window", rng(off, off + str2.length - 1))
        line(4, `g = <b>${g}</b> → the answer is the first ${g} chars of str1: "<b>${str1.slice(0, g)}</b>" (it tiles both strings).`)
        ptr("g", g - 1)
        vars({ g, answer: str1.slice(0, g) })
        return str1.slice(0, g)
      },
      1,
    )
    return go()
  },
}
