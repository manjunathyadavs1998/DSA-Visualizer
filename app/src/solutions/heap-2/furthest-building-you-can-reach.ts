import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): number[] => {
  const h = (a.heights as number[]).map((x) => Math.max(1, Math.trunc(x)))
  if (h.length < 2) h.push(4, 2, 7, 6, 9, 14, 12)
  return h
}

export const furthestBuildingYouCanReach: SolutionDef = {
  view: "array",
  array: (a) => clean(a),
  code: `// ladders take the biggest climbs; bricks mop up the rest
function furthestBuilding(heights, bricks, ladders) {
  const pq = new MinHeap();          // climbs currently using a ladder
  for (let i = 1; i < heights.length; i++) {
    const climb = heights[i] - heights[i - 1];
    if (climb <= 0) continue;        // downhill or flat — free
    pq.push(climb);                  // optimistically use a ladder
    if (pq.size() > ladders)
      bricks -= pq.pop();            // smallest climb falls back to bricks
    if (bricks < 0)
      return i - 1;                  // can't afford this climb
  }
  return heights.length - 1;         // reached the end
}`,
  codeJava: `// ladders take the biggest climbs; bricks mop up the rest
int furthestBuilding(int[] heights, int bricks, int ladders) {
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  for (int i = 1; i < heights.length; i++) {
    int climb = heights[i] - heights[i - 1];
    if (climb <= 0) continue;        // downhill or flat — free
    pq.offer(climb);                 // optimistically use a ladder
    if (pq.size() > ladders)
      bricks -= pq.poll();           // smallest climb falls back to bricks
    if (bricks < 0)
      return i - 1;                  // can't afford this climb
  }
  return heights.length - 1;         // reached the end
}`,
  inputs: [
    { kind: "numbers", name: "heights", label: "heights", default: [4, 2, 7, 6, 9, 14, 12], maxLen: 10 },
    { kind: "number", name: "bricks", label: "bricks", default: 5, min: 0, max: 30 },
    { kind: "number", name: "ladders", label: "ladders", default: 1, min: 0, max: 5 },
  ],
  entry: (a) => `furthestBuilding(heights, ${a.bricks}, ${a.ladders})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const heights = clean(args)
    const ladders = Math.max(0, Math.trunc(args.ladders as number))
    let bricks = Math.max(0, Math.trunc(args.bricks as number))
    const go = fn(
      "furthestBuilding",
      (): number => {
        // min-heap simulated as an array sorted ASCENDING → pq[0] = smallest laddered climb
        const pq: number[] = []
        heap("pq", [])
        line(2, `Min-heap of the climbs we are currently covering with ladders. Invariant: the <b>${ladders} ladder(s) always cover the biggest climbs so far</b>; bricks pay for the rest.`)
        for (let i = 1; i < heights.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          const climb = heights[i] - heights[i - 1]
          line(4, `heights[${i}] − heights[${i - 1}] = ${heights[i]} − ${heights[i - 1]} = <b>${climb}</b>.`)
          if (climb <= 0) {
            mark("done", Array.from({ length: i + 1 }, (_, x) => x))
            line(5, `Downhill/flat — walk across for free.`)
            continue
          }
          let p = 0
          while (p < pq.length && pq[p] <= climb) p++
          pq.splice(p, 0, climb)
          heap("pq", [...pq])
          line(6, `Assume a ladder covers this climb of ${climb}: push → ladder set [${pq.join(", ")}].`)
          if (pq.length > ladders) {
            const small = pq.shift() as number
            heap("pq", [...pq])
            bricks -= small
            line(8, `Only ${ladders} ladder(s), but ${pq.length + 1} laddered climbs → the <b>smallest</b> one (${small}) is demoted to bricks: bricks = ${bricks + small} − ${small} = <b>${bricks}</b>.`)
          }
          vars({ i, climb, bricks, "laddered climbs": `[${pq.join(", ")}]` })
          if (bricks < 0) {
            mark("bad", [i])
            heap("output", [`stuck before building ${i}`])
            line(10, `bricks = ${bricks} < 0 — this climb is unaffordable → furthest building is <b>${i - 1}</b>.`)
            return i - 1
          }
          mark("done", Array.from({ length: i + 1 }, (_, x) => x))
        }
        ptr("i", -1)
        mark("focus", [])
        mark("good", [heights.length - 1])
        heap("output", [`reached building ${heights.length - 1}`])
        line(12, `All climbs paid for (bricks left: ${bricks}) → we reach the last building, index <b>${heights.length - 1}</b>.`)
        return heights.length - 1
      },
      1,
    )
    narrate("Lazy greedy: give every climb a ladder first, then let the heap demote the cheapest ladder-user to bricks — ladders end up on exactly the largest climbs.")
    return go()
  },
}
