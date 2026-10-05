import type { SolutionDef } from "@/engine/types"

const cleanN = (xs: number[]) => {
  const v = xs.map((x) => Math.min(14, Math.max(1, Math.round(x))))
  return v.length ? v : [1, 2, 5, 9]
}

// The array view shows the CANDIDATE DIVISORS 1..max(nums) — the answer space.
export const smallestDivisor: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: Math.max(...cleanN(a.nums as number[])) }, (_, i) => i + 1),
  code: `// smallest divisor d with sum(ceil(x / d)) <= threshold
function smallestDivisor(nums, threshold) {
  let lo = 1, hi = Math.max(...nums);  // d > max never helps
  while (lo < hi) {
    const d = (lo + hi) >> 1;
    if (divSum(nums, d) <= threshold) hi = d; // fits — try smaller
    else lo = d + 1;                          // too big — divisor up
  }
  return lo;
}
function divSum(nums, d) {
  let s = 0;
  for (const x of nums) s += Math.ceil(x / d);
  return s;
}`,
  codeJava: `// smallest divisor d with sum(ceil(x / d)) <= threshold
int smallestDivisor(int[] nums, int threshold) {
  int lo = 1, hi = Arrays.stream(nums).max().getAsInt();
  while (lo < hi) {
    int d = (lo + hi) / 2;
    if (divSum(nums, d) <= threshold) hi = d; // fits — try smaller
    else lo = d + 1;                          // too big — divisor up
  }
  return lo;
}
int divSum(int[] nums, int d) {
  int s = 0;
  for (int x : nums) s += (x + d - 1) / d;
  return s;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 5, 9], maxLen: 10 },
    { kind: "number", name: "threshold", label: "threshold", default: 6, min: 1, max: 60 },
  ],
  entry: (a) => `smallestDivisor(nums, ${a.threshold})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = cleanN(args.nums as number[])
    const threshold = Math.max(nums.length, args.threshold as number) // sum is ≥ n even with d = max
    const maxN = Math.max(...nums)
    const idx = (v: number) => v - 1
    const divSum = fn(
      "divSum",
      (d: number): number => {
        let s = 0
        vars({ d, s })
        line(11, `Evaluate divisor ${d}: every element contributes ⌈x/${d}⌉ (division rounded UP).`)
        for (const x of nums) {
          s += Math.ceil(x / d)
          vars({ d, x, "⌈x/d⌉": Math.ceil(x / d), s })
          line(12, `⌈${x}/${d}⌉ = ${Math.ceil(x / d)} → running sum = <b>${s}</b>.`)
        }
        line(13, `Divisor ${d} gives total <b>${s}</b>.`)
        return s
      },
      10,
    )
    const go = fn(
      "smallestDivisor",
      (): number => {
        narrate(`nums: [${nums.join(", ")}]. The cells are the <b>candidate divisors 1..${maxN}</b>. A bigger divisor never increases the sum → monotonic → binary search the divisor.`)
        let lo = 1, hi = maxN
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, threshold })
        mark("window", Array.from({ length: maxN }, (_, i) => i))
        line(2, `Beyond d = ${maxN} every term is already 1, so searching past the max element is pointless.`)
        while (lo < hi) {
          const d = (lo + hi) >> 1
          ptr("mid", idx(d)); vars({ lo, hi, d, threshold })
          mark("focus", [idx(d)])
          line(4, `Guess divisor d = <b>${d}</b>.`)
          const s = divSum(d)
          if (s <= threshold) {
            line(5, `${s} ≤ ${threshold} → d = ${d} <b>fits</b>; larger divisors are no better answers. hi = ${d}.`)
            for (let v = d + 1; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = d
          } else {
            line(6, `${s} > ${threshold} → d = ${d} is <b>too small</b> (sum too big), and smaller d only grows it. lo = ${d + 1}.`)
            for (let v = lo; v <= d; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = d + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, threshold })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [idx(lo)])
        line(8, `Smallest divisor keeping the sum ≤ ${threshold}: <b>${lo}</b>.`)
        return lo
      },
      1,
    )
    return go()
  },
}
