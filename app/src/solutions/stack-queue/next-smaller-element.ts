import type { SolutionDef } from "@/engine/types"

export const nextSmallerElement: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below
function nextSmaller(nums) {
  const ans = new Array(nums.length).fill(-1);
  const stack = [];  // indices whose answer is still unknown
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] > nums[i]) {
      ans[stack.pop()] = nums[i];   // nums[i] answers them
    }
    stack.push(i);
  }
  return ans;
}`,
  codeJava: `// int[] nums is editable below
int[] nextSmaller(int[] nums) {
  int[] ans = new int[nums.length]; Arrays.fill(ans, -1);
  Deque<Integer> stack = new ArrayDeque<>(); // indices, answer unknown
  for (int i = 0; i < nums.length; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
      ans[stack.pop()] = nums[i];    // nums[i] answers them
    }
    stack.push(i);
  }
  return ans;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 5, 2, 10, 8, 1], maxLen: 10 }],
  entry: (a) => `nextSmaller([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "nextSmaller",
      (): string => {
        const ans: number[] = new Array(nums.length).fill(-1)
        const stack: number[] = []
        const resolved: number[] = []
        line(2, `Everyone starts at <b>-1</b>. This is Next Greater's mirror image: flip one comparison and the stack flips from decreasing to <b>increasing</b>.`)
        heap("answer", ans)
        heap("stack", [])
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          vars({ i, "nums[i]": nums[i] })
          line(4, `i = ${i}: nums[i] = <b>${nums[i]}</b>. Who on the stack is waiting for a <b>smaller</b> number?`)
          while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
            const j = stack.pop() as number
            line(5, `Top is index ${j} (value ${nums[j]}): ${nums[j]} > ${nums[i]} — <b>${nums[i]} undercuts it</b>, so it's the answer.`)
            ans[j] = nums[i]
            resolved.push(j)
            mark("good", [...resolved])
            heap("stack", stack.map((k) => `${k}:${nums[k]}`))
            heap("answer", ans)
            line(6, `ans[${j}] = ${nums[i]}. Popped once, done forever — still <b>O(n)</b> overall.`)
          }
          stack.push(i)
          heap("stack", stack.map((k) => `${k}:${nums[k]}`))
          line(8, `Push index ${i}. Stack values top-down: [${[...stack].reverse().map((k) => nums[k]).join(", ")}] — always <b>increasing</b> now.`)
        }
        mark("focus", [])
        ptr("i", -1)
        line(10, `Scan done. ${stack.length > 0 ? `Survivors on the stack (values ${stack.map((k) => nums[k]).join(", ")}) never saw a smaller number to their right — they keep -1.` : `Every index found an answer.`}`)
        heap("answer", ans)
        return JSON.stringify(ans)
      },
      1,
    )
    return go()
  },
}
