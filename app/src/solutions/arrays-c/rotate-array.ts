import type { SolutionDef } from "@/engine/types"

export const rotateArray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// rotate right by k steps, in place
function rotate(nums, k) {
  const n = nums.length;
  k %= n;                       // k ≥ n just wraps
  reverse(nums, 0, n - 1);      // 1) whole array
  reverse(nums, 0, k - 1);      // 2) first k
  reverse(nums, k, n - 1);      // 3) the rest
  return nums;
}
function reverse(a, i, j) {
  while (i < j) {
    [a[i], a[j]] = [a[j], a[i]];
    i++; j--;
  }
}`,
  codeJava: `// rotate right by k steps, in place
void rotate(int[] nums, int k) {
  int n = nums.length;
  k %= n;                       // k ≥ n just wraps
  reverse(nums, 0, n - 1);      // 1) whole array
  reverse(nums, 0, k - 1);      // 2) first k
  reverse(nums, k, n - 1);      // 3) the rest
  return;
}
void reverse(int[] a, int i, int j) {
  while (i < j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
    i++; j--;
  }
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3, 4, 5, 6, 7], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 3, min: 0, max: 20 },
  ],
  entry: (a) => `rotate([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, aset, vars, narrate }, args) {
    const nums = [...(args.nums as number[])]
    if (!nums.length) nums.push(1, 2, 3, 4, 5, 6, 7)
    const kRaw = Math.max(0, Math.trunc(args.k as number))
    const reverse = fn(
      "reverse",
      (lo: number, hi: number): void => {
        let i = lo
        let j = hi
        while (i < j) {
          ptr("i", i)
          ptr("j", j)
          mark("focus", [i, j])
          ;[nums[i], nums[j]] = [nums[j], nums[i]]
          aset(i, nums[i])
          aset(j, nums[j])
          vars({ i, j })
          line(12, `Swap ends: nums[${i}] ↔ nums[${j}] → <b>${nums[i]}</b> … <b>${nums[j]}</b>.`)
          i++
          j--
          line(13, `Pinch inward: i = ${i}, j = ${j}${i < j ? "" : " — pointers met, segment reversed"}.`)
        }
        ptr("i", -1)
        ptr("j", -1)
        mark("focus", [])
      },
      10,
    )
    const go = fn(
      "rotate",
      (): number[] => {
        const n = nums.length
        const k = kRaw % n
        vars({ n, k })
        line(3, `k = ${kRaw} mod ${n} = <b>${k}</b> — rotating by n is a no-op, only the remainder matters.`)
        line(4, `Step 1: reverse <b>everything</b> — the last ${k} items are now in front, but both halves are backwards.`)
        mark("window", Array.from({ length: n }, (_, x) => x))
        reverse(0, n - 1)
        line(5, `Step 2: reverse the <b>first ${k}</b> (indices 0..${k - 1}) to restore their order.`)
        mark("window", Array.from({ length: k }, (_, x) => x))
        if (k > 1) reverse(0, k - 1)
        line(6, `Step 3: reverse the <b>remaining ${n - k}</b> (indices ${k}..${n - 1}).`)
        mark("window", Array.from({ length: n - k }, (_, x) => k + x))
        if (k < n - 1) reverse(k, n - 1)
        mark("window", [])
        mark("good", Array.from({ length: n }, (_, x) => x))
        line(7, `Three reversals, zero extra memory: <b>[${nums.join(",")}]</b>.`)
        return nums
      },
      1,
    )
    narrate("Reverse all, reverse the first k, reverse the rest — each element moves at most twice, and no scratch array is needed.")
    const res = go()
    return `[${res.join(",")}]`
  },
}
