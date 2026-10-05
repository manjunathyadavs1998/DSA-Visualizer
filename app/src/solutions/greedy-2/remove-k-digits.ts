import type { SolutionDef } from "@/engine/types"

const sanitizeNum = (s: string): string => {
  const t = s.replace(/[^0-9]/g, "").slice(0, 14)
  return t.length ? t : "1432219"
}

export const removeKDigits: SolutionDef = {
  view: "array",
  array: (a) => sanitizeNum(a.num as string).split(""),
  code: `// monotonic stack: a big digit left of a smaller one must go
function removeKdigits(num, k) {
  const stack = [];
  for (const d of num) {
    while (k > 0 && stack.length && stack[stack.length - 1] > d) {
      stack.pop();   // top is bigger AND more significant: drop it
      k--;
    }
    stack.push(d);
  }
  while (k > 0) { stack.pop(); k--; }  // deletions left over
  const res = stack.join('').replace(/^0+/, '');
  return res === '' ? '0' : res;
}`,
  codeJava: `// monotonic stack: a big digit left of a smaller one must go
String removeKdigits(String num, int k) {
  Deque<Character> stack = new ArrayDeque<>();
  for (char d : num.toCharArray()) {
    while (k > 0 && !stack.isEmpty() && stack.peekLast() > d) {
      stack.pollLast(); // top is bigger AND more significant: drop it
      k--;
    }
    stack.addLast(d);
  }
  while (k > 0) { stack.pollLast(); k--; }  // deletions left over
  String res = join(stack).replaceFirst("^0+", "");
  return res.isEmpty() ? "0" : res;
}`,
  inputs: [
    { kind: "string", name: "num", label: "num (digits only)", default: "1432219", maxLen: 14 },
    { kind: "number", name: "k", label: "k (digits to remove)", default: 3, min: 0, max: 13 },
  ],
  entry: (a) => `removeKdigits("${sanitizeNum(a.num as string)}", ${Math.max(0, Math.trunc(a.k as number))})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const num = sanitizeNum(args.num as string)
    let k = Math.min(Math.max(0, Math.trunc(args.k as number)), num.length)
    const solve = fn(
      "removeKdigits",
      (): string => {
        const stack: string[] = []
        heap("stack", stack)
        vars({ k })
        line(2, `Keep a stack of digits that is as <b>non-decreasing</b> as the budget allows — small digits in high places win.`)
        const dropped: number[] = []
        for (let i = 0; i < num.length; i++) {
          const d = num[i]
          ptr("i", i)
          mark("focus", [i])
          while (k > 0 && stack.length && stack[stack.length - 1] > d) {
            line(4, `Top '${stack[stack.length - 1]}' > incoming '${d}', and ${k} deletion${k > 1 ? "s" : ""} left — the top sits in a MORE significant place, so deleting it helps most.`)
            const popped = stack.pop()
            k--
            heap("stack", [...stack])
            vars({ k })
            line(5, `Pop '${popped}' → stack = "${stack.join("")}", k = <b>${k}</b>.`)
          }
          stack.push(d)
          heap("stack", [...stack])
          line(8, `Push '${d}' → stack = "<b>${stack.join("")}</b>".`)
          mark("done", dropped)
        }
        while (k > 0) {
          const popped = stack.pop()
          k--
          heap("stack", [...stack])
          line(10, `Digits never descended, but k = ${k + 1} remains — pop the largest tail digit '${popped}' → "${stack.join("")}".`)
        }
        ptr("i", -1)
        mark("focus", [])
        const joined = stack.join("")
        const res = joined.replace(/^0+/, "")
        line(11, `Strip leading zeros: "${joined}" → "${res === "" ? "" : res}".`)
        line(12, `Answer: <b>${res === "" ? "0" : res}</b>.`)
        return res === "" ? "0" : res
      },
      1,
    )
    narrate(`Greedy exchange: whenever a digit is larger than its right neighbor, removing IT (not the neighbor) always yields the smaller number.`)
    return solve()
  },
}
