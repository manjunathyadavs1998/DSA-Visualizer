import type { SolutionDef } from "@/engine/types"

const clampN = (n: number): number => Math.max(1, Math.min(12, Math.trunc(n)))
const clampS = (s: number): number => Math.max(0, Math.min(20, Math.trunc(s)))
const build = (n: number, start: number): number[] => Array.from({ length: n }, (_, i) => start + 2 * i)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(8, "0").slice(-8)

export const xorOperationInAnArray: SolutionDef = {
  view: "array",
  array: (a) => build(clampN(a.n as number), clampS(a.start as number)),
  code: `// nums[i] = start + 2*i; XOR them all together
function xorOperation(n, start) {
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc = acc ^ (start + 2 * i); // generate, then fold in
  }
  return acc;
}`,
  codeJava: `// nums[i] = start + 2*i; XOR them all together
int xorOperation(int n, int start) {
  int acc = 0;
  for (int i = 0; i < n; i++) {
    acc = acc ^ (start + 2 * i); // generate, then fold in
  }
  return acc;
}`,
  inputs: [
    { kind: "number", name: "n", label: "n (1–12)", default: 6, min: 1, max: 12 },
    { kind: "number", name: "start", label: "start (0–20)", default: 3, min: 0, max: 20 },
  ],
  entry: (a) => `xorOperation(${clampN(a.n as number)}, ${clampS(a.start as number)})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const n = clampN(args.n as number)
    const start = clampS(args.start as number)
    const go = fn(
      "xorOperation",
      (): number => {
        let acc = 0
        heap("acc", `${acc} = ${bin(acc)}`)
        line(2, `The array is implicit: nums[i] = ${start} + 2·i, i.e. every value steps by 2 so <b>the low bit is the same (${start & 1}) in all of them</b>. Fold them into acc with XOR.`)
        for (let i = 0; i < n; i++) {
          const x = start + 2 * i
          ptr("i", i)
          mark("focus", [i])
          line(3, `i = ${i}: generate nums[${i}] = ${start} + 2·${i} = <b>${x}</b> = ${bin(x)} — note the low bit stays ${x & 1}.`)
          const next = acc ^ x
          line(4, `acc = ${bin(acc)} ^ ${bin(x)} → <b>${bin(next)}</b> (= ${next}) — columns where they differ become 1, matching 1s cancel.`)
          acc = next
          heap("acc", `${acc} = ${bin(acc)}`)
          vars({ i, "nums[i]": x, acc })
          mark("done", Array.from({ length: i + 1 }, (_, k) => k))
        }
        ptr("i", -1)
        mark("focus", [])
        line(6, `acc = <b>${acc}</b> (${bin(acc)}). Fun fact: because XOR of consecutive evens/odds telescopes, this also has a closed-form O(1) solution — but the fold is the honest O(n) one.`)
        return acc
      },
      1,
    )
    return go()
  },
}
