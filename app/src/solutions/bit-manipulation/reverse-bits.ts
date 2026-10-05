import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const reverseBits: SolutionDef = {
  view: "array",
  array: (a) => [...bits(clamp(a.n as number)), "→", ...Array.from({ length: W }, () => 0)],
  code: `// 8-bit demo of LeetCode's 32-bit reverse
function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 8; i++) {
    res = (res << 1) | (n & 1); // push n's low bit into res
    n = n >> 1;                 // consume that bit
  }
  return res;
}`,
  codeJava: `// 8-bit demo of LeetCode's 32-bit reverse
int reverseBits(int n) {
  int res = 0;
  for (int i = 0; i < 8; i++) {
    res = (res << 1) | (n & 1); // push n's low bit into res
    n = n >> 1;                 // consume that bit
  }
  return res;
}`,
  inputs: [{ kind: "number", name: "n", label: "n (0–255)", default: 178, min: 0, max: 255 }],
  entry: (a) => `reverseBits(${clamp(a.n as number)})`,
  run({ fn, line, mark, aset, vars, heap }, args) {
    const start = clamp(args.n as number)
    const go = fn(
      "reverseBits",
      (n: number): number => {
        let res = 0
        line(2, `n = <b>${bin(n)}</b> (= ${n}). Plan: peel bits off n's <b>right</b> end and push them into res's <b>right</b> end — ${W} shifts flip the whole order (LeetCode uses 32).`)
        heap("res", `${res} = ${bin(res)}`)
        for (let i = 0; i < W; i++) {
          const bit = n & 1
          const srcIdx = W - 1 - i
          mark("focus", [srcIdx])
          res = (res << 1) | bit
          line(4, `Round ${i + 1}: n's low bit = <b>${bit}</b>. res <<= 1 then OR it in: res = <b>${bin(res)}</b> — bit ${i} of the input becomes bit ${W - 1 - i} of the output.`)
          aset(W + 1 + i, bit)
          mark("good", Array.from({ length: i + 1 }, (_, k) => W + 1 + k))
          n = n >> 1
          line(5, `n >>= 1 → <b>${bin(n)}</b>: that bit is consumed; the next one is now in the low slot.`)
          heap("res", `${res} = ${bin(res)}`)
          vars({ i, bit, n, res })
        }
        mark("focus", [])
        line(7, `All ${W} bits mirrored: ${bin(start)} → <b>${bin(res)}</b> (= ${res}). A fixed number of shift/OR steps — O(1).`)
        return res
      },
      1,
    )
    return go(start)
  },
}
