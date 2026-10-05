import type { SolutionDef } from "@/engine/types"

const clean = (xs: number[]) => [...xs].sort((a, b) => a - b)

export const searchRange: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// run lower-bound twice: for target and for target+1
function searchRange(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target)
    return [-1, -1];                  // target absent
  const last = lowerBound(nums, target + 1) - 1;
  return [first, last];
}
function lowerBound(nums, t) {        // first index with nums[i] >= t
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= t) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  codeJava: `// run lower-bound twice: for target and for target+1
int[] searchRange(int[] nums, int target) {
  int first = lowerBound(nums, target);
  if (first == nums.length || nums[first] != target)
    return new int[]{-1, -1};         // target absent
  int last = lowerBound(nums, target + 1) - 1;
  return new int[]{first, last};
}
int lowerBound(int[] nums, int t) {   // first index with nums[i] >= t
  int lo = 0, hi = nums.length;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] >= t) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted nums", default: [5, 7, 7, 8, 8, 8, 10], maxLen: 12 },
    { kind: "number", name: "target", label: "target", default: 8, min: -99, max: 99 },
  ],
  entry: (a) => `searchRange(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const target = args.target as number
    const n = nums.length
    const lowerBound = fn(
      "lowerBound",
      (t: number): number => {
        let lo = 0, hi = n
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ t, lo, hi })
        mark("done", []); mark("focus", [])
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(10, `lowerBound(${t}): find the first index with value ≥ ${t}.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ t, lo, hi, mid, "nums[mid]": nums[mid] })
          mark("focus", [mid])
          line(12, `mid of [${lo}..${hi}) is ${mid} → nums[${mid}] = <b>${nums[mid]}</b>.`)
          if (nums[mid] >= t) {
            line(13, `${nums[mid]} ≥ ${t} → mid stays reachable, discard everything right of it: hi = ${mid}.`)
            for (let x = mid + 1; x < hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          } else {
            line(14, `${nums[mid]} < ${t} → discard the left half including mid: lo = ${mid + 1}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo); ptr("hi", hi); vars({ t, lo, hi })
          mark("window", Array.from({ length: hi - lo }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        line(16, `lowerBound(${t}) = <b>${lo}</b>.`)
        return lo
      },
      8,
    )
    const go = fn(
      "searchRange",
      (): number[] => {
        line(2, `Step 1 — find the <b>first</b> index of ${target} via lowerBound(${target}).`)
        const first = lowerBound(target)
        if (first === n || nums[first] !== target) {
          mark("done", [])
          line(4, `nums[${first}] ${first === n ? "doesn't exist" : `= ${nums[first]} ≠ ${target}`} → ${target} is <b>absent</b>. Return [-1, -1].`)
          return [-1, -1]
        }
        line(5, `nums[${first}] = ${target} → first occurrence is index <b>${first}</b>. Step 2 — lowerBound(${target + 1}) − 1 gives the last occurrence.`)
        const last = lowerBound(target + 1) - 1
        mark("done", [])
        mark("good", Array.from({ length: last - first + 1 }, (_, x) => first + x))
        line(6, `lowerBound(${target + 1}) = ${last + 1}, so the last ${target} sits at index <b>${last}</b>.`)
        line(7, `Range of ${target}: [<b>${first}</b>, <b>${last}</b>] — two O(log n) searches, no linear scan.`)
        return [first, last]
      },
      1,
    )
    return JSON.stringify(go())
  },
}
