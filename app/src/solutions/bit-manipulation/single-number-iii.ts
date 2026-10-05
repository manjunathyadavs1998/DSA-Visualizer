import type { SolutionDef } from "@/engine/types"

const clean = (nums: number[]): number[] => nums.map((x) => Math.trunc(Math.abs(x)) & 255)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)

export const singleNumberIII: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// two elements appear once, the rest twice
function singleNumber(nums) {
  let xorAll = 0;
  for (const x of nums) xorAll ^= x;   // pairs die → a ^ b
  const diff = xorAll & -xorAll;       // lowest differing bit
  let a = 0, b = 0;
  for (const x of nums) {
    if (x & diff) a ^= x;              // group: bit is 1
    else b ^= x;                       // group: bit is 0
  }
  return [a, b];                       // each group = Single Number I
}`,
  codeJava: `// two elements appear once, the rest twice
int[] singleNumber(int[] nums) {
  int xorAll = 0;
  for (int x : nums) xorAll ^= x;      // pairs die → a ^ b
  int diff = xorAll & -xorAll;         // lowest differing bit
  int a = 0, b = 0;
  for (int x : nums) {
    if ((x & diff) != 0) a ^= x;       // group: bit is 1
    else b ^= x;                       // group: bit is 0
  }
  return new int[]{a, b};              // each group = Single Number I
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 2, 1, 3, 2, 5], maxLen: 12 }],
  entry: (a) => `singleNumber([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = clean(args.nums as number[])
    const go = fn(
      "singleNumber",
      (): string => {
        let xorAll = 0
        heap("acc", `${xorAll} = ${bin(xorAll)}`)
        line(2, `Phase 1: XOR everything. Pairs cancel, so the accumulator will end as <b>a ^ b</b> — the two unique values mashed together.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          const next = xorAll ^ nums[i]
          line(3, `acc = ${bin(xorAll)} ^ ${bin(nums[i])} (= ${nums[i]}) → <b>${bin(next)}</b>.`)
          xorAll = next
          heap("acc", `${xorAll} = ${bin(xorAll)}`)
          vars({ i, xorAll })
        }
        mark("focus", [])
        const diff = xorAll & -xorAll
        heap("diff", `${diff} = ${bin(diff)}`)
        line(4, `acc = a ^ b = ${bin(xorAll)}. Any 1-bit is a place where <b>a and b disagree</b>. Isolate the lowest: ${bin(xorAll)} & ${bin(-xorAll)} (two's complement) = <b>${bin(diff)}</b>.`)
        let a = 0
        let b = 0
        line(5, `Phase 2: split by that bit. a and b land in <b>different groups</b>; every duplicate pair lands together — so each group reduces to Single Number I.`)
        const groupA: number[] = []
        const groupB: number[] = []
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (nums[i] & diff) {
            a ^= nums[i]
            groupA.push(i)
            line(7, `${nums[i]} (${bin(nums[i])}) has the diff bit <b>set</b> → group A, a → <b>${bin(a)}</b> (= ${a}).`)
            heap("a", `${a} = ${bin(a)}`)
          } else {
            b ^= nums[i]
            groupB.push(i)
            line(8, `${nums[i]} (${bin(nums[i])}) has the diff bit <b>clear</b> → group B, b → <b>${bin(b)}</b> (= ${b}).`)
            heap("b", `${b} = ${bin(b)}`)
          }
          mark("good", [...groupA])
          mark("window", [...groupB])
          vars({ i, a, b })
        }
        ptr("i", -1)
        mark("focus", [])
        line(10, `Each group's pairs cancelled: the two singles are <b>${a}</b> and <b>${b}</b>. Two linear passes, O(1) extra space.`)
        return `[${a},${b}]`
      },
      1,
    )
    return go()
  },
}
