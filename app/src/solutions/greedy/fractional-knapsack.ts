import type { SolutionDef } from "@/engine/types"

/** Pair value/weight (weight floored at 1 to avoid division by zero)
 *  and sort by value/weight ratio desc — shared by array() and run(). */
const itemsOf = (values: number[], weights: number[]): [number, number][] =>
  values
    .map((v, i) => [v, Math.max(weights[i] ?? 1, 1)] as [number, number])
    .sort((a, b) => b[0] / b[1] - a[0] / a[1])

export const fractionalKnapsack: SolutionDef = {
  view: "array",
  // each cell is one item: "value/weight", ordered by ratio desc
  array: (a) => itemsOf(a.values as number[], a.weights as number[]).map(([v, w]) => `${v}/${w}`),
  code: `// item i: value[i] worth, weight[i] heavy; W = capacity
function fractionalKnapsack(value, weight, W) {
  const items = value.map((v, i) => [v, weight[i]]);
  items.sort((a, b) => b[0]/b[1] - a[0]/a[1]); // ratio desc
  let capacity = W, total = 0;
  for (const [v, w] of items) {
    if (capacity === 0) break;
    if (w <= capacity) {           // take it whole
      capacity -= w; total += v;
    } else {                       // take the fraction that fits
      total += v * (capacity / w);
      capacity = 0;
    }
  }
  return total;
}`,
  codeJava: `// item i: value[i] worth, weight[i] heavy; W = capacity
double fractionalKnapsack(int[] value, int[] weight, int W) {
  double[][] items = pairUp(value, weight);
  Arrays.sort(items, (a, b) -> cmpRatioDesc(a, b)); // ratio desc
  double capacity = W, total = 0;
  for (double[] it : items) {
    if (capacity == 0) break;
    if (it[1] <= capacity) {       // take it whole
      capacity -= it[1]; total += it[0];
    } else {                       // take the fraction that fits
      total += it[0] * (capacity / it[1]);
      capacity = 0;
    }
  }
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "values", label: "values", default: [60, 100, 120], maxLen: 8 },
    { kind: "numbers", name: "weights", label: "weights", default: [10, 20, 30], maxLen: 8 },
    { kind: "number", name: "W", label: "capacity W", default: 50, min: 1, max: 99 },
  ],
  entry: (a) => `fractionalKnapsack(values, weights, ${a.W})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const items = itemsOf(args.values as number[], args.weights as number[])
    const W = args.W as number
    const round = (x: number) => Math.round(x * 100) / 100
    const solve = fn(
      "fractionalKnapsack",
      (): number => {
        line(3, `Sort by <b>value per kg</b>: ${items.map(([v, w]) => `${v}/${w} = <b>${round(v / w)}</b>`).join(", ")} — densest value first.`)
        let capacity = W, total = 0
        vars({ capacity, total })
        line(4, `The bag holds <b>${W}</b>; nothing packed yet.`)
        const taken: number[] = []
        const skipped: number[] = []
        for (let k = 0; k < items.length; k++) {
          const [v, w] = items[k]
          if (capacity === 0) {
            skipped.push(k)
            mark("bad", skipped)
            line(6, `The bag is full — item ${v}/${w} stays behind.`)
            continue
          }
          ptr("k", k)
          mark("focus", [k])
          line(5, `Item <b>${v}/${w}</b> (ratio ${round(v / w)}): ${w} vs remaining capacity ${capacity}.`)
          if (w <= capacity) {
            capacity -= w
            total += v
            vars({ capacity, total })
            line(8, `It fits whole: capacity ${capacity + w} → <b>${capacity}</b>, total value → <b>${round(total)}</b>.`)
            taken.push(k)
            mark("good", taken)
          } else {
            const frac = capacity / w
            total += v * frac
            line(10, `Only <b>${capacity}/${w}</b> of it fits — take that fraction: ${v} × ${round(frac)} = <b>${round(v * frac)}</b> more value. Total → <b>${round(total)}</b>.`)
            capacity = 0
            vars({ capacity, total: round(total) })
            line(11, `The bag is now exactly full — this is why fractional (unlike 0/1) knapsack is greedy-safe.`)
            taken.push(k)
            mark("good", taken)
          }
        }
        mark("focus", [])
        ptr("k", -1)
        line(14, `Maximum value packed: <b>${round(total)}</b>.`)
        return round(total)
      },
      1,
    )
    narrate(`Greedy on <b>value/weight ratio</b>: since items can be cut, the densest value should always fill the bag first.`)
    return solve()
  },
}
