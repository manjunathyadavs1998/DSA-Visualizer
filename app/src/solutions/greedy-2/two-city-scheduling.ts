import type { SolutionDef } from "@/engine/types"

/** Flat [a,b,...] → cost pairs (even count), sorted by refund a−b. */
const toCosts = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2)
    out.push([Math.max(0, Math.trunc(Math.abs(flat[i]))), Math.max(0, Math.trunc(Math.abs(flat[i + 1])))])
  if (out.length % 2 === 1) out.pop()
  if (!out.length) return [[10, 20], [30, 200], [400, 50], [30, 20]].sort((p, q) => p[0] - p[1] - (q[0] - q[1])) as [number, number][]
  return out.sort((p, q) => p[0] - p[1] - (q[0] - q[1]))
}

export const twoCityScheduling: SolutionDef = {
  view: "array",
  array: (a) => toCosts(a.costs as number[]).map(([x, y]) => `${x}/${y}`),
  code: `// cell "a/b" = fly to A for a, or to B for b
function twoCitySchedCost(costs) {
  costs.sort((p, q) => (p[0] - p[1]) - (q[0] - q[1]));
  const n = costs.length / 2;
  let total = 0;
  for (let i = 0; i < costs.length; i++) {
    if (i < n) total += costs[i][0];  // first half → city A
    else       total += costs[i][1];  // second half → city B
  }
  return total;
}`,
  codeJava: `// cell "a/b" = fly to A for a, or to B for b
int twoCitySchedCost(int[][] costs) {
  Arrays.sort(costs, (p, q) -> (p[0] - p[1]) - (q[0] - q[1]));
  int n = costs.length / 2;
  int total = 0;
  for (int i = 0; i < costs.length; i++) {
    if (i < n) total += costs[i][0];  // first half → city A
    else       total += costs[i][1];  // second half → city B
  }
  return total;
}`,
  inputs: [
    {
      kind: "numbers", name: "costs", label: "costs (flat [toA,toB] pairs: 10,20,30,200 = [10,20],[30,200]; pair count must be even)",
      default: [10, 20, 30, 200, 400, 50, 30, 20], maxLen: 12,
    },
  ],
  entry: (a) => `twoCitySchedCost([${toCosts(a.costs as number[]).map(([x, y]) => `[${x},${y}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const costs = toCosts(args.costs as number[])
    const solve = fn(
      "twoCitySchedCost",
      (): number => {
        line(2, `Sort by <b>a − b</b>: the people who save the most by going to A come first. (a−b is how much A "costs extra" — negative means A is the bargain.)`)
        narrate(`Sorted refunds a−b: ${costs.map(([x, y]) => x - y).join(", ")} — most A-leaning on the left.`)
        const n = costs.length / 2
        vars({ n, total: 0 })
        line(3, `Exactly <b>${n}</b> people must go to each city — the only constraint.`)
        let total = 0
        const toA: string[] = []
        const toB: string[] = []
        for (let i = 0; i < costs.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (i < n) {
            total += costs[i][0]
            toA.push(`$${costs[i][0]}`)
            heap("cityA", [...toA])
            mark("good", Array.from({ length: i + 1 }, (_, k) => k))
            line(6, `Person ${i} (costs ${costs[i][0]}/${costs[i][1]}) → city <b>A</b> for $${costs[i][0]}; total = <b>${total}</b>.`)
          } else {
            total += costs[i][1]
            toB.push(`$${costs[i][1]}`)
            heap("cityB", [...toB])
            mark("window", Array.from({ length: i - n + 1 }, (_, k) => n + k))
            line(7, `Person ${i} (costs ${costs[i][0]}/${costs[i][1]}) → city <b>B</b> for $${costs[i][1]}; total = <b>${total}</b>.`)
          }
          vars({ n, total })
        }
        ptr("i", -1)
        mark("focus", [])
        line(9, `Cheapest split: <b>$${total}</b>. Swapping any A-person with any B-person can only raise the bill — the sort guarantees it.`)
        return total
      },
      1,
    )
    narrate(`Reframe: send EVERYONE to B, then "refund" the n people with the best a−b by moving them to A — so sort by a−b.`)
    return solve()
  },
}
