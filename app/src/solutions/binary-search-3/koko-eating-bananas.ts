import type { SolutionDef } from "@/engine/types"

const cleanPiles = (xs: number[]) => {
  const p = xs.map((v) => Math.min(14, Math.max(1, Math.round(v))))
  return p.length ? p : [3, 6, 7, 11]
}

// The array view shows the CANDIDATE SPEEDS 1..max(piles) — the answer space.
export const kokoEatingBananas: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(...cleanPiles(a.piles as number[])) }, (_, i) => i + 1),
  code: `// slowest eating speed k that still finishes within h hours
function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);  // speed candidates
  while (lo < hi) {
    const k = (lo + hi) >> 1;
    if (hours(piles, k) <= h) hi = k;   // k works — try slower
    else lo = k + 1;                    // too slow — speed up
  }
  return lo;
}
function hours(piles, k) {              // hours at speed k
  let total = 0;
  for (const p of piles) total += Math.ceil(p / k);
  return total;
}`,
  codeJava: `// slowest eating speed k that still finishes within h hours
int minEatingSpeed(int[] piles, int h) {
  int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
  while (lo < hi) {
    int k = (lo + hi) / 2;
    if (hours(piles, k) <= h) hi = k;   // k works — try slower
    else lo = k + 1;                    // too slow — speed up
  }
  return lo;
}
long hours(int[] piles, int k) {        // hours at speed k
  long total = 0;
  for (int p : piles) total += (p + k - 1) / k;
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "piles", label: "piles", default: [3, 6, 7, 11], maxLen: 8 },
    { kind: "number", name: "h", label: "h hours", default: 8, min: 1, max: 50 },
  ],
  entry: (a) => `minEatingSpeed(piles, ${a.h})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const piles = cleanPiles(args.piles as number[])
    const h = Math.max(piles.length, args.h as number) // need ≥1 hour per pile
    const maxP = Math.max(...piles)
    const idx = (v: number) => v - 1
    const hours = fn(
      "hours",
      (k: number): number => {
        let total = 0
        vars({ k, total })
        line(11, `Simulate speed ${k}: each pile takes ⌈pile/${k}⌉ hours (Koko can't switch piles mid-hour).`)
        for (const p of piles) {
          total += Math.ceil(p / k)
          vars({ k, pile: p, "⌈p/k⌉": Math.ceil(p / k), total })
          line(12, `Pile of ${p} at speed ${k} → ⌈${p}/${k}⌉ = ${Math.ceil(p / k)} h → total = <b>${total}</b> h.`)
        }
        line(13, `Speed ${k} finishes everything in <b>${total}</b> hours.`)
        return total
      },
      10,
    )
    const go = fn(
      "minEatingSpeed",
      (): number => {
        narrate(`Piles: [${piles.join(", ")}]. The cells are the <b>candidate speeds 1..${maxP}</b> — not the piles! Faster always finishes sooner, so feasibility is monotonic → binary search the speed.`)
        let lo = 1, hi = maxP
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, h })
        mark("window", Array.from({ length: maxP }, (_, i) => i))
        line(2, `Speed ${maxP} (the biggest pile) always works; speed below 1 is impossible. Search [1..${maxP}].`)
        while (lo < hi) {
          const k = (lo + hi) >> 1
          ptr("mid", idx(k)); vars({ lo, hi, k, h })
          mark("focus", [idx(k)])
          line(4, `Guess speed k = <b>${k}</b> — does Koko finish within ${h} hours?`)
          const t = hours(k)
          if (t <= h) {
            line(5, `${t} ≤ ${h} → speed ${k} <b>works</b>. Every faster speed also works, so discard them and try slower: hi = ${k}.`)
            for (let v = k + 1; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = k
          } else {
            line(6, `${t} > ${h} → speed ${k} is <b>too slow</b>, and so is anything slower. Discard ${lo}..${k}: lo = ${k + 1}.`)
            for (let v = lo; v <= k; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = k + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, h })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [idx(lo)])
        line(8, `lo met hi at <b>${lo}</b> — the slowest speed that still finishes in ${h} hours.`)
        return lo
      },
      1,
    )
    return go()
  },
}
