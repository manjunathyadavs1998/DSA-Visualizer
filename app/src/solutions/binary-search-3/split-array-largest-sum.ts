import type { SolutionDef } from "@/engine/types"

const cleanN = (xs: number[]) => {
  const v = xs.map((x) => Math.min(12, Math.max(1, Math.round(x))))
  return v.length ? v : [7, 2, 5, 10, 8]
}

// The array view shows the CANDIDATE "largest part sums" max..total — the answer space.
export const splitArrayLargestSum: SolutionDef = {
  view: "array",
  array: (a) => {
    const v = cleanN(a.nums as number[])
    const lo = Math.max(...v), hi = v.reduce((s, x) => s + x, 0)
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
  },
  code: `// split nums into k parts minimizing the largest part-sum
function splitArray(nums, k) {
  let lo = Math.max(...nums);            // one element per part
  let hi = nums.reduce((a, b) => a + b, 0);   // no split at all
  while (lo < hi) {
    const cap = (lo + hi) >> 1;          // candidate largest sum
    if (pieces(nums, cap) <= k) hi = cap;    // few enough parts
    else lo = cap + 1;                       // too many parts
  }
  return lo;
}
function pieces(nums, cap) {   // greedy: cut when sum would exceed cap
  let count = 1, sum = 0;
  for (const x of nums) {
    if (sum + x > cap) { count++; sum = 0; }
    sum += x;
  }
  return count;
}`,
  codeJava: `// split nums into k parts minimizing the largest part-sum
int splitArray(int[] nums, int k) {
  int lo = Arrays.stream(nums).max().getAsInt();
  int hi = Arrays.stream(nums).sum();         // no split at all
  while (lo < hi) {
    int cap = (lo + hi) / 2;             // candidate largest sum
    if (pieces(nums, cap) <= k) hi = cap;    // few enough parts
    else lo = cap + 1;                       // too many parts
  }
  return lo;
}
int pieces(int[] nums, int cap) { // greedy: cut when sum would exceed cap
  int count = 1, sum = 0;
  for (int x : nums) {
    if (sum + x > cap) { count++; sum = 0; }
    sum += x;
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [7, 2, 5, 10, 8], maxLen: 10 },
    { kind: "number", name: "k", label: "k parts", default: 2, min: 1, max: 10 },
  ],
  entry: (a) => `splitArray(nums, ${a.k})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = cleanN(args.nums as number[])
    const k = Math.min(nums.length, Math.max(1, args.k as number))
    const minCap = Math.max(...nums)
    const total = nums.reduce((s, x) => s + x, 0)
    const idx = (v: number) => v - minCap
    const pieces = fn(
      "pieces",
      (cap: number): number => {
        let count = 1, sum = 0
        vars({ cap, count, sum })
        line(12, `Greedy check for cap ${cap}: stuff elements into the current part; cut just before the sum would exceed ${cap}.`)
        for (const x of nums) {
          if (sum + x > cap) {
            count++
            line(14, `${sum} + ${x} > ${cap} → <b>cut here</b>; part ${count} begins.`)
            sum = 0
          }
          sum += x
          vars({ cap, count, sum })
          line(15, `Add ${x} → part ${count} sums to <b>${sum}</b>/${cap}.`)
        }
        line(17, `Cap ${cap} forces <b>${count}</b> part(s).`)
        return count
      },
      11,
    )
    const go = fn(
      "splitArray",
      (): number => {
        narrate(`nums: [${nums.join(", ")}], k = ${k}. The cells are the <b>candidate answers ${minCap}..${total}</b> (the largest part-sum we tolerate). Looser caps need fewer parts → monotonic → binary search the cap.`)
        let lo = minCap, hi = total
        const gone: number[] = []
        ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, k })
        mark("window", Array.from({ length: total - minCap + 1 }, (_, i) => i))
        line(2, `Cap can't be below the largest element ${minCap}; cap = ${total} means one giant part.`)
        while (lo < hi) {
          const cap = (lo + hi) >> 1
          ptr("mid", idx(cap)); vars({ lo, hi, cap, k })
          mark("focus", [idx(cap)])
          line(5, `Guess cap = <b>${cap}</b> — how many parts does the greedy cutter need?`)
          const c = pieces(cap)
          if (c <= k) {
            line(6, `${c} ≤ ${k} → cap ${cap} is <b>achievable</b> (merging parts never raises the count). Looser caps are useless — hi = ${cap}.`)
            for (let v = cap + 1; v <= hi; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            hi = cap
          } else {
            line(7, `${c} > ${k} → cap ${cap} is <b>too tight</b>, it shatters the array into ${c} parts. Discard ${lo}..${cap}: lo = ${cap + 1}.`)
            for (let v = lo; v <= cap; v++) if (!gone.includes(idx(v))) gone.push(idx(v))
            lo = cap + 1
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", idx(lo)); ptr("hi", idx(hi)); vars({ lo, hi, k })
          mark("window", Array.from({ length: hi - lo + 1 }, (_, i) => idx(lo + i)))
        }
        ptr("mid", -1); mark("window", [])
        mark("good", [idx(lo)])
        line(9, `The smallest achievable "largest part-sum" with ${k} part(s) is <b>${lo}</b>.`)
        return lo
      },
      1,
    )
    return go()
  },
}
