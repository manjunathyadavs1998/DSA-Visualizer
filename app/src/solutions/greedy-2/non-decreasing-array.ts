import type { SolutionDef } from "@/engine/types"

const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.trunc(v))
  return out.length ? out : [1, 4, 2, 3, 3, 5, 6]
}

export const nonDecreasingArray: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// at the first dip, decide WHICH side to flatten
function checkPossibility(nums) {
  let fixed = false;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] <= nums[i + 1]) continue;  // no dip here
    if (fixed) return false;      // a second dip: hopeless
    if (i === 0 || nums[i - 1] <= nums[i + 1])
      nums[i] = nums[i + 1];      // lower the peak
    else
      nums[i + 1] = nums[i];      // raise the valley
    fixed = true;
  }
  return true;
}`,
  codeJava: `// at the first dip, decide WHICH side to flatten
boolean checkPossibility(int[] nums) {
  boolean fixed = false;
  for (int i = 0; i < nums.length - 1; i++) {
    if (nums[i] <= nums[i + 1]) continue;  // no dip here
    if (fixed) return false;      // a second dip: hopeless
    if (i == 0 || nums[i - 1] <= nums[i + 1])
      nums[i] = nums[i + 1];      // lower the peak
    else
      nums[i + 1] = nums[i];      // raise the valley
    fixed = true;
  }
  return true;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (may modify at most ONE element)", default: [1, 4, 2, 3, 3, 5, 6], maxLen: 12 },
  ],
  entry: (a) => `checkPossibility([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, aset, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const solve = fn(
      "checkPossibility",
      (): boolean => {
        let fixed = false
        vars({ fixed })
        line(2, `Budget: <b>one</b> modification. Scan left to right and spend it on the first "dip".`)
        for (let i = 0; i < nums.length - 1; i++) {
          ptr("i", i)
          mark("focus", [i, i + 1])
          if (nums[i] <= nums[i + 1]) {
            line(4, `nums[${i}]=${nums[i]} ≤ nums[${i + 1}]=${nums[i + 1]} — in order, keep scanning.`)
            continue
          }
          line(4, `nums[${i}]=${nums[i]} > nums[${i + 1}]=${nums[i + 1]} — a <b>dip</b>!`)
          if (fixed) {
            mark("bad", [i, i + 1])
            line(5, `Second dip and the budget is spent → <b>false</b>.`)
            return false
          }
          line(6, `Which side to change? Look at the left context: ${i === 0 ? "no left neighbor — lowering the peak is free" : `nums[${i - 1}]=${nums[i - 1]} ${nums[i - 1] <= nums[i + 1] ? "≤" : ">"} nums[${i + 1}]=${nums[i + 1]}`}.`)
          if (i === 0 || nums[i - 1] <= nums[i + 1]) {
            nums[i] = nums[i + 1]
            aset(i, nums[i])
            mark("good", [i])
            line(7, `<b>Lower the peak</b>: nums[${i}] = ${nums[i + 1]}. Lowering never endangers the future — raising might.`)
          } else {
            nums[i + 1] = nums[i]
            aset(i + 1, nums[i + 1])
            mark("good", [i + 1])
            line(9, `Lowering nums[${i}] would break order with ${nums[i - 1]} on its left — <b>raise the valley</b> instead: nums[${i + 1}] = ${nums[i]}.`)
          }
          fixed = true
          vars({ fixed })
          line(10, `Budget spent — any further dip means failure.`)
        }
        ptr("i", -1)
        mark("focus", [])
        line(12, `At most one dip, and it was repairable → <b>true</b>.`)
        return true
      },
      1,
    )
    narrate(`The greedy subtlety: at a dip, prefer LOWERING nums[i] (safe for the future); raise nums[i+1] only when the left neighbor forces it.`)
    return solve()
  },
}
