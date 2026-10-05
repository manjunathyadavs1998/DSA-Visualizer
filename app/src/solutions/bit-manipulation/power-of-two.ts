import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const powerOfTwo: SolutionDef = {
  view: "array",
  // left 8 cells: n, separator, right 8 cells: n-1
  array: (a) => {
    const n = clamp(a.n as number)
    return [...bits(n), "&", ...bits(n > 0 ? n - 1 : 0)]
  },
  code: `// a power of two has exactly ONE set bit
function isPowerOfTwo(n) {
  if (n <= 0) return false;
  const cleared = n & (n - 1); // kills the lowest set bit
  return cleared === 0;        // nothing left → one bit only
}`,
  codeJava: `// a power of two has exactly ONE set bit
boolean isPowerOfTwo(int n) {
  if (n <= 0) return false;
  int cleared = n & (n - 1);   // kills the lowest set bit
  return cleared == 0;         // nothing left → one bit only
}`,
  inputs: [{ kind: "number", name: "n", label: "n (0–255)", default: 64, min: 0, max: 255 }],
  entry: (a) => `isPowerOfTwo(${clamp(a.n as number)})`,
  run({ fn, line, mark, vars, heap }, args) {
    const n = clamp(args.n as number)
    const go = fn(
      "isPowerOfTwo",
      (): boolean => {
        line(2, `n = ${n}. ${n <= 0 ? "n ≤ 0 can never be a power of two → <b>false</b>." : "Positive — on to the one-bit test."}`)
        if (n <= 0) return false
        line(3, `The trick: n − 1 = <b>${bin(n - 1)}</b> flips n's lowest 1 and every 0 below it, leaving all <b>higher</b> bits untouched. AND the two rows bit by bit:`)
        heap("n", `${n} = ${bin(n)}`)
        heap("n-1", `${n - 1} = ${bin(n - 1)}`)
        let cleared = 0
        for (let j = 0; j < W; j++) {
          const bitN = (n >> (W - 1 - j)) & 1
          const bitM = ((n - 1) >> (W - 1 - j)) & 1
          mark("focus", [j, W + 1 + j])
          const and = bitN & bitM
          cleared = (cleared << 1) | and
          line(3, `Bit ${W - 1 - j}: ${bitN} & ${bitM} = <b>${and}</b>${and ? " — a set bit survives above the lowest 1, so n has ≥ 2 set bits" : ""}. Partial result: ${bin(cleared << (W - 1 - j)).slice(0, j + 1)}…`)
          if (and) mark("bad", [j, W + 1 + j])
          vars({ bit: W - 1 - j, and, cleared })
        }
        mark("focus", [])
        if (cleared === 0) mark("good", Array.from({ length: W }, (_, k) => k))
        line(4, `n & (n−1) = <b>${bin(cleared)}</b>${cleared === 0 ? " — erasing the lowest 1 erased EVERYTHING, so n had exactly one set bit → <b>true</b>" : ` ≠ 0 — other 1s remain, so ${n} is not a power of two → <b>false</b>`}. One AND, O(1).`)
        return cleared === 0
      },
      1,
    )
    return go()
  },
}
