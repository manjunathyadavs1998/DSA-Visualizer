import type { SolutionDef } from "@/engine/types"

const clean = (xs: number[]) =>
  [...new Set(xs.map((v) => Math.max(1, Math.round(v))))].sort((a, b) => a - b)

export const kthMissingPositiveNumber: SolutionDef = {
  view: "array",
  array: (a) => clean(a.arr as number[]),
  code: `// arr is sorted positives; find the k-th missing positive
function findKthPositive(arr, k) {
  // missing BEFORE index i (inclusive): arr[i] - (i+1)
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const missing = arr[mid] - (mid + 1);
    if (missing < k) lo = mid + 1;  // k-th missing is further right
    else hi = mid;                  // enough are missing by mid
  }
  return lo + k;  // lo values present before the answer
}`,
  codeJava: `// arr is sorted positives; find the k-th missing positive
int findKthPositive(int[] arr, int k) {
  // missing BEFORE index i (inclusive): arr[i] - (i+1)
  int lo = 0, hi = arr.length;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    int missing = arr[mid] - (mid + 1);
    if (missing < k) lo = mid + 1;  // k-th missing is further right
    else hi = mid;                  // enough are missing by mid
  }
  return lo + k;  // lo values present before the answer
}`,
  inputs: [
    { kind: "numbers", name: "arr", label: "sorted positives", default: [2, 3, 4, 7, 11], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 5, min: 1, max: 50 },
  ],
  entry: (a) => `findKthPositive(arr, ${a.k})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const arr = clean(args.arr as number[])
    const k = Math.max(1, args.k as number)
    const n = arr.length
    const go = fn(
      "findKthPositive",
      (): number => {
        narrate(`Key trick: if nothing were missing, arr[i] would be i+1. So <b>arr[i] − (i+1)</b> counts how many positives are missing up to arr[i] — and it's non-decreasing, so binary search it.`)
        let lo = 0, hi = n
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, k })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(3, `Find the first index where at least ${k} positives are already missing.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          const missing = arr[mid] - (mid + 1)
          ptr("mid", mid); vars({ lo, hi, mid, "arr[mid]": arr[mid], missing, k })
          mark("focus", [mid])
          line(6, `At index ${mid}: arr[${mid}] = ${arr[mid]}, so <b>${missing}</b> positive(s) are missing before it (${arr[mid]} − ${mid + 1}).`)
          if (missing < k) {
            line(7, `${missing} < ${k} → the ${k}-th missing number lies <b>beyond</b> index ${mid}. Discard ${lo}..${mid}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          } else {
            line(8, `${missing} ≥ ${k} → by index ${mid} we've already skipped ${k} numbers. Discard ${mid + 1}..${hi - 1} and keep mid.`)
            for (let x = mid + 1; x < hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo < n ? lo : -1); ptr("hi", hi < n ? hi : -1); vars({ lo, hi, k })
          mark("window", Array.from({ length: hi - lo }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        if (lo < n) mark("focus", [lo])
        line(10, `Exactly <b>${lo}</b> array value(s) are smaller than the answer, so the ${k}-th missing positive is ${lo} + ${k} = <b>${lo + k}</b>.`)
        return lo + k
      },
      1,
    )
    return go()
  },
}
