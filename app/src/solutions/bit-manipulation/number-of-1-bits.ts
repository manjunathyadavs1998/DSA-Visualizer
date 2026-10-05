import type { SolutionDef } from "@/engine/types"

const W = 8
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const numberOf1Bits: SolutionDef = {
  view: "array",
  array: (a) => bits(a.n as number),
  code: `// Kernighan: n & (n-1) kills the lowest set bit
function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // one 1-bit gone per loop
    count++;
  }
  return count;      // loops = number of set bits
}`,
  codeJava: `// Kernighan: n & (n-1) kills the lowest set bit
int hammingWeight(int n) {
  int count = 0;
  while (n != 0) {
    n = n & (n - 1); // one 1-bit gone per loop
    count++;
  }
  return count;      // loops = number of set bits
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 219, min: 0, max: 255 }],
  entry: (a) => `hammingWeight(${a.n})`,
  run({ fn, line, mark, aset, vars, heap }, args) {
    const start = args.n as number
    const go = fn(
      "hammingWeight",
      (n: number): number => {
        let count = 0
        const cleared: number[] = []
        line(2, `n = <b>${bin(n)}</b> (= ${n}). The bit trick: <b>n − 1</b> flips the lowest 1 to 0 and all zeros below it to 1 — so <b>n & (n−1)</b> erases exactly that lowest 1.`)
        heap("n", `${n} = ${bin(n)}`)
        while (n !== 0) {
          const low = n & -n
          const idx = W - 1 - Math.log2(low)
          mark("focus", [idx])
          const next = n & (n - 1)
          line(4, `${bin(n)} & ${bin(n - 1)} = <b>${bin(next)}</b> — the lowest set bit (value ${low}) is gone; no scanning of zero bits needed.`)
          cleared.push(idx)
          aset(idx, 0)
          mark("bad", [...cleared])
          mark("focus", [])
          n = next
          heap("n", `${n} = ${bin(n)}`)
          count++
          line(5, `count = <b>${count}</b>. Remaining n = ${bin(n)}${n === 0 ? " — nothing left" : ""}.`)
          vars({ n, count })
        }
        line(7, `The loop ran once per set bit — <b>${count}</b> ones in ${bin(start)}. O(k) where k = set bits, not O(32).`)
        return count
      },
      1,
    )
    return go(start)
  },
}
