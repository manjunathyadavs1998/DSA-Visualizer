import type { SolutionDef } from "@/engine/types"

export const implementStackUsingArrays: SolutionDef = {
  view: "array",
  array: (a) => (a.values as number[]).map(() => "·"),
  code: `// stack in a fixed array; top = -1 means empty
const arr = new Array(cap); let top = -1;
function push(x) {
  if (top === cap - 1) return "overflow";
  arr[++top] = x;
}
function pop() {
  if (top === -1) return "underflow";
  return arr[top--];
}`,
  codeJava: `// stack in a fixed int[]; top = -1 means empty
int[] arr = new int[cap]; int top = -1;
void push(int x) {
  if (top == cap - 1) throw new RuntimeException("overflow");
  arr[++top] = x;
}
int pop() {
  if (top == -1) throw new RuntimeException("underflow");
  return arr[top--];
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values to push", default: [3, 5, 7, 2, 8], maxLen: 6 }],
  entry: (a) => `stackOps([${(a.values as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, heap, narrate }, args) {
    const values = args.values as number[]
    const cap = values.length
    let top = -1
    const stack: number[] = []
    const push = fn(
      "push",
      (x: number): string => {
        line(3, `push(${x}): full? top = ${top}, cap − 1 = ${cap - 1} → ${top === cap - 1 ? "<b>yes — overflow, reject.</b>" : "no, there's room."}`)
        if (top === cap - 1) return "overflow"
        top++
        aset(top, x)
        stack.push(x)
        heap("stack", stack)
        ptr("top", top)
        mark("focus", [top])
        vars({ top, x })
        line(4, `arr[${top}] = ${x} — <b>top climbs</b> to slot ${top}. No shifting, ever: O(1).`)
        return "ok"
      },
      2,
    )
    const pop = fn(
      "pop",
      (): string => {
        line(7, `pop(): empty? top = ${top} → ${top === -1 ? "<b>yes — underflow.</b>" : "no."}`)
        if (top === -1) return "underflow"
        const x = stack.pop() as number
        mark("focus", [top])
        line(8, `Return arr[${top}] = <b>${x}</b>, then top steps back to ${top - 1}. (Real code leaves the slot; we blank it for clarity.)`)
        aset(top, "·")
        top--
        heap("stack", stack)
        ptr("top", top)
        vars({ top })
        return String(x)
      },
      6,
    )
    const stackOps = fn("stackOps", (): string => {
      line(1, `A stack is just an array plus <b>one index</b>. cap = ${cap}, top = -1 (empty).`)
      heap("stack", stack)
      vars({ cap, top })
      for (const v of values) push(v)
      narrate(`The array is full — one more push must fail.`)
      push(99)
      narrate(`Now pop twice. LIFO: the <b>last</b> value in is the <b>first</b> one out.`)
      pop()
      pop()
      mark("focus", [])
      return `top = ${top}`
    })
    stackOps()
    return `stack after ops: [${stack.join(", ")}]`
  },
}
