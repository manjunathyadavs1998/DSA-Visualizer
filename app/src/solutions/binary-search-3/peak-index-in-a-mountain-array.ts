import type { SolutionDef } from "@/engine/types"

export const peakIndexInMountainArray: SolutionDef = {
  view: "array",
  array: (a) => a.arr as number[],
  code: `// strictly up then strictly down — find the top
function peakIndexInMountainArray(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;  // uphill → right
    else hi = mid;                              // downhill → peak is mid or left
  }
  return lo;                                    // lo == hi == peak
}`,
  codeJava: `// strictly up then strictly down — find the top
int peakIndexInMountainArray(int[] arr) {
  int lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;  // uphill → right
    else hi = mid;                              // downhill → peak is mid or left
  }
  return lo;                                    // lo == hi == peak
}`,
  inputs: [
    { kind: "numbers", name: "arr", label: "mountain arr", default: [1, 3, 5, 8, 6, 4, 2], maxLen: 12 },
  ],
  entry: () => `peakIndexInMountainArray(arr)`,
  run({ fn, line, ptr, mark, vars }, args) {
    const arr = args.arr as number[]
    const n = arr.length
    const go = fn(
      "peakIndexInMountainArray",
      (): number => {
        let lo = 0, hi = n - 1
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `The array climbs then falls. The slope at any index tells us which side the peak is on — no target needed.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "arr[mid]": arr[mid], "arr[mid+1]": arr[mid + 1] })
          mark("focus", [mid, mid + 1])
          line(4, `Compare the slope at mid = ${mid}: arr[${mid}] = <b>${arr[mid]}</b> vs arr[${mid + 1}] = <b>${arr[mid + 1]}</b>.`)
          if (arr[mid] < arr[mid + 1]) {
            line(5, `${arr[mid]} < ${arr[mid + 1]} → we're on the <b>uphill</b> side; the peak is strictly right. Discard ${lo}..${mid}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          } else {
            line(6, `${arr[mid]} ≥ ${arr[mid + 1]} → we're on the <b>downhill</b> side; mid itself could be the peak. Discard ${mid + 1}..${hi}.`)
            for (let x = mid + 1; x <= hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [lo])
        line(8, `lo met hi at index <b>${lo}</b> — the summit, value <b>${arr[lo]}</b>. O(log n) with zero comparisons against a target.`)
        return lo
      },
      1,
    )
    return go()
  },
}
