import type { SolutionDef } from "@/engine/types"

export const removeDuplicates: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sorted nums is editable below
function removeDuplicates(nums) {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];   // pull the new value forward
    }
  }
  return slow + 1;
}`,
  codeJava: `// sorted int[] nums is editable below
int removeDuplicates(int[] nums) {
  int slow = 0;
  for (int fast = 1; fast < nums.length; fast++) {
    if (nums[fast] != nums[slow]) {
      slow++;
      nums[slow] = nums[fast];   // pull the new value forward
    }
  }
  return slow + 1;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "sorted nums", default: [0, 0, 1, 1, 1, 2, 3, 3], maxLen: 12 }],
  entry: () => `removeDuplicates(nums)`,
  run({ fn, line, ptr, mark, vars, aset, narrate }, args) {
    const nums = [...(args.nums as number[])]
    const go = fn(
      "removeDuplicates",
      (): number => {
        let slow = 0
        ptr("slow", slow)
        mark("good", [0])
        line(2, `slow guards the unique prefix — nums[0] = ${nums[0]} is unique by definition.`)
        for (let fast = 1; fast < nums.length; fast++) {
          ptr("fast", fast)
          mark("focus", [fast])
          vars({ slow, fast })
          line(4, `nums[fast]=${nums[fast]} vs nums[slow]=${nums[slow]}: ${nums[fast] !== nums[slow] ? "<b>new value!</b>" : "duplicate — fast just walks past it."}`)
          if (nums[fast] !== nums[slow]) {
            slow++
            ptr("slow", slow)
            line(5, `Grow the unique prefix: slow → ${slow}.`)
            nums[slow] = nums[fast]
            aset(slow, nums[fast])
            mark("good", Array.from({ length: slow + 1 }, (_, k) => k))
            vars({ slow, fast })
            line(6, `Overwrite nums[${slow}] with <b>${nums[fast]}</b> — the unique prefix is now [${nums.slice(0, slow + 1).join(", ")}].`)
          }
        }
        mark("focus", [])
        line(9, `Unique prefix has <b>${slow + 1}</b> elements — return slow + 1 = ${slow + 1}.`)
        return slow + 1
      },
      1,
    )
    narrate("Classic slow/fast: fast scouts every element, slow only advances for new values — duplicates get overwritten in place, no extra array.")
    return go()
  },
}
