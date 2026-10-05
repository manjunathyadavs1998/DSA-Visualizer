import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,...] → pairs with s ≤ e, sorted by END time. */
const byEnd = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) out.push([1, 2])
  return out.sort((p, q) => p[1] - q[1])
}

export const nonOverlappingIntervals: SolutionDef = {
  view: "array",
  array: (a) => byEnd(a.intervals as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// min removals = n - (max intervals we can KEEP)
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);   // by END time
  let lastEnd = -Infinity, kept = 0;
  for (const [s, e] of intervals) {
    if (s >= lastEnd) {      // starts after last kept one ends
      kept++;                // keep it
      lastEnd = e;           // earliest possible new deadline
    }
  }
  return intervals.length - kept;
}`,
  codeJava: `// min removals = n - (max intervals we can KEEP)
int eraseOverlapIntervals(int[][] intervals) {
  Arrays.sort(intervals, (a, b) -> a[1] - b[1]);  // by END time
  int lastEnd = Integer.MIN_VALUE, kept = 0;
  for (int[] iv : intervals) {
    if (iv[0] >= lastEnd) {  // starts after last kept one ends
      kept++;                // keep it
      lastEnd = iv[1];       // earliest possible new deadline
    }
  }
  return intervals.length - kept;
}`,
  inputs: [
    {
      kind: "numbers", name: "intervals", label: "intervals (flat [s,e] pairs: 1,3,2,5 = [1,3],[2,5])",
      default: [1, 3, 2, 5, 3, 6, 5, 7, 6, 8, 8, 9], maxLen: 12,
    },
  ],
  entry: (a) => `eraseOverlapIntervals([${byEnd(a.intervals as number[]).map(([s, e]) => `[${s},${e}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const iv = byEnd(args.intervals as number[])
    const solve = fn(
      "eraseOverlapIntervals",
      (): number => {
        line(2, `Sort by <b>end</b> time. Keeping the interval that ends earliest leaves maximum room — so removals are minimized.`)
        let lastEnd = -Infinity
        let kept = 0
        vars({ lastEnd: "-∞", kept })
        const good: number[] = []
        const bad: number[] = []
        heap("kept", [])
        for (let k = 0; k < iv.length; k++) {
          const [s, e] = iv[k]
          ptr("k", k)
          mark("focus", [k])
          line(5, `[${s},${e}]: starts at ${s} — last kept interval ends at ${lastEnd === -Infinity ? "-∞" : lastEnd}. ${s >= lastEnd ? "<b>No overlap</b>." : "<b>Overlap!</b>"}`)
          if (s >= lastEnd) {
            kept++
            good.push(k)
            mark("good", good)
            heap("kept", good.map((g) => `[${iv[g].join(",")}]`))
            line(6, `Keep it → kept = <b>${kept}</b>.`)
            lastEnd = e
            vars({ lastEnd, kept })
            line(7, `New deadline: lastEnd = <b>${e}</b> — the smallest it can be, thanks to the end-time sort.`)
          } else {
            bad.push(k)
            mark("bad", bad)
            narrate(`It collides with the kept set — this one must be <b>removed</b> (it ends no earlier than the one we kept, so it can only hurt).`)
          }
        }
        ptr("k", -1)
        mark("focus", [])
        line(10, `Kept <b>${kept}</b> of ${iv.length} → remove <b>${iv.length - kept}</b>.`)
        return iv.length - kept
      },
      1,
    )
    narrate(`Classic exchange argument: among overlapping intervals, discarding the one with the <b>latest end</b> is never worse.`)
    return solve()
  },
}
