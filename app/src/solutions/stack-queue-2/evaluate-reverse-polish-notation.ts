import type { SolutionDef } from "@/engine/types"

const DEFAULT_TOKENS = ["5", "1", "2", "+", "4", "*", "+"]

/** Parse and validate a space-separated RPN expression; fall back if it would crash. */
function rpnTokens(raw: unknown): string[] {
  const toks = String(raw ?? "")
    .split(/\s+/)
    .filter((t) => /^(?:-?\d+|[+\-*/])$/.test(t))
  // simulate to guarantee the expression is well-formed and never divides by 0
  let depth = 0
  const sim: number[] = []
  for (const t of toks) {
    if (/^[+\-*/]$/.test(t)) {
      if (depth < 2) return DEFAULT_TOKENS
      const b = sim.pop() as number
      const a = sim.pop() as number
      if (t === "/" && b === 0) return DEFAULT_TOKENS
      sim.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b))
      depth--
    } else {
      sim.push(Number(t))
      depth++
    }
  }
  return depth === 1 ? toks : DEFAULT_TOKENS
}

export const evaluateReversePolishNotation: SolutionDef = {
  view: "array",
  array: (a) => rpnTokens(a.tokens),
  code: `// evaluate Reverse Polish Notation
function evalRPN(tokens) {
  const stack = [];
  for (const tok of tokens) {
    if ("+-*/".includes(tok)) {
      const b = stack.pop(), a = stack.pop();
      if (tok === "+") stack.push(a + b);
      if (tok === "-") stack.push(a - b);
      if (tok === "*") stack.push(a * b);
      if (tok === "/") stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(tok));
    }
  }
  return stack.pop();
}`,
  codeJava: `// evaluate Reverse Polish Notation
int evalRPN(String[] tokens) {
  Deque<Integer> stack = new ArrayDeque<>();
  for (String tok : tokens) {
    if ("+-*/".contains(tok)) {
      int b = stack.pop(), a = stack.pop();
      if (tok.equals("+")) stack.push(a + b);
      if (tok.equals("-")) stack.push(a - b);
      if (tok.equals("*")) stack.push(a * b);
      if (tok.equals("/")) stack.push(a / b);
    } else {
      stack.push(Integer.parseInt(tok));
    }
  }
  return stack.pop();
}`,
  inputs: [
    { kind: "string", name: "tokens", label: "tokens (space-separated)", default: "5 1 2 + 4 * +", maxLen: 14 },
  ],
  entry: (a) => `evalRPN([${rpnTokens(a.tokens).join(" ")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const tokens = rpnTokens(args.tokens)
    const go = fn(
      "evalRPN",
      (): number => {
        const stack: number[] = []
        line(2, `RPN puts the operator <b>after</b> its operands — so a stack is the whole algorithm: numbers wait, operators consume.`)
        heap("stack", [])
        for (let i = 0; i < tokens.length; i++) {
          const tok = tokens[i]
          ptr("i", i)
          mark("focus", [i])
          if ("+-*/".includes(tok)) {
            const b = stack.pop() as number
            const a = stack.pop() as number
            heap("stack", [...stack])
            line(5, `"${tok}" is an operator → pop the two most recent results: b = <b>${b}</b>, a = <b>${a}</b> (order matters for − and ÷).`)
            const v = tok === "+" ? a + b : tok === "-" ? a - b : tok === "*" ? a * b : Math.trunc(a / b)
            stack.push(v)
            heap("stack", [...stack])
            vars({ a, b, result: v })
            line(tok === "+" ? 6 : tok === "-" ? 7 : tok === "*" ? 8 : 9, `${a} ${tok} ${b} = <b>${v}</b> → push it back; it becomes an operand for a later operator.`)
          } else {
            stack.push(Number(tok))
            heap("stack", [...stack])
            line(11, `"${tok}" is a number → push <b>${tok}</b> and keep scanning. Stack: [${stack.join(", ")}].`)
          }
        }
        mark("focus", [])
        ptr("i", -1)
        const ans = stack.pop() as number
        heap("stack", [...stack])
        heap("output", ans)
        line(14, `All tokens consumed, exactly one value remains → the answer is <b>${ans}</b>. One pass, O(n) time.`)
        return ans
      },
      1,
    )
    return go()
  },
}
