import type { SolutionDef } from "@/engine/types"

export const sortAStack: SolutionDef = {
  code: `// stack is editable below (rightmost = top)
function sortStack(stack) {
  if (stack.length === 0) return;
  const top = stack.pop();
  sortStack(stack);
  insertSorted(stack, top);
}
function insertSorted(stack, x) {
  if (stack.length === 0 || stack.at(-1) <= x) {
    stack.push(x);
    return;
  }
  const top = stack.pop();
  insertSorted(stack, x);
  stack.push(top);
}`,
  codeJava: `// stack is editable below (rightmost = top)
void sortStack(Deque<Integer> stack) {
  if (stack.isEmpty()) return;
  int top = stack.pop();
  sortStack(stack);
  insertSorted(stack, top);
}
void insertSorted(Deque<Integer> stack, int x) {
  if (stack.isEmpty() || stack.peek() <= x) {
    stack.push(x);
    return;
  }
  int top = stack.pop();
  insertSorted(stack, x);
  stack.push(top);
}`,
  inputs: [{ kind: "numbers", name: "stack", label: "stack (rightmost = top)", default: [3, 1, 4, 2], maxLen: 5 }],
  entry: (a) => `sortStack([${(a.stack as number[]).join(",")}])`,
  run({ fn, line, heap, narrate }, args) {
    const stack: number[] = [...(args.stack as number[])]
    const insertSorted = fn(
      "insertSorted",
      (x: number): string => {
        const topVal = stack.length > 0 ? stack[stack.length - 1] : null
        const fits = topVal === null || topVal <= x
        line(8, `insertSorted(${x}): top is ${topVal === null ? "— (empty)" : topVal} → ${fits ? `${topVal === null ? "empty stack" : `${topVal} ≤ ${x}`}, so <b>${x} belongs right here</b>.` : `${topVal} > ${x}, so ${x} must sink <b>deeper</b>.`}`)
        if (fits) {
          stack.push(x)
          heap("stack", stack)
          line(9, `Push ${x}. Stack (bottom→top): [${stack.join(", ")}] — sorted so far.`)
          return `placed ${x}`
        }
        const top = stack.pop() as number
        heap("stack", stack)
        line(12, `Lift ${top} out of the way — this frame holds it while ${x} keeps sinking.`)
        insertSorted(x)
        stack.push(top)
        heap("stack", stack)
        line(14, `${x} is settled below — put ${top} back on top (${top} > ${x}, so order holds): [${stack.join(", ")}].`)
        return `reinserted ${top}`
      },
      7,
    )
    const sortStack = fn(
      "sortStack",
      (): string => {
        line(2, `sortStack(): ${stack.length === 0 ? "<b>empty</b> — a stack of nothing is sorted. Unwind." : `stack = [${stack.join(", ")}] — peel the top off and sort the rest first.`}`)
        if (stack.length === 0) return "∅"
        const top = stack.pop() as number
        heap("stack", stack)
        line(3, `Hold <b>${top}</b> in this call frame — the call stack is our free extra storage.`)
        sortStack()
        line(5, `Everything below is now sorted — sink ${top} to its correct depth.`)
        insertSorted(top)
        return `[${stack.join(", ")}]`
      },
      1,
    )
    narrate(`Only stack operations allowed — no arrays, no loops. Recursion empties the stack, then insertSorted rebuilds it in order, one value at a time.`)
    heap("stack", stack)
    sortStack()
    narrate(`Done: [${stack.join(", ")}] — smallest at the bottom, largest on top.`)
    return `[${stack.join(", ")}]`
  },
}
