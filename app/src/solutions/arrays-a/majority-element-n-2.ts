import type { SolutionDef } from "@/engine/types"

export const majorityElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// Boyer–Moore voting: pair off different values; a majority survives
function majorityElement(nums) {
  let candidate = 0, count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) candidate = nums[i];  // crown a new candidate
    if (nums[i] === candidate) count++;    // vote FOR
    else count--;                          // vote AGAINST (cancels one)
  }
  return candidate;
}`,
  codeJava: `// Boyer–Moore voting: pair off different values; a majority survives
int majorityElement(int[] nums) {
  int candidate = 0, count = 0;
  for (int i = 0; i < nums.length; i++) {
    if (count == 0) candidate = nums[i];   // crown a new candidate
    if (nums[i] == candidate) count++;     // vote FOR
    else count--;                          // vote AGAINST (cancels one)
  }
  return candidate;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (majority > n/2)", default: [2, 2, 1, 1, 1, 2, 2], maxLen: 12 }],
  entry: () => `majorityElement(nums)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "majorityElement",
      (): number => {
        let candidate = 0, count = 0
        let forIdx: number[] = []
        const againstIdx: number[] = []
        line(2, `No candidate yet, count 0. The idea: pair every candidate vote against a different value — a TRUE majority (> n/2) can never be fully cancelled.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          if (count === 0) {
            candidate = nums[i]
            forIdx = []
            line(4, `count is 0 — the old votes cancelled out. Crown <b>${candidate}</b> as the new candidate.`)
          }
          if (nums[i] === candidate) {
            count++
            forIdx.push(i)
            mark("good", [...forIdx])
            line(5, `nums[${i}] = ${nums[i]} matches the candidate → vote FOR: count = <b>${count}</b>.`)
          } else {
            count--
            againstIdx.push(i)
            mark("bad", [...againstIdx])
            line(6, `nums[${i}] = ${nums[i]} ≠ ${candidate} → vote AGAINST, cancelling one FOR: count = <b>${count}</b>.`)
          }
          vars({ candidate, count })
        }
        ptr("i", -1)
        line(8, `Survivor: <b>${candidate}</b> (count ${count}). With more than n/2 copies, it outlives every possible cancellation.`)
        return candidate
      },
      1,
    )
    narrate("Boyer–Moore voting: each non-matching element cancels one candidate vote; only a strict majority survives the brawl.")
    return go()
  },
}
