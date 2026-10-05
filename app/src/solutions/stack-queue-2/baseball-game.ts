import type { SolutionDef } from "@/engine/types"

const OPS_DEFAULT = ["5", "2", "C", "D", "+"]

/** Validate the op list: C/D need one prior score, + needs two. */
function opsOf(args: Record<string, unknown>): string[] {
  const toks = String(args.ops ?? "")
    .split(/\s+/)
    .filter((t) => /^(?:-?\d+|[CD+])$/.test(t))
  let n = 0
  for (const t of toks) {
    if (t === "C") {
      if (n < 1) return OPS_DEFAULT
      n--
    } else if (t === "D") {
      if (n < 1) return OPS_DEFAULT
      n++
    } else if (t === "+") {
      if (n < 2) return OPS_DEFAULT
      n++
    } else n++
  }
  return toks.length ? toks : OPS_DEFAULT
}

export const baseballGame: SolutionDef = {
  view: "array",
  array: (a) => opsOf(a),
  code: `// ops: number = score, "+" sum of last two, "D" double, "C" cancel
function calPoints(ops) {
  const stack = [];
  for (const op of ops) {
    const n = stack.length;
    if (op === "C") stack.pop();
    else if (op === "D") stack.push(2 * stack[n - 1]);
    else if (op === "+") stack.push(stack[n - 1] + stack[n - 2]);
    else stack.push(Number(op));
  }
  return stack.reduce((s, x) => s + x, 0);
}`,
  codeJava: `// ops: number = score, "+" sum of last two, "D" double, "C" cancel
int calPoints(String[] ops) {
  List<Integer> stack = new ArrayList<>();
  for (String op : ops) {
    int n = stack.size();
    if (op.equals("C")) stack.remove(n - 1);
    else if (op.equals("D")) stack.add(2 * stack.get(n - 1));
    else if (op.equals("+")) stack.add(stack.get(n-1) + stack.get(n-2));
    else stack.add(Integer.parseInt(op));
  }
  return stack.stream().mapToInt(x -> x).sum();
}`,
  inputs: [{ kind: "string", name: "ops", label: "ops (space-separated)", default: "5 2 C D +", maxLen: 14 }],
  entry: (a) => `calPoints([${opsOf(a).join(" ")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const ops = opsOf(args)
    const go = fn(
      "calPoints",
      (): number => {
        const stack: number[] = []
        line(2, `The record is a <b>stack of scores</b> — every op is defined relative to the <b>most recent</b> scores, which is exactly what a stack gives us.`)
        heap("stack", [])
        for (let i = 0; i < ops.length; i++) {
          const op = ops[i]
          ptr("i", i)
          mark("focus", [i])
          const n = stack.length
          vars({ i, op })
          line(4, `op #${i + 1} is "<b>${op}</b>" — ${op === "C" ? "cancel the last score" : op === "D" ? "double the last score" : op === "+" ? "add the last two scores" : "a plain score"}. Record has ${n} score${n === 1 ? "" : "s"}.`)
          if (op === "C") {
            const gone = stack.pop()
            heap("stack", [...stack])
            mark("bad", [i])
            line(5, `"C" <b>cancels</b> the previous score → pop <b>${gone}</b>. Record: [${stack.join(", ")}].`)
            mark("bad", [])
          } else if (op === "D") {
            stack.push(2 * stack[n - 1])
            heap("stack", [...stack])
            line(6, `"D" <b>doubles</b> the last score: 2 × ${stack[stack.length - 2]} = <b>${stack[stack.length - 1]}</b>. Record: [${stack.join(", ")}].`)
          } else if (op === "+") {
            stack.push(stack[n - 1] + stack[n - 2])
            heap("stack", [...stack])
            line(7, `"+" records the <b>sum of the last two</b>: ${stack[n - 1]} + ${stack[n - 2]} = <b>${stack[stack.length - 1]}</b>. Record: [${stack.join(", ")}].`)
          } else {
            stack.push(Number(op))
            heap("stack", [...stack])
            line(8, `"${op}" is a plain score → push <b>${op}</b>. Record: [${stack.join(", ")}].`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        const total = stack.reduce((s, x) => s + x, 0)
        heap("output", total)
        line(10, `Sum what survived: ${stack.join(" + ") || "0"} = <b>${total}</b>. One pass, O(n).`)
        return total
      },
      1,
    )
    return go()
  },
}
