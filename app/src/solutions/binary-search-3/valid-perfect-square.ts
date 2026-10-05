import type { SolutionDef } from "@/engine/types"

// The array view shows the CANDIDATE ROOTS 1..num — binary search values, not indexes.
export const validPerfectSquare: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(1, a.num as number) }, (_, i) => i + 1),
  code: `// is num == k*k for some integer k? Search k in 1..num
function isPerfectSquare(num) {
  let lo = 1, hi = num;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const sq = mid * mid;
    if (sq === num) return true;   // found the exact root
    if (sq < num) lo = mid + 1;    // root is bigger
    else hi = mid - 1;             // root is smaller
  }
  return false;                    // no integer root exists
}`,
  codeJava: `// is num == k*k for some integer k? Search k in 1..num
boolean isPerfectSquare(int num) {
  long lo = 1, hi = num;
  while (lo <= hi) {
    long mid = (lo + hi) / 2;
    long sq = mid * mid;
    if (sq == num) return true;    // found the exact root
    if (sq < num) lo = mid + 1;    // root is bigger
    else hi = mid - 1;             // root is smaller
  }
  return false;                    // no integer root exists
}`,
  inputs: [{ kind: "number", name: "num", label: "num", default: 36, min: 1, max: 60 }],
  entry: (a) => `isPerfectSquare(${a.num})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const num = Math.max(1, args.num as number)
    const idx = (v: number) => v - 1
    const go = fn(
      "isPerfectSquare",
      (): boolean => {
        narrate(`The cells are the <b>candidate roots 1..${num}</b> — the answer space, not an input array.`)
        let lo = 1, hi = num
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, num })
        mark("window", Array.from({ length: num }, (_, i) => i))
        line(2, `If an integer root exists it lies in [1..${num}]. Squaring is monotonic, so we can binary search it.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          const sq = mid * mid
          ptr("mid", idx(mid)); vars({ lo, hi, mid, sq })
          mark("focus", [idx(mid)])
          line(5, `Guess mid = <b>${mid}</b> → ${mid}² = <b>${sq}</b> vs ${num}.`)
          if (sq === num) {
            mark("focus", []); mark("good", [idx(mid)])
            line(6, `${sq} = ${num} exactly — <b>${num} is a perfect square</b> (${mid}²). Return true.`)
            return true
          }
          if (sq < num) {
            line(7, `${sq} < ${num} → the root must be bigger. Discard ${lo}..${mid}.`)
            for (let v = lo; v <= mid; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = mid + 1
          } else {
            line(8, `${sq} > ${num} → the root must be smaller. Discard ${mid}..${hi}.`)
            for (let v = mid; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = mid - 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo <= num ? idx(lo) : -1); ptr("hi", hi >= 1 ? idx(hi) : -1)
          vars({ lo, hi })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)) : [])
        }
        ptr("mid", -1)
        line(10, `Every candidate is ruled out — ${num} sits strictly between two squares. Return <b>false</b>.`)
        return false
      },
      1,
    )
    return go()
  },
}
