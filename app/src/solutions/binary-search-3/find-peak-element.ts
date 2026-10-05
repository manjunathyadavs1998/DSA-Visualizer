import type { SolutionDef } from "@/engine/types"

export const findPeakElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// ANY index whose neighbors are both smaller
function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1])
      lo = mid + 1;    // rising → a peak exists to the right
    else
      hi = mid;        // falling → mid or something left is a peak
  }
  return lo;
}`,
  codeJava: `// ANY index whose neighbors are both smaller
int findPeakElement(int[] nums) {
  int lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] < nums[mid + 1])
      lo = mid + 1;    // rising → a peak exists to the right
    else
      hi = mid;        // falling → mid or something left is a peak
  }
  return lo;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 8, 3, 6, 7, 4], maxLen: 12 },
  ],
  entry: () => `findPeakElement(nums)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const go = fn(
      "findPeakElement",
      (): number => {
        narrate(`The array is NOT sorted — binary search still works because we only need <b>some</b> peak, and following any rising slope must eventually hit one (edges count as −∞).`)
        let lo = 0, hi = n - 1
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `Invariant: the window [lo..hi] always contains at least one peak.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "nums[mid]": nums[mid], "nums[mid+1]": nums[mid + 1] })
          mark("focus", [mid, mid + 1])
          line(4, `Check the slope at mid = ${mid}: nums[${mid}] = <b>${nums[mid]}</b> vs nums[${mid + 1}] = <b>${nums[mid + 1]}</b>.`)
          if (nums[mid] < nums[mid + 1]) {
            line(6, `Rising (${nums[mid]} < ${nums[mid + 1]}) → walking right must reach a peak before the array ends. Discard ${lo}..${mid}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          } else {
            line(8, `Falling (${nums[mid]} ≥ ${nums[mid + 1]}) → mid might already be a peak; one surely exists at or left of it. Discard ${mid + 1}..${hi}.`)
            for (let x = mid + 1; x <= hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [lo])
        line(10, `Window shrank to index <b>${lo}</b> (value ${nums[lo]}) — a peak: both neighbors (or the −∞ edges) are smaller.`)
        return lo
      },
      1,
    )
    return go()
  },
}
