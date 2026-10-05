import type { SolutionDef } from "@/engine/types"

export const searchRotated: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sorted array, rotated at an unknown pivot
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {           // LEFT half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                               // RIGHT half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  codeJava: `// sorted array, rotated at an unknown pivot
int search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) {           // LEFT half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                               // RIGHT half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "rotated sorted nums", default: [4, 5, 6, 7, 0, 1, 2], maxLen: 12 },
    { kind: "number", name: "target", label: "target", default: 0, min: -99, max: 99 },
  ],
  entry: (a) => `search(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const target = args.target as number
    const go = fn(
      "search",
      (): number => {
        let lo = 0, hi = nums.length - 1
        const win = () => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
        mark("window", win())
        line(2, `The rotation broke full sortedness — but split anywhere, and <b>at least one half is still sorted</b>. That's the trick.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); mark("focus", [mid])
          vars({ lo, hi, mid, "nums[mid]": nums[mid] })
          line(4, `mid = ${mid} → nums[${mid}] = <b>${nums[mid]}</b>.`)
          if (nums[mid] === target) {
            mark("good", [mid]); mark("focus", [])
            line(5, `nums[${mid}] = ${nums[mid]} <b>equals the target — found it!</b>`)
            return mid
          }
          if (nums[lo] <= nums[mid]) {
            line(6, `Which half is sorted? nums[${lo}] = ${nums[lo]} ≤ nums[${mid}] = ${nums[mid]} → the <b>LEFT half [${lo}..${mid}] is sorted</b>.`)
            if (nums[lo] <= target && target < nums[mid]) {
              line(7, `${nums[lo]} ≤ ${target} < ${nums[mid]} → the target <b>fits inside the sorted left half</b>. Discard the right.`)
              mark("done", Array.from({ length: hi - mid + 1 }, (_, i) => mid + i))
              hi = mid - 1
            } else {
              line(8, `${target} does <b>not</b> fit in the sorted range [${nums[lo]}..${nums[mid]}) → it must hide in the messy right half. Discard the left.`)
              mark("done", Array.from({ length: mid - lo + 1 }, (_, i) => lo + i))
              lo = mid + 1
            }
          } else {
            line(9, `Which half is sorted? nums[${lo}] = ${nums[lo]} > nums[${mid}] = ${nums[mid]} → the pivot is on the left, so the <b>RIGHT half [${mid}..${hi}] is sorted</b>.`)
            if (nums[mid] < target && target <= nums[hi]) {
              line(10, `${nums[mid]} < ${target} ≤ ${nums[hi]} → the target <b>fits inside the sorted right half</b>. Discard the left.`)
              mark("done", Array.from({ length: mid - lo + 1 }, (_, i) => lo + i))
              lo = mid + 1
            } else {
              line(11, `${target} does <b>not</b> fit in the sorted range (${nums[mid]}..${nums[hi]}] → it must hide in the messy left half. Discard the right.`)
              mark("done", Array.from({ length: hi - mid + 1 }, (_, i) => mid + i))
              hi = mid - 1
            }
          }
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          if (lo <= hi) mark("window", win())
        }
        mark("focus", []); mark("window", [])
        line(14, `Window empty — ${target} is <b>not in the array</b>. Return -1.`)
        return -1
      },
      1,
    )
    return go()
  },
}
