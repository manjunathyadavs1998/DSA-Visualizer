import type { SolutionDef } from "@/engine/types"

function dupString(args: Record<string, unknown>): string {
  const s = String(args.s ?? "").toLowerCase().replace(/[^a-z]/g, "")
  return s.length ? s.slice(0, 14) : "abbaca"
}

export const removeAllAdjacentDuplicatesInString: SolutionDef = {
  view: "array",
  array: (a) => dupString(a).split(""),
  code: `// delete adjacent equal pairs until none remain
function removeDuplicates(s) {
  const stack = [];
  for (const c of s) {
    if (stack.length && stack.at(-1) === c) {
      stack.pop();     // c annihilates the top
    } else {
      stack.push(c);
    }
  }
  return stack.join("");
}`,
  codeJava: `// delete adjacent equal pairs until none remain
String removeDuplicates(String s) {
  StringBuilder stack = new StringBuilder();
  for (char c : s.toCharArray()) {
    if (stack.length() > 0 && stack.charAt(stack.length()-1) == c) {
      stack.deleteCharAt(stack.length() - 1); // c kills the top
    } else {
      stack.append(c);
    }
  }
  return stack.toString();
}`,
  inputs: [{ kind: "string", name: "s", label: "s (lowercase)", default: "abbaca", maxLen: 14 }],
  entry: (a) => `removeDuplicates("${dupString(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = dupString(args)
    const go = fn(
      "removeDuplicates",
      (): string => {
        const stack: string[] = []
        line(2, `Naively you'd rescan after every deletion — O(n²). The stack remembers the <b>surviving prefix</b>, so each character is handled once.`)
        heap("stack", [])
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          vars({ i, c, "stack top": stack.length ? stack[stack.length - 1] : "∅" })
          if (stack.length > 0 && stack[stack.length - 1] === c) {
            line(4, `'${c}' equals the stack top '${stack[stack.length - 1]}' → they form an <b>adjacent pair</b>.`)
            stack.pop()
            heap("stack", [...stack])
            mark("bad", [i])
            line(5, `Pop! Both copies of '${c}' vanish. ${stack.length ? `New top '${stack[stack.length - 1]}' is now exposed — a deletion can <b>create a new pair</b> with the next char.` : "Stack is empty again."}`)
            mark("bad", [])
          } else {
            line(4, `'${c}' ${stack.length ? `differs from top '${stack[stack.length - 1]}'` : "arrives on an empty stack"} → no pair here.`)
            stack.push(c)
            heap("stack", [...stack])
            line(7, `Push '${c}'. Survivors so far: "<b>${stack.join("")}</b>".`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        const ans = stack.join("")
        heap("output", ans)
        line(10, `Done in one pass: every char pushed once, popped at most once → <b>O(n)</b>. Result: "<b>${ans}</b>".`)
        return ans
      },
      1,
    )
    return go()
  },
}
