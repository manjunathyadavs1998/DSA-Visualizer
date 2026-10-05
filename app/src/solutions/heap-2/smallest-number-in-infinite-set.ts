import type { SolutionDef } from "@/engine/types"

export const smallestNumberInInfiniteSet: SolutionDef = {
  code: `// added-back numbers live in a min-heap; the rest is just \`next\`
class SmallestInfiniteSet {
  next = 1;                      // 1,2,3,… never materialized
  pq = new MinHeap();            // numbers added back, deduped
  popSmallest() {
    if (!this.pq.isEmpty() && this.pq.top() < this.next)
      return this.pq.pop();      // a returned number wins
    return this.next++;          // else consume the frontier
  }
  addBack(num) {
    if (num < this.next && !this.pq.has(num))
      this.pq.push(num);         // only already-popped numbers
  }
}`,
  codeJava: `// added-back numbers live in a min-heap; the rest is just \`next\`
class SmallestInfiniteSet {
  int next = 1;                  // 1,2,3,… never materialized
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  int popSmallest() {
    if (!pq.isEmpty() && pq.peek() < next)
      return pq.poll();          // a returned number wins
    return next++;               // else consume the frontier
  }
  void addBack(int num) {
    if (num < next && !pq.contains(num))
      pq.offer(num);             // only already-popped numbers
  }
}`,
  inputs: [
    { kind: "number", name: "pops1", label: "popSmallest × (phase 1)", default: 3, min: 1, max: 6 },
    { kind: "numbers", name: "addBack", label: "addBack values", default: [2, 1], maxLen: 6 },
    { kind: "number", name: "pops2", label: "popSmallest × (phase 2)", default: 3, min: 1, max: 6 },
  ],
  entry: (a) => `pop ×${a.pops1}, addBack([${(a.addBack as number[]).join(",")}]), pop ×${a.pops2}`,
  run({ fn, line, vars, heap, narrate }, args) {
    const pops1 = Math.max(1, Math.min(6, Math.trunc(args.pops1 as number)))
    const pops2 = Math.max(1, Math.min(6, Math.trunc(args.pops2 as number)))
    const adds = (args.addBack as number[]).map(Math.trunc).filter((x) => x > 0)
    // state of the "infinite set"
    let next = 1
    const pq: number[] = [] // min-heap simulated as a sorted ascending array
    const popped: number[] = []
    const popSmallest = fn(
      "popSmallest",
      (): number => {
        line(5, `popSmallest(): heap root = ${pq.length ? pq[0] : "∅"}, next = ${next}. ${pq.length ? `Is ${pq[0]} < ${next}? ${pq[0] < next ? "<b>yes</b>" : "no"}.` : "Heap empty — the frontier wins by default."}`)
        if (pq.length && pq[0] < next) {
          const v = pq.shift() as number
          heap("pq", [...pq])
          vars({ returned: v, next })
          line(6, `An added-back number is smaller than the untouched frontier → pop <b>${v}</b> from the heap.`)
          return v
        }
        const v = next++
        vars({ returned: v, next })
        line(7, `Take the frontier value <b>${v}</b> and advance next → ${next}. The numbers ${next}, ${next + 1}, … still exist only implicitly.`)
        return v
      },
      4,
    )
    const addBack = fn(
      "addBack",
      (num: number): string => {
        line(10, `addBack(${num}): is it already popped (num < next = ${next}) and not sitting in the heap? ${num < next && !pq.includes(num) ? "<b>yes</b>" : "no"}.`)
        if (num < next && !pq.includes(num)) {
          let p = 0
          while (p < pq.length && pq[p] <= num) p++
          pq.splice(p, 0, num)
          heap("pq", [...pq])
          line(11, `push(<b>${num}</b>) → heap: [${pq.join(", ")}]. It will beat the frontier on a future pop.`)
          return "added"
        }
        line(10, `<b>${num}</b> is still in the infinite tail (or already back) — adding it would create a duplicate. Ignore.`)
        return "ignored"
      },
      9,
    )
    narrate(`The infinite set {1, 2, 3, …} is never stored: a counter marks the untouched tail, and a tiny min-heap holds only the numbers handed back.`)
    heap("pq", [])
    for (let i = 0; i < pops1; i++) {
      popped.push(popSmallest())
      heap("output", [...popped])
    }
    for (const v of adds) addBack(v)
    for (let i = 0; i < pops2; i++) {
      popped.push(popSmallest())
      heap("output", [...popped])
    }
    return `popped: ${popped.join(", ")}`
  },
}
