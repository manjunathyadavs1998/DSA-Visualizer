import type { SolutionDef } from "@/engine/types"

const clean = (nums: number[]): number[] => nums.map((x) => Math.trunc(Math.abs(x)) & 255)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)

export const missingNumber: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// nums holds 0..n with one value missing
function missingNumber(nums) {
  let acc = nums.length;       // seed with the index n itself
  for (let i = 0; i < nums.length; i++) {
    acc = acc ^ i ^ nums[i];   // pair every index with a value
  }
  return acc;                  // the index nobody matched
}`,
  codeJava: `// nums holds 0..n with one value missing
int missingNumber(int[] nums) {
  int acc = nums.length;       // seed with the index n itself
  for (int i = 0; i < nums.length; i++) {
    acc = acc ^ i ^ nums[i];   // pair every index with a value
  }
  return acc;                  // the index nobody matched
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (0..n, one missing)", default: [8, 6, 4, 2, 3, 5, 7, 0, 1], maxLen: 12 }],
  entry: (a) => `missingNumber([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = clean(args.nums as number[])
    const go = fn(
      "missingNumber",
      (): number => {
        let acc = nums.length
        heap("acc", `${acc} = ${bin(acc)}`)
        line(2, `XOR all indices <b>0..${nums.length}</b> against all values. Every value that IS present pairs with its equal index and cancels (x ^ x = 0). Seed acc with <b>${nums.length}</b> so index n joins the party.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          line(3, `i = ${i}: fold in the index <b>${i}</b> and the value <b>${nums[i]}</b> — if ${nums[i]} ever meets index ${nums[i]}, the two annihilate.`)
          const next = acc ^ i ^ nums[i]
          line(4, `acc ^ i ^ nums[i] = ${bin(acc)} ^ ${bin(i)} (i=${i}) ^ ${bin(nums[i])} (${nums[i]}) → <b>${bin(next)}</b> (= ${next}).`)
          acc = next
          heap("acc", `${acc} = ${bin(acc)}`)
          vars({ i, "nums[i]": nums[i], acc })
          mark("done", Array.from({ length: i + 1 }, (_, k) => k))
        }
        ptr("i", -1)
        mark("focus", [])
        line(6, `Every present value met its matching index and vanished — the survivor is the missing number <b>${acc}</b>. Same idea as the sum formula, but XOR can never overflow.`)
        return acc
      },
      1,
    )
    return go()
  },
}
