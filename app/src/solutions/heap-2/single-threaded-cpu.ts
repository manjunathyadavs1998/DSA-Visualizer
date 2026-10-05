import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): [number, number][] => {
  const e = (a.enqueue as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const p = (a.processing as number[]).map((x) => Math.max(1, Math.trunc(x)))
  const n = Math.min(e.length, p.length)
  const tasks: [number, number][] = []
  for (let i = 0; i < n; i++) tasks.push([e[i], p[i]])
  if (!tasks.length) tasks.push([1, 2], [2, 4], [3, 2], [4, 1])
  return tasks
}

export const singleThreadedCPU: SolutionDef = {
  code: `// when idle, jump the clock; otherwise run the shortest job
function getOrder(tasks) {
  const idx = tasks.map((t, i) => [t[0], t[1], i]);
  idx.sort((a, b) => a[0] - b[0]);       // by enqueue time
  const pq = new MinHeap();              // (procTime, index)
  const ans = [];
  let time = 0, next = 0;
  while (ans.length < tasks.length) {
    while (next < idx.length && idx[next][0] <= time)
      pq.push([idx[next][1], idx[next++][2]]);
    if (pq.isEmpty()) {                  // CPU idle, nothing arrived
      time = idx[next][0];               // fast-forward the clock
      continue;
    }
    const [p, i] = pq.pop();             // shortest job, tie → low index
    time += p;
    ans.push(i);
  }
  return ans;
}`,
  codeJava: `// when idle, jump the clock; otherwise run the shortest job
int[] getOrder(int[][] tasks) {
  int[][] idx = new int[tasks.length][3];   // (enqueue, proc, i)
  Arrays.sort(idx, (a, b) -> a[0] - b[0]);  // by enqueue time
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
  int[] ans = new int[tasks.length];
  long time = 0; int next = 0, done = 0;
  while (done < tasks.length) {
    while (next < idx.length && idx[next][0] <= time)
      pq.offer(new int[]{idx[next][1], idx[next++][2]});
    if (pq.isEmpty()) {                  // CPU idle, nothing arrived
      time = idx[next][0];               // fast-forward the clock
      continue;
    }
    int[] t = pq.poll();                 // shortest job, tie → low index
    time += t[0];
    ans[done++] = t[1];
  }
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "enqueue", label: "enqueue times", default: [1, 2, 3, 4], maxLen: 8 },
    { kind: "numbers", name: "processing", label: "processing times", default: [2, 4, 2, 1], maxLen: 8 },
  ],
  entry: (a) => `getOrder([${build(a).map(([e, p]) => `[${e},${p}]`).join(",")}])`,
  run({ fn, line, vars, heap, narrate }, args) {
    const tasks = build(args)
    const show = (pq: [number, number][]) => pq.map(([p, i]) => `task ${i} (${p} ticks)`)
    const go = fn(
      "getOrder",
      (): string => {
        const idx: [number, number, number][] = tasks.map((t, i) => [t[0], t[1], i])
        idx.sort((a, b) => a[0] - b[0] || a[2] - b[2])
        line(3, `Sort tasks by arrival: ${idx.map(([e, , i]) => `#${i}@t${e}`).join(", ")} — we feed them to the heap as the clock passes their enqueue times.`)
        // min-heap simulated as an array sorted by (procTime, index) ASCENDING
        const pq: [number, number][] = []
        heap("pq", [])
        const ans: number[] = []
        let time = 0
        let next = 0
        while (ans.length < tasks.length) {
          while (next < idx.length && idx[next][0] <= time) {
            const item: [number, number] = [idx[next][1], idx[next][2]]
            let p = 0
            while (p < pq.length && (pq[p][0] < item[0] || (pq[p][0] === item[0] && pq[p][1] < item[1]))) p++
            pq.splice(p, 0, item)
            heap("pq", show(pq))
            line(9, `t=${time}: task <b>#${item[1]}</b> (needs ${item[0]} ticks) has arrived → push into the availability heap.`)
            next++
          }
          if (!pq.length) {
            line(10, `t=${time}: heap empty — the CPU would sit idle.`)
            time = idx[next][0]
            vars({ time })
            line(11, `Fast-forward the clock to the next arrival: time = <b>${time}</b>.`)
            continue
          }
          const [p, i] = pq.shift() as [number, number]
          heap("pq", show(pq))
          line(14, `t=${time}: run the <b>shortest available</b> job → task <b>#${i}</b> (${p} ticks)${pq.length ? ` beats [${show(pq).join(", ")}]` : ""}.`)
          time += p
          ans.push(i)
          heap("output", [...ans])
          vars({ time, running: `#${i}`, "order so far": ans.join("→") })
          line(16, `It runs to completion (non-preemptive) → finishes at t=<b>${time}</b>; order so far: ${ans.join(" → ")}.`)
        }
        line(18, `All tasks done at t=${time}. Execution order: <b>[${ans.join(", ")}]</b>.`)
        return `[${ans.join(", ")}]`
      },
      1,
    )
    narrate("Two queues in play: time releases tasks into the heap, and the heap always serves the shortest processing time (ties → lower index).")
    return go()
  },
}
