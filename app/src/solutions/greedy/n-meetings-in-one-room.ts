import type { SolutionDef } from "@/engine/types"

/** Pair starts/ends and sort by END time — shared by array() and run(). */
const meetings = (starts: number[], ends: number[]): [number, number][] =>
  starts
    .map((s, i) => [s, ends[i] ?? s + 1] as [number, number])
    .sort((a, b) => a[1] - b[1])

export const nMeetingsInOneRoom: SolutionDef = {
  view: "array",
  array: (a) => meetings(a.starts as number[], a.ends as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// starts[i]–ends[i] is one meeting (cells sorted by end)
function maxMeetings(starts, ends) {
  const m = starts.map((s, i) => [s, ends[i]]);
  m.sort((a, b) => a[1] - b[1]);   // by END time
  let lastEnd = -1, count = 0;
  for (const [s, e] of m) {
    if (s > lastEnd) {             // fits after last picked
      count++;                     // take this meeting
      lastEnd = e;                 // room is busy until e
    }
  }
  return count;
}`,
  codeJava: `// starts[i]–ends[i] is one meeting (cells sorted by end)
int maxMeetings(int[] starts, int[] ends) {
  int[][] m = pairUp(starts, ends);       // [start, end]
  Arrays.sort(m, (a, b) -> a[1] - b[1]);  // by END time
  int lastEnd = -1, count = 0;
  for (int[] me : m) {
    if (me[0] > lastEnd) {         // fits after last picked
      count++;                     // take this meeting
      lastEnd = me[1];             // room is busy until e
    }
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "starts", label: "start times", default: [1, 3, 0, 5, 8, 5], maxLen: 10 },
    { kind: "numbers", name: "ends", label: "end times", default: [2, 4, 6, 7, 9, 9], maxLen: 10 },
  ],
  entry: () => `maxMeetings(starts, ends)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const starts = args.starts as number[]
    const ends = args.ends as number[]
    const m = meetings(starts, ends)
    const solve = fn(
      "maxMeetings",
      (): number => {
        line(3, `Sort by <b>end</b> time, not start: the meeting that finishes earliest leaves the most room for everything after it.`)
        let lastEnd = -1
        let count = 0
        vars({ lastEnd, count })
        line(4, `Nothing picked yet — the room is free from the beginning (lastEnd = -1).`)
        const good: number[] = []
        const bad: number[] = []
        for (let k = 0; k < m.length; k++) {
          const [s, e] = m[k]
          ptr("k", k)
          mark("focus", [k])
          line(6, `Meeting <b>${s}–${e}</b>: does it start after the last picked one ends? ${s} > ${lastEnd} → ${s > lastEnd ? "<b>yes, it fits</b>" : "<b>no, it overlaps</b>"}.`)
          if (s > lastEnd) {
            count++
            good.push(k)
            mark("good", good)
            line(7, `Take it — <b>count = ${count}</b>.`)
            lastEnd = e
            vars({ lastEnd, count })
            line(8, `The room is now busy until <b>${e}</b> — the earliest possible, since we sorted by end.`)
          } else {
            bad.push(k)
            mark("bad", bad)
            narrate(`Skip ${s}–${e}: it starts at ${s}, but the room is busy until ${lastEnd}.`)
          }
        }
        mark("focus", [])
        ptr("k", -1)
        line(11, `Done — <b>${count}</b> meetings fit in the one room.`)
        return count
      },
      1,
    )
    narrate(`Greedy: always keep the meeting that <b>ends first</b> — it can never block more future meetings than any alternative.`)
    return solve()
  },
}
