import type { SolutionDef } from "@/engine/types"

const cleanBloom = (xs: number[]) => {
  const b = xs.map((v) => Math.min(14, Math.max(1, Math.round(v))))
  return b.length ? b : [1, 10, 3, 10, 2]
}

export const minDaysToMakeBouquets: SolutionDef = {
  view: "array",
  array: (a) => cleanBloom(a.bloomDay as number[]),
  code: `// min days until we can cut m bouquets of k ADJACENT flowers
function minDays(bloomDay, m, k) {
  if (m * k > bloomDay.length) return -1;   // not enough flowers
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) {
    const day = (lo + hi) >> 1;
    if (canMake(bloomDay, m, k, day)) hi = day; // works — earlier?
    else lo = day + 1;                          // wait longer
  }
  return lo;
}
function canMake(bloomDay, m, k, day) {
  let bouquets = 0, run = 0;
  for (const b of bloomDay) {
    run = b <= day ? run + 1 : 0;    // adjacent bloomed streak
    if (run === k) { bouquets++; run = 0; }
  }
  return bouquets >= m;
}`,
  codeJava: `// min days until we can cut m bouquets of k ADJACENT flowers
int minDays(int[] bloomDay, int m, int k) {
  if ((long) m * k > bloomDay.length) return -1;
  int lo = Arrays.stream(bloomDay).min().getAsInt(), hi = Arrays.stream(bloomDay).max().getAsInt();
  while (lo < hi) {
    int day = (lo + hi) / 2;
    if (canMake(bloomDay, m, k, day)) hi = day; // works — earlier?
    else lo = day + 1;                          // wait longer
  }
  return lo;
}
boolean canMake(int[] bloomDay, int m, int k, int day) {
  int bouquets = 0, run = 0;
  for (int b : bloomDay) {
    run = b <= day ? run + 1 : 0;    // adjacent bloomed streak
    if (run == k) { bouquets++; run = 0; }
  }
  return bouquets >= m;
}`,
  inputs: [
    { kind: "numbers", name: "bloomDay", label: "bloom days", default: [1, 10, 3, 10, 2], maxLen: 10 },
    { kind: "number", name: "m", label: "m bouquets", default: 3, min: 1, max: 10 },
    { kind: "number", name: "k", label: "k adjacent", default: 1, min: 1, max: 10 },
  ],
  entry: (a) => `minDays(bloomDay, ${a.m}, ${a.k})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const bloom = cleanBloom(args.bloomDay as number[])
    const n = bloom.length
    const m = Math.max(1, args.m as number)
    const k = Math.max(1, args.k as number)
    const canMake = fn(
      "canMake",
      (day: number): boolean => {
        let bouquets = 0, run = 0
        const open: number[] = bloom.map((b, i) => (b <= day ? i : -1)).filter((i) => i >= 0)
        mark("good", open)
        vars({ day, bouquets, run })
        line(13, `By day ${day}, flowers [${open.map((i) => bloom[i]).join(", ")}] have bloomed (green). Scan for runs of ${k} adjacent blooms.`)
        for (let i = 0; i < n; i++) {
          const b = bloom[i]
          ptr("i", i)
          run = b <= day ? run + 1 : 0
          vars({ day, i, run, bouquets })
          if (b <= day && run < k) line(14, `Flower ${i} (blooms day ${b}) is open → adjacent streak = <b>${run}</b>/${k}.`)
          else if (b > day) line(14, `Flower ${i} blooms on day ${b} > ${day} → still closed, streak <b>resets to 0</b>.`)
          if (run === k) {
            bouquets++
            run = 0
            vars({ day, i, run, bouquets })
            line(15, `Streak hit ${k} → <b>cut bouquet ${bouquets}</b>; the streak restarts.`)
          }
        }
        ptr("i", -1)
        line(17, `Day ${day} yields <b>${bouquets}</b> bouquet(s); need ${m} → ${bouquets >= m ? "<b>feasible</b>" : "<b>infeasible</b>"}.`)
        return bouquets >= m
      },
      11,
    )
    const go = fn(
      "minDays",
      (): number => {
        narrate(`The array shows each flower's <b>bloom day</b>. We binary search the answer — the waiting day — because more waiting never hurts (monotonic feasibility).`)
        if (m * k > n) {
          line(2, `${m} bouquets × ${k} flowers = ${m * k} > ${n} flowers in the garden → <b>impossible</b>, return -1.`)
          return -1
        }
        let lo = Math.min(...bloom), hi = Math.max(...bloom)
        vars({ lo, hi, m, k })
        line(3, `No point checking before day ${lo} (first bloom) or after day ${hi} (everything open). Search days [${lo}..${hi}].`)
        while (lo < hi) {
          const day = (lo + hi) >> 1
          mark("good", [])
          vars({ lo, hi, day, m, k })
          line(5, `Guess waiting until day <b>${day}</b> — can we cut ${m} bouquet(s) of ${k} adjacent flower(s)?`)
          if (canMake(day)) {
            line(6, `Feasible → maybe an even earlier day works. <b>hi = ${day}</b>.`)
            hi = day
          } else {
            line(7, `Infeasible → day ${day} is too early (and so is anything earlier). <b>lo = ${day + 1}</b>.`)
            lo = day + 1
          }
          vars({ lo, hi, m, k })
        }
        mark("good", bloom.map((b, i) => (b <= lo ? i : -1)).filter((i) => i >= 0))
        line(9, `Earliest day that works: <b>${lo}</b>.`)
        return lo
      },
      1,
    )
    return go()
  },
}
