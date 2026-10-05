import type { SolutionDef } from "@/engine/types"

const sanitize = (a: Record<string, unknown>): [number, number] => {
  let x = Math.abs(Math.trunc(a.a as number))
  let y = Math.abs(Math.trunc(a.b as number))
  if (x === 0 && y === 0) {
    x = 1071
    y = 462
  }
  return [x, y]
}

export const greatestCommonDivisorEuclid: SolutionDef = {
  code: `// Euclid: gcd(a, b) = gcd(b, a mod b) — the remainder
// keeps every common divisor of a and b, but shrinks fast
function gcd(a, b) {
  if (b === 0) return a;                // b divides a evenly -> done
  const r = a % b;                      // a = q*b + r, 0 <= r < b
  return gcd(b, r);
}`,
  codeJava: `// Euclid: gcd(a, b) = gcd(b, a mod b) — the remainder
// keeps every common divisor of a and b, but shrinks fast
int gcd(int a, int b) {
  if (b == 0) return a;                 // b divides a evenly -> done
  int r = a % b;                        // a = q*b + r, 0 <= r < b
  return gcd(b, r);
}`,
  inputs: [
    { kind: "number", name: "a", label: "a", default: 1071, min: 0, max: 10000 },
    { kind: "number", name: "b", label: "b", default: 462, min: 0, max: 10000 },
  ],
  entry: (args) => {
    const [a, b] = sanitize(args)
    return `gcd(${a}, ${b})`
  },
  run({ fn, line, vars, narrate }, args) {
    const [a0, b0] = sanitize(args)
    const gcd = fn(
      "gcd",
      (a: number, b: number): number => {
        line(3, `gcd(${a}, ${b}): is b zero? (${b === 0 ? `<b>yes — every number divides 0, so the answer is a = ${a}</b>` : "no, divide and look at the remainder"})`)
        if (b === 0) return a
        const q = Math.floor(a / b)
        const r = a % b
        vars({ a, b, q, r })
        line(4, `${a} = <b>${q}</b> × ${b} + <b>${r}</b> — any d dividing both ${a} and ${b} must also divide the remainder ${r}.`)
        line(5, `So gcd(${a}, ${b}) = gcd(${b}, ${r}) — the pair strictly shrinks, halving at least every two steps.`)
        return gcd(b, r)
      },
      2,
    )
    const ans = gcd(a0, b0)
    narrate(
      `gcd(${a0}, ${b0}) = <b>${ans}</b>. The argument chain is Euclid's 2300-year-old algorithm; its O(log min(a,b)) bound comes from Fibonacci pairs being the worst case.`,
    )
    return ans
  },
}
