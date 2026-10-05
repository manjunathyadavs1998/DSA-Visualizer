import type { SolutionDef } from "@/engine/types"

// The array view shows the CANDIDATE numbers 1..n.
export const guessNumber: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(1, a.n as number) }, (_, i) => i + 1),
  code: `// guess(x): -1 if pick < x, 1 if pick > x, 0 if equal
function guessNumber(n) {
  let lo = 1, hi = n;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const g = guess(mid);          // ask the API
    if (g === 0) return mid;       // got it
    if (g === -1) hi = mid - 1;    // pick is lower
    else lo = mid + 1;             // pick is higher
  }
  return -1;                       // unreachable per problem
}`,
  codeJava: `// guess(x): -1 if pick < x, 1 if pick > x, 0 if equal
int guessNumber(int n) {
  int lo = 1, hi = n;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    int g = guess(mid);            // ask the API
    if (g == 0) return mid;        // got it
    if (g == -1) hi = mid - 1;     // pick is lower
    else lo = mid + 1;             // pick is higher
  }
  return -1;                       // unreachable per problem
}`,
  inputs: [
    { kind: "number", name: "n", label: "n", default: 12, min: 1, max: 60 },
    { kind: "number", name: "pick", label: "secret pick", default: 7, min: 1, max: 60 },
  ],
  entry: (a) => `guessNumber(${a.n})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const n = Math.max(1, args.n as number)
    const pick = Math.min(n, Math.max(1, args.pick as number))
    const idx = (v: number) => v - 1
    const guess = (x: number) => (pick < x ? -1 : pick > x ? 1 : 0)
    const go = fn(
      "guessNumber",
      (): number => {
        narrate(`The cells are the candidates 1..${n}; the secret pick is <b>${pick}</b> (hidden from the algorithm — it only sees guess()'s -1/0/1 replies).`)
        let lo = 1, hi = n
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, n })
        mark("window", Array.from({ length: n }, (_, i) => i))
        line(2, `This IS the "guess a number" game — and binary search is the optimal strategy: each question kills half the candidates.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", idx(mid)); vars({ lo, hi, mid })
          mark("focus", [idx(mid)])
          line(4, `Candidates left: [${lo}..${hi}]. Ask about the middle one, <b>${mid}</b>.`)
          const g = guess(mid)
          line(5, `guess(${mid}) replies <b>${g}</b> (${g === 0 ? "correct!" : g === -1 ? "pick is lower" : "pick is higher"}).`)
          if (g === 0) {
            mark("focus", []); mark("good", [idx(mid)])
            line(6, `Found the secret number: <b>${mid}</b>.`)
            return mid
          }
          if (g === -1) {
            line(7, `Pick < ${mid} → discard ${mid}..${hi}: hi = ${mid - 1}.`)
            for (let v = mid; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = mid - 1
          } else {
            line(8, `Pick > ${mid} → discard ${lo}..${mid}: lo = ${mid + 1}.`)
            for (let v = lo; v <= mid; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = mid + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo <= n ? idx(lo) : -1); ptr("hi", hi >= 1 ? idx(hi) : -1)
          vars({ lo, hi })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)) : [])
        }
        line(10, `Unreachable when guess() is honest — the pick is always found.`)
        return -1
      },
      1,
    )
    return go()
  },
}
