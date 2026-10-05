import type { SolutionDef } from "@/engine/types"

const clampN = (n: number) => Math.min(25, Math.max(1, Math.trunc(n)))

export const bulbSwitcher: SolutionDef = {
  view: "array",
  // bulb i lives in cell i-1; 0 = off, 1 = on
  array: (a) => Array.from({ length: clampN(a.n as number) }, () => 0),
  code: `// bulb i gets toggled once per divisor of i
function bulbSwitch(n) {
  const on = new Array(n + 1).fill(false);
  for (let round = 1; round <= n; round++) {
    for (let i = round; i <= n; i += round)
      on[i] = !on[i];                   // round r toggles multiples of r
  }
  let count = 0;
  for (let i = 1; i <= n; i++)
    if (on[i]) count++;
  // odd #divisors <=> perfect square (divisors pair up d, i/d)
  return count;                         // = floor(sqrt(n))
}`,
  codeJava: `// bulb i gets toggled once per divisor of i
int bulbSwitch(int n) {
  boolean[] on = new boolean[n + 1];
  for (int round = 1; round <= n; round++) {
    for (int i = round; i <= n; i += round)
      on[i] = !on[i];                   // round r toggles multiples of r
  }
  int count = 0;
  for (int i = 1; i <= n; i++)
    if (on[i]) count++;
  // odd #divisors <=> perfect square (divisors pair up d, i/d)
  return count;                         // = floor(sqrt(n))
}`,
  inputs: [{ kind: "number", name: "n", label: "n (bulbs)", default: 12, min: 1, max: 25 }],
  entry: (a) => `bulbSwitch(${clampN(a.n as number)})`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const n = clampN(args.n as number)
    const go = fn(
      "bulbSwitch",
      (): number => {
        const on = new Array(n + 1).fill(false)
        line(2, `${n} bulbs, all off. Round r toggles every r-th bulb — so bulb i flips once per <b>divisor</b> of i.`)
        for (let round = 1; round <= n; round++) {
          const touched: number[] = []
          for (let i = round; i <= n; i += round) {
            on[i] = !on[i]
            aset(i - 1, on[i] ? 1 : 0)
            touched.push(i)
          }
          ptr("round", round - 1)
          mark("focus", touched.map((i) => i - 1))
          vars({ round })
          line(5, `Round <b>${round}</b> toggles bulbs ${touched.join(", ")} — ${round === 1 ? "all on" : `the multiples of ${round}`}.`)
        }
        ptr("round", -1)
        mark("focus", [])
        let count = 0
        const lit: number[] = []
        for (let i = 1; i <= n; i++) {
          if (on[i]) {
            count++
            lit.push(i)
          }
        }
        mark("good", lit.map((i) => i - 1))
        line(10, `Still on: ${lit.join(", ") || "none"} — exactly the <b>perfect squares</b> (only i = d² has an unpaired divisor d, giving an odd toggle count).`)
        line(11, `count = <b>${count}</b> = ⌊√${n}⌋ — the whole simulation collapses to one square root.`)
        return count
      },
      1,
    )
    return go()
  },
}
