import type { SolutionDef } from "@/engine/types"

export const sortArrayByParity: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// evens up front: fix an odd-left / even-right pair with one swap
function sortArrayByParity(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    if (nums[left] % 2 === 0)  { left++;  continue; }   // already fine
    if (nums[right] % 2 === 1) { right--; continue; }   // already fine
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++; right--;
  }
  return nums;
}`,
  codeJava: `// evens up front: fix an odd-left / even-right pair with one swap
int[] sortArrayByParity(int[] nums) {
  int left = 0, right = nums.length - 1;
  while (left < right) {
    if (nums[left] % 2 == 0)  { left++;  continue; }    // already fine
    if (nums[right] % 2 == 1) { right--; continue; }    // already fine
    int t = nums[left]; nums[left] = nums[right]; nums[right] = t;
    left++; right--;
  }
  return nums;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [3, 1, 2, 4, 7, 6, 5, 8, 9, 12, 11, 10], maxLen: 12 },
  ],
  entry: (a) => `sortArrayByParity([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const nums = (args.nums as number[]).map((x) => Math.abs(Math.trunc(x)))
    const go = fn(
      "sortArrayByParity",
      (): string => {
        let left = 0
        let right = nums.length - 1
        ptr("left", left)
        ptr("right", right >= 0 ? right : -1)
        line(2, `Invariant: everything left of <b>left</b> is even, everything right of <b>right</b> is odd.`)
        while (left < right) {
          mark("focus", [left, right])
          if (nums[left] % 2 === 0) {
            mark("good", [left])
            line(4, `nums[${left}] = ${nums[left]} is <b>even</b> — already on the correct side; left → ${left + 1}.`)
            left++
            ptr("left", left)
            continue
          }
          if (nums[right] % 2 === 1) {
            mark("done", [right])
            line(5, `nums[${right}] = ${nums[right]} is <b>odd</b> — already on the correct side; right → ${right - 1}.`)
            right--
            ptr("right", right)
            continue
          }
          const t = nums[left]
          nums[left] = nums[right]
          nums[right] = t
          aset(left, nums[left])
          aset(right, nums[right])
          line(6, `Both misplaced: odd <b>${nums[right]}</b> at left, even <b>${nums[left]}</b> at right — one swap fixes both.`)
          mark("good", [left])
          mark("done", [right])
          left++
          right--
          ptr("left", left)
          ptr("right", right)
          line(7, `left = ${left}, right = ${right}.`)
          vars({ left, right })
        }
        mark("focus", [])
        line(9, `Partitioned in one pass: [<b>${nums.join(", ")}</b>] — evens first, odds last (order within each group is free).`)
        return `[${nums.join(",")}]`
      },
      1,
    )
    return go()
  },
}
