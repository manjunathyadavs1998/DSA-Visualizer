import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (a: number[]) => a.map((v) => Math.max(1, Math.trunc(v)))

export const subarrayProductLessThanK: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// count subarrays whose product is strictly < k
function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;               // nothing can be < k
  let left = 0, product = 1, count = 0;
  for (let right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= k) {            // too big: shrink
      product /= nums[left];
      left++;
    }
    count += right - left + 1;        // subarrays ending at right
  }
  return count;
}`,
  codeJava: `// count subarrays whose product is strictly < k
int numSubarrayProductLessThanK(int[] nums, int k) {
  if (k <= 1) return 0;               // nothing can be < k
  int left = 0, product = 1, count = 0;
  for (int right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= k) {            // too big: shrink
      product /= nums[left];
      left++;
    }
    count += right - left + 1;        // subarrays ending at right
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (≥1)", default: [10, 5, 2, 6, 4, 3, 8], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 100, min: 0, max: 10000 },
  ],
  entry: (a) => `numSubarrayProductLessThanK([${clean(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const k = Math.trunc(args.k as number)
    const go = fn(
      "numSubarrayProductLessThanK",
      (): number => {
        if (k <= 1) {
          line(2, `k = ${k} ≤ 1 and every element is ≥ 1 → no product can be < k. Return <b>0</b>.`)
          return 0
        }
        line(2, `k = ${k} > 1, so windows can qualify. Count windows, not elements!`)
        let left = 0
        let product = 1
        let count = 0
        ptr("left", 0)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          product *= nums[right]
          mark("window", win(left, right))
          line(5, `product ×= nums[${right}] = ${nums[right]} → product = <b>${product}</b>.`)
          while (product >= k) {
            line(6, `product ${product} ≥ k ${k} — the window is invalid, shrink.`)
            product /= nums[left]
            mark("bad", [left])
            line(7, `product ÷= nums[${left}] = ${nums[left]} → product = <b>${product}</b>.`)
            left++
            ptr("left", left)
            mark("bad", [])
            mark("window", win(left, right))
          }
          count += right - left + 1
          line(10, `Every subarray ending at ${right} and starting in [${left}..${right}] works: +<b>${right - left + 1}</b> → count = <b>${count}</b>.`)
          vars({ left, right, product, count })
        }
        mark("focus", [])
        mark("window", [])
        line(12, `Total subarrays with product < ${k}: <b>${count}</b>. The "+= window length" trick counts them all without double-counting.`)
        return count
      },
      1,
    )
    return go()
  },
}
