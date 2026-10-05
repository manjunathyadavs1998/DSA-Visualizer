import type { SolutionDef } from "@/engine/types"

export const singleElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// every value appears exactly twice, except one — find it
function singleNonDuplicate(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--;          // align mid to a pair start
    if (nums[mid] === nums[mid + 1]) lo = mid + 2;
    else hi = mid;
  }
  return nums[lo];
}`,
  codeJava: `// every value appears exactly twice, except one — find it
int singleNonDuplicate(int[] nums) {
  int lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (mid % 2 == 1) mid--;           // align mid to a pair start
    if (nums[mid] == nums[mid + 1]) lo = mid + 2;
    else hi = mid;
  }
  return nums[lo];
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted nums (pairs + one single)", default: [1, 1, 2, 3, 3, 4, 4, 8, 8], maxLen: 11 },
  ],
  entry: () => `singleNonDuplicate(nums)`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "singleNonDuplicate",
      (): number => {
        let lo = 0, hi = nums.length - 1
        const win = () => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
        mark("window", win())
        line(2, `Key insight: <b>before</b> the single element, pairs start at EVEN indexes (0-1, 2-3, …). <b>After</b> it, that parity breaks.`)
        while (lo < hi) {
          let mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid })
          line(4, `mid = (${lo} + ${hi}) >> 1 = <b>${mid}</b>.`)
          if (mid % 2 === 1) {
            mid--
            ptr("mid", mid); vars({ lo, hi, mid })
            line(5, `${mid + 1} is odd — step back to <b>${mid}</b> so mid points at where a pair <b>should start</b>.`)
          }
          mark("focus", [mid, mid + 1]); vars({ lo, hi, mid, "nums[mid]": nums[mid], "nums[mid+1]": nums[mid + 1] })
          if (nums[mid] === nums[mid + 1]) {
            line(6, `nums[${mid}] = nums[${mid + 1}] = ${nums[mid]} — this pair is <b>intact</b>, so the parity is still unbroken here. The single element must be to the <b>right</b>.`)
            mark("done", Array.from({ length: mid + 2 - lo }, (_, i) => lo + i))
            lo = mid + 2
          } else {
            line(7, `nums[${mid}] = ${nums[mid]} ≠ nums[${mid + 1}] = ${nums[mid + 1]} — the pairing is <b>already broken</b>, so the single element is at mid or to the <b>left</b>.`)
            mark("done", Array.from({ length: hi - mid }, (_, i) => mid + 1 + i))
            hi = mid
          }
          ptr("lo", lo); ptr("hi", hi); vars({ lo, hi })
          if (lo < hi) mark("window", win())
        }
        mark("focus", []); mark("window", []); mark("good", [lo])
        line(9, `lo and hi met at index ${lo} — <b>${nums[lo]}</b> is the value with no partner.`)
        return nums[lo]
      },
      1,
    )
    return go()
  },
}
