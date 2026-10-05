import type { SolutionDef } from "@/engine/types"

export const implementQueueUsingStacks: SolutionDef = {
  view: "array",
  array: (a) => a.values as number[],
  code: `// queue from two stacks: reverse once, lazily
function push(x) {
  inS.push(x);
}
function pop() {
  if (outS.length === 0)
    while (inS.length > 0)
      outS.push(inS.pop());  // the transfer reverses order
  return outS.pop();
}`,
  codeJava: `// queue from two stacks: reverse once, lazily
void push(int x) {
  in.push(x);
}
int pop() {
  if (out.isEmpty())
    while (!in.isEmpty())
      out.push(in.pop());    // the transfer reverses order
  return out.pop();
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values to push", default: [3, 5, 7, 2], maxLen: 5 }],
  entry: (a) => `queueFromStacks([${(a.values as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const values = args.values as number[]
    const inS: { v: number; i: number }[] = []
    const outS: { v: number; i: number }[] = []
    const done: number[] = []
    const snap = () => {
      heap("in", inS.map((e) => e.v))
      heap("out", outS.map((e) => e.v))
    }
    const push = fn(
      "push",
      (x: number, i: number): string => {
        ptr("i", i)
        mark("focus", [i])
        vars({ x })
        inS.push({ v: x, i })
        snap()
        line(2, `push(${x}): just drop it on the <b>in</b> stack — O(1), no questions asked.`)
        return "ok"
      },
      1,
    )
    const pop = fn(
      "pop",
      (): string => {
        line(5, `pop(): is <b>out</b> empty? ${outS.length === 0 ? "<b>Yes</b> — time to pay for the lazy pushes." : `No — its top is already the oldest element. <b>O(1), no transfer.</b>`}`)
        if (outS.length === 0) {
          while (inS.length > 0) {
            const e = inS.pop() as { v: number; i: number }
            outS.push(e)
            snap()
            line(7, `Transfer ${e.v}: in → out. Stacking a stack onto a stack <b>reverses it</b> — newest sinks to the bottom, oldest rises to the top.`)
          }
        }
        const e = outS.pop() as { v: number; i: number }
        snap()
        done.push(e.i)
        mark("done", [...done])
        line(8, `Pop out's top = <b>${e.v}</b> — the oldest value: FIFO. Each element moves at most twice ever, so pop is <b>O(1) amortized</b>.`)
        return String(e.v)
      },
      4,
    )
    const queueFromStacks = fn("queueFromStacks", (): string => {
      narrate(`Two stacks, one lazy flip: pushes pile up in "in"; the first pop flips them all into "out", already reversed into queue order.`)
      snap()
      if (values.length === 0) return "no ops"
      push(values[0], 0)
      if (values.length > 1) push(values[1], 1)
      pop()
      for (let i = 2; i < values.length; i++) push(values[i], i)
      if (inS.length + outS.length > 0) pop()
      if (inS.length + outS.length > 0) pop()
      mark("focus", [])
      ptr("i", -1)
      return "done"
    })
    queueFromStacks()
    return `pops came out oldest-first (FIFO)`
  },
}
