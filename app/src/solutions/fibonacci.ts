import type { SolutionDef } from "@/engine/types"

export const fibonacci: SolutionDef = {
  code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
  codeJava: `int fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 6, min: 0, max: 10 }],
  entry: (a) => `fib(${a.n})`,
  run({ fn, line, narrate }, args) {
    const fib = fn(
      "fib",
      (n: number): number => {
        line(1, `fib(${n}): is n ≤ 1? (${n <= 1 ? "<b>yes — base case</b>" : "no"})`)
        if (n <= 1) return n
        line(2, `fib(${n}) needs fib(${n - 1}) first — it <b>pauses</b> and calls down.`)
        const L = fib(n - 1)
        line(2, `Back in fib(${n}): left part = ${L}. Now the second call, fib(${n - 2}).`)
        const R = fib(n - 2)
        line(2, `fib(${n}): ${L} + ${R} = <b>${L + R}</b> — returning.`)
        return L + R
      },
      0,
    )
    narrate("Plain recursion, no memo — count the repeated subtrees as they appear.")
    return fib(args.n as number)
  },
}
