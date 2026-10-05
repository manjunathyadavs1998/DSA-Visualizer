import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const powerOfFour: SolutionDef = {
  view: "array",
  array: (a) => bits(clamp(a.n as number)),
  code: `// one set bit, AND it must sit on an EVEN position
function isPowerOfFour(n) {
  if (n <= 0) return false;
  if ((n & (n - 1)) !== 0) return false; // not a power of 2
  return (n & 0x55555555) !== 0;         // 0101…: even slots
}`,
  codeJava: `// one set bit, AND it must sit on an EVEN position
boolean isPowerOfFour(int n) {
  if (n <= 0) return false;
  if ((n & (n - 1)) != 0) return false;  // not a power of 2
  return (n & 0x55555555) != 0;          // 0101…: even slots
}`,
  inputs: [{ kind: "number", name: "n", label: "n (0–255)", default: 64, min: 0, max: 255 }],
  entry: (a) => `isPowerOfFour(${clamp(a.n as number)})`,
  run({ fn, line, mark, vars, heap }, args) {
    const n = clamp(args.n as number)
    const go = fn(
      "isPowerOfFour",
      (): boolean => {
        line(2, `n = ${n} = <b>${bin(n)}</b>. Powers of 4 are 1, 100, 10000, …₂ — <b>one set bit on an even position</b> (bit 0, 2, 4, …). ${n <= 0 ? "n ≤ 0 → <b>false</b> immediately." : "Positive — run the two bit tests."}`)
        if (n <= 0) return false
        heap("n", `${n} = ${bin(n)}`)
        const cleared = n & (n - 1)
        const setIdx: number[] = []
        for (let j = 0; j < W; j++) {
          const b = (n >> (W - 1 - j)) & 1
          if (b) setIdx.push(j)
          mark("focus", [j])
          line(3, `Scan bit ${W - 1 - j}: <b>${b}</b> — set bits so far: ${setIdx.length}.`)
          mark("good", [...setIdx])
        }
        mark("focus", [])
        line(3, `Test 1: n & (n−1) = ${bin(n)} & ${bin(n - 1)} = <b>${bin(cleared)}</b> — ${cleared === 0 ? "zero, so there is exactly <b>one</b> set bit (a power of 2)" : `non-zero: ${setIdx.length} set bits → not even a power of 2 → <b>false</b>`}.`)
        vars({ n, "n&(n-1)": cleared })
        if (cleared !== 0) {
          mark("bad", [...setIdx])
          return false
        }
        const pos = W - 1 - setIdx[0]
        const even = (n & 0x55) !== 0
        mark("window", [7, 5, 3, 1])
        line(4, `Test 2: AND with mask 0x55 = <b>01010101</b> (even positions highlighted). The single 1 sits at position <b>${pos}</b> — ${pos % 2 === 0 ? `even, and 4^${pos / 2} = ${n}` : "odd, so n is 2·4^k, not 4^k"} → n & 0x55 ${even ? "≠ 0 → <b>true</b>" : "= 0 → <b>false</b>"}.`)
        if (even) mark("good", [...setIdx])
        else mark("bad", [...setIdx])
        vars({ pos, "n&0x55": n & 0x55 })
        return even
      },
      1,
    )
    return go()
  },
}
