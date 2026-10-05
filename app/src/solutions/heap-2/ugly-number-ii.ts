import type { SolutionDef } from "@/engine/types"

export const uglyNumberII: SolutionDef = {
  code: `// the heap always surfaces the next ugly number
function nthUglyNumber(n) {
  const pq = new MinHeap([1]);
  const seen = new Set([1]);
  let ugly = 1;
  for (let i = 1; i <= n; i++) {
    ugly = pq.pop();                 // i-th smallest ugly number
    for (const f of [2, 3, 5]) {
      const next = ugly * f;
      if (!seen.has(next)) {         // dedupe: 6 = 2·3 = 3·2
        seen.add(next);
        pq.push(next);
      }
    }
  }
  return ugly;
}`,
  codeJava: `// the heap always surfaces the next ugly number
int nthUglyNumber(int n) {
  PriorityQueue<Long> pq = new PriorityQueue<>(List.of(1L));
  Set<Long> seen = new HashSet<>(List.of(1L));
  long ugly = 1;
  for (int i = 1; i <= n; i++) {
    ugly = pq.poll();                // i-th smallest ugly number
    for (long f : new long[]{2, 3, 5}) {
      long next = ugly * f;
      if (!seen.contains(next)) {    // dedupe: 6 = 2·3 = 3·2
        seen.add(next);
        pq.offer(next);
      }
    }
  }
  return (int) ugly;
}`,
  inputs: [
    { kind: "number", name: "n", label: "n", default: 10, min: 1, max: 15 },
  ],
  entry: (a) => `nthUglyNumber(${a.n})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const n = Math.max(1, Math.min(15, Math.trunc(args.n as number)))
    const go = fn(
      "nthUglyNumber",
      (): number => {
        // min-heap simulated as an array sorted ASCENDING → pq[0] is the root
        const pq: number[] = [1]
        const seen = new Set<number>([1])
        heap("pq", [...pq])
        line(2, `Seed the min-heap with <b>1</b>, the first ugly number. Every other ugly number is (a smaller ugly) × 2, 3 or 5.`)
        let ugly = 1
        const found: number[] = []
        for (let i = 1; i <= n; i++) {
          ugly = pq.shift() as number
          heap("pq", [...pq])
          found.push(ugly)
          heap("output", [...found])
          vars({ i, ugly })
          line(6, `pop() → <b>${ugly}</b> is the <b>${i}-th</b> ugly number: nothing smaller is still hiding, because all its possible producers were popped earlier.`)
          for (const f of [2, 3, 5]) {
            const next = ugly * f
            if (!seen.has(next)) {
              seen.add(next)
              let p = 0
              while (p < pq.length && pq[p] <= next) p++
              pq.splice(p, 0, next)
              heap("pq", [...pq])
              line(11, `${ugly} × ${f} = <b>${next}</b> — new, push it. Heap: [${pq.join(", ")}].`)
            } else {
              line(9, `${ugly} × ${f} = ${next} — already generated (e.g. 6 = 2·3 = 3·2), <b>skip</b> to avoid duplicates.`)
            }
          }
        }
        line(15, `Answer: the ${n}-th ugly number is <b>${ugly}</b>. Each pop spawns ≤ 3 children → heap stays O(n).`)
        return ugly
      },
      1,
    )
    narrate("Best-first generation: pop the smallest ugly number, breed it with 2, 3 and 5 — the `seen` set stops double births.")
    return go()
  },
}
