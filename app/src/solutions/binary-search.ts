import type { SolutionDef } from "@/engine/types"

export const binarySearch: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sorted nums and target are editable below
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  codeJava: `// sorted int[] nums and int target editable below
int search(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted nums", default: [-1, 0, 3, 5, 9, 12, 17, 23], maxLen: 14 },
    { kind: "number", name: "target", label: "target", default: 9, min: -99, max: 99 },
  ],
  entry: (a) => `search(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const target = args.target as number
    const search = fn(
      "search",
      (): number => {
        let lo = 0, hi = nums.length - 1
        const range = () => Array.from({ length: hi - lo + 1 }, (_, x) => lo + x)
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
        mark("window", range())
        line(2, `Start with the whole array in play: lo = ${lo}, hi = ${hi}.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "nums[mid]": nums[mid] })
          mark("focus", [mid])
          line(4, `Middle of [${lo}..${hi}] is index ${mid} → value ${nums[mid]}.`)
          if (nums[mid] === target) {
            mark("good", [mid]); mark("focus", [])
            line(5, `nums[${mid}] = ${nums[mid]} <b>equals the target — found it!</b>`)
            return mid
          }
          if (nums[mid] < target) {
            line(6, `${nums[mid]} < ${target} → the answer must be to the <b>right</b>. Discard the left half.`)
            mark("done", Array.from({ length: mid - lo + 1 }, (_, x) => lo + x))
            lo = mid + 1
          } else {
            line(7, `${nums[mid]} > ${target} → the answer must be to the <b>left</b>. Discard the right half.`)
            mark("done", Array.from({ length: hi - mid + 1 }, (_, x) => mid + x))
            hi = mid - 1
          }
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          if (lo <= hi) mark("window", range())
        }
        mark("focus", []); mark("window", [])
        line(9, `lo passed hi — the target is <b>not in the array</b>. Return -1.`)
        return -1
      },
      1,
    )
    return search()
  },
}
