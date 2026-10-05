import type { SolutionDef } from "@/engine/types"

export const seatReservationManager: SolutionDef = {
  code: `// returned seats wait in a min-heap; \`next\` covers the untouched tail
class SeatManager {
  next = 1;                      // smallest never-used seat
  pq = new MinHeap();            // seats handed back
  constructor(n) { this.n = n; } // seats 1..n, all free
  reserve() {
    if (!this.pq.isEmpty())
      return this.pq.pop();      // a returned seat is always lowest
    return this.next++;          // else extend the frontier
  }
  unreserve(seatNumber) {
    this.pq.push(seatNumber);    // back into the recycled pool
  }
}`,
  codeJava: `// returned seats wait in a min-heap; \`next\` covers the untouched tail
class SeatManager {
  int next = 1;                  // smallest never-used seat
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  SeatManager(int n) { }         // seats 1..n, all free
  int reserve() {
    if (!pq.isEmpty())
      return pq.poll();          // a returned seat is always lowest
    return next++;               // else extend the frontier
  }
  void unreserve(int seatNumber) {
    pq.offer(seatNumber);        // back into the recycled pool
  }
}`,
  inputs: [
    { kind: "number", name: "n", label: "seats n", default: 5, min: 2, max: 10 },
    { kind: "number", name: "reserve1", label: "reserve × (phase 1)", default: 3, min: 1, max: 8 },
    { kind: "numbers", name: "unreserve", label: "unreserve seats", default: [2, 1], maxLen: 6 },
    { kind: "number", name: "reserve2", label: "reserve × (phase 2)", default: 3, min: 1, max: 8 },
  ],
  entry: (a) => `SeatManager(${a.n}): reserve ×${a.reserve1}, unreserve([${(a.unreserve as number[]).join(",")}]), reserve ×${a.reserve2}`,
  run({ fn, line, vars, heap, narrate }, args) {
    const n = Math.max(2, Math.min(10, Math.trunc(args.n as number)))
    const r1 = Math.max(1, Math.min(8, Math.trunc(args.reserve1 as number)))
    const r2 = Math.max(1, Math.min(8, Math.trunc(args.reserve2 as number)))
    let next = 1
    const pq: number[] = [] // min-heap simulated as a sorted ascending array
    const taken = new Set<number>()
    const log: string[] = []
    const reserve = fn(
      "reserve",
      (): number => {
        line(6, `reserve(): recycled pool = [${pq.join(", ") || "∅"}], frontier next = ${next}.`)
        if (pq.length) {
          const s = pq.shift() as number
          heap("pq", [...pq])
          taken.add(s)
          vars({ seat: s, next })
          line(7, `A handed-back seat exists and it is always below the frontier → pop seat <b>${s}</b>.`)
          return s
        }
        const s = next++
        taken.add(s)
        vars({ seat: s, next })
        line(8, `Pool empty → hand out the frontier seat <b>${s}</b> and bump next → ${next}. Seats ${next}…${n} have never been touched.`)
        return s
      },
      5,
    )
    const unreserve = fn(
      "unreserve",
      (seat: number): string => {
        taken.delete(seat)
        let p = 0
        while (p < pq.length && pq[p] <= seat) p++
        pq.splice(p, 0, seat)
        heap("pq", [...pq])
        line(11, `unreserve(${seat}): seat <b>${seat}</b> sifts into the recycled min-heap → [${pq.join(", ")}]. Being < next = ${next}, it will win the next reserve().`)
        return "ok"
      },
      10,
    )
    narrate(`Never materialize ${n} seats: a counter owns the pristine tail, the heap owns the recycled holes — reserve() just compares their fronts.`)
    heap("pq", [])
    for (let i = 0; i < r1 && next <= n; i++) log.push(`reserve → ${reserve()}`)
    heap("output", [...log])
    const uns = [...new Set((args.unreserve as number[]).map(Math.trunc))].filter((s) => taken.has(s))
    for (const s of uns) {
      unreserve(s)
      log.push(`unreserve(${s})`)
      heap("output", [...log])
    }
    for (let i = 0; i < r2 && (pq.length || next <= n); i++) {
      log.push(`reserve → ${reserve()}`)
      heap("output", [...log])
    }
    return log.join("; ")
  },
}
