import type { SolutionDef } from "@/engine/types"

type Entry = { c: number; val: string }

export const topKFrequentElements: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// phase 1: count into a map; phase 2: size-k min-heap keeps the k best
function topKFrequent(nums, k) {
  for (let i = 0; i < nums.length; i++)
    count[nums[i]] = (count[nums[i]] || 0) + 1;
  const heap = new MinHeap();            // ordered by count
  for (const val in count) {
    heap.push([count[val], val]);
    if (heap.size() > k)
      heap.pop();                        // evict the rarest
  }
  return heap.map(([c, val]) => val);
}`,
  codeJava: `// phase 1: count into a map; phase 2: size-k min-heap keeps the k best
List<Integer> topKFrequent(int[] nums, int k) {
  for (int i = 0; i < nums.length; i++)
    count.merge(nums[i], 1, Integer::sum);
  PriorityQueue<int[]> heap = minByCount(); // ordered by count
  for (int val : count.keySet()) {
    heap.offer(new int[]{count.get(val), val});
    if (heap.size() > k)
      heap.poll();                       // evict the rarest
  }
  return heap.stream().map(t -> t[1]).toList();
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 1, 1, 2, 2, 2, 2, 3, 5, 5], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 2, min: 1, max: 5 },
  ],
  entry: (a) => `topKFrequent(nums, ${a.k})`,
  run({ fn, memo, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const k = args.k as number
    const go = fn(
      "topKFrequent",
      (): string => {
        const order: string[] = [] // distinct values in first-seen order
        const done: number[] = []
        for (let i = 0; i < nums.length; i++) {
          const key = String(nums[i])
          ptr("i", i)
          mark("focus", [i])
          const prev = (memo[key] as number | undefined) ?? 0
          if (prev === 0) order.push(key)
          memo[key] = prev + 1
          line(3, `count[${key}] = ${prev} + 1 = <b>${prev + 1}</b> — the frequency map is the memo table above.`)
          done.push(i)
          mark("done", [...done])
        }
        ptr("i", -1)
        mark("focus", [])
        const h: Entry[] = []
        const snap = () => heap("minHeap", h.map((e) => `value ${e.val} (count ${e.c})`))
        snap()
        line(4, `Phase 2: a min-heap ordered by <b>count</b> (kept as an array sorted rarest-first, mirroring a real heap), capped at k = ${k}. Its root is always the rarest survivor.`)
        for (const val of order) {
          const c = memo[val] as number
          let p = 0
          while (p < h.length && h[p].c <= c) p++
          h.splice(p, 0, { c, val })
          snap()
          vars({ "heap size": h.length, k })
          line(6, `push (count ${c}, value ${val}) — it sifts to slot ${p}.`)
          if (h.length > k) {
            const out = h.shift() as Entry
            snap()
            line(8, `Heap over capacity → evict the root (count ${out.c}, value ${out.val}): the rarest survivor can never be in the top ${k}.`)
          }
        }
        const ans = h.map((e) => Number(e.val))
        line(10, `The ${h.length} survivors are the answer: values [${ans.join(", ")}] with counts [${h.map((e) => e.c).join(", ")}].`)
        return JSON.stringify(ans)
      },
      1,
    )
    narrate(`Two phases: the memo table becomes the frequency map, then a size-${k} min-heap evicts rare values one by one.`)
    return go()
  },
}
