import type { SolutionDef } from "@/engine/types"

const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const width = (n: number): number => Math.max(1, n.toString(2).length)
const bits = (n: number): number[] => {
  const w = width(n)
  return Array.from({ length: w }, (_, i) => (n >> (w - 1 - i)) & 1)
}
const binW = (x: number, w: number): string => x.toString(2).padStart(w, "0")

export const complementOfBase10Integer: SolutionDef = {
  view: "array",
  array: (a) => bits(clamp(a.n as number)),
  code: `// flip every bit inside n's own bit-length
function bitwiseComplement(n) {
  if (n === 0) return 1;
  let mask = 0;
  while (mask < n) mask = (mask << 1) | 1; // grow all-ones
  return n ^ mask;      // XOR with 1s flips every bit
}`,
  codeJava: `// flip every bit inside n's own bit-length
int bitwiseComplement(int n) {
  if (n == 0) return 1;
  int mask = 0;
  while (mask < n) mask = (mask << 1) | 1; // grow all-ones
  return n ^ mask;      // XOR with 1s flips every bit
}`,
  inputs: [{ kind: "number", name: "n", label: "n (0–255)", default: 100, min: 0, max: 255 }],
  entry: (a) => `bitwiseComplement(${clamp(a.n as number)})`,
  run({ fn, line, mark, aset, vars, heap }, args) {
    const n = clamp(args.n as number)
    const w = width(n)
    const go = fn(
      "bitwiseComplement",
      (): number => {
        line(2, `n = ${n} = <b>${binW(n, w)}</b>₂ (${w} bits shown). ${n === 0 ? "Special case: 0's complement is defined as <b>1</b>." : "We must flip bits only inside this width — a plain ~n would also flip the 24+ leading zeros."}`)
        if (n === 0) return 1
        let mask = 0
        line(3, `Build an all-ones mask exactly as wide as n: start at mask = 0.`)
        heap("mask", `${mask} = ${binW(mask, w)}`)
        while (mask < n) {
          mask = (mask << 1) | 1
          line(4, `mask < n, so shift and append a 1: mask = <b>${binW(mask, w)}</b> (= ${mask}).`)
          heap("mask", `${mask} = ${binW(mask, w)}`)
          vars({ n, mask })
        }
        line(4, `mask = ${binW(mask, w)} ≥ n — it now covers all ${w} bits of n.`)
        let ans = 0
        for (let j = 0; j < w; j++) {
          const bit = (n >> (w - 1 - j)) & 1
          mark("focus", [j])
          const flipped = bit ^ 1
          ans = (ans << 1) | flipped
          line(5, `Bit ${w - 1 - j}: ${bit} ^ 1 = <b>${flipped}</b> — XOR with a 1 always flips.`)
          aset(j, flipped)
          mark("done", Array.from({ length: j + 1 }, (_, k) => k))
          vars({ bit: w - 1 - j, flipped, ans })
        }
        mark("focus", [])
        mark("good", Array.from({ length: w }, (_, k) => k))
        line(5, `n ^ mask = ${binW(n, w)} ^ ${binW(mask, w)} = <b>${binW(ans, w)}</b> = <b>${ans}</b>. O(log n) to build the mask, one XOR to flip.`)
        return ans
      },
      1,
    )
    return go()
  },
}
