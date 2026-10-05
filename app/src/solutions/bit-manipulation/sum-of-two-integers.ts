import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(99, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const sumOfTwoIntegers: SolutionDef = {
  view: "array",
  array: (a) => [...bits(clamp(a.a as number)), "+", ...bits(clamp(a.b as number))],
  code: `// add without '+': XOR adds, AND finds the carries
function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1; // both 1 → carry one left
    a = a ^ b;                  // per-bit add, no carrying
    b = carry;                  // now add the carries in
  }
  return a;
}`,
  codeJava: `// add without '+': XOR adds, AND finds the carries
int getSum(int a, int b) {
  while (b != 0) {
    int carry = (a & b) << 1;   // both 1 → carry one left
    a = a ^ b;                  // per-bit add, no carrying
    b = carry;                  // now add the carries in
  }
  return a;
}`,
  inputs: [
    { kind: "number", name: "a", label: "a (0–99)", default: 13, min: 0, max: 99 },
    { kind: "number", name: "b", label: "b (0–99)", default: 27, min: 0, max: 99 },
  ],
  entry: (a) => `getSum(${clamp(a.a as number)}, ${clamp(a.b as number)})`,
  run({ fn, line, mark, aset, vars, heap }, args) {
    const a0 = clamp(args.a as number)
    const b0 = clamp(args.b as number)
    const go = fn(
      "getSum",
      (a: number, b: number): number => {
        heap("a", `${a} = ${bin(a)}`)
        heap("b", `${b} = ${bin(b)}`)
        line(2, `a = ${bin(a)} (${a}), b = ${bin(b)} (${b}). Half-adder idea: <b>XOR is addition that forgets carries</b>; <b>AND marks where both bits are 1</b> — exactly the carry spots.`)
        let round = 0
        while (b !== 0) {
          round++
          const carry = (a & b) << 1
          const both = a & b
          mark("bad", Array.from({ length: W }, (_, j) => j).filter((j) => (both >> (W - 1 - j)) & 1))
          line(3, `Round ${round}: a & b = <b>${bin(both)}</b> (both-1 columns, red) → shift left: carry = <b>${bin(carry)}</b> — each carry moves one column up, just like pencil addition.`)
          const xorAB = a ^ b
          line(4, `a = a ^ b = ${bin(a)} ^ ${bin(b)} = <b>${bin(xorAB)}</b> — the carry-less digit sum.`)
          a = xorAB
          for (let j = 0; j < W; j++) aset(j, (a >> (W - 1 - j)) & 1)
          heap("a", `${a} = ${bin(a)}`)
          b = carry
          line(5, `b = carry = <b>${bin(b)}</b>${b === 0 ? " — no carries left, we are done" : " — loop again to add the carries in"}.`)
          for (let j = 0; j < W; j++) aset(W + 1 + j, (b >> (W - 1 - j)) & 1)
          heap("b", `${b} = ${bin(b)}`)
          vars({ round, a, b })
          mark("bad", [])
        }
        mark("good", Array.from({ length: W }, (_, j) => j))
        line(7, `b hit 0 after ${round} round(s): a = <b>${bin(a)}</b> = <b>${a}</b> = ${a0} + ${b0}, and no '+' was ever used. Carries can only ride left, so ≤ bit-width rounds.`)
        return a
      },
      1,
    )
    return go(a0, b0)
  },
}
