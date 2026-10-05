import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): number[] => {
  const p = (a.piles as number[]).map(Math.trunc).filter((x) => x > 0)
  if (!p.length) p.push(5, 4, 9)
  return p
}

export const removeStonesToMinimizeTheTotal: SolutionDef = {
  view: "array",
  array: (a) => clean(a),
  code: `// k times: halve the biggest pile — nothing else is ever optimal
function minStoneSum(piles, k) {
  const pq = new MaxHeap(piles.map((v, i) => [v, i]));
  let total = piles.reduce((s, v) => s + v, 0);
  for (let op = 1; op <= k; op++) {
    const [v, i] = pq.pop();         // current biggest pile
    const removed = Math.floor(v / 2);
    total -= removed;                // shave the max
    pq.push([v - removed, i]);       // the halved pile re-enters
  }
  return total;
}`,
  codeJava: `// k times: halve the biggest pile — nothing else is ever optimal
int minStoneSum(int[] piles, int k) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> y[0] - x[0]);
  int total = Arrays.stream(piles).sum();
  for (int op = 1; op <= k; op++) {
    int[] top = pq.poll();           // current biggest pile
    int removed = top[0] / 2;
    total -= removed;                // shave the max
    pq.offer(new int[]{top[0] - removed, top[1]});
  }
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "piles", label: "piles", default: [5, 4, 9], maxLen: 8 },
    { kind: "number", name: "k", label: "k operations", default: 2, min: 1, max: 10 },
  ],
  entry: (a) => `minStoneSum([${clean(a).join(",")}], ${a.k})`,
  run({ fn, line, mark, aset, vars, heap, narrate }, args) {
    const piles = clean(args)
    const k = Math.max(1, Math.min(10, Math.trunc(args.k as number)))
    const show = (pq: [number, number][]) => pq.map(([v, i]) => `${v} (pile ${i})`)
    const go = fn(
      "minStoneSum",
      (): number => {
        // max-heap simulated as an array sorted by value DESCENDING
        const pq: [number, number][] = []
        for (let i = 0; i < piles.length; i++) {
          let p = 0
          while (p < pq.length && pq[p][0] >= piles[i]) p++
          pq.splice(p, 0, [piles[i], i])
        }
        heap("pq", show(pq))
        let total = piles.reduce((s, v) => s + v, 0)
        line(3, `Heapify the piles (with their indices): [${show(pq).join(", ")}]. Starting total = <b>${total}</b>. Each operation removes floor(max/2) stones — biggest pile = biggest removal.`)
        for (let op = 1; op <= k; op++) {
          const [v, i] = pq.shift() as [number, number]
          heap("pq", show(pq))
          mark("focus", [i])
          line(5, `Op ${op}/${k}: pop() → the biggest pile, <b>${v}</b> stones (pile ${i}).`)
          const removed = Math.floor(v / 2)
          line(6, `Remove floor(${v}/2) = <b>${removed}</b> stones.`)
          total -= removed
          heap("output", [`after op ${op}: total ${total}`])
          line(7, `total = ${total + removed} − ${removed} = <b>${total}</b>.`)
          const keep = v - removed
          let p = 0
          while (p < pq.length && pq[p][0] >= keep) p++
          pq.splice(p, 0, [keep, i])
          aset(i, keep)
          heap("pq", show(pq))
          vars({ op, total, "pile halved": `#${i}: ${v} → ${keep}` })
          line(8, `Pile ${i} shrinks to <b>${keep}</b> and sifts back in: [${show(pq).join(", ")}]. It may be the max again next round.`)
          mark("focus", [])
        }
        mark("good", piles.map((_, i) => i))
        line(10, `After ${k} halvings the minimum possible total is <b>${total}</b>. Greedy works because halving the max always removes at least as much as halving anything else.`)
        return total
      },
      1,
    )
    narrate("A classic 'repeat k times on the extreme element' problem — the heap keeps 'which pile is biggest NOW' an O(log n) question while the array shows the shrinking piles.")
    return go()
  },
}
