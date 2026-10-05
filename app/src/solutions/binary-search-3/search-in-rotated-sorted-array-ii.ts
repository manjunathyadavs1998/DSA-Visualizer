import type { SolutionDef } from "@/engine/types"

export const searchRotatedII: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// rotated + DUPLICATES — worst case degrades to O(n)
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++; hi--;              // can't tell which half is sorted
    } else if (nums[lo] <= nums[mid]) {           // left is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                      // right is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
  codeJava: `// rotated + DUPLICATES — worst case degrades to O(n)
boolean search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] == target) return true;
    if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
      lo++; hi--;              // can't tell which half is sorted
    } else if (nums[lo] <= nums[mid]) {           // left is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                      // right is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "rotated nums (dups ok)", default: [2, 5, 6, 0, 0, 1, 2], maxLen: 12 },
    { kind: "number", name: "target", label: "target", default: 3, min: -99, max: 99 },
  ],
  entry: (a) => `search(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const target = args.target as number
    const n = nums.length
    const go = fn(
      "search",
      (): boolean => {
        let lo = 0, hi = n - 1
        const gone: number[] = []
        const discard = (a: number, b: number) => {
          for (let x = a; x <= b; x++) if (!gone.includes(x)) gone.push(x)
          mark("done", [...gone])
        }
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `Rotated-array search, but duplicates can make both ends equal to mid — then we can't tell which half is sorted and must shrink by one.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "nums[mid]": nums[mid] })
          mark("focus", [mid])
          line(4, `mid of [${lo}..${hi}] is ${mid} → nums[${mid}] = <b>${nums[mid]}</b>.`)
          if (nums[mid] === target) {
            mark("focus", []); mark("good", [mid])
            line(5, `nums[${mid}] = ${target} — <b>found the target</b>. Return true.`)
            return true
          }
          if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
            line(7, `nums[${lo}] = nums[${mid}] = nums[${hi}] = ${nums[mid]} — <b>ambiguous</b>: either half could hide ${target}. Shed one duplicate from each end.`)
            discard(lo, lo); discard(hi, hi)
            lo++; hi--
          } else if (nums[lo] <= nums[mid]) {
            line(8, `nums[${lo}] = ${nums[lo]} ≤ ${nums[mid]} → the <b>left half [${lo}..${mid}] is sorted</b>.`)
            if (nums[lo] <= target && target < nums[mid]) {
              line(9, `${nums[lo]} ≤ ${target} < ${nums[mid]} → target fits in the sorted left half. Discard the right.`)
              discard(mid, hi)
              hi = mid - 1
            } else {
              line(10, `${target} doesn't fit in [${nums[lo]}..${nums[mid]}) → it must be in the messy right half. Discard the left.`)
              discard(lo, mid)
              lo = mid + 1
            }
          } else {
            line(11, `nums[${lo}] = ${nums[lo]} > ${nums[mid]} → the <b>right half [${mid}..${hi}] is sorted</b>.`)
            if (nums[mid] < target && target <= nums[hi]) {
              line(12, `${nums[mid]} < ${target} ≤ ${nums[hi]} → target fits in the sorted right half. Discard the left.`)
              discard(lo, mid)
              lo = mid + 1
            } else {
              line(13, `${target} doesn't fit in (${nums[mid]}..${nums[hi]}] → it must be in the messy left half. Discard the right.`)
              discard(mid, hi)
              hi = mid - 1
            }
          }
          mark("focus", [])
          ptr("lo", lo < n ? lo : -1); ptr("hi", hi >= 0 ? hi : -1); vars({ lo, hi, target })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, x) => lo + x) : [])
        }
        ptr("mid", -1)
        line(16, `Window exhausted — <b>${target} is not in the array</b>. Return false. (All-duplicates input is why worst case is O(n).)`)
        return false
      },
      1,
    )
    return go()
  },
}
