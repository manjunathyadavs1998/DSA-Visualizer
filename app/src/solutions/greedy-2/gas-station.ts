import type { SolutionDef } from "@/engine/types"

/** Equal-length, non-negative gas/cost arrays. */
const sanitize = (args: Record<string, unknown>): { gas: number[]; cost: number[] } => {
  let gas = (args.gas as number[]).map((v) => Math.max(0, Math.trunc(Math.abs(v))))
  let cost = (args.cost as number[]).map((v) => Math.max(0, Math.trunc(Math.abs(v))))
  const n = Math.min(gas.length, cost.length)
  gas = gas.slice(0, n)
  cost = cost.slice(0, n)
  if (!n) return { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] }
  return { gas, cost }
}

export const gasStation: SolutionDef = {
  view: "array",
  array: (a) => {
    const { gas, cost } = sanitize(a)
    return gas.map((g, i) => `${g}|${cost[i]}`)
  },
  code: `// cell "g|c": gain g gas here, pay c to reach the next stop
function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const d = gas[i] - cost[i];
    total += d; tank += d;
    if (tank < 0) {     // ran dry before station i+1
      start = i + 1;    // no station in [start..i] can work
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
  codeJava: `// cell "g|c": gain g gas here, pay c to reach the next stop
int canCompleteCircuit(int[] gas, int[] cost) {
  int total = 0, tank = 0, start = 0;
  for (int i = 0; i < gas.length; i++) {
    int d = gas[i] - cost[i];
    total += d; tank += d;
    if (tank < 0) {     // ran dry before station i+1
      start = i + 1;    // no station in [start..i] can work
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
  inputs: [
    { kind: "numbers", name: "gas", label: "gas (fuel gained at station i)", default: [1, 2, 3, 4, 5], maxLen: 10 },
    { kind: "numbers", name: "cost", label: "cost (fuel to drive from i to i+1)", default: [3, 4, 5, 1, 2], maxLen: 10 },
  ],
  entry: (a) => {
    const { gas, cost } = sanitize(a)
    return `canCompleteCircuit([${gas.join(",")}], [${cost.join(",")}])`
  },
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const { gas, cost } = sanitize(args)
    const n = gas.length
    const solve = fn(
      "canCompleteCircuit",
      (): number => {
        let total = 0
        let tank = 0
        let start = 0
        vars({ total, tank, start })
        line(2, `Two facts carry the proof: (1) if total gas ≥ total cost a start exists, (2) if you die at i, no station you passed could have survived either.`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          ptr("start", start)
          mark("focus", [i])
          const d = gas[i] - cost[i]
          line(4, `Station ${i}: gain ${gas[i]}, pay ${cost[i]} → net d = <b>${d >= 0 ? "+" : ""}${d}</b>.`)
          total += d
          tank += d
          vars({ total, tank, start })
          line(5, `total = ${total}, tank from current start = <b>${tank}</b>.`)
          if (tank < 0) {
            mark("bad", Array.from({ length: i - start + 1 }, (_, k) => start + k))
            line(6, `Tank went negative — the trip from start=${start} dies between ${i} and ${i + 1}.`)
            start = i + 1
            tank = 0
            vars({ total, tank, start })
            ptr("start", Math.min(start, n - 1))
            line(7, `Any station between the old start and ${i} would reach here with even LESS fuel — skip them all, restart at <b>${start}</b> with an empty tank.`)
          } else {
            mark("window", Array.from({ length: i - start + 1 }, (_, k) => start + k))
          }
        }
        ptr("i", -1)
        mark("focus", [])
        if (total >= 0) {
          mark("good", [start])
          line(11, `Total surplus ${total} ≥ 0 → a lap is possible, and the surviving candidate <b>${start}</b> is the unique answer.`)
          return start
        }
        mark("bad", gas.map((_, k) => k))
        line(11, `Total gas falls ${-total} short of total cost → <b>-1</b>, no start can ever work.`)
        return -1
      },
      1,
    )
    narrate(`One pass, no simulation of each start: a failed stretch eliminates every station inside it at once.`)
    return solve()
  },
}
