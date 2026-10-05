import type { SolutionDef } from "@/engine/types"

export const validParentheses: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below — try "([)]" or "(()"
function isValid(s) {
  const stack = [];
  const match = { ')': '(', ']': '[', '}': '{' };
  for (let i = 0; i < s.length; i++) {
    if (!match[s[i]]) stack.push(s[i]);
    else if (stack.pop() !== match[s[i]]) return false;
  }
  return stack.length === 0;
}`,
  codeJava: `// String s is editable below — try "([)]" or "(()"
boolean isValid(String s) {
  Deque<Character> stack = new ArrayDeque<>();
  Map<Character, Character> match = Map.of(')','(', ']','[', '}','{');
  for (int i = 0; i < s.length(); i++) {
    if (!match.containsKey(s.charAt(i))) stack.push(s.charAt(i));
    else if (stack.isEmpty() || stack.pop() != match.get(s.charAt(i))) return false;
  }
  return stack.isEmpty();
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "([{}])(())[{}]", maxLen: 14 }],
  entry: (a) => `isValid("${a.s}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const match: Record<string, string> = { ")": "(", "]": "[", "}": "{" }
    const go = fn(
      "isValid",
      (): boolean => {
        const stack: { ch: string; idx: number }[] = []
        const good: number[] = []
        heap("stack", [])
        line(2, `Scan left to right. Openers <b>wait</b> on the stack; every closer must match the <b>most recent</b> unclosed opener — exactly LIFO.`)
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          vars({ i, c })
          if (!match[c]) {
            stack.push({ ch: c, idx: i })
            heap("stack", stack.map((e) => e.ch))
            line(5, `'${c}' is an <b>opener</b> — push it and move on. Stack: [${stack.map((e) => e.ch).join(" ")}].`)
          } else {
            const top = stack.pop()
            heap("stack", stack.map((e) => e.ch))
            if (!top || top.ch !== match[c]) {
              line(6, top
                ? `'${c}' needs '${match[c]}' on top, but the top is '${top.ch}' — <b>wrong nesting, invalid!</b>`
                : `'${c}' arrives with an <b>empty stack</b> — there's nothing to close. Invalid!`)
              mark("bad", top ? [top.idx, i] : [i])
              mark("focus", [])
              return false
            }
            good.push(top.idx, i)
            mark("good", [...good])
            line(6, `'${c}' closes the top '${top.ch}' — pop it. The pair (${top.idx}, ${i}) is matched ✓`)
          }
        }
        mark("focus", [])
        if (stack.length > 0) {
          mark("bad", stack.map((e) => e.idx))
          line(8, `End of string, but ${stack.length} opener${stack.length === 1 ? "" : "s"} never got closed → <b>false</b>.`)
          return false
        }
        line(8, `Stack is empty — every opener found its closer, in the right order. <b>Valid!</b>`)
        return true
      },
      1,
    )
    return go()
  },
}
