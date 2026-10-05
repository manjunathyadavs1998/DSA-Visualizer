import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): [number, number][] => {
  const pos = (a.positions as number[]).map((x) => Math.max(1, Math.trunc(x)))
  const gas = (a.fuel as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const n = Math.min(pos.length, gas.length)
  const st: [number, number][] = []
  for (let i = 0; i < n; i++) st.push([pos[i], gas[i]])
  st.sort((x, y) => x[0] - y[0])
  return st
}

export const minimumNumberOfRefuelingStops: SolutionDef = {
  code: `// drive past stations, banking them; refuel RETROACTIVELY, biggest first
function minRefuelStops(target, startFuel, stations) {
  const pq = new MaxHeap();          // fuel of stations already passed
  let fuel = startFuel, stops = 0, i = 0;
  while (fuel < target) {            // can't reach the target yet
    while (i < stations.length && stations[i][0] <= fuel)
      pq.push(stations[i++][1]);     // passed it — bank its gas
    if (pq.isEmpty()) return -1;     // stranded: nothing left to burn
    fuel += pq.pop();                // pretend we stopped at the best one
    stops++;
  }
  return stops;
}`,
  codeJava: `// drive past stations, banking them; refuel RETROACTIVELY, biggest first
int minRefuelStops(int target, int startFuel, int[][] stations) {
  PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
  long fuel = startFuel; int stops = 0, i = 0;
  while (fuel < target) {            // can't reach the target yet
    while (i < stations.length && stations[i][0] <= fuel)
      pq.offer(stations[i++][1]);    // passed it — bank its gas
    if (pq.isEmpty()) return -1;     // stranded: nothing left to burn
    fuel += pq.poll();               // pretend we stopped at the best one
    stops++;
  }
  return stops;
}`,
  inputs: [
    { kind: "number", name: "target", label: "target distance", default: 100, min: 1, max: 200 },
    { kind: "number", name: "startFuel", label: "start fuel", default: 10, min: 1, max: 200 },
    { kind: "numbers", name: "positions", label: "station positions", default: [10, 20, 30, 60], maxLen: 8 },
    { kind: "numbers", name: "fuel", label: "station fuel", default: [60, 30, 30, 40], maxLen: 8 },
  ],
  entry: (a) => `minRefuelStops(${a.target}, ${a.startFuel}, stations)`,
  run({ fn, line, vars, heap, narrate }, args) {
    const stations = build(args)
    const target = Math.max(1, Math.trunc(args.target as number))
    const startFuel = Math.max(1, Math.trunc(args.startFuel as number))
    const go = fn(
      "minRefuelStops",
      (): number => {
        // max-heap simulated as an array sorted DESCENDING
        const pq: number[] = []
        heap("pq", [])
        let fuel = startFuel
        let stops = 0
        let i = 0
        line(3, `Start with fuel = <b>${startFuel}</b> (fuel ≡ farthest reachable mile). Stations: ${stations.map(([p, f]) => `${f} gal @mile ${p}`).join(", ") || "none"}. Target: mile ${target}.`)
        while (fuel < target) {
          line(4, `Reach = ${fuel} < ${target} — not there yet.`)
          while (i < stations.length && stations[i][0] <= fuel) {
            const g = stations[i][1]
            let p = 0
            while (p < pq.length && pq[p] >= g) p++
            pq.splice(p, 0, g)
            heap("pq", [...pq])
            line(6, `Mile ${stations[i][0]} is within reach → drive past it and <b>bank its ${g} gallons</b> for later: [${pq.join(", ")}]. (No commitment yet!)`)
            i++
          }
          if (!pq.length) {
            heap("output", ["unreachable"])
            line(7, `Reach is ${fuel}, no banked station remains → <b>stranded</b>. Return -1.`)
            return -1
          }
          const g = pq.shift() as number
          heap("pq", [...pq])
          fuel += g
          stops++
          heap("output", [`stop ${stops}: +${g} → reach ${fuel}`])
          vars({ fuel, stops, banked: `[${pq.join(", ")}]` })
          line(8, `Retroactively refuel at the <b>biggest banked station</b> (+${g}) → reach = <b>${fuel}</b>. One stop, maximum range: that's why the max-heap gives the minimum stop count.`)
          line(9, `stops = <b>${stops}</b>.`)
        }
        line(11, `Reach ${fuel} ≥ ${target} → the target is reachable with <b>${stops}</b> stop(s).`)
        return stops
      },
      1,
    )
    narrate("Decide stops lazily: pass every station, bank its fuel, and only when the tank runs dry 'rewind' and claim the largest banked fill-up.")
    return go()
  },
}
