import type { SolutionDef } from "@/engine/types"

export const dailyTemperatures: SolutionDef = {
  view: "array",
  array: (a) => a.temps as number[],
  code: `// temps is editable below
function dailyTemperatures(temps) {
  const ans = new Array(temps.length).fill(0);
  const stack = []; // indices waiting for a warmer day
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack.at(-1)] < temps[i]) {
      const j = stack.pop();
      ans[j] = i - j;       // days to wait
    }
    stack.push(i);
  }
  return ans;
}`,
  codeJava: `int[] dailyTemperatures(int[] temps) {
  int[] ans = new int[temps.length];
  Deque<Integer> stack = new ArrayDeque<>();
  for (int i = 0; i < temps.length; i++) {
    while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
      int j = stack.pop();
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}`,
  inputs: [{ kind: "numbers", name: "temps", label: "temps", default: [73, 74, 75, 71, 69, 72, 76, 73], maxLen: 10 }],
  entry: (a) => `dailyTemperatures([${(a.temps as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const temps = args.temps as number[]
    const go = fn("dailyTemperatures", (): string => {
      const ans = new Array(temps.length).fill(0)
      const stack: number[] = []
      const resolved: number[] = []
      heap("answer", [...ans])
      heap("stack", [])
      line(1, `ans[i] = days until a warmer temperature. Stack holds indices still <b>waiting</b>.`)
      for (let i = 0; i < temps.length; i++) {
        ptr("i", i)
        mark("focus", [i])
        vars({ i, temp: temps[i] })
        line(4, `i=${i}, temp=${temps[i]}. Pop all stack indices with a colder temperature — today answers them.`)
        while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {
          const j = stack.pop()!
          ans[j] = i - j
          resolved.push(j)
          mark("good", [...resolved])
          heap("stack", stack.map(k => `${k}:${temps[k]}`))
          heap("answer", [...ans])
          line(6, `Index ${j} (temp ${temps[j]}) waited <b>${ans[j]}</b> day${ans[j] > 1 ? "s" : ""} for ${temps[i]}.`)
        }
        stack.push(i)
        heap("stack", stack.map(k => `${k}:${temps[k]}`))
        line(8, `Push ${i}. Stack (top→bottom): [${[...stack].reverse().map(k => temps[k]).join(",")}] — always <b>decreasing</b>.`)
      }
      ptr("i", -1)
      mark("focus", [])
      line(10, `Remaining stack indices never found a warmer day — their answer stays 0.`)
      heap("answer", [...ans])
      return JSON.stringify(ans)
    }, 1)
    return go()
  },
}
