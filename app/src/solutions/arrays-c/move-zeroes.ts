import type { SolutionDef } from "@/engine/types"

export const moveZeroes: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// push all zeroes right, keep non-zero order (in place)
function moveZeroes(nums) {
  let write = 0;               // next slot for a non-zero
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }
  return nums;
}`,
  codeJava: `// push all zeroes right, keep non-zero order (in place)
void moveZeroes(int[] nums) {
  int write = 0;               // next slot for a non-zero
  for (int read = 0; read < nums.length; read++) {
    if (nums[read] != 0) {
      int t = nums[write]; nums[write] = nums[read]; nums[read] = t;
      write++;
    }
  }
  return;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [0, 1, 0, 3, 12, 0, 5], maxLen: 12 }],
  entry: (a) => `moveZeroes([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, narrate }, args) {
    const nums = [...(args.nums as number[])]
    const go = fn(
      "moveZeroes",
      (): number[] => {
        let write = 0
        ptr("write", 0)
        line(2, `<b>write</b> marks where the next non-zero belongs; everything before it is the compacted prefix.`)
        for (let read = 0; read < nums.length; read++) {
          ptr("read", read)
          mark("focus", [read])
          line(4, `nums[${read}] = <b>${nums[read]}</b> — ${nums[read] !== 0 ? "non-zero, it must move up front" : "a zero, skip it"}.`)
          if (nums[read] !== 0) {
            if (read !== write) {
              ;[nums[write], nums[read]] = [nums[read], nums[write]]
              aset(write, nums[write])
              aset(read, nums[read])
              line(5, `Swap it into slot ${write}: <b>${nums[write]}</b> lands there, the 0 drifts back to index ${read}.`)
            } else {
              line(5, `read = write = ${read} — the swap is with itself, nothing visibly moves.`)
            }
            write++
            ptr("write", write)
            mark("window", Array.from({ length: write }, (_, k) => k))
            vars({ read, write })
            line(6, `write advances to <b>${write}</b> — indices 0..${write - 1} are the non-zeros, in order.`)
          }
        }
        ptr("read", -1)
        mark("focus", [])
        mark("good", Array.from({ length: write }, (_, k) => k))
        mark("bad", Array.from({ length: nums.length - write }, (_, k) => write + k))
        line(9, `All ${write} non-zeros packed left, ${nums.length - write} zeroes swept right: <b>[${nums.join(",")}]</b>.`)
        return nums
      },
      1,
    )
    narrate("The classic two-pointer compaction: 'read' scans everything, 'write' only advances over keepers — stable and in place.")
    const res = go()
    return `[${res.join(",")}]`
  },
}
