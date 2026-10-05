import type { SolutionDef } from "@/engine/types"

export const findPivotIndex: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// index where left-of sum equals right-of sum
function pivotIndex(nums) {
  let total = 0;
  for (const x of nums) total += x;
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    const right = total - left - nums[i];
    if (left === right) return i;   // balanced!
    left += nums[i];
  }
  return -1;                        // never balances
}`,
  codeJava: `// index where left-of sum equals right-of sum
int pivotIndex(int[] nums) {
  int total = 0;
  for (int x : nums) total += x;
  int left = 0;
  for (int i = 0; i < nums.length; i++) {
    int right = total - left - nums[i];
    if (left == right) return i;    // balanced!
    left += nums[i];
  }
  return -1;                        // never balances
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 7, 3, 6, 5, 6], maxLen: 12 }],
  entry: (a) => `pivotIndex([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "pivotIndex",
      (): number => {
        let total = 0
        for (const x of nums) total += x
        heap("prefix", { total })
        line(3, `One pass for the grand total: <b>${total}</b>.`)
        let left = 0
        line(4, `Walk with a running <b>left</b> sum; the right sum then costs nothing: total − left − nums[i].`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: i }, (_, k) => k))
          const right = total - left - nums[i]
          heap("prefix", { total, left, right })
          vars({ i, left, right })
          line(6, `right = ${total} − ${left} − ${nums[i]} = <b>${right}</b> (left = <b>${left}</b>).`)
          if (left === right) {
            mark("good", [i])
            line(7, `left = right = ${left} → index <b>${i}</b> is the pivot!`)
            return i
          }
          line(7, `${left} ≠ ${right} — not balanced here.`)
          left += nums[i]
          line(8, `Absorb nums[${i}] = ${nums[i]} into left → left = <b>${left}</b>.`)
        }
        ptr("i", -1)
        mark("focus", [])
        mark("window", [])
        line(10, `No index balances the scales → return <b>−1</b>.`)
        return -1
      },
      1,
    )
    narrate("Compute the total once; then at each index the right-side sum is free — left and right must each be (total − nums[i]) / 2.")
    return go()
  },
}
