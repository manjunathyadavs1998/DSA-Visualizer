import type { SolutionDef } from "@/engine/types"

export const nextGreaterElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below
function nextGreater(nums) {
  const ans = new Array(nums.length).fill(-1);
  const stack = [];  // indices whose answer is still unknown
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i]) {
      ans[stack.pop()] = nums[i];   // nums[i] answers them
    }
    stack.push(i);
  }
  return ans;
}`,
  codeJava: `// int[] nums is editable below
int[] nextGreater(int[] nums) {
  int[] ans = new int[nums.length]; Arrays.fill(ans, -1);
  Deque<Integer> stack = new ArrayDeque<>(); // indices, answer unknown
  for (int i = 0; i < nums.length; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
      ans[stack.pop()] = nums[i];    // nums[i] answers them
    }
    stack.push(i);
  }
  return ans;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [2, 1, 5, 3, 6, 4], maxLen: 10 }],
  entry: (a) => `nextGreater([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "nextGreater",
      (): string => {
        const ans: number[] = new Array(nums.length).fill(-1)
        const stack: number[] = []
        const resolved: number[] = []
        line(2, `Everyone starts at <b>-1</b> — "no greater element to my right" until proven otherwise.`)
        heap("answer", ans)
        heap("stack", [])
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          vars({ i, "nums[i]": nums[i] })
          line(4, `i = ${i}: nums[i] = <b>${nums[i]}</b>. The stack holds indices still <b>waiting</b> for a bigger number — check them, newest first.`)
          while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
            const j = stack.pop() as number
            line(5, `Top of stack is index ${j} (value ${nums[j]}): ${nums[j]} < ${nums[i]}, so <b>${nums[i]} is its next greater</b> — the wait is over.`)
            ans[j] = nums[i]
            resolved.push(j)
            mark("good", [...resolved])
            heap("stack", stack.map((k) => `${k}:${nums[k]}`))
            heap("answer", ans)
            line(6, `ans[${j}] = ${nums[i]}. Index ${j} is popped exactly once and never returns — that's why the whole thing is <b>O(n)</b>.`)
          }
          stack.push(i)
          heap("stack", stack.map((k) => `${k}:${nums[k]}`))
          line(8, `Push index ${i}; it now waits its turn. Stack values top-down: [${[...stack].reverse().map((k) => nums[k]).join(", ")}] — always <b>decreasing</b>.`)
        }
        mark("focus", [])
        ptr("i", -1)
        line(10, `Scan done. ${stack.length > 0 ? `Indices still on the stack (values ${stack.map((k) => nums[k]).join(", ")}) never met a bigger number — they keep -1.` : `Every index found an answer.`}`)
        heap("answer", ans)
        return JSON.stringify(ans)
      },
      1,
    )
    return go()
  },
}
