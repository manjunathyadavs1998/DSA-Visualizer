import type { SolutionDef } from "@/engine/types"

const clean = (xs: number[]) => [...xs].sort((a, b) => a - b)

export const searchInsertPosition: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// first index where nums[i] >= target (lower bound)
function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;      // hi is one PAST the end
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] >= target) hi = mid;   // mid could be the answer
    else lo = mid + 1;                   // mid is too small
  }
  return lo;                         // lo == hi == insertion point
}`,
  codeJava: `// first index where nums[i] >= target (lower bound)
int searchInsert(int[] nums, int target) {
  int lo = 0, hi = nums.length;      // hi is one PAST the end
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (nums[mid] >= target) hi = mid;   // mid could be the answer
    else lo = mid + 1;                   // mid is too small
  }
  return lo;                         // lo == hi == insertion point
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted nums", default: [1, 3, 5, 7, 9, 11, 14], maxLen: 12 },
    { kind: "number", name: "target", label: "target", default: 8, min: -99, max: 99 },
  ],
  entry: (a) => `searchInsert(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const target = args.target as number
    const n = nums.length
    const go = fn(
      "searchInsert",
      (): number => {
        let lo = 0, hi = n
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `Lower bound: find the first index whose value is ≥ ${target}. hi starts at ${n} (one past the end) so "insert at the very end" is a legal answer.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "nums[mid]": nums[mid] })
          mark("focus", [mid])
          line(4, `mid of [${lo}..${hi}) is ${mid} → nums[${mid}] = <b>${nums[mid]}</b>.`)
          if (nums[mid] >= target) {
            line(5, `${nums[mid]} ≥ ${target} → index ${mid} <b>could be the insertion point</b>, but maybe an earlier one works too. Keep mid: hi = ${mid}.`)
            for (let x = mid + 1; x < hi; x++) if (!gone.includes(x)) gone.push(x)
            mark("done", [...gone])
            hi = mid
          } else {
            line(6, `${nums[mid]} < ${target} → everything up to index ${mid} is too small. Discard it: lo = ${mid + 1}.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            mark("done", [...gone])
            lo = mid + 1
          }
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
          mark("focus", [])
          mark("window", Array.from({ length: hi - lo }, (_, x) => lo + x))
        }
        mark("window", []); ptr("mid", -1)
        if (lo < n) mark("good", [lo])
        line(8, `lo met hi at <b>${lo}</b> — ${lo < n && nums[lo] === target ? `${target} already sits there` : `${target} would be inserted at index ${lo}`}${lo === n ? " (past the last element)" : ""}.`)
        return lo
      },
      1,
    )
    return go()
  },
}
