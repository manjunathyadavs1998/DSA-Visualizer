import type { SolutionDef } from "@/engine/types"

export const minStack: SolutionDef = {
  view: "array",
  array: (a) => a.values as number[],
  code: `// twin stacks: mins[i] = min of stack[0..i]
function push(x) {
  stack.push(x);
  const m = mins.length ? Math.min(x, mins.at(-1)) : x;
  mins.push(m);          // the min-so-far rides along
}
function pop() {
  mins.pop();            // min history rewinds for free
  return stack.pop();
}
function getMin() {
  return mins.at(-1);    // O(1) — no scanning
}`,
  codeJava: `// twin stacks: mins[i] = min of stack[0..i]
void push(int x) {
  stack.push(x);
  int m = mins.isEmpty() ? x : Math.min(x, mins.peek());
  mins.push(m);          // the min-so-far rides along
}
int pop() {
  mins.pop();            // min history rewinds for free
  return stack.pop();
}
int getMin() {
  return mins.peek();    // O(1) — no scanning
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values to push", default: [5, 2, 7, 1], maxLen: 6 }],
  entry: (a) => `minStackOps([${(a.values as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const values = args.values as number[]
    const stack: number[] = []
    const mins: number[] = []
    const done: number[] = []
    const push = fn(
      "push",
      (x: number, i: number): string => {
        ptr("i", i)
        mark("focus", [i])
        vars({ x })
        stack.push(x)
        heap("stack", stack)
        line(2, `push(${x}) onto the main stack.`)
        const m = mins.length > 0 ? Math.min(x, mins[mins.length - 1]) : x
        line(3, mins.length === 0
          ? `mins is empty — the min so far is just ${x}.`
          : `min so far = min(${x}, ${mins[mins.length - 1]}) = <b>${m}</b>${m === x ? ` — ${x} is the new champion.` : ` — the old min ${mins[mins.length - 1]} still rules.`}`)
        mins.push(m)
        heap("mins", mins)
        line(4, `Push ${m} onto mins. The twin stacks move in <b>lockstep</b>: mins[top] always knows the min of everything below.`)
        return "ok"
      },
      1,
    )
    const pop = fn(
      "pop",
      (i: number): string => {
        const m = mins.pop() as number
        heap("mins", mins)
        line(7, `Pop mins too (dropping ${m}) — the min <b>rewinds automatically</b> to what it was before this element arrived. No recomputation.`)
        const x = stack.pop() as number
        heap("stack", stack)
        done.push(i)
        mark("done", [...done])
        line(8, `Pop <b>${x}</b> from the main stack.`)
        return String(x)
      },
      6,
    )
    const getMin = fn(
      "getMin",
      (): string => {
        const m = mins[mins.length - 1]
        line(11, `getMin(): just peek mins' top → <b>${m}</b>. O(1) — the scan was prepaid, one comparison per push.`)
        return String(m)
      },
      10,
    )
    const minStackOps = fn("minStackOps", (): string => {
      narrate(`Question: how can pop() restore the previous minimum without searching? Answer: every element carries the min-so-far in a twin stack.`)
      heap("stack", stack)
      heap("mins", mins)
      if (values.length === 0) return "no ops"
      for (let i = 0; i < values.length; i++) {
        push(values[i], i)
        getMin()
      }
      narrate(`Now pop — watch mins fall back to earlier champions all by itself.`)
      if (stack.length > 0) {
        pop(values.length - 1)
        if (stack.length > 0) getMin()
      }
      if (stack.length > 0) {
        pop(values.length - 2)
        if (stack.length > 0) getMin()
      }
      mark("focus", [])
      ptr("i", -1)
      return "done"
    })
    minStackOps()
    return `stack: [${stack.join(", ")}], mins: [${mins.join(", ")}]`
  },
}
