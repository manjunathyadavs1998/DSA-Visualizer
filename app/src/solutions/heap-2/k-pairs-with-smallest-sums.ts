import type { SolutionDef } from "@/engine/types"

const arr = (a: Record<string, unknown>, key: string, fb: number[]): number[] => {
  const v = (a[key] as number[]).map(Math.trunc).sort((x, y) => x - y)
  return v.length ? v : fb
}

export const kPairsWithSmallestSums: SolutionDef = {
  code: `// best-first search over the (i, j) index grid
function kSmallestPairs(nums1, nums2, k) {
  const pq = new MinHeap();          // (sum, i, j)
  for (let i = 0; i < Math.min(k, nums1.length); i++)
    pq.push([nums1[i] + nums2[0], i, 0]);
  const ans = [];
  while (ans.length < k && !pq.isEmpty()) {
    const [sum, i, j] = pq.pop();    // smallest unexplored sum
    ans.push([nums1[i], nums2[j]]);
    if (j + 1 < nums2.length)        // unlock this row's next column
      pq.push([nums1[i] + nums2[j + 1], i, j + 1]);
  }
  return ans;
}`,
  codeJava: `// best-first search over the (i, j) index grid
List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
  for (int i = 0; i < Math.min(k, nums1.length); i++)
    pq.offer(new int[]{nums1[i] + nums2[0], i, 0});
  List<List<Integer>> ans = new ArrayList<>();
  while (ans.size() < k && !pq.isEmpty()) {
    int[] t = pq.poll();             // smallest unexplored sum
    ans.add(List.of(nums1[t[1]], nums2[t[2]]));
    if (t[2] + 1 < nums2.length)     // unlock this row's next column
      pq.offer(new int[]{nums1[t[1]] + nums2[t[2] + 1], t[1], t[2] + 1});
  }
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "nums1", label: "nums1 (sorted)", default: [1, 7, 11], maxLen: 6 },
    { kind: "numbers", name: "nums2", label: "nums2 (sorted)", default: [2, 4, 6], maxLen: 6 },
    { kind: "number", name: "k", label: "k", default: 5, min: 1, max: 12 },
  ],
  entry: (a) => `kSmallestPairs([${arr(a, "nums1", [1, 7, 11]).join(",")}], [${arr(a, "nums2", [2, 4, 6]).join(",")}], ${a.k})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const nums1 = arr(args, "nums1", [1, 7, 11])
    const nums2 = arr(args, "nums2", [2, 4, 6])
    const k = Math.max(1, Math.min(12, Math.trunc(args.k as number)))
    const show = (pq: [number, number, number][]) =>
      pq.map(([s, i, j]) => `(${nums1[i]},${nums2[j]}) Σ${s}`)
    const push = (pq: [number, number, number][], item: [number, number, number]) => {
      let p = 0
      while (p < pq.length && pq[p][0] <= item[0]) p++
      pq.splice(p, 0, item)
    }
    const go = fn(
      "kSmallestPairs",
      (): string => {
        // min-heap simulated as an array sorted by sum ASCENDING
        const pq: [number, number, number][] = []
        line(2, `Think of all pairs as a ${nums1.length}×${nums2.length} grid where row i uses nums1[${"i"}] and column j uses nums2[j] — every row is sorted left→right, every column top→bottom.`)
        for (let i = 0; i < Math.min(k, nums1.length); i++) {
          push(pq, [nums1[i] + nums2[0], i, 0])
          heap("pq", show(pq))
          line(4, `Seed row ${i}: push (${nums1[i]}, ${nums2[0]}) with sum <b>${nums1[i] + nums2[0]}</b> — each row's smallest pair uses nums2[0].`)
        }
        const ans: [number, number][] = []
        while (ans.length < k && pq.length) {
          const [sum, i, j] = pq.shift() as [number, number, number]
          heap("pq", show(pq))
          ans.push([nums1[i], nums2[j]])
          heap("output", ans.map(([x, y]) => `(${x},${y})`))
          vars({ taken: ans.length, pair: `(${nums1[i]},${nums2[j]})`, sum })
          line(8, `pop() → (<b>${nums1[i]}, ${nums2[j]}</b>) with sum <b>${sum}</b> — pair #${ans.length}. Nothing unexplored can be smaller: every candidate's row-predecessor was already popped.`)
          if (j + 1 < nums2.length) {
            push(pq, [nums1[i] + nums2[j + 1], i, j + 1])
            heap("pq", show(pq))
            line(10, `Unlock its right neighbor in row ${i}: push (${nums1[i]}, ${nums2[j + 1]}) with sum ${nums1[i] + nums2[j + 1]}.`)
          } else {
            line(9, `Row ${i} is exhausted (j = ${j} was the last column).`)
          }
        }
        const res = ans.map(([x, y]) => `(${x},${y})`).join(" ")
        line(12, `Collected ${ans.length} pairs in sum order: <b>${res}</b>. The heap never held more than min(k, n1) entries → O(k log k).`)
        return res
      },
      1,
    )
    narrate("Instead of sorting all n1·n2 sums, grow a frontier: each popped pair unlocks exactly one successor in its row.")
    return go()
  },
}
