import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): number[] => {
  const s = (a.sticks as number[]).map(Math.trunc).filter((x) => x > 0)
  if (!s.length) s.push(1, 8, 3, 5)
  return s
}

export const minimumCostToConnectSticks: SolutionDef = {
  code: `// always merge the two cheapest sticks (Huffman's idea)
function connectSticks(sticks) {
  const pq = new MinHeap(sticks);    // heapify all sticks
  let total = 0;
  while (pq.size() > 1) {
    const a = pq.pop();              // cheapest stick
    const b = pq.pop();              // second cheapest
    total += a + b;                  // pay their combined length
    pq.push(a + b);                  // the merged stick competes again
  }
  return total;
}`,
  codeJava: `// always merge the two cheapest sticks (Huffman's idea)
int connectSticks(int[] sticks) {
  PriorityQueue<Integer> pq = new PriorityQueue<>(Arrays.stream(sticks).boxed().toList());
  int total = 0;
  while (pq.size() > 1) {
    int a = pq.poll();               // cheapest stick
    int b = pq.poll();               // second cheapest
    total += a + b;                  // pay their combined length
    pq.offer(a + b);                 // the merged stick competes again
  }
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "sticks", label: "sticks", default: [1, 8, 3, 5], maxLen: 8 },
  ],
  entry: (a) => `connectSticks([${clean(a).join(",")}])`,
  run({ fn, line, vars, heap, narrate }, args) {
    const sticks = clean(args)
    const go = fn(
      "connectSticks",
      (): number => {
        // min-heap simulated as an array sorted ASCENDING → pq[0] is the cheapest stick
        const pq = [...sticks].sort((a, b) => a - b)
        heap("pq", [...pq])
        line(2, `Heapify the sticks: [${pq.join(", ")}]. A stick's length is paid <b>once per merge it takes part in</b> — so short sticks should be merged early (and often), long sticks as late as possible.`)
        let total = 0
        const merges: string[] = []
        while (pq.length > 1) {
          line(4, `${pq.length} sticks left — merge the two cheapest.`)
          const a = pq.shift() as number
          heap("pq", [...pq])
          line(5, `pop() → <b>${a}</b> (cheapest).`)
          const b = pq.shift() as number
          heap("pq", [...pq])
          line(6, `pop() → <b>${b}</b> (second cheapest).`)
          total += a + b
          merges.push(`${a}+${b} → ${a + b}`)
          heap("output", [...merges, `total ${total}`])
          line(7, `Pay <b>${a} + ${b} = ${a + b}</b> → total cost = <b>${total}</b>.`)
          let p = 0
          while (p < pq.length && pq[p] <= a + b) p++
          pq.splice(p, 0, a + b)
          heap("pq", [...pq])
          vars({ merged: `${a}+${b}`, total })
          line(8, `The merged stick of length ${a + b} sifts back in: [${pq.join(", ")}] — it may be merged again (and re-paid) later.`)
        }
        line(10, `One stick remains — total connection cost: <b>${total}</b>. This greedy is exactly Huffman coding on stick lengths.`)
        return total
      },
      1,
    )
    narrate("Every merge's cost is re-paid by all future merges containing it — so the two cheapest sticks must merge first. That exchange argument is Huffman's.")
    return go()
  },
}
