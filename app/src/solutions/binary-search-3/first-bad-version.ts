import type { SolutionDef } from "@/engine/types"

// The array view shows versions 1..n; we search for the first bad one.
export const firstBadVersion: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(1, a.n as number) }, (_, i) => i + 1),
  code: `// versions look like G G G G B B B — find the first B
function firstBadVersion(n) {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (isBadVersion(mid)) hi = mid;  // mid may be the first bad
    else lo = mid + 1;                // bad ones are later
  }
  return lo;                          // lo == hi == first bad
}`,
  codeJava: `// versions look like G G G G B B B — find the first B
int firstBadVersion(int n) {
  int lo = 1, hi = n;
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (isBadVersion(mid)) hi = mid;  // mid may be the first bad
    else lo = mid + 1;                // bad ones are later
  }
  return lo;                          // lo == hi == first bad
}`,
  inputs: [
    { kind: "number", name: "n", label: "n versions", default: 12, min: 1, max: 60 },
    { kind: "number", name: "bad", label: "first bad version", default: 5, min: 1, max: 60 },
  ],
  entry: (a) => `firstBadVersion(${a.n})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const n = Math.max(1, args.n as number)
    const bad = Math.min(n, Math.max(1, args.bad as number))
    const idx = (v: number) => v - 1
    const isBadVersion = (v: number) => v >= bad
    const go = fn(
      "firstBadVersion",
      (): number => {
        narrate(`Versions ${bad}..${n} are secretly bad. Once a version is bad, all later ones are too — a sorted true/false pattern, perfect for binary search.`)
        let lo = 1, hi = n
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, n })
        mark("window", Array.from({ length: n }, (_, i) => i))
        line(2, `Each isBadVersion() call is an expensive CI run — binary search needs only ⌈log₂ ${n}⌉ of them.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", idx(mid)); vars({ lo, hi, mid })
          mark("focus", [idx(mid)])
          line(4, `Check the middle version <b>${mid}</b> of [${lo}..${hi}].`)
          if (isBadVersion(mid)) {
            line(5, `isBadVersion(${mid}) = <b>true</b> → the first bad is ${mid} or earlier. Keep mid: hi = ${mid}.`)
            for (let v = mid + 1; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = mid
          } else {
            line(6, `isBadVersion(${mid}) = <b>false</b> → ${mid} and everything before it are good. lo = ${mid + 1}.`)
            for (let v = lo; v <= mid; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = mid + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [idx(lo)])
        line(8, `lo and hi converged on <b>${lo}</b> — the first bad version (the commit that broke the build).`)
        return lo
      },
      1,
    )
    return go()
  },
}
