import type { SolutionDef } from "@/engine/types"

export const nextPermutation: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// rearrange nums into the next lexicographically greater order
function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i+1]) i--;  // find pivot
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;            // rightmost bigger
    [nums[i], nums[j]] = [nums[j], nums[i]];   // swap
  }
  reverse(nums, i + 1);                        // suffix -> ascending
  return nums;
}`,
  codeJava: `// rearrange nums into the next lexicographically greater order
int[] nextPermutation(int[] nums) {
  int i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i+1]) i--;  // find pivot
  if (i >= 0) {
    int j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;            // rightmost bigger
    int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
  }
  reverse(nums, i + 1);                        // suffix -> ascending
  return nums;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 3, 5, 4, 2], maxLen: 8 }],
  entry: (a) => `nextPermutation([${(a.nums as number[]).join(", ")}])`,
  run({ fn, line, ptr, mark, aset, vars, narrate }, args) {
    const nums = [...(args.nums as number[])]
    const go = fn(
      "nextPermutation",
      (): string => {
        if (nums.length < 2) {
          line(10, `Fewer than two elements — nothing to rearrange.`)
          return `[${nums.join(", ")}]`
        }
        let i = nums.length - 2
        ptr("i", i)
        line(2, `Scan from the right for the <b>pivot</b> — the first index where the value rises (nums[i] < nums[i+1]).`)
        while (i >= 0 && nums[i] >= nums[i + 1]) {
          line(3, `nums[${i}] = ${nums[i]} ≥ nums[${i + 1}] = ${nums[i + 1]} — still descending; move i left.`)
          i--
          ptr("i", i)
        }
        const suffix = Array.from({ length: nums.length - i - 1 }, (_, k) => i + 1 + k)
        mark("window", suffix)
        vars({ i })
        if (i >= 0) {
          line(4, `Pivot found: nums[${i}] = ${nums[i]} < nums[${i + 1}] = ${nums[i + 1]}. The suffix (window) is descending — already the LARGEST arrangement of itself.`)
          let j = nums.length - 1
          ptr("j", j)
          while (nums[j] <= nums[i]) {
            line(6, `nums[${j}] = ${nums[j]} ≤ pivot ${nums[i]} — too small to help; move j left.`)
            j--
            ptr("j", j)
          }
          line(6, `nums[${j}] = ${nums[j]} is the <b>rightmost value bigger</b> than the pivot ${nums[i]} — the smallest possible upgrade.`)
          mark("focus", [i, j])
          const a = nums[i], b = nums[j]
          nums[i] = b
          nums[j] = a
          aset(i, b)
          aset(j, a)
          vars({ i, j })
          line(7, `Swap them: index ${i} gets ${b}, index ${j} gets ${a} — the prefix just grew by the minimum amount.`)
          ptr("j", -1)
        } else {
          line(3, `No pivot — the whole array is descending: this is the LAST permutation. Reversing everything wraps around to the first.`)
        }
        mark("focus", [])
        line(9, `The suffix is still descending — reverse it to ascending so the tail is as SMALL as possible.`)
        let l = i + 1, r = nums.length - 1
        while (l < r) {
          ptr("l", l)
          ptr("r", r)
          const x = nums[l], y = nums[r]
          nums[l] = y
          nums[r] = x
          aset(l, y)
          aset(r, x)
          line(9, `Reverse suffix: swap nums[${l}] = ${x} with nums[${r}] = ${y}.`)
          l++
          r--
        }
        ptr("l", -1)
        ptr("r", -1)
        mark("good", suffix)
        line(10, `Done: [${nums.join(", ")}] is the next permutation.`)
        return `[${nums.join(", ")}]`
      },
      1,
    )
    narrate("Three moves: find the pivot from the right, swap it with the rightmost bigger value, then reverse the suffix.")
    go()
    return JSON.stringify(nums)
  },
}
