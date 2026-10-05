import type { SolutionDef } from "@/engine/types"

const clean = (nums: number[]): number[] => nums.map((x) => Math.trunc(Math.abs(x)) & 255)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)

export const singleNumberII: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// every element appears 3 times except one
function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (const x of nums) {
    ones = (ones ^ x) & ~twos; // bits seen 1× (mod 3)
    twos = (twos ^ x) & ~ones; // bits seen 2× (mod 3)
  }
  return ones;                 // 3rd sighting wipes both
}`,
  codeJava: `// every element appears 3 times except one
int singleNumber(int[] nums) {
  int ones = 0, twos = 0;
  for (int x : nums) {
    ones = (ones ^ x) & ~twos; // bits seen 1× (mod 3)
    twos = (twos ^ x) & ~ones; // bits seen 2× (mod 3)
  }
  return ones;                 // 3rd sighting wipes both
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [5, 2, 5, 9, 5, 2, 2], maxLen: 12 }],
  entry: (a) => `singleNumber([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = clean(args.nums as number[])
    const go = fn(
      "singleNumber",
      (): number => {
        let ones = 0
        let twos = 0
        heap("ones", `${ones} = ${bin(ones)}`)
        heap("twos", `${twos} = ${bin(twos)}`)
        line(2, `Two registers act as a per-bit <b>mod-3 counter</b>: a bit lives in <b>ones</b> after 1 sighting, moves to <b>twos</b> after 2, and vanishes from both after 3.`)
        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          ptr("i", i)
          mark("focus", [i])
          const nextOnes = (ones ^ x) & ~twos
          line(4, `x = ${x} (${bin(x)}): ones = (${bin(ones)} ^ ${bin(x)}) & ~${bin(twos)} → <b>${bin(nextOnes)}</b>. XOR toggles x's bits in; <b>& ~twos</b> blocks any bit already seen twice.`)
          ones = nextOnes
          heap("ones", `${ones} = ${bin(ones)}`)
          const nextTwos = (twos ^ x) & ~ones
          line(5, `twos = (${bin(twos)} ^ ${bin(x)}) & ~${bin(ones)} → <b>${bin(nextTwos)}</b>. A bit leaving ones lands in twos; a bit leaving twos (3rd time) is erased by <b>& ~ones</b>.`)
          twos = nextTwos
          heap("twos", `${twos} = ${bin(twos)}`)
          vars({ i, x, ones, twos })
          mark("done", Array.from({ length: i + 1 }, (_, k) => k))
        }
        ptr("i", -1)
        mark("focus", [])
        const lone = nums.indexOf(ones)
        if (lone >= 0) mark("good", [lone])
        line(7, `Every triple cancelled itself (count mod 3 = 0); bits seen exactly once remain in ones = <b>${ones}</b> (${bin(ones)}).`)
        return ones
      },
      1,
    )
    return go()
  },
}
