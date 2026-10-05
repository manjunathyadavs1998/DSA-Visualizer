import type { SolutionDef } from "@/engine/types"

export const maxSumSubarraySizeK: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums and k editable (fixed-size window)
function maxSumSubarray(nums, k) {
  let sum = 0, best = -Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];                     // take right edge in
    if (right >= k) sum -= nums[right - k]; // drop left edge out
    if (right >= k - 1) best = Math.max(best, sum);
  }
  return best;
}`,
  codeJava: `// int[] nums; int k (fixed-size window)
int maxSumSubarray(int[] nums, int k) {
  int sum = 0, best = Integer.MIN_VALUE;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];                     // take right edge in
    if (right >= k) sum -= nums[right - k]; // drop left edge out
    if (right >= k - 1) best = Math.max(best, sum);
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [2, 1, 5, 1, 3, 2], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 10 },
  ],
  entry: (a) => `maxSumSubarray([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const k = Math.min(args.k as number, nums.length)
    const go = fn(
      "maxSumSubarray",
      (): number => {
        let sum = 0
        let best = -Infinity
        let bestL = 0
        line(2, `Fixed window of size ${k}: add the new right edge, drop the old left edge — never re-sum.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += nums[right]
          line(4, `sum += nums[${right}] = ${nums[right]} → sum = <b>${sum}</b>.`)
          if (right >= k) {
            sum -= nums[right - k]
            mark("bad", [right - k])
            line(5, `Index ${right - k} slid out → subtract ${nums[right - k]} → sum = <b>${sum}</b>.`)
            mark("bad", [])
          }
          const left = Math.max(0, right - k + 1)
          ptr("left", left)
          mark("window", Array.from({ length: right - left + 1 }, (_, x) => left + x))
          if (right >= k - 1) {
            if (sum > best) {
              best = sum
              bestL = left
              line(6, `Window [${left}..${right}] sums to ${sum} — <b>new best!</b>`)
            } else {
              line(6, `Window [${left}..${right}] sums to ${sum} — best stays ${best}.`)
            }
          }
          vars({ sum, best: best === -Infinity ? "-∞" : best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: k }, (_, x) => bestL + x))
        line(8, `Best sum of any ${k}-window: <b>${best}</b> (green). One pass — O(n), not O(n·k).`)
        return best
      },
      1,
    )
    return go()
  },
}
