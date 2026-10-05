import type { SolutionDef } from "@/engine/types"

// The array view shows the CANDIDATE row counts 1..n — the answer space.
export const arrangingCoins: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(1, a.n as number) }, (_, i) => i + 1),
  code: `// largest k with 1+2+...+k = k(k+1)/2 <= n coins
function arrangeCoins(n) {
  let lo = 1, hi = n, ans = 0;
  while (lo <= hi) {
    const k = (lo + hi) >> 1;
    const need = k * (k + 1) / 2;  // coins for k full rows
    if (need <= n) {
      ans = k;                     // k rows fit — try more
      lo = k + 1;
    } else {
      hi = k - 1;                  // too many rows
    }
  }
  return ans;
}`,
  codeJava: `// largest k with 1+2+...+k = k(k+1)/2 <= n coins
int arrangeCoins(int n) {
  long lo = 1, hi = n, ans = 0;
  while (lo <= hi) {
    long k = (lo + hi) / 2;
    long need = k * (k + 1) / 2;   // coins for k full rows
    if (need <= n) {
      ans = k;                     // k rows fit — try more
      lo = k + 1;
    } else {
      hi = k - 1;                  // too many rows
    }
  }
  return (int) ans;
}`,
  inputs: [{ kind: "number", name: "n", label: "n coins", default: 12, min: 1, max: 60 }],
  entry: (a) => `arrangeCoins(${a.n})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const n = Math.max(1, args.n as number)
    const idx = (v: number) => v - 1
    const go = fn(
      "arrangeCoins",
      (): number => {
        narrate(`Staircase row k holds k coins. The cells are the <b>candidate numbers of complete rows 1..${n}</b>.`)
        let lo = 1, hi = n, ans = 0
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, n, ans })
        mark("window", Array.from({ length: n }, (_, i) => i))
        line(2, `k complete rows need k(k+1)/2 coins — monotonic in k, so binary search k in [1..${n}].`)
        while (lo <= hi) {
          const k = (lo + hi) >> 1
          const need = (k * (k + 1)) / 2
          ptr("mid", idx(k)); vars({ lo, hi, k, need, n })
          mark("focus", [idx(k)])
          line(5, `Guess k = <b>${k}</b> rows → needs ${k}·${k + 1}/2 = <b>${need}</b> coins vs n = ${n}.`)
          if (need <= n) {
            ans = k
            line(7, `${need} ≤ ${n} → ${k} full rows fit (ans = <b>${k}</b>). Smaller counts are now pointless — try more rows.`)
            for (let v = lo; v <= k; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = k + 1
          } else {
            line(10, `${need} > ${n} → not enough coins for ${k} rows (or any more). Discard ${k}..${hi}.`)
            for (let v = k; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = k - 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo <= n ? idx(lo) : -1); ptr("hi", hi >= 1 ? idx(hi) : -1)
          vars({ lo, hi, ans })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)) : [])
        }
        ptr("mid", -1)
        if (ans >= 1) mark("good", [idx(ans)])
        line(13, `Search done: <b>${ans}</b> complete rows use ${(ans * (ans + 1)) / 2} coins, leaving ${n - (ans * (ans + 1)) / 2} for the unfinished row.`)
        return ans
      },
      1,
    )
    return go()
  },
}
