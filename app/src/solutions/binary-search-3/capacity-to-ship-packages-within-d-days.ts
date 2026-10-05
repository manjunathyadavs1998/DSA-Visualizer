import type { SolutionDef } from "@/engine/types"

const cleanW = (xs: number[]) => {
  const w = xs.map((v) => Math.min(10, Math.max(1, Math.round(v))))
  return w.length ? w : [3, 2, 2, 4, 1, 4]
}

// The array view shows the CANDIDATE CAPACITIES max(w)..sum(w) — the answer space.
export const shipWithinDays: SolutionDef = {
  view: "array",
  array: (a) => {
    const w = cleanW(a.weights as number[])
    const lo = Math.max(...w), hi = w.reduce((s, x) => s + x, 0)
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
  },
  code: `// least ship capacity to ship all packages within D days
function shipWithinDays(weights, days) {
  let lo = Math.max(...weights);        // must fit heaviest package
  let hi = weights.reduce((a, b) => a + b, 0);   // one-day shipping
  while (lo < hi) {
    const cap = (lo + hi) >> 1;
    if (daysNeeded(weights, cap) <= days) hi = cap; // fits — shrink
    else lo = cap + 1;                              // overloaded — grow
  }
  return lo;
}
function daysNeeded(weights, cap) {     // greedy: load in order
  let d = 1, load = 0;
  for (const w of weights) {
    if (load + w > cap) { d++; load = 0; }   // start a new day
    load += w;
  }
  return d;
}`,
  codeJava: `// least ship capacity to ship all packages within D days
int shipWithinDays(int[] weights, int days) {
  int lo = Arrays.stream(weights).max().getAsInt();
  int hi = Arrays.stream(weights).sum();         // one-day shipping
  while (lo < hi) {
    int cap = (lo + hi) / 2;
    if (daysNeeded(weights, cap) <= days) hi = cap; // fits — shrink
    else lo = cap + 1;                              // overloaded — grow
  }
  return lo;
}
int daysNeeded(int[] weights, int cap) { // greedy: load in order
  int d = 1, load = 0;
  for (int w : weights) {
    if (load + w > cap) { d++; load = 0; }   // start a new day
    load += w;
  }
  return d;
}`,
  inputs: [
    { kind: "numbers", name: "weights", label: "package weights", default: [3, 2, 2, 4, 1, 4], maxLen: 10 },
    { kind: "number", name: "days", label: "days", default: 3, min: 1, max: 10 },
  ],
  entry: (a) => `shipWithinDays(weights, ${a.days})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const weights = cleanW(args.weights as number[])
    const days = Math.min(weights.length, Math.max(1, args.days as number))
    const minCap = Math.max(...weights)
    const sum = weights.reduce((s, x) => s + x, 0)
    const idx = (v: number) => v - minCap
    const daysNeeded = fn(
      "daysNeeded",
      (cap: number): number => {
        let d = 1, load = 0
        vars({ cap, d, load })
        line(12, `Greedy check for capacity ${cap}: keep loading in order; when a package doesn't fit, ship and start day ${d + 1}.`)
        for (const w of weights) {
          if (load + w > cap) {
            d++
            line(14, `Package ${w} won't fit (${load} + ${w} > ${cap}) → ship! Day <b>${d}</b> starts empty.`)
            load = 0
          }
          load += w
          vars({ cap, d, load })
          line(15, `Load package ${w} → day ${d} carries <b>${load}</b>/${cap}.`)
        }
        line(17, `Capacity ${cap} needs <b>${d}</b> day(s).`)
        return d
      },
      11,
    )
    const go = fn(
      "shipWithinDays",
      (): number => {
        narrate(`Weights: [${weights.join(", ")}]. The cells are the <b>candidate capacities ${minCap}..${sum}</b> — the answer space, not the packages. Bigger ships never need more days → monotonic → binary search.`)
        let lo = minCap, hi = sum
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, days })
        mark("window", Array.from({ length: sum - minCap + 1 }, (_, i) => i))
        line(2, `Capacity below ${minCap} can't even lift the heaviest package; capacity ${sum} ships everything in one day.`)
        while (lo < hi) {
          const cap = (lo + hi) >> 1
          ptr("mid", idx(cap)); vars({ lo, hi, cap, days })
          mark("focus", [idx(cap)])
          line(5, `Guess capacity <b>${cap}</b> — how many days does the greedy loader need?`)
          const d = daysNeeded(cap)
          if (d <= days) {
            line(6, `${d} ≤ ${days} → capacity ${cap} <b>fits the deadline</b>. All larger capacities are wasteful — discard them: hi = ${cap}.`)
            for (let v = cap + 1; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = cap
          } else {
            line(7, `${d} > ${days} → capacity ${cap} is <b>too small</b> (and smaller is worse). Discard ${lo}..${cap}: lo = ${cap + 1}.`)
            for (let v = lo; v <= cap; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = cap + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, days })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [idx(lo)])
        line(9, `Minimum capacity that ships everything within ${days} day(s): <b>${lo}</b>.`)
        return lo
      },
      1,
    )
    return go()
  },
}
