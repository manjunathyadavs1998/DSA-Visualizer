import type { SolutionDef } from "@/engine/types"

const clean = (nums: number[]): number[] => nums.map((x) => Math.trunc(Math.abs(x)) & 255)
const bin = (x: number): string => x.toString(2).padStart(4, "0")

export const totalHammingDistance: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// per bit column: each (1,0) pair differs there
function totalHammingDistance(nums) {
  let total = 0;
  for (let bit = 0; bit < 8; bit++) {       // 32 on LeetCode
    let ones = 0;
    for (const x of nums) ones += (x >> bit) & 1;
    total += ones * (nums.length - ones);   // 1s × 0s pairs
  }
  return total;
}`,
  codeJava: `// per bit column: each (1,0) pair differs there
int totalHammingDistance(int[] nums) {
  int total = 0;
  for (int bit = 0; bit < 8; bit++) {       // 32 on LeetCode
    int ones = 0;
    for (int x : nums) ones += (x >> bit) & 1;
    total += ones * (nums.length - ones);   // 1s × 0s pairs
  }
  return total;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 14, 2, 7], maxLen: 12 }],
  entry: (a) => `totalHammingDistance([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, mark, vars, heap }, args) {
    const nums = clean(args.nums as number[])
    const n = nums.length
    const maxBit = Math.max(1, ...nums.map((x) => x.toString(2).length))
    const go = fn(
      "totalHammingDistance",
      (): number => {
        let total = 0
        line(2, `Don't compare all ${n * (n - 1) / 2} pairs — flip the loop: go <b>column by column</b>. In one bit column with k ones and ${n}−k zeros, exactly <b>k·(${n}−k)</b> pairs disagree there.`)
        heap("total", total)
        for (let bit = 0; bit < 8; bit++) {
          if (bit >= maxBit) {
            line(3, `Bits ${bit}..7 are <b>0 in every number</b> — ones = 0 contributes 0·${n} = 0 each. Skip ahead.`)
            break
          }
          let ones = 0
          const setIdx: number[] = []
          line(4, `Bit ${bit} (value ${1 << bit}): count how many numbers have a <b>1</b> in this column.`)
          for (let i = 0; i < n; i++) {
            const b = (nums[i] >> bit) & 1
            mark("focus", [i])
            ones += b
            if (b) setIdx.push(i)
            line(5, `nums[${i}] = ${nums[i]} = ${bin(nums[i])}₂ → bit ${bit} is <b>${b}</b>. ones = ${ones}.`)
            mark("good", [...setIdx])
          }
          mark("focus", [])
          const add = ones * (n - ones)
          total += add
          line(6, `Column ${bit}: <b>${ones}</b> ones (green) × <b>${n - ones}</b> zeros = <b>${add}</b> differing pairs → total = <b>${total}</b>.`)
          heap("total", total)
          vars({ bit, ones, zeros: n - ones, total })
          mark("good", [])
        }
        line(8, `Sum over columns = <b>${total}</b> — O(32·n) instead of O(n²) pairwise comparisons.`)
        return total
      },
      1,
    )
    return go()
  },
}
