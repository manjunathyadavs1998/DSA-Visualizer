import type { SolutionDef } from "@/engine/types"

/** Ping times must be strictly increasing positives — repair the input. */
function pingTimes(args: Record<string, unknown>): number[] {
  const raw = (args.times as number[]).map((t) => Math.max(1, Math.trunc(t)))
  const out: number[] = []
  for (const t of raw) out.push(out.length && t <= out[out.length - 1] ? out[out.length - 1] + 1 : t)
  return out.length ? out.slice(0, 10) : [1, 100, 3001, 3002, 3100]
}

export const numberOfRecentCalls: SolutionDef = {
  view: "array",
  array: (a) => pingTimes(a),
  code: `// count pings in the sliding window [t-3000, t]
const queue = [];    // pings still inside some recent window
function ping(t) {
  queue.push(t);               // enqueue the new call
  while (queue[0] < t - 3000) {
    queue.shift();             // too old — expire it forever
  }
  return queue.length;
}
// driver: ping() each strictly-increasing time
for (const t of times) results.push(ping(t));`,
  codeJava: `// count pings in the sliding window [t-3000, t]
Deque<Integer> queue = new ArrayDeque<>(); // recent pings
int ping(int t) {
  queue.addLast(t);            // enqueue the new call
  while (queue.peekFirst() < t - 3000) {
    queue.pollFirst();         // too old — expire it forever
  }
  return queue.size();
}
// driver: ping() each strictly-increasing time
for (int t : times) results.add(ping(t));`,
  inputs: [
    { kind: "numbers", name: "times", label: "ping times (increasing)", default: [1, 100, 3001, 3002, 3100], maxLen: 10 },
  ],
  entry: (a) => `RecentCounter.ping × [${pingTimes(a).join(",")}]`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const times = pingTimes(args)
    const queue: number[] = []
    const results: number[] = []
    const ping = fn(
      "ping",
      (t: number): number => {
        queue.push(t)
        heap("queue", [...queue])
        line(3, `ping(${t}): enqueue at the back. Window of interest: [<b>${t - 3000}</b>, <b>${t}</b>].`)
        while (queue[0] < t - 3000) {
          const old = queue.shift() as number
          heap("queue", [...queue])
          line(5, `Front ${old} < ${t - 3000} → <b>dequeue</b>: it left the window and, since times only increase, it will <b>never</b> be recent again.`)
        }
        vars({ t, window: `[${t - 3000}, ${t}]`, count: queue.length })
        line(7, `Everything left in the queue is within 3000 ms → <b>${queue.length}</b> recent call${queue.length === 1 ? "" : "s"}.`)
        return queue.length
      },
      2,
    )
    const go = fn(
      "RecentCounter",
      (): string => {
        line(1, `A queue is perfect here: times arrive in increasing order, so calls expire in <b>FIFO order</b> — old ones leave the front, new ones join the back.`)
        heap("queue", [])
        for (let i = 0; i < times.length; i++) {
          ptr("t", i)
          mark("focus", [i])
          line(10, `Call #${i + 1}: ping(<b>${times[i]}</b>).`)
          results.push(ping(times[i]))
          heap("output", [...results])
          mark("good", Array.from({ length: i + 1 }, (_, x) => x).filter((x) => times[x] >= times[i] - 3000))
          line(10, `ping(${times[i]}) → <b>${results[results.length - 1]}</b> (green cells = pings still in the window). Results: [${results.join(", ")}].`)
        }
        ptr("t", -1)
        mark("focus", [])
        line(10, `Each ping is enqueued once and dequeued at most once → <b>amortized O(1)</b> per call.`)
        return JSON.stringify(results)
      },
      1,
    )
    return go()
  },
}
