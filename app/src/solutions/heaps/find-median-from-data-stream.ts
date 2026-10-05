import type { SolutionDef } from "@/engine/types"

export const findMedianFromDataStream: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// lo (max-heap) holds the small half, hi (min-heap) the large half
function medianStream(nums) {
  const lo = new MaxHeap(), hi = new MinHeap();
  const medians = [];
  for (const x of nums) {
    lo.push(x);                      // 1) always enter lo
    hi.push(lo.pop());               // 2) lo's max crosses to hi
    if (hi.size() > lo.size())
      lo.push(hi.pop());             // 3) rebalance: lo keeps the extra
    medians.push(lo.size() > hi.size()
      ? lo.top() : (lo.top() + hi.top()) / 2);
  }
  return medians;
}`,
  codeJava: `// lo (max-heap) holds the small half, hi (min-heap) the large half
List<Double> medianStream(int[] nums) {
  PriorityQueue<Integer> lo = maxHeap(); PriorityQueue<Integer> hi = minHeap();
  List<Double> medians = new ArrayList<>();
  for (int x : nums) {
    lo.offer(x);                     // 1) always enter lo
    hi.offer(lo.poll());             // 2) lo's max crosses to hi
    if (hi.size() > lo.size())
      lo.offer(hi.poll());           // 3) rebalance: lo keeps the extra
    medians.add(lo.size() > hi.size()
      ? (double) lo.peek() : (lo.peek() + hi.peek()) / 2.0);
  }
  return medians;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "stream (arrives one by one)", default: [5, 15, 1, 3, 8, 7], maxLen: 8 }],
  entry: () => `medianStream(nums)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "medianStream",
      (): string => {
        // lo is kept sorted largest-first (lo[0] = its max), hi sorted smallest-first (hi[0] = its min)
        const lo: number[] = []
        const hi: number[] = []
        const medians: number[] = []
        const done: number[] = []
        const insertDesc = (arr: number[], v: number) => {
          let p = 0
          while (p < arr.length && arr[p] > v) p++
          arr.splice(p, 0, v)
          return p
        }
        const insertAsc = (arr: number[], v: number) => {
          let p = 0
          while (p < arr.length && arr[p] < v) p++
          arr.splice(p, 0, v)
          return p
        }
        heap("lo", lo)
        heap("hi", hi)
        line(2, `Two empty heaps (each shown as a sorted array with its root first — the ordering a real heap keeps). Invariant: every value in <b>lo ≤ every value in hi</b>, and their sizes differ by at most 1.`)
        for (let idx = 0; idx < nums.length; idx++) {
          const x = nums[idx]
          ptr("i", idx)
          mark("focus", [idx])
          const p = insertDesc(lo, x)
          heap("lo", lo)
          line(5, `x = <b>${x}</b> arrives and always enters <b>lo</b> first — it sifts to slot ${p}. lo = [${lo.join(", ")}].`)
          const mv = lo.shift() as number
          insertAsc(hi, mv)
          heap("lo", lo)
          heap("hi", hi)
          line(6, `lo's max <b>${mv}</b> crosses over to hi. This one push-then-move guarantees lo ≤ hi even if ${x} really belonged in hi.`)
          if (hi.length > lo.length) {
            const back = hi.shift() as number
            insertDesc(lo, back)
            heap("hi", hi)
            heap("lo", lo)
            line(8, `hi (${hi.length + 1}) outgrew lo (${lo.length - 1}) — hi's min <b>${back}</b> comes back, so lo holds the extra element on odd counts.`)
          }
          const median = lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2
          medians.push(median)
          vars({ x, median, "lo size": lo.length, "hi size": hi.length })
          if (lo.length > hi.length) {
            line(9, `${lo.length + hi.length} values (odd) → the median is lo's root: <b>${median}</b>.`)
          } else {
            line(10, `${lo.length + hi.length} values (even) → median = (lo.top + hi.top) / 2 = (${lo[0]} + ${hi[0]}) / 2 = <b>${median}</b>.`)
          }
          done.push(idx)
          mark("done", [...done])
        }
        ptr("i", -1)
        mark("focus", [])
        line(12, `Stream finished — medians after each arrival: [${medians.join(", ")}].`)
        return JSON.stringify(medians)
      },
      1,
    )
    narrate(`The median is where the sorted stream splits in half — so keep the two halves as heaps whose roots touch at the split.`)
    return go()
  },
}
