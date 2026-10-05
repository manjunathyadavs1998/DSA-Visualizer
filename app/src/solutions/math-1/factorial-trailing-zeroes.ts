import type { SolutionDef } from "@/engine/types"

export const factorialTrailingZeroes: SolutionDef = {
  code: `// each trailing zero needs a 2x5 pair; 5s are the scarce factor
function trailingZeroes(n) {
  if (n < 5) return 0;                  // no multiples of 5 left
  const fives = Math.floor(n / 5);      // multiples of 5 in 1..n
  // 25, 125, ... carry EXTRA 5s -> recurse to count them again
  return fives + trailingZeroes(fives);
}`,
  codeJava: `// each trailing zero needs a 2x5 pair; 5s are the scarce factor
int trailingZeroes(int n) {
  if (n < 5) return 0;                  // no multiples of 5 left
  int fives = n / 5;                    // multiples of 5 in 1..n
  // 25, 125, ... carry EXTRA 5s -> recurse to count them again
  return fives + trailingZeroes(fives);
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 2026, min: 0, max: 10000 }],
  entry: (a) => `trailingZeroes(${Math.max(0, Math.trunc(a.n as number))})`,
  run({ fn, line, vars, narrate }, args) {
    const start = Math.max(0, Math.trunc(args.n as number))
    const trailingZeroes = fn(
      "trailingZeroes",
      (n: number): number => {
        line(2, `trailingZeroes(${n}): is n < 5? (${n < 5 ? `<b>yes — no multiple of 5 fits in 1..${n}, contribute 0</b>` : "no"})`)
        if (n < 5) return 0
        const fives = Math.floor(n / 5)
        vars({ n, fives })
        line(3, `⌊${n} / 5⌋ = <b>${fives}</b> numbers in 1..${n} are multiples of 5 — each donates at least one 5.`)
        line(5, `But 25-multiples donate a 2nd five, 125-multiples a 3rd… recursing on ${fives} counts exactly those extras.`)
        const extra = trailingZeroes(fives)
        line(5, `trailingZeroes(${n}) = ${fives} + ${extra} = <b>${fives + extra}</b>.`)
        return fives + extra
      },
      1,
    )
    narrate(
      `${start}! ends in a zero for every factor 10 = 2 × 5 it contains. Factors of 2 are everywhere (every 2nd number), so counting 5s alone — n/5 + n/25 + n/125 + … — gives the answer in O(log₅ n).`,
    )
    return trailingZeroes(start)
  },
}
