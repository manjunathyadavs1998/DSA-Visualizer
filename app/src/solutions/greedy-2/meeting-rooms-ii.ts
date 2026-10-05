import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,...] → pairs with s ≤ e, sorted by START. */
const byStart = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) out.push([0, 30], [5, 10], [15, 20])
  return out.sort((p, q) => p[0] - q[0])
}

export const meetingRoomsII: SolutionDef = {
  view: "array",
  array: (a) => byStart(a.intervals as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// minimum rooms = peak number of simultaneous meetings
function minMeetingRooms(intervals) {
  const starts = intervals.map(iv => iv[0]).sort((a, b) => a - b);
  const ends = intervals.map(iv => iv[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, j = 0;
  for (let i = 0; i < starts.length; i++) {
    while (ends[j] <= starts[i]) {  // a meeting ended first
      rooms--; j++;                 // its room frees up
    }
    rooms++;                        // meeting i takes a room
    best = Math.max(best, rooms);
  }
  return best;
}`,
  codeJava: `// minimum rooms = peak number of simultaneous meetings
int minMeetingRooms(int[][] intervals) {
  int[] starts = sortedStarts(intervals);
  int[] ends = sortedEnds(intervals);
  int rooms = 0, best = 0, j = 0;
  for (int i = 0; i < starts.length; i++) {
    while (ends[j] <= starts[i]) {  // a meeting ended first
      rooms--; j++;                 // its room frees up
    }
    rooms++;                        // meeting i takes a room
    best = Math.max(best, rooms);
  }
  return best;
}`,
  inputs: [
    {
      kind: "numbers", name: "intervals", label: "meetings (flat [s,e] pairs: 0,30,5,10 = [0,30],[5,10])",
      default: [1, 10, 2, 7, 3, 19, 8, 12, 10, 20, 11, 30], maxLen: 12,
    },
  ],
  entry: (a) => `minMeetingRooms([${byStart(a.intervals as number[]).map(([s, e]) => `[${s},${e}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const iv = byStart(args.intervals as number[])
    const starts = iv.map((p) => p[0]).sort((a, b) => a - b)
    const ends = iv.map((p) => p[1]).sort((a, b) => a - b)
    const solve = fn(
      "minMeetingRooms",
      (): number => {
        line(2, `Forget pairings — only the <b>timeline</b> matters. Sorted starts: [${starts.join(",")}].`)
        line(3, `Sorted ends: [${ends.join(",")}]. A start before the next unmatched end = one more simultaneous meeting.`)
        let rooms = 0
        let best = 0
        let j = 0
        vars({ rooms, best, j })
        for (let i = 0; i < starts.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          while (ends[j] <= starts[i]) {
            line(6, `Earliest unmatched end ${ends[j]} ≤ this start ${starts[i]} — that meeting is over before this one begins.`)
            rooms--
            j++
            vars({ rooms, best, j })
            line(7, `Free its room → rooms in use = <b>${rooms}</b>.`)
          }
          rooms++
          best = Math.max(best, rooms)
          vars({ rooms, best, j })
          heap("inUse", { rooms, peak: best })
          mark("window", Array.from({ length: i + 1 }, (_, k) => k).slice(-rooms))
          line(9, `Meeting starting at ${starts[i]} takes a room → <b>${rooms}</b> in use${best === rooms ? " — a new peak!" : ""}.`)
          line(10, `best = <b>${best}</b>.`)
        }
        ptr("i", -1)
        mark("focus", [])
        line(12, `Peak overlap was <b>${best}</b> — that many rooms are necessary AND sufficient.`)
        return best
      },
      1,
    )
    narrate(`Two sorted event streams, two pointers: identical to Minimum Platforms. The answer is the high-water mark of (starts seen − ends seen).`)
    return solve()
  },
}
