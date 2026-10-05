import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): [number, number][] => {
  const n1 = (a.nums1 as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const n2 = (a.nums2 as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const n = Math.min(n1.length, n2.length)
  const pairs: [number, number][] = []
  for (let i = 0; i < n; i++) pairs.push([n2[i], n1[i]]) // (multiplier, value)
  if (!pairs.length) pairs.push([4, 1], [7, 3], [2, 3], [1, 2])
  pairs.sort((x, y) => y[0] - x[0])
  return pairs
}

export const maximumSubsequenceScore: SolutionDef = {
  code: `// anchor the minimum: scan multipliers from high to low
function maxScore(nums1, nums2, k) {
  const pairs = nums2.map((m, i) => [m, nums1[i]]);
  pairs.sort((a, b) => b[0] - a[0]);  // multiplier high → low
  const pq = new MinHeap();           // the k values we keep
  let sum = 0, best = 0;
  for (const [mult, val] of pairs) {
    pq.push(val); sum += val;         // take this value
    if (pq.size() > k)
      sum -= pq.pop();                // evict the smallest value
    if (pq.size() === k)
      best = Math.max(best, sum * mult);
  }
  return best;
}`,
  codeJava: `// anchor the minimum: scan multipliers from high to low
long maxScore(int[] nums1, int[] nums2, int k) {
  Integer[] idx = sortIndexDesc(nums2);  // pairs (mult, value)
  // multiplier high → low
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  long sum = 0, best = 0;
  for (int j : idx) {
    pq.offer(nums1[j]); sum += nums1[j];  // take this value
    if (pq.size() > k)
      sum -= pq.poll();                // evict the smallest value
    if (pq.size() == k)
      best = Math.max(best, sum * nums2[j]);
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "nums1", label: "nums1 (values)", default: [1, 3, 3, 2], maxLen: 8 },
    { kind: "numbers", name: "nums2", label: "nums2 (multipliers)", default: [2, 4, 6, 3], maxLen: 8 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 8 },
  ],
  entry: (a) => `maxScore(nums1, nums2, ${a.k})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const pairs = build(args)
    const k = Math.max(1, Math.min(pairs.length, Math.trunc(args.k as number)))
    const go = fn(
      "maxScore",
      (): number => {
        line(3, `Sort by multiplier, high → low: ${pairs.map(([m, v]) => `(×${m}, val ${v})`).join(" ")}. Trick: score = (sum of values) × (<b>min</b> multiplier) — so decide the minimum first.`)
        // min-heap simulated as an array sorted ASCENDING
        const pq: number[] = []
        heap("pq", [])
        let sum = 0
        let best = 0
        for (const [mult, val] of pairs) {
          let p = 0
          while (p < pq.length && pq[p] <= val) p++
          pq.splice(p, 0, val)
          sum += val
          heap("pq", [...pq])
          line(7, `Take (×${mult}, val ${val}): if ×${mult} is the chosen <b>minimum</b> multiplier, every earlier pair (all with multiplier ≥ ${mult}) is fair game. sum = <b>${sum}</b>.`)
          if (pq.length > k) {
            const out = pq.shift() as number
            sum -= out
            heap("pq", [...pq])
            line(9, `More than k = ${k} values kept → evict the smallest, <b>${out}</b> → sum = <b>${sum}</b>. The heap always holds the k best values available.`)
          }
          if (pq.length === k) {
            const score = sum * mult
            if (score > best) {
              best = score
              heap("output", [`best = ${sum} × ${mult} = ${best}`])
              line(11, `Score with min-multiplier ×${mult}: ${sum} × ${mult} = <b>${score}</b> — <b>new best!</b>`)
            } else {
              line(11, `Score with min-multiplier ×${mult}: ${sum} × ${mult} = ${score} — not better than ${best}.`)
            }
            vars({ sum, mult, best })
          }
        }
        line(13, `Every pair had its turn as "the minimum multiplier". Maximum score: <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("Fix the pair whose nums2 will be the minimum, then the best companions are simply the k−1 largest nums1 values seen so far — a size-k min-heap maintains them.")
    return go()
  },
}
