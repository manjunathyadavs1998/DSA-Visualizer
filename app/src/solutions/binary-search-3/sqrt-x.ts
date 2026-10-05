import type { SolutionDef } from "@/engine/types"

// The array view shows the CANDIDATE ANSWERS 1..x — we binary search values, not indexes.
export const sqrtX: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(1, a.x as number) }, (_, i) => i + 1),
  code: `// no array given — binary search the ANSWER space 1..x
function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (mid * mid <= x) {      // mid fits under x
      ans = mid;               // best so far
      lo = mid + 1;            // try bigger
    } else {
      hi = mid - 1;            // overshoots, go smaller
    }
  }
  return ans;                  // floor of sqrt(x)
}`,
  codeJava: `// no array given — binary search the ANSWER space 1..x
int mySqrt(int x) {
  if (x < 2) return x;
  long lo = 1, hi = x, ans = 1;
  while (lo <= hi) {
    long mid = (lo + hi) / 2;
    if (mid * mid <= x) {      // mid fits under x
      ans = mid;               // best so far
      lo = mid + 1;            // try bigger
    } else {
      hi = mid - 1;            // overshoots, go smaller
    }
  }
  return (int) ans;            // floor of sqrt(x)
}`,
  inputs: [{ kind: "number", name: "x", label: "x", default: 26, min: 0, max: 60 }],
  entry: (a) => `mySqrt(${a.x})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const x = Math.max(0, args.x as number)
    const idx = (v: number) => v - 1 // candidate value → cell index
    const go = fn(
      "mySqrt",
      (): number => {
        if (x < 2) {
          line(2, `x = ${x} is 0 or 1 — its square root is itself. Return <b>${x}</b>.`)
          return x
        }
        narrate(`There is no input array — the cells below are the <b>candidate answers 1..${x}</b>, and we binary search over them.`)
        let lo = 1, hi = x, ans = 1
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, ans })
        mark("window", Array.from({ length: x }, (_, i) => i))
        line(3, `Any answer lies in [1..${x}]. Each guess costs one multiplication — no need to try all ${x} values.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", idx(mid)); vars({ lo, hi, mid, "mid²": mid * mid, ans })
          mark("focus", [idx(mid)])
          line(5, `Guess mid = <b>${mid}</b> → ${mid}² = <b>${mid * mid}</b> vs x = ${x}.`)
          if (mid * mid <= x) {
            ans = mid
            line(7, `${mid * mid} ≤ ${x} → ${mid} fits. Record ans = <b>${mid}</b> and discard every smaller candidate — they can't beat it.`)
            for (let v = lo; v <= mid; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = mid + 1
          } else {
            line(10, `${mid * mid} > ${x} → ${mid} overshoots, and so does everything above it. Discard the upper half.`)
            for (let v = mid; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = mid - 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo <= x ? idx(lo) : -1); ptr("hi", hi >= 1 ? idx(hi) : -1)
          vars({ lo, hi, ans })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)) : [])
        }
        ptr("mid", -1)
        mark("good", [idx(ans)])
        line(13, `lo crossed hi — the biggest value whose square stays ≤ ${x} is <b>${ans}</b> (${ans}² = ${ans * ans}). That's ⌊√${x}⌋.`)
        return ans
      },
      1,
    )
    return go()
  },
}
