import type { SolutionDef } from "@/engine/types"

export const kthLargestElementInAnArray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// min-heap of size k — its root is the k-th largest so far
function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (let i = 0; i < nums.length; i++) {
    heap.push(nums[i]);           // sift up
    if (heap.size() > k)
      heap.pop();                 // evict the smallest
  }
  return heap.top();              // k-th largest
}`,
  codeJava: `// min-heap of size k — its root is the k-th largest so far
int findKthLargest(int[] nums, int k) {
  PriorityQueue<Integer> heap = new PriorityQueue<>();
  for (int i = 0; i < nums.length; i++) {
    heap.offer(nums[i]);          // sift up
    if (heap.size() > k)
      heap.poll();                // evict the smallest
  }
  return heap.peek();             // k-th largest
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [3, 2, 1, 5, 6, 4], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 2, min: 1, max: 10 },
  ],
  entry: (a) => `findKthLargest(nums, ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const k = args.k as number
    const go = fn(
      "findKthLargest",
      (): number => {
        const h: number[] = []
        const done: number[] = []
        heap("minHeap", h)
        line(2, `Start with an empty min-heap (we keep it as a <b>sorted array, smallest first</b> — the same order a real heap maintains). It will hold only the <b>${k} largest values seen so far</b>; its root is the smallest of those.`)
        for (let i = 0; i < nums.length; i++) {
          const v = nums[i]
          ptr("i", i)
          mark("focus", [i])
          let p = 0
          while (p < h.length && h[p] < v) p++
          h.splice(p, 0, v)
          heap("minHeap", h)
          vars({ i, "heap size": h.length })
          line(4, `push(<b>${v}</b>): it sifts up past ${p} smaller value(s) and settles at slot ${p}. Heap: [${h.join(", ")}].`)
          if (h.length > k) {
            line(5, `The heap now holds ${h.length} values — more than k = ${k}, so one must go.`)
            const out = h.shift() as number
            heap("minHeap", h)
            line(6, `Evict the root <b>${out}</b>: with ${k} values above it, ${out} can never be the ${k}-th largest. New root: ${h[0]}.`)
          }
          done.push(i)
          mark("done", [...done])
        }
        ptr("i", -1)
        mark("focus", [])
        const ansIdx = nums.indexOf(h[0])
        if (ansIdx >= 0) mark("good", [ansIdx])
        vars({ answer: h[0] })
        line(8, `Every number has been offered to the heap. The survivors are exactly the ${h.length} largest, and the root <b>${h[0]}</b> is the ${k}-th largest.`)
        return h[0]
      },
      1,
    )
    narrate(`Keep a min-heap of size ${k}: anything smaller than its root is provably not the answer, so evictions are always safe.`)
    return go()
  },
}
