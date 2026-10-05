import type { SolutionDef } from "@/engine/types"

export const maximumSumCircularSubarray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// max subarray sum when the array wraps around
function maxSubarraySumCircular(nums) {
  let total = 0;
  let maxCur = 0, maxSum = -Infinity;  // best straight
  let minCur = 0, minSum = Infinity;   // worst straight
  for (const x of nums) {
    total += x;
    maxCur = Math.max(maxCur + x, x);
    maxSum = Math.max(maxSum, maxCur);
    minCur = Math.min(minCur + x, x);
    minSum = Math.min(minSum, minCur);
  }
  if (maxSum < 0) return maxSum;       // all negative
  return Math.max(maxSum, total - minSum);
}`,
  codeJava: `// max subarray sum when the array wraps around
int maxSubarraySumCircular(int[] nums) {
  int total = 0;
  int maxCur = 0, maxSum = Integer.MIN_VALUE;
  int minCur = 0, minSum = Integer.MAX_VALUE;
  for (int x : nums) {
    total += x;
    maxCur = Math.max(maxCur + x, x);
    maxSum = Math.max(maxSum, maxCur);
    minCur = Math.min(minCur + x, x);
    minSum = Math.min(minSum, minCur);
  }
  if (maxSum < 0) return maxSum;       // all negative
  return Math.max(maxSum, total - minSum);
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [5, -3, 5, -2, 4], maxLen: 10 }],
  entry: (a) => `maxSubarraySumCircular([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "maxSubarraySumCircular",
      (): number => {
        let total = 0
        let maxCur = 0
        let maxSum = -Infinity
        let minCur = 0
        let minSum = Infinity
        line(4, `Run <b>two Kadanes at once</b>: the best subarray (straight case) and the WORST one (wrap case).`)
        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          ptr("i", i)
          mark("focus", [i])
          total += x
          line(6, `total += ${x} → <b>${total}</b>.`)
          maxCur = Math.max(maxCur + x, x)
          line(7, `maxCur = max(extend, restart at ${x}) = <b>${maxCur}</b>.`)
          maxSum = Math.max(maxSum, maxCur)
          line(8, `Best straight subarray so far: maxSum = <b>${maxSum}</b>.`)
          minCur = Math.min(minCur + x, x)
          line(9, `minCur = min(extend, restart at ${x}) = <b>${minCur}</b>.`)
          minSum = Math.min(minSum, minCur)
          vars({ i, total, maxSum, minSum })
          line(10, `Worst straight subarray so far: minSum = <b>${minSum}</b>.`)
          heap("prefix", { total, maxCur, maxSum, minCur, minSum })
        }
        ptr("i", -1)
        mark("focus", [])
        line(12, `All negative? (${maxSum < 0 ? `<b>yes</b> — the "wrap" would be empty, so just take maxSum = ${maxSum}` : "no — compare both cases"})`)
        if (maxSum < 0) return maxSum
        const wrap = total - minSum
        line(13, `Wrap case = total − minSum = ${total} − (${minSum}) = <b>${wrap}</b>. Answer = max(${maxSum}, ${wrap}) = <b>${Math.max(maxSum, wrap)}</b>.`)
        return Math.max(maxSum, wrap)
      },
      1,
    )
    narrate("A wrapping subarray is the whole array minus a straight 'hole' in the middle — so maximize the wrap by MINIMIZING the hole with a second Kadane.")
    return go()
  },
}
