import type { SolutionDef } from "@/engine/types"

const points = (a: Record<string, unknown>): [number, number][] => {
  const xs = (a.xs as number[]).map(Math.trunc)
  const ys = (a.ys as number[]).map(Math.trunc)
  const n = Math.min(xs.length, ys.length)
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) pts.push([xs[i], ys[i]])
  if (!pts.length) pts.push([1, 3], [-2, 2])
  return pts
}

export const kClosestPointsToOrigin: SolutionDef = {
  view: "array",
  array: (a) => points(a).map(([x, y]) => x * x + y * y),
  code: `// keep the k closest seen so far in a MAX-heap on d²
function kClosest(points, k) {
  const pq = new MaxHeap();         // root = farthest of the kept
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const d = x * x + y * y;        // compare d² — sqrt never needed
    pq.push([d, x, y]);             // sift up by distance
    if (pq.size() > k)
      pq.pop();                     // the farthest kept can never win
  }
  return pq.toArray();              // any order — these ARE the k closest
}`,
  codeJava: `// keep the k closest seen so far in a MAX-heap on d²
int[][] kClosest(int[][] points, int k) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((p, q) -> q[2] - p[2]);
  for (int i = 0; i < points.length; i++) {
    int x = points[i][0], y = points[i][1];
    int d = x * x + y * y;          // compare d² — sqrt never needed
    pq.offer(new int[]{x, y, d});   // sift up by distance
    if (pq.size() > k)
      pq.poll();                    // the farthest kept can never win
  }
  return pq.stream().map(p -> new int[]{p[0], p[1]}).toArray(int[][]::new);
}`,
  inputs: [
    { kind: "numbers", name: "xs", label: "x coords", default: [1, -2, 5, 0, 3], maxLen: 8 },
    { kind: "numbers", name: "ys", label: "y coords", default: [3, 2, -1, 1, 3], maxLen: 8 },
    { kind: "number", name: "k", label: "k", default: 2, min: 1, max: 8 },
  ],
  entry: (a) => `kClosest(points, ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const pts = points(args)
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), pts.length)
    const label = (e: [number, number, number]) => `(${e[1]},${e[2]}) d²=${e[0]}`
    const go = fn(
      "kClosest",
      (): string => {
        // max-heap simulated as an array sorted by d² DESCENDING → pq[0] is the root
        const pq: [number, number, number][] = []
        const done: number[] = []
        heap("pq", [])
        line(2, `Empty <b>max-heap</b> (shown as a sorted array, largest d² first). It will keep only the <b>${k} closest points</b> seen so far — the root is the farthest of those, i.e. the first to be evicted.`)
        for (let i = 0; i < pts.length; i++) {
          const [x, y] = pts[i]
          ptr("i", i)
          mark("focus", [i])
          line(4, `Point ${i}: (${x}, ${y}).`)
          const d = x * x + y * y
          line(5, `d² = ${x}² + ${y}² = <b>${d}</b>. Comparing squared distances keeps everything in integers — sqrt preserves order, so we skip it.`)
          let p = 0
          while (p < pq.length && pq[p][0] > d) p++
          pq.splice(p, 0, [d, x, y])
          heap("pq", pq.map(label))
          vars({ i, "d²": d, "pq size": pq.length })
          line(6, `push((${x},${y})): it sifts past ${p} farther point(s) and settles at slot ${p}. Heap: [${pq.map((e) => e[0]).join(", ")}].`)
          if (pq.length > k) {
            const out = pq.shift() as [number, number, number]
            heap("pq", pq.map(label))
            mark("bad", [pts.findIndex(([px, py]) => px === out[1] && py === out[2])])
            line(8, `Size ${pq.length + 1} > k = ${k} → evict the root <b>${label(out)}</b>: with ${k} closer points in the heap, it can never be in the answer.`)
            mark("bad", [])
          }
          done.push(i)
          mark("done", [...done])
        }
        ptr("i", -1)
        mark("focus", [])
        const good = pq.map((e) => pts.findIndex(([px, py]) => px === e[1] && py === e[2])).filter((x) => x >= 0)
        mark("good", good)
        const ans = pq.map((e) => `(${e[1]},${e[2]})`).join(" ")
        heap("output", pq.map(label))
        line(10, `All points offered. The ${k} survivors are exactly the closest: <b>${ans}</b>. Total cost O(n log k) — better than sorting when k ≪ n.`)
        return ans
      },
      1,
    )
    narrate(`A max-heap of size ${k}: the farthest of the kept points sits on top, so one O(log k) comparison decides every eviction.`)
    return go()
  },
}
