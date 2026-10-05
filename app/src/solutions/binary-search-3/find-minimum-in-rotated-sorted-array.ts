import type { SolutionDef } from "@/engine/types"

export const findMinInRotatedSortedArray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sorted array rotated k times — find the minimum
function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi])
      lo = mid + 1;   // break point (min) is right of mid
    else
      hi = mid;       // mid is in the sorted tail — min is mid or left
  }
  return nums[lo];
}`,
  codeJava: `// sorted array rotated k times — find the minimum
int findMin(int[] nums) {
  int lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] > nums[hi])
      lo = mid + 1;   // break point (min) is right of mid
    else
      hi = mid;       // mid is in the sorted tail — min is mid or left
  }
  return nums[lo];
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "rotated sorted nums", default: [8, 9, 11, 14, 1, 3, 5, 7], maxLen: 12 },
  ],
  entry: () => `findMin(nums)`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const go = fn(
      "findMin",
      (): number => {
        let lo = 0, hi = n - 1
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `A rotated sorted array is two sorted runs; the minimum is where they meet. Compare mid against the <b>right end</b> to tell which run mid is in.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "nums[mid]": nums[mid], "nums[hi]": nums[hi] })
          mark("focus", [mid, hi])
          line(4, `nums[mid=${mid}] = <b>${nums[mid]}</b> vs nums[hi=${hi}] = <b>${nums[hi]}</b>.`)
          if (nums[mid] > nums[hi]) {
            line(6, `${nums[mid]} > ${nums[hi]} → mid sits in the <b>first (larger) run</b>; the drop to the minimum happens to its right. Discard ${lo}..${mid}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          } else {
            line(8, `${nums[mid]} ≤ ${nums[hi]} → mid is already in the <b>sorted tail</b>; the minimum is mid or left of it. Discard ${mid + 1}..${hi}.`)
            for (let x = mid + 1; x <= hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [lo])
        line(10, `Window collapsed to index ${lo}: the minimum is <b>${nums[lo]}</b> — also the rotation point.`)
        return nums[lo]
      },
      1,
    )
    return go()
  },
}
