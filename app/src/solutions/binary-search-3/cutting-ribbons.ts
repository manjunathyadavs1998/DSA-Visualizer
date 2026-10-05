import type { SolutionDef } from "@/engine/types"

const cleanR = (xs: number[]) => {
  const v = xs.map((x) => Math.min(14, Math.max(1, Math.round(x))))
  return v.length ? v : [9, 7, 5]
}

// The array view shows the CANDIDATE LENGTHS 1..max(ribbons) — the answer space.
export const cuttingRibbons: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(...cleanR(a.ribbons as number[])) }, (_, i) => i + 1),
  code: `// longest equal piece-length that yields at least k pieces
function maxLength(ribbons, k) {
  let lo = 1, hi = Math.max(...ribbons), ans = 0;
  while (lo <= hi) {
    const len = (lo + hi) >> 1;
    if (pieces(ribbons, len) >= k) {
      ans = len;      // len works — try longer
      lo = len + 1;
    } else {
      hi = len - 1;   // too long — not enough pieces
    }
  }
  return ans;         // 0 if even length 1 can't give k pieces
}
function pieces(ribbons, len) {
  let c = 0;
  for (const r of ribbons) c += Math.floor(r / len);
  return c;
}`,
  codeJava: `// longest equal piece-length that yields at least k pieces
int maxLength(int[] ribbons, int k) {
  int lo = 1, hi = Arrays.stream(ribbons).max().getAsInt(), ans = 0;
  while (lo <= hi) {
    int len = (lo + hi) / 2;
    if (pieces(ribbons, len) >= k) {
      ans = len;      // len works — try longer
      lo = len + 1;
    } else {
      hi = len - 1;   // too long — not enough pieces
    }
  }
  return ans;         // 0 if even length 1 can't give k pieces
}
int pieces(int[] ribbons, int len) {
  int c = 0;
  for (int r : ribbons) c += r / len;
  return c;
}`,
  inputs: [
    { kind: "numbers", name: "ribbons", label: "ribbon lengths", default: [9, 7, 5], maxLen: 10 },
    { kind: "number", name: "k", label: "k pieces", default: 3, min: 1, max: 40 },
  ],
  entry: (a) => `maxLength(ribbons, ${a.k})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const ribbons = cleanR(args.ribbons as number[])
    const k = Math.max(1, args.k as number)
    const maxR = Math.max(...ribbons)
    const idx = (v: number) => v - 1
    const pieces = fn(
      "pieces",
      (len: number): number => {
        let c = 0
        vars({ len, c })
        line(15, `Cutting to length ${len}: each ribbon r yields ⌊r/${len}⌋ pieces (leftover is wasted).`)
        for (const r of ribbons) {
          c += Math.floor(r / len)
          vars({ len, r, "⌊r/len⌋": Math.floor(r / len), c })
          line(16, `Ribbon ${r} → ⌊${r}/${len}⌋ = ${Math.floor(r / len)} piece(s) → total = <b>${c}</b>.`)
        }
        line(17, `Length ${len} produces <b>${c}</b> piece(s).`)
        return c
      },
      14,
    )
    const go = fn(
      "maxLength",
      (): number => {
        narrate(`Ribbons: [${ribbons.join(", ")}], need ${k} equal pieces. The cells are the <b>candidate lengths 1..${maxR}</b>. Shorter pieces always give more of them → monotonic → binary search the length.`)
        let lo = 1, hi = maxR, ans = 0
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, k, ans })
        mark("window", Array.from({ length: maxR }, (_, i) => i))
        line(2, `A piece can't be longer than the longest ribbon ${maxR}; start with [1..${maxR}].`)
        while (lo <= hi) {
          const len = (lo + hi) >> 1
          ptr("mid", idx(len)); vars({ lo, hi, len, k, ans })
          mark("focus", [idx(len)])
          line(4, `Guess piece length <b>${len}</b>.`)
          const c = pieces(len)
          if (c >= k) {
            ans = len
            line(6, `${c} ≥ ${k} → length ${len} <b>works</b>; remember ans = ${len} and discard all shorter candidates — we're maximizing.`)
            for (let v = lo; v <= len; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = len + 1
          } else {
            line(9, `${c} < ${k} → length ${len} is <b>too greedy</b>, and longer is worse. Discard ${len}..${hi}.`)
            for (let v = len; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = len - 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo <= maxR ? idx(lo) : -1); ptr("hi", hi >= 1 ? idx(hi) : -1)
          vars({ lo, hi, ans })
          mark("window", lo <= hi ? Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)) : [])
        }
        ptr("mid", -1)
        if (ans >= 1) mark("good", [idx(ans)])
        line(12, ans > 0
          ? `Longest length giving ≥ ${k} pieces: <b>${ans}</b>.`
          : `Even length 1 yields fewer than ${k} pieces → return <b>0</b>.`)
        return ans
      },
      1,
    )
    return go()
  },
}
