import type { SolutionDef } from "@/engine/types"

const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)
const chr = (code: number): string => (code >= 32 && code < 127 ? `'${String.fromCharCode(code)}'` : `#${code}`)

export const findTheDifference: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string), "|", ...(a.t as string)],
  code: `// t = shuffled s + one extra char; find it
function findTheDifference(s, t) {
  let acc = 0;
  for (const c of s) acc ^= c.charCodeAt(0); // XOR s in
  for (const c of t) acc ^= c.charCodeAt(0); // XOR t in
  return String.fromCharCode(acc); // pairs cancelled
}`,
  codeJava: `// t = shuffled s + one extra char; find it
char findTheDifference(String s, String t) {
  int acc = 0;
  for (char c : s.toCharArray()) acc ^= c;   // XOR s in
  for (char c : t.toCharArray()) acc ^= c;   // XOR t in
  return (char) acc;               // pairs cancelled
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "abcde", maxLen: 10 },
    { kind: "string", name: "t", label: "t (s shuffled + 1 char)", default: "ecabdf", maxLen: 11 },
  ],
  entry: (a) => `findTheDifference("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const t = args.t as string
    const go = fn(
      "findTheDifference",
      (): string => {
        let acc = 0
        heap("acc", `${acc} = ${bin(acc)}`)
        line(2, `Characters are just numbers (char codes). XOR them ALL — every char that appears in both s and t cancels itself, order be damned. No sorting, no counting map.`)
        for (let i = 0; i < s.length; i++) {
          const code = s.charCodeAt(i)
          ptr("i", i)
          mark("focus", [i])
          acc ^= code
          line(3, `s[${i}] = ${chr(code)} (code ${code} = ${bin(code)}) → acc = <b>${bin(acc)}</b>.`)
          heap("acc", `${acc} = ${bin(acc)} ${chr(acc)}`)
          vars({ i, char: String.fromCharCode(code), acc })
        }
        for (let i = 0; i < t.length; i++) {
          const code = t.charCodeAt(i)
          ptr("i", s.length + 1 + i)
          mark("focus", [s.length + 1 + i])
          acc ^= code
          line(4, `t[${i}] = ${chr(code)} (code ${code} = ${bin(code)}) → acc = <b>${bin(acc)}</b>${acc > 0 && acc < 128 ? ` = ${chr(acc)}` : ""}.`)
          heap("acc", `${acc} = ${bin(acc)} ${chr(acc)}`)
          vars({ i, char: String.fromCharCode(code), acc })
        }
        ptr("i", -1)
        mark("focus", [])
        const ans = String.fromCharCode(acc)
        const where = t.indexOf(ans)
        if (where >= 0) mark("good", [s.length + 1 + where])
        line(5, `Every matched pair XORed to 0 — the surviving code ${acc} is the extra character <b>${chr(acc)}</b>. O(n) time, O(1) space.`)
        return ans
      },
      1,
    )
    return go()
  },
}
