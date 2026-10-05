import type { SolutionDef } from "@/engine/types"

type Head = { val: number; L: number; idx: number }

const sortedLists = (a: Record<string, unknown>): number[][] =>
  [a.l1, a.l2, a.l3].map((x) => [...(x as number[])].sort((p, q) => p - q))

export const mergeKSortedLists: SolutionDef = {
  view: "array",
  // the 3 lists shown as one row of cells, separated by "|"
  array: (a) => {
    const [l1, l2, l3] = sortedLists(a)
    return [...l1, "|", ...l2, "|", ...l3]
  },
  code: `// the heap holds one head per list — pop the global min, push its successor
function mergeKLists(lists) {
  const heap = new MinHeap(), merged = [];
  for (let L = 0; L < lists.length; L++)
    if (lists[L].length > 0)
      heap.push([lists[L][0], L, 0]);    // each list's head
  while (heap.size() > 0) {
    const [val, L, idx] = heap.pop();    // smallest head anywhere
    merged.push(val);
    if (idx + 1 < lists[L].length)
      heap.push([lists[L][idx + 1], L, idx + 1]);
  }
  return merged;
}`,
  codeJava: `// the heap holds one head per list — pop the global min, push its successor
List<Integer> mergeKLists(int[][] lists) {
  PriorityQueue<int[]> heap = minByValue(); List<Integer> merged = new ArrayList<>();
  for (int L = 0; L < lists.length; L++)
    if (lists[L].length > 0)
      heap.offer(new int[]{lists[L][0], L, 0});   // each list's head
  while (!heap.isEmpty()) {
    int[] t = heap.poll();               // smallest head anywhere
    merged.add(t[0]);
    if (t[2] + 1 < lists[t[1]].length)
      heap.offer(new int[]{lists[t[1]][t[2] + 1], t[1], t[2] + 1});
  }
  return merged;
}`,
  inputs: [
    { kind: "numbers", name: "l1", label: "sorted list 1", default: [1, 4, 7], maxLen: 3 },
    { kind: "numbers", name: "l2", label: "sorted list 2", default: [2, 5], maxLen: 3 },
    { kind: "numbers", name: "l3", label: "sorted list 3", default: [3, 6, 8], maxLen: 3 },
  ],
  entry: () => `mergeKLists([l1, l2, l3])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const lists = sortedLists(args) // inputs are sorted defensively; the view shows the same
    const off = [0, lists[0].length + 1, lists[0].length + lists[1].length + 2]
    const go = fn(
      "mergeKLists",
      (): string => {
        const h: Head[] = []
        const merged: number[] = []
        const done: number[] = []
        const snap = () => heap("minHeap", h.map((e) => `${e.val} (list ${e.L + 1})`))
        const push = (val: number, L: number, idx: number, ln: number) => {
          let p = 0
          while (p < h.length && h[p].val <= val) p++
          h.splice(p, 0, { val, L, idx })
          snap()
          line(ln, `Push <b>${val}</b> (list ${L + 1}'s new head) — it sifts to slot ${p} of the min-heap (kept as an array sorted smallest-first, matching a real heap's order).`)
        }
        heap("merged", merged)
        for (let L = 0; L < lists.length; L++) {
          if (lists[L].length > 0) {
            ptr(`p${L + 1}`, off[L])
            push(lists[L][0], L, 0, 5)
          } else {
            line(4, `List ${L + 1} is empty — it contributes no head.`)
          }
        }
        while (h.length > 0) {
          const t = h.shift() as Head
          snap()
          mark("focus", [off[t.L] + t.idx])
          line(7, `Pop <b>${t.val}</b> from list ${t.L + 1} — the smallest of the ${h.length + 1} competing heads, so it must come next globally.`)
          merged.push(t.val)
          heap("merged", [...merged])
          vars({ merged: merged.length, "in heap": h.length })
          line(8, `Append ${t.val} to merged → [${merged.join(", ")}].`)
          done.push(off[t.L] + t.idx)
          mark("done", [...done])
          if (t.idx + 1 < lists[t.L].length) {
            ptr(`p${t.L + 1}`, off[t.L] + t.idx + 1)
            push(lists[t.L][t.idx + 1], t.L, t.idx + 1, 10)
          } else {
            ptr(`p${t.L + 1}`, -1)
            line(9, `List ${t.L + 1} is exhausted — nothing replaces ${t.val} in the heap.`)
          }
        }
        mark("focus", [])
        line(12, `Heap empty → all lists consumed. Merged result: [${merged.join(", ")}].`)
        return JSON.stringify(merged)
      },
      1,
    )
    narrate(`Only the k current heads can be the next-smallest value — a min-heap of size ≤ ${lists.filter((l) => l.length).length} picks the winner each round.`)
    return go()
  },
}
