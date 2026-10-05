import type { SolutionDef } from "@/engine/types"

const digitsOf = (x: number): number[] => String(Math.abs(Math.trunc(x))).split("").map(Number)

export const reverseInteger: SolutionDef = {
  view: "array",
  array: (a) => digitsOf(a.x as number),
  code: `// pop digits off x, push onto rev — watch 32-bit overflow
function reverse(x) {
  const LIMIT = 2147483647;             // 2^31 - 1
  let n = Math.abs(x), rev = 0;
  while (n > 0) {
    const d = n % 10;                   // pop the last digit
    rev = rev * 10 + d;                 // push it onto rev
    n = Math.floor(n / 10);
    if (rev > LIMIT) return 0;          // overflow guard
  }
  return x < 0 ? -rev : rev;
}`,
  codeJava: `// pop digits off x, push onto rev — watch 32-bit overflow
int reverse(int x) {
  final long LIMIT = Integer.MAX_VALUE; // 2^31 - 1
  long n = Math.abs((long) x), rev = 0;
  while (n > 0) {
    long d = n % 10;                    // pop the last digit
    rev = rev * 10 + d;                 // push it onto rev
    n = n / 10;
    if (rev > LIMIT) return 0;          // overflow guard
  }
  return x < 0 ? (int) -rev : (int) rev;
}`,
  inputs: [{ kind: "number", name: "x", label: "x", default: -1234, min: -9999, max: 9999 }],
  entry: (a) => `reverse(${Math.trunc(a.x as number)})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const x = Math.trunc(args.x as number)
    const digits = digitsOf(x)
    const go = fn(
      "reverse",
      (): number => {
        let n = Math.abs(x)
        let rev = 0
        line(3, `Work on |x| = <b>${n}</b>, remember the sign (${x < 0 ? "negative" : "non-negative"}); rev starts at 0.`)
        const done: number[] = []
        let i = digits.length - 1
        while (n > 0) {
          const d = n % 10
          ptr("pop", i)
          mark("focus", [i])
          line(5, `n = ${n}: pop its last digit d = n % 10 = <b>${d}</b>.`)
          rev = rev * 10 + d
          line(6, `Push: rev = rev × 10 + ${d} = <b>${rev}</b> — old digits shift left to make room.`)
          n = Math.floor(n / 10)
          done.push(i)
          mark("done", [...done])
          vars({ n, d, rev })
          heap("rev digits", String(rev).split(""))
          i--
        }
        ptr("pop", -1)
        mark("focus", [])
        line(8, `rev = ${rev} ≤ 2³¹ − 1 — no overflow (LeetCode's real trap: 1534236469 reversed overflows → 0).`)
        const ans = x < 0 ? -rev : rev
        mark("good", digits.map((_, k) => k))
        line(10, `Reapply the sign: reverse(${x}) = <b>${ans}</b>.`)
        return ans
      },
      1,
    )
    return go()
  },
}
