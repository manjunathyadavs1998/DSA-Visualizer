import type { SolutionDef } from "@/engine/types"

export const removeElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// copy every survivor to the write pointer
function removeElement(nums, val) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[write] = nums[read];   // keep it
      write++;
    }
  }
  return write;                   // survivors fill nums[0..write-1]
}`,
  codeJava: `// copy every survivor to the write pointer
int removeElement(int[] nums, int val) {
  int write = 0;
  for (int read = 0; read < nums.length; read++) {
    if (nums[read] != val) {
      nums[write] = nums[read];   // keep it
      write++;
    }
  }
  return write;                   // survivors fill nums[0..write-1]
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [0, 1, 2, 2, 3, 0, 4, 2], maxLen: 12 },
    { kind: "number", name: "val", label: "val", default: 2, min: 0, max: 9 },
  ],
  entry: (a) => `removeElement([${(a.nums as number[]).join(",")}], ${a.val})`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const nums = [...(args.nums as number[])].map(Math.trunc)
    const val = args.val as number
    const go = fn(
      "removeElement",
      (): number => {
        let write = 0
        ptr("write", 0)
        line(2, `write = 0: everything left of <b>write</b> is the cleaned array (no ${val}s).`)
        for (let read = 0; read < nums.length; read++) {
          ptr("read", read)
          mark("focus", [read])
          if (nums[read] !== val) {
            line(4, `nums[${read}] = ${nums[read]} ≠ ${val} — a survivor.`)
            nums[write] = nums[read]
            aset(write, nums[read])
            line(5, `Copy it down: nums[${write}] = <b>${nums[read]}</b>.`)
            write++
            ptr("write", write)
            mark("good", Array.from({ length: write }, (_, i) => i))
            line(6, `write advances to <b>${write}</b> — ${write} survivor${write === 1 ? "" : "s"} locked in.`)
          } else {
            mark("bad", [read])
            line(4, `nums[${read}] = <b>${val}</b> — the value we're removing. Skip it; write stays at ${write}.`)
          }
          vars({ read, write })
        }
        mark("focus", [])
        mark("bad", [])
        line(9, `Done: the first <b>${write}</b> slots hold every non-${val} in order. Return <b>${write}</b>.`)
        return write
      },
      1,
    )
    return go()
  },
}
