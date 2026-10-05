import type { SolutionDef } from "@/engine/types"

const clampN = (n: number): number => Math.max(1, Math.min(15, Math.trunc(n)))
const bin = (x: number): string => x.toString(2)

export const countingBits: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: clampN(a.n as number) + 1 }, () => 0),
  code: `// bits[i] = bits[i >> 1] + (i & 1)
function countBits(n) {
  const bits = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    bits[i] = bits[i >> 1] + (i & 1); // reuse i/2's answer
  }
  return bits;
}`,
  codeJava: `// bits[i] = bits[i >> 1] + (i & 1)
int[] countBits(int n) {
  int[] bits = new int[n + 1];
  for (int i = 1; i <= n; i++) {
    bits[i] = bits[i >> 1] + (i & 1); // reuse i/2's answer
  }
  return bits;
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 10, min: 1, max: 15 }],
  entry: (a) => `countBits(${clampN(a.n as number)})`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const n = clampN(args.n as number)
    const go = fn(
      "countBits",
      (): string => {
        const dp = new Array<number>(n + 1).fill(0)
        line(2, `The cell at index i will hold <b>popcount(i)</b>. bits[0] = 0 — the number 0 has no set bits. DP insight: <b>i >> 1</b> is i with its last binary digit chopped off.`)
        aset(0, 0)
        mark("done", [0])
        for (let i = 1; i <= n; i++) {
          ptr("i", i)
          ptr("i>>1", i >> 1)
          mark("focus", [i])
          mark("window", [i >> 1])
          line(3, `i = ${i}: ${i % 2 === 0 ? `even — same 1s as ${i >> 1}, just shifted left` : `odd — one more 1 than ${i >> 1}`}.`)
          dp[i] = dp[i >> 1] + (i & 1)
          line(4, `i = ${i} = <b>${bin(i)}</b>₂. Chop the last digit: ${i} >> 1 = ${i >> 1} (<b>${bin(i >> 1)}</b>₂, already solved → ${dp[i >> 1]} ones) and add the chopped digit i & 1 = <b>${i & 1}</b> → bits[${i}] = <b>${dp[i]}</b>.`)
          aset(i, dp[i])
          mark("done", Array.from({ length: i + 1 }, (_, k) => k))
          vars({ i, "i>>1": i >> 1, "i&1": i & 1, "bits[i]": dp[i] })
        }
        ptr("i", -1)
        ptr("i>>1", -1)
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: n + 1 }, (_, k) => k))
        line(6, `Done in one pass: each answer was one shift + one add on top of a smaller answer — <b>O(n)</b> total, no per-number popcount loop.`)
        return `[${dp.join(",")}]`
      },
      1,
    )
    return go()
  },
}
