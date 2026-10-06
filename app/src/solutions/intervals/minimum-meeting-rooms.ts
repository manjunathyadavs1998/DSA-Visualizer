import type { SolutionDef } from "@/engine/types"

// events: [start, end] — find minimum rooms needed
const EVENTS: [number, number][] = [
  [0, 30], [5, 10], [15, 20],
]

export const minMeetingRooms: SolutionDef = {
  view: "array",
  array: () => EVENTS.map(e => e[0]),  // show start times
  code: `// events = [[start,end], ...] — sweep line approach
function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a,b) => a-b);
  const ends   = intervals.map(i => i[1]).sort((a,b) => a-b);
  let rooms = 0, maxRooms = 0, e = 0;
  for (let s = 0; s < starts.length; s++) {
    if (starts[s] < ends[e]) {
      rooms++;                  // new meeting starts before any ends
    } else {
      e++;                      // one meeting ended — reuse its room
    }
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`,
  codeJava: `int minMeetingRooms(int[][] intervals) {
  int n = intervals.length;
  int[] starts = new int[n], ends = new int[n];
  for (int i = 0; i < n; i++) { starts[i]=intervals[i][0]; ends[i]=intervals[i][1]; }
  Arrays.sort(starts); Arrays.sort(ends);
  int rooms = 0, maxRooms = 0, e = 0;
  for (int s = 0; s < n; s++) {
    if (starts[s] < ends[e]) rooms++;
    else { e++; }
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`,
  inputs: [],
  entry: () => `minMeetingRooms([[0,30],[5,10],[15,20]])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }) {
    const go = fn("minMeetingRooms", (): number => {
      const starts = EVENTS.map(e => e[0]).sort((a, b) => a - b)
      const ends   = EVENTS.map(e => e[1]).sort((a, b) => a - b)
      let rooms = 0, maxRooms = 0, e = 0
      heap("starts", [...starts])
      heap("ends", [...ends])
      line(1, `Two sorted arrays: starts and ends. Walk starts with pointer s; advance ends pointer e when a meeting finishes.`)
      for (let s = 0; s < starts.length; s++) {
        ptr("i", s)
        mark("focus", [s])
        vars({ s, e, "starts[s]": starts[s], "ends[e]": ends[e], rooms })
        if (starts[s] < ends[e]) {
          rooms++
          line(6, `starts[${s}]=${starts[s]} < ends[${e}]=${ends[e]} — new meeting starts before any ends. Rooms needed: <b>${rooms}</b>.`)
        } else {
          e++
          line(8, `starts[${s}]=${starts[s]} ≥ ends[${e-1}]=${ends[e-1]} — a meeting ended, reuse its room. e→${e}.`)
        }
        maxRooms = Math.max(maxRooms, rooms)
        vars({ s, e, rooms, maxRooms })
        heap("rooms", rooms)
      }
      ptr("i", -1)
      mark("focus", [])
      line(11, `Minimum meeting rooms required: <b>${maxRooms}</b>.`)
      return maxRooms
    }, 1)
    narrate("Sweep line: sort starts and ends separately. Each start that arrives before the earliest end needs a new room; otherwise reuse.")
    return go()
  },
}
