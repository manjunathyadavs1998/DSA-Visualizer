import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): [number, number][] => {
  const s = (a.starts as number[]).map(Math.trunc)
  const e = (a.ends as number[]).map(Math.trunc)
  const n = Math.min(s.length, e.length)
  const iv: [number, number][] = []
  for (let i = 0; i < n; i++) iv.push([s[i], Math.max(e[i], s[i] + 1)])
  if (!iv.length) iv.push([0, 30], [5, 10], [15, 20])
  iv.sort((x, y) => x[0] - y[0])
  return iv
}

export const meetingRoomsII: SolutionDef = {
  code: `// one heap entry per occupied room, keyed by its end time
function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);  // by start time
  const pq = new MinHeap();               // end times of busy rooms
  for (const [start, end] of intervals) {
    if (!pq.isEmpty() && pq.top() <= start)
      pq.pop();                           // earliest room frees — reuse it
    pq.push(end);                         // occupy a room until \`end\`
  }
  return pq.size();                       // rooms open simultaneously
}`,
  codeJava: `// one heap entry per occupied room, keyed by its end time
int minMeetingRooms(int[][] intervals) {
  Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  for (int[] iv : intervals) {
    if (!pq.isEmpty() && pq.peek() <= iv[0])
      pq.poll();                          // earliest room frees — reuse it
    pq.offer(iv[1]);                      // occupy a room until end
  }
  return pq.size();                       // rooms open simultaneously
}`,
  inputs: [
    { kind: "numbers", name: "starts", label: "start times", default: [0, 5, 15, 2, 9], maxLen: 8 },
    { kind: "numbers", name: "ends", label: "end times", default: [30, 10, 20, 7, 14], maxLen: 8 },
  ],
  entry: (a) => `minMeetingRooms([${build(a).map(([s, e]) => `[${s},${e}]`).join(",")}])`,
  run({ fn, line, vars, heap, narrate }, args) {
    const intervals = build(args)
    const go = fn(
      "minMeetingRooms",
      (): number => {
        line(2, `Sort meetings by start: ${intervals.map(([s, e]) => `[${s},${e}]`).join(" ")}. We now meet every meeting in the order it begins.`)
        // min-heap simulated as an array sorted ASCENDING → pq[0] = room that frees first
        const pq: number[] = []
        heap("pq", [])
        line(3, `Empty min-heap of <b>end times</b> — one entry per room currently in use; the root is the room that frees up first.`)
        let rooms = 0
        for (const [start, end] of intervals) {
          line(4, `Meeting [${start}, ${end}) arrives.`)
          if (pq.length && pq[0] <= start) {
            const freed = pq.shift() as number
            heap("pq", [...pq])
            line(6, `The earliest-ending room frees at <b>${freed}</b> ≤ start ${start} → <b>reuse that room</b> (pop it; checking only the root is enough — every other room ends later).`)
          } else if (pq.length) {
            line(5, `Root ends at ${pq[0]} > ${start} — every room is still busy → this meeting needs a <b>new room</b>.`)
          }
          let p = 0
          while (p < pq.length && pq[p] <= end) p++
          pq.splice(p, 0, end)
          heap("pq", [...pq])
          rooms = Math.max(rooms, pq.length)
          vars({ "rooms in use": pq.length, "max rooms": rooms })
          line(7, `push(end = <b>${end}</b>) → ${pq.length} room(s) in use: [${pq.join(", ")}].`)
        }
        heap("output", [`${pq.length} rooms`])
        line(9, `Every meeting placed. The heap holds <b>${pq.length}</b> end times — that is the peak number of simultaneous meetings, so <b>${pq.length} rooms</b> suffice and fewer cannot.`)
        return pq.length
      },
      1,
    )
    narrate("Heap size = rooms in use right now. A meeting steals the earliest-freeing room if possible; otherwise the heap (and the answer) grows.")
    return go()
  },
}
