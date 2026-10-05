import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): string => {
  const s = (a.tasks as string).toUpperCase().replace(/[^A-Z]/g, "")
  return s.length ? s : "AAABBB"
}

export const taskScheduler: SolutionDef = {
  code: `// run the most-abundant task first; the cooldown forces idles
function leastInterval(tasks, n) {
  const count = new Map();           // letter → remaining runs
  for (const t of tasks)
    count.set(t, (count.get(t) || 0) + 1);
  const pq = new MaxHeap();          // counts, biggest on top
  for (const [ch, c] of count) pq.push([c, ch]);
  let time = 0;
  while (!pq.isEmpty()) {
    const ran = [];                  // tasks run in this window
    for (let slot = 0; slot <= n && !pq.isEmpty(); slot++)
      ran.push(pq.pop());            // always the biggest count left
    for (const [c, ch] of ran)
      if (c - 1 > 0) pq.push([c - 1, ch]);
    time += pq.isEmpty() ? ran.length : n + 1;
  }
  return time;
}`,
  codeJava: `// run the most-abundant task first; the cooldown forces idles
int leastInterval(char[] tasks, int n) {
  Map<Character, Integer> count = new HashMap<>();
  for (char t : tasks)
    count.merge(t, 1, Integer::sum);
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
  for (var e : count.entrySet()) pq.offer(new int[]{e.getValue(), e.getKey()});
  int time = 0;
  while (!pq.isEmpty()) {
    List<int[]> ran = new ArrayList<>(); // tasks run in this window
    for (int slot = 0; slot <= n && !pq.isEmpty(); slot++)
      ran.add(pq.poll());            // always the biggest count left
    for (int[] e : ran)
      if (e[0] - 1 > 0) pq.offer(new int[]{e[0] - 1, e[1]});
    time += pq.isEmpty() ? ran.size() : n + 1;
  }
  return time;
}`,
  inputs: [
    { kind: "string", name: "tasks", label: "tasks", default: "AAABBB", maxLen: 12 },
    { kind: "number", name: "n", label: "cooldown n", default: 2, min: 0, max: 4 },
  ],
  entry: (a) => `leastInterval("${clean(a)}", ${a.n})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const tasks = clean(args)
    const n = Math.max(0, Math.min(4, Math.trunc(args.n as number)))
    const show = (pq: [number, string][]) => pq.map(([c, ch]) => `${ch} ×${c}`)
    const go = fn(
      "leastInterval",
      (): number => {
        const count = new Map<string, number>()
        for (const t of tasks) count.set(t, (count.get(t) || 0) + 1)
        heap("counts", Object.fromEntries(count))
        line(4, `Count the tasks: {${[...count].map(([c, f]) => `${c}:${f}`).join(", ")}}. The letter with the biggest pile dictates the idles.`)
        // max-heap simulated as an array sorted by count DESCENDING
        const pq: [number, string][] = []
        for (const [ch, c] of count) {
          let p = 0
          while (p < pq.length && pq[p][0] > c) p++
          pq.splice(p, 0, [c, ch])
        }
        heap("pq", show(pq))
        line(6, `Heapify the counts: [${show(pq).join(", ")}] — a max-heap always serves the most urgent (most abundant) task.`)
        let time = 0
        const timeline: string[] = []
        while (pq.length) {
          line(8, `New cooldown window of ${n + 1} slot(s): a task that runs now cannot run again inside it, so we pick <b>up to ${n + 1} different tasks</b>, biggest piles first.`)
          const ran: [number, string][] = []
          for (let slot = 0; slot <= n && pq.length; slot++) {
            const top = pq.shift() as [number, string]
            ran.push(top)
            heap("pq", show(pq))
            timeline.push(top[1])
            heap("output", timeline.join(""))
            line(11, `Slot ${slot}: pop() → run '<b>${top[1]}</b>' (had ${top[0]} left).`)
          }
          for (const [c, ch] of ran) {
            if (c - 1 > 0) {
              let p = 0
              while (p < pq.length && pq[p][0] > c - 1) p++
              pq.splice(p, 0, [c - 1, ch])
              heap("pq", show(pq))
              line(13, `'${ch}' still has <b>${c - 1}</b> run(s) → push it back for the next window.`)
            }
          }
          const add = pq.length ? n + 1 : ran.length
          if (pq.length && ran.length < n + 1) {
            for (let idle = ran.length; idle <= n; idle++) timeline.push("·")
            heap("output", timeline.join(""))
          }
          time += add
          vars({ time, "pq size": pq.length })
          line(14, pq.length
            ? `Tasks remain → the whole window costs <b>${n + 1}</b> ticks${ran.length < n + 1 ? ` (${n + 1 - ran.length} forced <b>idle</b>)` : ""} → time = <b>${time}</b>.`
            : `Heap empty — last window only costs its ${ran.length} real task(s) → time = <b>${time}</b>.`)
        }
        line(16, `Schedule: <b>${timeline.join(" ")}</b> ('·' = idle). Minimum intervals = <b>${time}</b>.`)
        return time
      },
      1,
    )
    narrate(`Greedy invariant: inside each window of ${n + 1} slots, serving the largest remaining piles first can never create more idles than any other order.`)
    return go()
  },
}
