import type { SolutionDef } from "@/engine/types"

export const lastStoneWeight: SolutionDef = {
  view: "array",
  array: (a) => (a.stones as number[]).filter((s) => Math.trunc(s) > 0).map(Math.trunc),
  code: `// smash the two heaviest until at most one stone remains
function lastStoneWeight(stones) {
  const pq = new MaxHeap(stones);   // heapify every stone
  while (pq.size() > 1) {
    const y = pq.pop();             // heaviest
    const x = pq.pop();             // second heaviest
    if (y > x)
      pq.push(y - x);               // the remnant rejoins the fight
  }
  return pq.size() ? pq.top() : 0;
}`,
  codeJava: `// smash the two heaviest until at most one stone remains
int lastStoneWeight(int[] stones) {
  PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
  while (pq.size() > 1) {
    int y = pq.poll();              // heaviest
    int x = pq.poll();              // second heaviest
    if (y > x)
      pq.offer(y - x);              // the remnant rejoins the fight
  }
  return pq.size() > 0 ? pq.peek() : 0;
}`,
  inputs: [
    { kind: "numbers", name: "stones", label: "stones", default: [2, 7, 4, 1, 8, 1], maxLen: 10 },
  ],
  entry: (a) => `lastStoneWeight([${(a.stones as number[]).join(",")}])`,
  run({ fn, line, mark, vars, heap, narrate }, args) {
    const stones = (args.stones as number[]).filter((s) => Math.trunc(s) > 0).map(Math.trunc)
    if (!stones.length) stones.push(1)
    const go = fn(
      "lastStoneWeight",
      (): number => {
        // max-heap simulated as an array sorted DESCENDING → pq[0] is the root
        const pq = [...stones].sort((a, b) => b - a)
        heap("pq", pq)
        line(2, `Heapify all ${stones.length} stones into a <b>max-heap</b> (shown largest-first): [${pq.join(", ")}]. The two heaviest are always at the front.`)
        let round = 0
        while (pq.length > 1) {
          round++
          line(3, `Round ${round}: ${pq.length} stones left — smash the top two.`)
          const y = pq.shift() as number
          heap("pq", pq)
          const yi = stones.indexOf(y)
          if (yi >= 0) mark("focus", [yi])
          line(4, `pop() → heaviest y = <b>${y}</b>.`)
          const x = pq.shift() as number
          heap("pq", pq)
          const xi = stones.findIndex((s, i) => s === x && i !== yi)
          if (xi >= 0) mark("focus", [yi, xi].filter((v) => v >= 0))
          line(5, `pop() → second heaviest x = <b>${x}</b>.`)
          if (y > x) {
            const r = y - x
            let p = 0
            while (p < pq.length && pq[p] > r) p++
            pq.splice(p, 0, r)
            heap("pq", pq)
            vars({ y, x, remnant: r })
            line(7, `${y} ≠ ${x} → remnant <b>${y} − ${x} = ${r}</b> sifts back into the heap: [${pq.join(", ")}].`)
          } else {
            vars({ y, x, remnant: 0 })
            line(6, `${y} = ${x} → <b>both stones vaporize</b>; nothing goes back.`)
          }
          mark("focus", [])
        }
        const ans = pq.length ? pq[0] : 0
        heap("output", [ans])
        line(9, pq.length ? `One stone survives: <b>${ans}</b>.` : `Every stone was destroyed → return <b>0</b>.`)
        return ans
      },
      1,
    )
    narrate("The order of smashes is forced: always the two heaviest. A max-heap serves them in O(log n) each.")
    return go()
  },
}
