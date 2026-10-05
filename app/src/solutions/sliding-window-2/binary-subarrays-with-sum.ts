import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (a: number[]) => a.map((v) => (v === 1 ? 1 : 0))

export const binarySubarraysWithSum: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// exactly(goal) = atMost(goal) - atMost(goal - 1)
function numSubarraysWithSum(nums, goal) {
  return atMost(nums, goal) - atMost(nums, goal - 1);
}
function atMost(nums, g) {
  if (g < 0) return 0;
  let left = 0, sum = 0, count = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > g) {                 // too big: shrink
      sum -= nums[left];
      left++;
    }
    count += right - left + 1;        // windows ending at right
  }
  return count;
}`,
  codeJava: `// exactly(goal) = atMost(goal) - atMost(goal - 1)
int numSubarraysWithSum(int[] nums, int goal) {
  return atMost(nums, goal) - atMost(nums, goal - 1);
}
int atMost(int[] nums, int g) {
  if (g < 0) return 0;
  int left = 0, sum = 0, count = 0;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > g) {                 // too big: shrink
      sum -= nums[left];
      left++;
    }
    count += right - left + 1;        // windows ending at right
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (0/1)", default: [1, 0, 1, 0, 1], maxLen: 12 },
    { kind: "number", name: "goal", label: "goal", default: 2, min: 0, max: 12 },
  ],
  entry: (a) => `numSubarraysWithSum([${clean(a.nums as number[]).join(",")}], ${a.goal})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const goal = Math.max(0, Math.trunc(args.goal as number))
    const atMost = fn(
      "atMost",
      (g: number): number => {
        if (g < 0) {
          line(5, `atMost(−1): a sum can't be ≤ −1 with 0/1 values → <b>0</b> windows.`)
          return 0
        }
        let left = 0
        let sum = 0
        let count = 0
        ptr("left", 0)
        line(6, `atMost(${g}): count windows whose sum of 1s is ≤ <b>${g}</b>.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += nums[right]
          mark("window", win(left, right))
          line(8, `sum += nums[${right}] = ${nums[right]} → sum = <b>${sum}</b>.`)
          while (sum > g) {
            sum -= nums[left]
            line(10, `sum ${sum + nums[left]} > ${g}: drop nums[${left}] = ${nums[left]} → sum = <b>${sum}</b>.`)
            left++
            ptr("left", left)
            mark("window", win(left, right))
          }
          count += right - left + 1
          line(13, `All ${right - left + 1} windows ending at ${right} have sum ≤ ${g} → count = <b>${count}</b>.`)
          vars({ g, left, right, sum, count })
        }
        mark("focus", [])
        mark("window", [])
        line(15, `atMost(${g}) = <b>${count}</b>.`)
        return count
      },
      4,
    )
    const go = fn(
      "numSubarraysWithSum",
      (): number => {
        line(2, `"Exactly ${goal}" is hard to shrink on directly — compute <b>atMost(${goal}) − atMost(${goal - 1})</b> instead.`)
        const hi = atMost(goal)
        const lo = atMost(goal - 1)
        line(2, `exactly(${goal}) = ${hi} − ${lo} = <b>${hi - lo}</b>.`)
        return hi - lo
      },
      1,
    )
    return go()
  },
}
