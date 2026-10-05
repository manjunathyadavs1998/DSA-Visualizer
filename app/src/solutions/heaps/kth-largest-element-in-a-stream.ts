import type { SolutionDef } from "@/engine/types"

export const kthLargestElementInAStream: SolutionDef = {
  view: "array",
  array: (a) => a.stream as number[],
  code: `// keep only the k largest ever seen — the min-heap root is the k-th largest
function kthLargestStream(k, stream) {
  const heap = new MinHeap(); let kth = null;
  for (let i = 0; i < stream.length; i++) {
    heap.push(stream[i]);        // add(val): sift up
    if (heap.size() > k)
      heap.pop();                // evict — too small to matter
    kth = heap.size() === k ? heap.top() : null;
  }
  return kth;
}`,
  codeJava: `// keep only the k largest ever seen — the min-heap root is the k-th largest
Integer kthLargestStream(int k, int[] stream) {
  PriorityQueue<Integer> heap = new PriorityQueue<>(); Integer kth = null;
  for (int i = 0; i < stream.length; i++) {
    heap.offer(stream[i]);       // add(val): sift up
    if (heap.size() > k)
      heap.poll();               // evict — too small to matter
    kth = heap.size() == k ? heap.peek() : null;
  }
  return kth;
}`,
  inputs: [
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 8 },
    { kind: "numbers", name: "stream", label: "stream (added one by one)", default: [4, 5, 8, 2, 3, 5, 10, 9], maxLen: 10 },
  ],
  entry: (a) => `kthLargestStream(${a.k}, stream)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const k = args.k as number
    const stream = args.stream as number[]
    const go = fn(
      "kthLargestStream",
      (): number | null => {
        const h: number[] = []
        const done: number[] = []
        let kth: number | null = null
        heap("minHeap", h)
        line(2, `Empty min-heap (we keep it as a <b>sorted array, smallest first</b> — the exact order a heap maintains). It will never hold more than the <b>${k} largest</b> numbers seen.`)
        for (let i = 0; i < stream.length; i++) {
          const v = stream[i]
          ptr("i", i)
          mark("focus", [i])
          let p = 0
          while (p < h.length && h[p] < v) p++
          h.splice(p, 0, v)
          heap("minHeap", h)
          line(4, `add(<b>${v}</b>): it sifts up past ${p} smaller value(s) into slot ${p}. Heap: [${h.join(", ")}].`)
          if (h.length > k) {
            const out = h.shift() as number
            heap("minHeap", h)
            line(6, `Size ${h.length + 1} > k = ${k} → evict the root <b>${out}</b>: with ${k} numbers above it, it can never be the ${k}-th largest again.`)
          }
          kth = h.length === k ? h[0] : null
          vars({ added: v, kth: kth ?? `need ${k - h.length} more` })
          line(7, kth === null
            ? `Only ${h.length} number(s) so far — there is no ${k}-th largest yet.`
            : `The heap root <b>${kth}</b> is the ${k}-th largest of everything streamed so far.`)
          done.push(i)
          mark("done", [...done])
        }
        ptr("i", -1)
        mark("focus", [])
        line(9, `Stream finished — the ${k}-th largest is <b>${kth}</b>, always sitting at the heap root in O(log k) per add.`)
        return kth
      },
      1,
    )
    narrate(`Same trick as the array version, but online: after every add the answer is just heap.top() — no re-sorting.`)
    return go()
  },
}
