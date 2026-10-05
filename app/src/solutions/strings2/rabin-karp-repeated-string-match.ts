import type { SolutionDef, Args } from "@/engine/types"

const repeated = (a: Args): string => {
  const s = a.a as string, b = a.b as string
  if (!s.length) return ""
  const k = Math.ceil(Math.max(b.length, 1) / s.length)
  return s.repeat(k + 1)
}

export const rabinKarpRepeatedStringMatch: SolutionDef = {
  view: "array",
  array: (a) => (repeated(a) || "·").split(""),
  code: `// a and b are editable below (Rabin-Karp)
function repeatedStringMatch(a, b) {
  const k = Math.ceil(b.length / a.length);
  const s = a.repeat(k + 1);           // enough copies to contain b
  const B = 31, M = 1000;
  let hb = 0, h = 0, pow = 1;
  for (let i = 0; i < b.length; i++) { // hash b and the first window
    hb = (hb * B + b.charCodeAt(i)) % M;
    h = (h * B + s.charCodeAt(i)) % M;
    if (i > 0) pow = pow * B % M;
  }
  for (let i = 0; i + b.length <= s.length; i++) {
    if (h === hb && s.slice(i, i + b.length) === b)
      return i + b.length <= a.length * k ? k : k + 1;
    if (i + b.length < s.length)       // roll: drop s[i], add next
      h = ((h - s.charCodeAt(i) * pow % M + M) % M * B + s.charCodeAt(i + b.length)) % M;
  }
  return -1;
}`,
  codeJava: `// String a and b editable below (Rabin-Karp)
int repeatedStringMatch(String a, String b) {
  int k = (b.length() + a.length() - 1) / a.length();
  String s = a.repeat(k + 1);          // enough copies to contain b
  int B = 31, M = 1000;
  int hb = 0, h = 0, pow = 1;
  for (int i = 0; i < b.length(); i++) { // hash b and the first window
    hb = (hb * B + b.charAt(i)) % M;
    h = (h * B + s.charAt(i)) % M;
    if (i > 0) pow = pow * B % M;
  }
  for (int i = 0; i + b.length() <= s.length(); i++) {
    if (h == hb && s.substring(i, i + b.length()).equals(b))
      return i + b.length() <= a.length() * k ? k : k + 1;
    if (i + b.length() < s.length())   // roll: drop s[i], add next
      h = ((h - s.charAt(i) * pow % M + M) % M * B + s.charAt(i + b.length())) % M;
  }
  return -1;
}`,
  inputs: [
    { kind: "string", name: "a", label: "a", default: "abcd", maxLen: 4 },
    { kind: "string", name: "b", label: "b", default: "cdabcdab", maxLen: 8 },
  ],
  entry: (a) => `repeatedStringMatch("${a.a}", "${a.b}")`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const go = fn(
      "repeatedStringMatch",
      (): number => {
        if (!a.length || !b.length) return -1
        const k = Math.ceil(b.length / a.length)
        const s = a.repeat(k + 1)
        line(3, `b needs at most ⌈${b.length}/${a.length}⌉ = ${k} copies of "${a}" — display ${k + 1} copies ("${s}") to catch matches that spill over.`)
        const B = 31, M = 1000
        let hb = 0, h = 0, pow = 1
        for (let i = 0; i < b.length; i++) {
          hb = (hb * B + b.charCodeAt(i)) % M
          h = (h * B + s.charCodeAt(i)) % M
          if (i > 0) pow = pow * B % M
        }
        mark("window", Array.from({ length: b.length }, (_, x) => x))
        vars({ k, hb, h, pow })
        line(6, `Hash b once: hash(b) = <b>${hb}</b>. Hash of the first window "${s.slice(0, b.length)}" = <b>${h}</b>.`)
        for (let i = 0; i + b.length <= s.length; i++) {
          ptr("i", i)
          mark("window", Array.from({ length: b.length }, (_, x) => i + x))
          vars({ i, h, hb })
          if (h === hb) {
            if (s.slice(i, i + b.length) === b) {
              mark("good", Array.from({ length: b.length }, (_, x) => i + x)); mark("window", [])
              const ans = i + b.length <= a.length * k ? k : k + 1
              line(13, `Hashes match (${h}) and the characters <b>confirm it</b> — b starts at index ${i}. The match ends at ${i + b.length}, so <b>${ans}</b> cop${ans === 1 ? "y" : "ies"} of "${a}" suffice.`)
              return ans
            }
            mark("bad", Array.from({ length: b.length }, (_, x) => i + x))
            line(12, `Hashes collide at ${h} but the characters differ — a <b>false positive</b>, keep sliding.`)
            mark("bad", [])
          } else {
            line(12, `Window at ${i}: hash ${h} ≠ ${hb} — no match, slide on.`)
          }
          if (i + b.length < s.length) {
            const h2 = ((h - s.charCodeAt(i) * pow % M + M) % M * B + s.charCodeAt(i + b.length)) % M
            line(15, `Roll the hash: drop '${s[i]}', pull in '${s[i + b.length]}' → ${h} becomes <b>${h2}</b> in O(1).`)
            h = h2
          }
        }
        mark("window", [])
        narrate(`Even ${k + 1} copies never contain b.`)
        line(17, `No window ever matched — b can <b>never</b> appear, answer −1.`)
        return -1
      },
      1,
    )
    return go()
  },
}
