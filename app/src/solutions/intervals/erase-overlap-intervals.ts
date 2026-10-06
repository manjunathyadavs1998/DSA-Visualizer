import type { SolutionDef } from "@/engine/types"

// intervals sorted by end time (greedy: pick earliest-ending non-overlapping)
const INTERVALS: [number, number][] = [
  [1, 2], [2, 3], [3, 4], [1, 3], [2, 4],
]

export const eraseOverlapIntervals: SolutionDef = {
  view: "array",
  array: () => INTERVALS.map(i => i[1]),  // show end times
  code: `// intervals = [[start,end], ...] — greedy by end time
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let kept = 0, prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) {
      kept++;          // no overlap — keep this interval
      prevEnd = e;
    }
    // else: overlaps — discard (count removal implicitly)
  }
  return intervals.length - kept;
}`,
  codeJava: `int eraseOverlapIntervals(int[][] intervals) {
  Arrays.sort(intervals, (a,b) -> a[1]-b[1]);
  int kept = 0; int prevEnd = Integer.MIN_VALUE;
  for (int[] iv : intervals) {
    if (iv[0] >= prevEnd) {
      kept++;
      prevEnd = iv[1];
    }
  }
  return intervals.length - kept;
}`,
  inputs: [],
  entry: () => `eraseOverlapIntervals(5 intervals)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }) {
    const go = fn("eraseOverlapIntervals", (): number => {
      const intervals = [...INTERVALS].sort((a, b) => a[1] - b[1])
      let kept = 0
      let prevEnd = -Infinity
      const keptIdx: number[] = []
      line(1, `Sort by end time. Greedily keep the interval that ends earliest — it leaves the most room for future intervals.`)
      heap("prevEnd", prevEnd)
      for (let i = 0; i < intervals.length; i++) {
        const [s, e] = intervals[i]
        ptr("i", i)
        mark("focus", [i])
        vars({ i, start: s, end: e, prevEnd: prevEnd === -Infinity ? "−∞" : prevEnd, kept })
        if (s >= prevEnd) {
          kept++
          prevEnd = e
          keptIdx.push(i)
          mark("good", [...keptIdx])
          heap("prevEnd", prevEnd)
          vars({ i, start: s, end: e, prevEnd, kept })
          line(5, `[${s},${e}] starts at ${s} ≥ prevEnd=${prevEnd === e ? "−∞" : prevEnd} — <b>keep</b>. prevEnd → ${e}.`)
        } else {
          mark("bad", [i])
          line(8, `[${s},${e}] starts at ${s} < prevEnd=${prevEnd} — <b>overlaps</b>, remove it.`)
        }
      }
      ptr("i", -1)
      const removed = intervals.length - kept
      line(10, `Kept ${kept} intervals. Minimum removals: <b>${removed}</b>.`)
      return removed
    }, 1)
    narrate("Greedy: sort by end time, always keep the interval ending earliest. Any overlap is resolved by discarding the later-ending one.")
    return go()
  },
}
