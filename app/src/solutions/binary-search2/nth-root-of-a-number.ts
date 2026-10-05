import type { SolutionDef } from "@/engine/types"

export const nthRoot: SolutionDef = {
  view: "array",
  array: () => Array.from({ length: 12 }, (_, i) => i + 1),
  code: `// find m with m^n === x, else -1 (binary search the ANSWER)
function nthRoot(n, x) {
  let lo = 1, hi = 12;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const p = Math.pow(mid, n);
    if (p === x) return mid;
    if (p < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  codeJava: `// find m with m^n == x, else -1 (binary search the ANSWER)
int nthRoot(int n, int x) {
  int lo = 1, hi = 12;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    long p = (long) Math.pow(mid, n);
    if (p == x) return mid;
    if (p < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  inputs: [
    { kind: "number", name: "n", label: "n (root degree)", default: 3, min: 2, max: 6 },
    { kind: "number", name: "x", label: "x", default: 64, min: 1, max: 144 },
  ],
  entry: (a) => `nthRoot(${a.n}, ${a.x})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const n = args.n as number
    const x = args.x as number
    const pow = (m: number, e: number): number => {
      let r = 1
      for (let i = 0; i < e; i++) r *= m
      return r
    }
    const go = fn(
      "nthRoot",
      (): number => {
        let lo = 1, hi = 12
        const win = () => Array.from({ length: hi - lo + 1 }, (_, i) => lo - 1 + i)
        ptr("lo", lo - 1); ptr("hi", hi - 1); vars({ lo, hi, n, x })
        mark("window", win())
        line(2, `There's no array here — the cells are <b>candidate answers</b> 1..12. Binary search the answer itself.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          const p = pow(mid, n)
          ptr("mid", mid - 1); mark("focus", [mid - 1])
          vars({ lo, hi, mid, "mid^n": `${mid}^${n} = ${p}` })
          line(4, `Guess the middle candidate: mid = <b>${mid}</b>.`)
          line(5, `Raise it: ${mid}^${n} = <b>${p}</b>. Compare against x = ${x}.`)
          if (p === x) {
            mark("good", [mid - 1]); mark("focus", [])
            line(6, `${p} <b>equals ${x}</b> — the ${n}th root of ${x} is exactly ${mid}!`)
            return mid
          }
          if (p < x) {
            line(7, `${p} < ${x} → ${mid} is <b>too small</b>. Every candidate ≤ ${mid} is too small too — discard them.`)
            mark("done", Array.from({ length: mid - lo + 1 }, (_, i) => lo - 1 + i))
            lo = mid + 1
          } else {
            line(8, `${p} > ${x} → ${mid} is <b>too big</b>. Every candidate ≥ ${mid} overshoots too — discard them.`)
            mark("done", Array.from({ length: hi - mid + 1 }, (_, i) => mid - 1 + i))
            hi = mid - 1
          }
          ptr("lo", lo - 1); ptr("hi", hi - 1); vars({ lo, hi })
          if (lo <= hi) mark("window", win())
        }
        mark("focus", []); mark("window", [])
        line(10, `No candidate's ${n}th power hits ${x} — ${x} has <b>no integer ${n}th root</b>. Return -1.`)
        return -1
      },
      1,
    )
    return go()
  },
}
