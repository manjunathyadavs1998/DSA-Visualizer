import type { SolutionDef } from "@/engine/types"

const clean = (xs: number[]) => [...xs].sort((a, b) => a - b)

export const findKClosestElements: SolutionDef = {
  view: "array",
  array: (a) => clean(a.arr as number[]),
  code: `// k elements closest to x — binary search the window START
function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;   // candidate start indexes
  while (lo < hi) {
    const mid = (lo + hi) >> 1;      // try window [mid .. mid+k-1]
    if (x - arr[mid] > arr[mid + k] - x)
      lo = mid + 1;    // element just right of window is closer — slide right
    else
      hi = mid;        // this start (or an earlier one) is fine
  }
  return arr.slice(lo, lo + k);
}`,
  codeJava: `// k elements closest to x — binary search the window START
int[] findClosestElements(int[] arr, int k, int x) {
  int lo = 0, hi = arr.length - k;   // candidate start indexes
  while (lo < hi) {
    int mid = (lo + hi) / 2;         // try window [mid .. mid+k-1]
    if (x - arr[mid] > arr[mid + k] - x)
      lo = mid + 1;    // element just right of window is closer — slide right
    else
      hi = mid;        // this start (or an earlier one) is fine
  }
  return Arrays.copyOfRange(arr, lo, lo + k);
}`,
  inputs: [
    { kind: "numbers", name: "arr", label: "sorted arr", default: [1, 2, 4, 7, 9, 10, 13, 15], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 12 },
    { kind: "number", name: "x", label: "x", default: 6, min: -99, max: 99 },
  ],
  entry: (a) => `findClosestElements(arr, ${a.k}, ${a.x})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const arr = clean(args.arr as number[])
    const n = arr.length
    const k = Math.min(n, Math.max(1, args.k as number))
    const x = args.x as number
    const go = fn(
      "findClosestElements",
      (): number[] => {
        narrate(`The answer is always a <b>contiguous block of ${k}</b> in a sorted array — so search over the ${n - k + 1} possible start positions, not over elements.`)
        let lo = 0, hi = n - k
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, k, x })
        line(2, `lo and hi point at candidate window STARTS: start ∈ [0..${n - k}].`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          const dl = x - arr[mid], dr = arr[mid + k] - x
          ptr("mid", mid)
          mark("window", Array.from({ length: k }, (_, i) => mid + i))
          mark("focus", [mid, mid + k])
          vars({ lo, hi, mid, "x-arr[mid]": dl, "arr[mid+k]-x": dr })
          line(4, `Try the window starting at ${mid}: [${arr.slice(mid, mid + k).join(", ")}].`)
          line(5, `Edge duel: drop arr[${mid}] = ${arr[mid]} (dist ${dl}) or grab arr[${mid + k}] = ${arr[mid + k]} (dist ${dr})?`)
          if (dl > dr) {
            line(6, `${dl} > ${dr} → the right neighbor is strictly closer to ${x}; the window should slide right. Discard starts ${lo}..${mid}.`)
            for (let s = lo; s <= mid; s++) if (!gone.includes(s)) gone.push(s)
            lo = mid + 1
          } else {
            line(8, `${dl} ≤ ${dr} → the left edge is at least as close (ties prefer smaller values). Discard starts ${mid + 1}..${hi}.`)
            for (let s = mid + 1; s <= hi; s++) if (!gone.includes(s)) gone.push(s)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, k, x })
        }
        ptr("mid", -1); mark("done", [])
        mark("good", Array.from({ length: k }, (_, i) => lo + i))
        line(10, `Start converged to <b>${lo}</b> → the ${k} closest to ${x} are [<b>${arr.slice(lo, lo + k).join(", ")}</b>].`)
        return arr.slice(lo, lo + k)
      },
      1,
    )
    return JSON.stringify(go())
  },
}
