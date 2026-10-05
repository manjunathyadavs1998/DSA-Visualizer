import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] => [...(args.nums as number[])].map(Math.trunc).sort((a, b) => a - b)

export const removeDuplicatesFromSortedArrayIi: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// keep ≤ 2 copies: compare read with the value TWO behind write
function removeDuplicates(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (write < 2 || nums[read] !== nums[write - 2]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}`,
  codeJava: `// keep ≤ 2 copies: compare read with the value TWO behind write
int removeDuplicates(int[] nums) {
  int write = 0;
  for (int read = 0; read < nums.length; read++) {
    if (write < 2 || nums[read] != nums[write - 2]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (sorted)", default: [0, 0, 1, 1, 1, 1, 2, 3, 3], maxLen: 12 },
  ],
  entry: (a) => `removeDuplicates([${prep(a).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const nums = prep(args)
    const go = fn(
      "removeDuplicates",
      (): number => {
        let write = 0
        ptr("write", 0)
        line(2, `Invariant: nums[0..write−1] is the answer so far, with <b>at most two</b> copies of anything.`)
        for (let read = 0; read < nums.length; read++) {
          ptr("read", read)
          mark("focus", [read])
          if (write < 2 || nums[read] !== nums[write - 2]) {
            line(4, write < 2
              ? `write = ${write} < 2 — the first two elements are always safe to keep.`
              : `nums[${read}] = ${nums[read]} ≠ nums[write−2] = ${nums[write - 2]} — keeping it can't create a third copy (sorted!).`)
            nums[write] = nums[read]
            aset(write, nums[read])
            line(5, `nums[${write}] = <b>${nums[read]}</b>.`)
            write++
            ptr("write", write)
            mark("good", Array.from({ length: write }, (_, i) => i))
            line(6, `write → <b>${write}</b>.`)
          } else {
            mark("bad", [read])
            line(4, `nums[${read}] = ${nums[read]} <b>equals</b> nums[write−2] = ${nums[write - 2]} — a third copy. Skip it.`)
          }
          vars({ read, write })
        }
        mark("focus", [])
        mark("bad", [])
        line(9, `First <b>${write}</b> slots: [${nums.slice(0, write).join(", ")}] — every value at most twice. Return <b>${write}</b>.`)
        return write
      },
      1,
    )
    return go()
  },
}
