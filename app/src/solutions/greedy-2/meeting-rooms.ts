import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,...] → pairs with s ≤ e, sorted by START time. */
const byStart = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) out.push([1, 2])
  return out.sort((p, q) => p[0] - q[0])
}

export const meetingRooms: SolutionDef = {
  view: "array",
  array: (a) => byStart(a.intervals as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// can one person attend ALL meetings?
function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);   // by START time
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1])
      return false;   // starts before the previous one ends
  }
  return true;        // no adjacent pair overlaps
}`,
  codeJava: `// can one person attend ALL meetings?
boolean canAttendMeetings(int[][] intervals) {
  Arrays.sort(intervals, (a, b) -> a[0] - b[0]);  // by START time
  for (int i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1])
      return false;   // starts before the previous one ends
  }
  return true;        // no adjacent pair overlaps
}`,
  inputs: [
    {
      kind: "numbers", name: "intervals", label: "meetings (flat [s,e] pairs: 0,30,5,10 = [0,30],[5,10])",
      default: [2, 4, 5, 8, 9, 15, 14, 20, 21, 25], maxLen: 12,
    },
  ],
  entry: (a) => `canAttendMeetings([${byStart(a.intervals as number[]).map(([s, e]) => `[${s},${e}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const iv = byStart(args.intervals as number[])
    const solve = fn(
      "canAttendMeetings",
      (): boolean => {
        line(2, `Sort by <b>start</b> time. Then a conflict, if any exists, must appear between <b>adjacent</b> meetings.`)
        narrate(`Sorted order: ${iv.map(([s, e]) => `[${s},${e}]`).join(" ")}.`)
        for (let i = 1; i < iv.length; i++) {
          ptr("i", i)
          mark("focus", [i - 1, i])
          vars({ i, prevEnd: iv[i - 1][1], curStart: iv[i][0] })
          line(4, `Does [${iv[i].join(",")}] start before [${iv[i - 1].join(",")}] ends? ${iv[i][0]} < ${iv[i - 1][1]} → <b>${iv[i][0] < iv[i - 1][1] ? "yes — clash!" : "no"}</b>.`)
          if (iv[i][0] < iv[i - 1][1]) {
            mark("bad", [i - 1, i])
            line(5, `Meetings [${iv[i - 1].join(",")}] and [${iv[i].join(",")}] overlap — one person can't attend both → <b>false</b>.`)
            return false
          }
          mark("good", Array.from({ length: i }, (_, k) => k))
          line(3, `Safe: [${iv[i - 1].join(",")}] is over by ${iv[i - 1][1]} ≤ ${iv[i][0]} — the first ${i + 1} meetings chain back-to-back.`)
        }
        ptr("i", -1)
        mark("focus", [])
        mark("good", iv.map((_, k) => k))
        line(7, `Every meeting starts after the previous one ends → <b>true</b>, the calendar is conflict-free.`)
        return true
      },
      1,
    )
    narrate(`After sorting by start, "no adjacent pair overlaps" chains into "no pair overlaps": each meeting ends before the next begins.`)
    return solve()
  },
}
