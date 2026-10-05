import type { SolutionDef } from "@/engine/types"

function numOf(args: Record<string, unknown>): string {
  const s = String(args.num ?? "").replace(/\D/g, "").slice(0, 14)
  return s.length ? s : "1432219"
}

function kOf(args: Record<string, unknown>): number {
  const n = numOf(args).length
  const k = Math.trunc(args.k as number)
  return Math.max(0, Math.min(n, Number.isFinite(k) ? k : 3))
}

export const removeKDigits: SolutionDef = {
  view: "array",
  array: (a) => numOf(a).split(""),
  code: `// remove k digits so the remaining number is smallest
function removeKdigits(num, k) {
  const stack = [];
  for (const d of num) {
    while (k > 0 && stack.length && stack.at(-1) > d) {
      stack.pop(); k--;  // a bigger digit left of a smaller one
    }
    stack.push(d);
  }
  while (k > 0) { stack.pop(); k--; }  // still too long: trim tail
  const res = stack.join("").replace(/^0+/, "");
  return res === "" ? "0" : res;
}`,
  codeJava: `// remove k digits so the remaining number is smallest
String removeKdigits(String num, int k) {
  StringBuilder stack = new StringBuilder();
  for (char d : num.toCharArray()) {
    while (k > 0 && stack.length() > 0 && lastChar(stack) > d) {
      stack.setLength(stack.length() - 1); k--;  // drop bigger
    }
    stack.append(d);
  }
  stack.setLength(stack.length() - k);  // still too long: trim
  String res = stack.toString().replaceFirst("^0+", "");
  return res.isEmpty() ? "0" : res;
}`,
  inputs: [
    { kind: "string", name: "num", label: "num (digits)", default: "1432219", maxLen: 14 },
    { kind: "number", name: "k", label: "k (digits to remove)", default: 3, min: 0, max: 14 },
  ],
  entry: (a) => `removeKdigits("${numOf(a)}", ${kOf(a)})`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const num = numOf(args)
    let k = kOf(args)
    const go = fn(
      "removeKdigits",
      (): string => {
        const stack: string[] = []
        line(2, `Greedy insight: a number is smaller when its <b>leading digits</b> are smaller. So delete any digit that is <b>bigger than the digit after it</b> — the stack finds those pairs.`)
        heap("stack", [])
        for (let i = 0; i < num.length; i++) {
          const d = num[i]
          ptr("i", i)
          mark("focus", [i])
          vars({ i, d, k })
          line(4, `Digit '<b>${d}</b>'. While we still have removals (k = ${k}) and the stack top is bigger than '${d}', deleting the top helps.`)
          while (k > 0 && stack.length > 0 && stack[stack.length - 1] > d) {
            const gone = stack.pop()
            k--
            heap("stack", [...stack])
            vars({ i, d, k })
            line(5, `Top '${gone}' > '${d}' → <b>pop it</b>: '${d}' takes an earlier (more significant) position. k = <b>${k}</b> left.`)
          }
          stack.push(d)
          heap("stack", [...stack])
          line(7, `Push '${d}'. Kept so far: "<b>${stack.join("")}</b>" — digits are <b>non-decreasing</b>, so nothing inside can be improved.`)
        }
        ptr("i", -1)
        mark("focus", [])
        if (k > 0) {
          line(9, `Digits never went down (non-decreasing run) and k = ${k} removals remain → the <b>largest digits are at the tail</b>; chop them off.`)
          while (k > 0) {
            stack.pop()
            k--
            heap("stack", [...stack])
          }
          line(9, `After trimming: "<b>${stack.join("")}</b>".`)
        }
        const joined = stack.join("").replace(/^0+/, "")
        const res = joined === "" ? "0" : joined
        heap("output", res)
        line(10, `Strip leading zeros: "${stack.join("")}" → "<b>${joined || "0"}</b>".`)
        line(11, `Smallest possible number: "<b>${res}</b>". Each digit pushed/popped once → O(n).`)
        return res
      },
      1,
    )
    return go()
  },
}
