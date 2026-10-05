import type { SolutionDef } from "@/engine/types"

const MAXSTOP = 10

/** Flat [passengers, from, to] triples; stops clamped to 0..10, from < to. */
const toTrips = (flat: number[]): [number, number, number][] => {
  const out: [number, number, number][] = []
  for (let i = 0; i + 2 < flat.length; i += 3) {
    const p = Math.max(1, Math.trunc(Math.abs(flat[i])))
    let a = Math.min(MAXSTOP, Math.max(0, Math.trunc(Math.abs(flat[i + 1]))))
    let b = Math.min(MAXSTOP, Math.max(0, Math.trunc(Math.abs(flat[i + 2]))))
    if (a > b) [a, b] = [b, a]
    if (a === b) {
      if (a > 0) a -= 1
      else b += 1
    }
    out.push([p, a, b])
  }
  if (!out.length) return [[2, 1, 5], [3, 3, 7], [1, 2, 4]]
  return out
}

export const carPooling: SolutionDef = {
  view: "array",
  array: () => Array.from({ length: MAXSTOP + 1 }, () => 0),
  code: `// difference array over stops 0..10, then prefix-sum sweep
function carPooling(trips, capacity) {
  const diff = new Array(11).fill(0);
  for (const [p, from, to] of trips) {
    diff[from] += p;   // p riders board at 'from'
    diff[to] -= p;     // and leave at 'to'
  }
  let load = 0;
  for (let stop = 0; stop <= 10; stop++) {
    load += diff[stop];
    if (load > capacity) return false;
  }
  return true;
}`,
  codeJava: `// difference array over stops 0..10, then prefix-sum sweep
boolean carPooling(int[][] trips, int capacity) {
  int[] diff = new int[11];
  for (int[] t : trips) {
    diff[t[1]] += t[0];  // t[0] riders board at t[1]
    diff[t[2]] -= t[0];  // and leave at t[2]
  }
  int load = 0;
  for (int stop = 0; stop <= 10; stop++) {
    load += diff[stop];
    if (load > capacity) return false;
  }
  return true;
}`,
  inputs: [
    {
      kind: "numbers", name: "trips", label: "trips (flat [passengers,from,to] triples: 2,1,5,3,3,7 = [2,1,5],[3,3,7]; stops 0–10)",
      default: [2, 1, 5, 3, 3, 7, 1, 2, 4], maxLen: 12,
    },
    { kind: "number", name: "capacity", label: "capacity (seats in the car)", default: 6, min: 1, max: 20 },
  ],
  entry: (a) => `carPooling([${toTrips(a.trips as number[]).map((t) => `[${t.join(",")}]`).join(",")}], ${Math.max(1, Math.trunc(a.capacity as number))})`,
  run({ fn, line, ptr, mark, vars, aset, heap, narrate }, args) {
    const trips = toTrips(args.trips as number[])
    const capacity = Math.max(1, Math.trunc(args.capacity as number))
    const solve = fn(
      "carPooling",
      (): boolean => {
        const diff = new Array(MAXSTOP + 1).fill(0)
        line(2, `The array below is the road, stops 0..${MAXSTOP}. We record only <b>changes</b> in passenger count — a difference array.`)
        for (const [p, from, to] of trips) {
          diff[from] += p
          aset(from, diff[from] > 0 ? `+${diff[from]}` : diff[from])
          mark("focus", [from, to])
          line(4, `Trip [${p},${from},${to}]: <b>+${p}</b> board at stop ${from} → diff[${from}] = ${diff[from]}.`)
          diff[to] -= p
          aset(to, diff[to] > 0 ? `+${diff[to]}` : diff[to])
          line(5, `…and <b>−${p}</b> leave at stop ${to} → diff[${to}] = ${diff[to]}.`)
        }
        heap("diff", [...diff])
        mark("focus", [])
        let load = 0
        line(7, `Now sweep the road once; the running sum of diff is the live passenger <b>load</b>.`)
        for (let stop = 0; stop <= MAXSTOP; stop++) {
          ptr("stop", stop)
          load += diff[stop]
          vars({ load, capacity })
          if (diff[stop] !== 0) {
            line(9, `Stop ${stop}: load ${diff[stop] > 0 ? "+" : ""}${diff[stop]} → <b>${load}</b> aboard (capacity ${capacity}).`)
          }
          if (load > capacity) {
            mark("bad", [stop])
            line(10, `<b>${load} > ${capacity}</b> — the car overflows at stop ${stop} → return <b>false</b>.`)
            return false
          }
          if (diff[stop] !== 0) mark("good", [stop])
        }
        ptr("stop", -1)
        line(12, `The load never exceeded ${capacity} → <b>true</b>, everyone fits.`)
        return true
      },
      1,
    )
    narrate(`No sorting, no simulation per trip: because stops are small integers, "+p at from, −p at to" plus one prefix-sum sweep answers it in O(n + stops).`)
    return solve()
  },
}
