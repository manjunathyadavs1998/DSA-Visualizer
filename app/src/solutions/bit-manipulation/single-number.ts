import type { SolutionDef } from "@/engine/types"

const clean = (nums: number[]): number[] => nums.map((x) => Math.trunc(Math.abs(x)) & 255)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)

export const singleNumber: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// every element appears twice except one
function singleNumber(nums) {
  let acc = 0;                 // x ^ x = 0, x ^ 0 = x
  for (const x of nums) {
    acc = acc ^ x;             // pairs cancel to 0
  }
  return acc;                  // only the lone value survives
}`,
  codeJava: `// every element appears twice except one
int singleNumber(int[] nums) {
  int acc = 0;                 // x ^ x = 0, x ^ 0 = x
  for (int x : nums) {
    acc = acc ^ x;             // pairs cancel to 0
  }
  return acc;                  // only the lone value survives
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 1, 2, 9, 1, 2, 9, 4, 7], maxLen: 12 }],
  entry: (a) => `singleNumber([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = clean(args.nums as number[])
    const go = fn(
      "singleNumber",
      (): number => {
        let acc = 0
        heap("acc", `${acc} = ${bin(acc)}`)
        line(2, `acc = <b>0</b>. XOR trick: <b>x ^ x = 0</b> and <b>x ^ 0 = x</b>, so every pair annihilates itself.`)
        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          ptr("i", i)
          mark("focus", [i])
          const seen = nums.slice(0, i).filter((v) => v === x).length
          line(3, `Take nums[${i}] = <b>${x}</b> = ${bin(x)}${seen % 2 === 1 ? ` — its earlier copy is already in acc, so this XOR will <b>cancel it out</b>` : ""}.`)
          const next = acc ^ x
          line(4, `acc = ${bin(acc)} ^ ${bin(x)} (= ${x}) → <b>${bin(next)}</b> (= <b>${next}</b>). Bits where acc and x differ stay 1; matching bits cancel.`)
          acc = next
          heap("acc", `${acc} = ${bin(acc)}`)
          vars({ i, x, acc })
          mark("done", Array.from({ length: i + 1 }, (_, k) => k))
        }
        ptr("i", -1)
        mark("focus", [])
        const lone = nums.indexOf(acc)
        if (lone >= 0) mark("good", [lone])
        line(6, `Every duplicate pair XORed itself to 0 — the accumulator holds the lone value <b>${acc}</b> (${bin(acc)}). O(n) time, O(1) space, no hash map.`)
        return acc
      },
      1,
    )
    return go()
  },
}
