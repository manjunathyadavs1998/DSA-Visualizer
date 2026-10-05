import type { SolutionDef } from "@/engine/types"

export const arithmeticSlices: SolutionDef = {
  code: `// endAt(i) = # of arithmetic slices ENDING exactly at i
function endAt(i) {
  if (i < 2) return 0;
  if (memo[i] !== undefined) return memo[i];
  if (nums[i] - nums[i - 1] !== nums[i - 1] - nums[i - 2]) {
    memo[i] = 0;
  } else {
    memo[i] = 1 + endAt(i - 1);
  }
  return memo[i];
}
// total = endAt(2) + endAt(3) + ... + endAt(n-1)`,
  codeJava: `// int[] nums; Integer[] memo
int endAt(int i) {
  if (i < 2) return 0;
  if (memo[i] != null) return memo[i];
  if (nums[i] - nums[i - 1] != nums[i - 1] - nums[i - 2]) {
    memo[i] = 0;
  } else {
    memo[i] = 1 + endAt(i - 1);
  }
  return memo[i];
}
// total = endAt(2) + endAt(3) + ... + endAt(n-1)`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 3, 5, 7, 9], maxLen: 10 }],
  entry: (a) => `countSlices([${(a.nums as number[]).join(", ")}])`,
  run({ fn, memo, line, vars, narrate }, args) {
    let nums = (args.nums as number[]).map(Math.trunc)
    if (nums.length < 3) nums = [1, 3, 5, 7, 9]
    const n = nums.length
    const endAt = fn(
      "endAt",
      (i: number): number => {
        line(2, `endAt(${i}): fewer than 3 elements end here? (${i < 2 ? "<b>yes — no slice fits, 0</b>" : "no"})`)
        if (i < 2) return 0
        line(3, `endAt(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        const d1 = nums[i] - nums[i - 1]
        const d2 = nums[i - 1] - nums[i - 2]
        line(4, `endAt(${i}): gaps ${nums[i]}−${nums[i - 1]} = <b>${d1}</b> vs ${nums[i - 1]}−${nums[i - 2]} = <b>${d2}</b> — ${d1 === d2 ? "equal, the run continues" : "different, the run breaks"}.`)
        if (d1 !== d2) {
          line(5, `endAt(${i}) = 0 → memo[${i}]. No arithmetic slice ends at index ${i}.`)
          memo[i] = 0
        } else {
          line(7, `endAt(${i}): the new triple + every slice ending at ${i - 1} stretched by one → 1 + endAt(${i - 1}).`)
          memo[i] = 1 + (endAt(i - 1) as number)
        }
        return memo[i] as number
      },
      1,
    )
    const countSlices = fn("countSlices", (): number => {
      narrate("Every slice ends SOMEWHERE — count the slices ending at each index and sum them.")
      let total = 0
      for (let i = 2; i < n; i++) {
        const e = endAt(i)
        total += e
        vars({ i, endAtI: e, total })
        line(11, `total += endAt(${i}) = ${e} → total = <b>${total}</b>.`)
      }
      return total
    })
    return countSlices()
  },
}
