import type { SolutionDef } from "@/engine/types"

export const powXN: SolutionDef = {
  code: `// fast exponentiation: compute the half ONCE, then square it
function pow(x, n) {
  if (n === 0) return 1;
  const half = pow(x, Math.floor(n / 2));
  let result = half * half;              // square the half
  if (n % 2 === 1) result = result * x;  // odd n: one extra x
  return result;
}`,
  codeJava: `// fast exponentiation: compute the half ONCE, then square it
double pow(double x, int n) {
  if (n == 0) return 1;
  double half = pow(x, n / 2);
  double result = half * half;           // square the half
  if (n % 2 == 1) result = result * x;   // odd n: one extra x
  return result;
}`,
  inputs: [
    { kind: "number", name: "x", label: "x", default: 2, min: -5, max: 5 },
    { kind: "number", name: "n", label: "n", default: 10, min: 0, max: 16 },
  ],
  entry: (a) => `pow(${a.x}, ${a.n})`,
  run({ fn, line, vars, narrate }, args) {
    const x = args.x as number
    const n = args.n as number
    const go = fn(
      "pow",
      (b: number, e: number): number => {
        line(2, `pow(${b}, ${e}): is the exponent 0? (${e === 0 ? "<b>yes — anything^0 = 1</b>, the chain's anchor" : "no"})`)
        if (e === 0) return 1
        line(3, `Key insight: ${b}^${e} = (${b}^${Math.floor(e / 2)})² — so compute the HALF once instead of multiplying ${e} times.`)
        const half = go(b, Math.floor(e / 2))
        let result = half * half
        vars({ half, result })
        line(4, `Square it: ${half} × ${half} = <b>${result}</b>${e % 2 === 0 ? ` — and that is ${b}^${e} exactly (even exponent).` : "."}`)
        if (e % 2 === 1) {
          result = result * b
          vars({ half, result })
          line(5, `${e} is odd — halving dropped one factor, so multiply once more by ${b}: result = <b>${result}</b>.`)
        }
        return result
      },
      1,
    )
    narrate(`Each level halves the exponent — only ~${Math.max(1, Math.ceil(Math.log2(Math.max(n, 1)) + 1))} calls instead of ${n} multiplications: a log-n chain, not a tree.`)
    return go(x, n)
  },
}
