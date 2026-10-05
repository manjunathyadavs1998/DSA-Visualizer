import type { SolutionDef } from "@/engine/types"

export const validateStackSequences: SolutionDef = {
  view: "array",
  array: (a) => a.pushed as number[],
  code: `// could popped be produced by push/pop operations on pushed?
function validateStackSequences(pushed, popped) {
  const stack = [];
  let j = 0;         // next value popped expects
  for (const x of pushed) {
    stack.push(x);   // always push in the given order
    while (stack.length && stack.at(-1) === popped[j]) {
      stack.pop();   // greedy: pop whenever the top matches
      j++;
    }
  }
  return stack.length === 0;
}`,
  codeJava: `// could popped be produced by push/pop operations on pushed?
boolean validateStackSequences(int[] pushed, int[] popped) {
  Deque<Integer> stack = new ArrayDeque<>();
  int j = 0;         // next value popped expects
  for (int x : pushed) {
    stack.push(x);   // always push in the given order
    while (!stack.isEmpty() && stack.peek() == popped[j]) {
      stack.pop();   // greedy: pop whenever the top matches
      j++;
    }
  }
  return stack.isEmpty();
}`,
  inputs: [
    { kind: "numbers", name: "pushed", label: "pushed", default: [1, 2, 3, 4, 5], maxLen: 10 },
    { kind: "numbers", name: "popped", label: "popped", default: [4, 5, 3, 2, 1], maxLen: 10 },
  ],
  entry: (a) => `validate([${(a.pushed as number[]).join(",")}], [${(a.popped as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const pushed = args.pushed as number[]
    const popped = args.popped as number[]
    const go = fn(
      "validateStackSequences",
      (): boolean => {
        const stack: number[] = []
        let j = 0
        line(2, `Strategy: <b>simulate</b>. Push pushed[] in order, and greedily pop whenever the top equals the next expected pop. Greedy is safe — a matching top popped later can never help.`)
        heap("stack", [])
        heap("popped", popped)
        for (let i = 0; i < pushed.length; i++) {
          const x = pushed[i]
          ptr("i", i)
          mark("focus", [i])
          stack.push(x)
          heap("stack", [...stack])
          vars({ i, x, j, "popped[j]": j < popped.length ? popped[j] : "—" })
          line(5, `Push <b>${x}</b>. Stack: [${stack.join(", ")}]. Next expected pop: <b>${j < popped.length ? popped[j] : "none"}</b>.`)
          while (stack.length > 0 && j < popped.length && stack[stack.length - 1] === popped[j]) {
            const v = stack.pop() as number
            heap("stack", [...stack])
            j++
            vars({ i, x, j, "popped[j]": j < popped.length ? popped[j] : "—" })
            line(7, `Top <b>${v}</b> = popped[${j - 1}] → <b>pop it now</b>. ${j < popped.length ? `Next expected: ${popped[j]}.` : "popped[] fully consumed!"}`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        const ok = stack.length === 0
        heap("output", ok)
        if (ok) {
          line(11, `Everything pushed was popped in exactly the requested order → <b>true</b>. O(n): each value pushed and popped once.`)
        } else {
          line(11, `Stuck: [${stack.join(", ")}] remains but the next expected pop is ${j < popped.length ? `<b>${popped[j]}</b>, which is buried or already used` : "nothing"} → <b>false</b>.`)
        }
        return ok
      },
      1,
    )
    return go()
  },
}
