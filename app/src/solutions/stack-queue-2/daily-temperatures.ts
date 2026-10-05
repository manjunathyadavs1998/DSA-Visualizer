import type { SolutionDef } from "@/engine/types"

export const dailyTemperatures: SolutionDef = {
  view: "array",
  array: (a) => a.temps as number[],
  code: `// days until a warmer temperature
function dailyTemperatures(temps) {
  const ans = new Array(temps.length).fill(0);
  const stack = [];  // indices still waiting for warmth
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack.at(-1)] < temps[i]) {
      const j = stack.pop();
      ans[j] = i - j;        // day j waited i - j days
    }
    stack.push(i);
  }
  return ans;
}`,
  codeJava: `// days until a warmer temperature
int[] dailyTemperatures(int[] temps) {
  int[] ans = new int[temps.length];
  Deque<Integer> stack = new ArrayDeque<>(); // waiting indices
  for (int i = 0; i < temps.length; i++) {
    while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
      int j = stack.pop();
      ans[j] = i - j;        // day j waited i - j days
    }
    stack.push(i);
  }
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "temps", label: "temperatures", default: [73, 74, 75, 71, 69, 72, 76, 73], maxLen: 12 },
  ],
  entry: (a) => `dailyTemperatures([${(a.temps as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const temps = args.temps as number[]
    const go = fn(
      "dailyTemperatures",
      (): string => {
        const ans: number[] = new Array(temps.length).fill(0)
        const stack: number[] = []
        const resolved: number[] = []
        line(2, `Everyone starts at <b>0</b> — "no warmer day ahead" until we actually see one.`)
        heap("output", ans)
        line(3, `The stack holds indices of days still <b>waiting</b> for a warmer temperature — their temps are always decreasing top-to-bottom.`)
        heap("stack", [])
        for (let i = 0; i < temps.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          vars({ i, "temps[i]": temps[i] })
          line(4, `Day ${i}: temperature <b>${temps[i]}</b>°. Can it answer anyone still waiting on the stack?`)
          while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {
            const j = stack.pop() as number
            line(5, `Top of stack is day ${j} (${temps[j]}°): ${temps[j]} < ${temps[i]}, so day ${i} is its <b>first warmer day</b>.`)
            ans[j] = i - j
            resolved.push(j)
            mark("good", [...resolved])
            heap("stack", stack.map((k) => `day ${k}: ${temps[k]}°`))
            heap("output", ans)
            line(7, `ans[${j}] = ${i} − ${j} = <b>${i - j}</b> days of waiting. Day ${j} is popped once and never returns — that is the <b>O(n)</b> guarantee.`)
          }
          stack.push(i)
          heap("stack", stack.map((k) => `day ${k}: ${temps[k]}°`))
          line(9, `Push day ${i}; it now waits. Stack temps top-down: [${[...stack].reverse().map((k) => temps[k]).join(", ")}] — <b>strictly decreasing</b>.`)
        }
        mark("focus", [])
        ptr("i", -1)
        line(11, `Scan done. ${stack.length > 0 ? `Days ${stack.join(", ")} never saw a warmer day — they keep <b>0</b>.` : "Every day found a warmer day."} Answer: [${ans.join(", ")}].`)
        heap("output", ans)
        return JSON.stringify(ans)
      },
      1,
    )
    return go()
  },
}
