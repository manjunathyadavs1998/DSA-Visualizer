import type { SolutionDef } from "@/engine/types"

export const twoSumSorted: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sorted nums and target are editable below
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
  codeJava: `// sorted int[] nums and int target editable below
int[] twoSum(int[] nums, int target) {
  int left = 0, right = nums.length - 1;
  while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
  }
  return new int[]{-1, -1};
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted nums", default: [1, 3, 4, 6, 8, 11, 13], maxLen: 12 },
    { kind: "number", name: "target", label: "target", default: 14, min: -99, max: 99 },
  ],
  entry: (a) => `twoSum(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const target = args.target as number
    const twoSum = fn(
      "twoSum",
      (): number[] => {
        let left = 0, right = nums.length - 1
        ptr("left", left); ptr("right", right); vars({ left, right, target })
        line(2, `Two pointers at the ends: smallest value + largest value.`)
        while (left < right) {
          const sum = nums[left] + nums[right]
          mark("focus", [left, right]); vars({ left, right, sum })
          line(4, `sum = nums[${left}] + nums[${right}] = ${nums[left]} + ${nums[right]} = <b>${sum}</b>.`)
          if (sum === target) {
            mark("good", [left, right]); mark("focus", [])
            line(5, `${sum} <b>equals the target</b> — pair found at indexes ${left} and ${right}!`)
            return [left, right]
          }
          if (sum < target) {
            line(6, `${sum} < ${target} → need a <b>bigger</b> sum → move left inward.`)
            mark("done", [left])
            left++
          } else {
            line(7, `${sum} > ${target} → need a <b>smaller</b> sum → move right inward.`)
            mark("done", [right])
            right--
          }
          ptr("left", left); ptr("right", right)
        }
        mark("focus", [])
        line(9, `Pointers crossed — <b>no pair sums to ${target}</b>.`)
        return [-1, -1]
      },
      1,
    )
    return twoSum()
  },
}
