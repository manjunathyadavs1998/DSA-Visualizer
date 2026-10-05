import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): number[][] => {
  const v = (a.vals as number[]).map(Math.trunc).sort((x, y) => x - y)
  while (v.length < 4) v.push((v[v.length - 1] ?? 0) + 1)
  const n = Math.min(3, Math.floor(Math.sqrt(v.length)))
  const m: number[][] = []
  for (let r = 0; r < n; r++) m.push(v.slice(r * n, r * n + n))
  return m
}

export const kthSmallestElementInASortedMatrix: SolutionDef = {
  view: "grid",
  grid: (a) => build(a).map((r) => [...r]),
  code: `// n sorted row-frontiers compete in a min-heap; pop k times
function kthSmallest(matrix, k) {
  const n = matrix.length;
  const pq = new MinHeap();          // (value, row, col)
  for (let r = 0; r < n; r++)
    pq.push([matrix[r][0], r, 0]);   // each row's head
  let val = -1;
  for (let i = 1; i <= k; i++) {
    const [v, r, c] = pq.pop();      // smallest frontier value
    val = v;
    if (c + 1 < n)                   // advance that row's frontier
      pq.push([matrix[r][c + 1], r, c + 1]);
  }
  return val;                        // the k-th popped = k-th smallest
}`,
  codeJava: `// n sorted row-frontiers compete in a min-heap; pop k times
int kthSmallest(int[][] matrix, int k) {
  int n = matrix.length;
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
  for (int r = 0; r < n; r++)
    pq.offer(new int[]{matrix[r][0], r, 0});
  int val = -1;
  for (int i = 1; i <= k; i++) {
    int[] top = pq.poll();           // smallest frontier value
    val = top[0];
    if (top[2] + 1 < n)              // advance that row's frontier
      pq.offer(new int[]{matrix[top[1]][top[2] + 1], top[1], top[2] + 1});
  }
  return val;                        // the k-th popped = k-th smallest
}`,
  inputs: [
    { kind: "numbers", name: "vals", label: "matrix values (sorted & reshaped n×n)", default: [1, 5, 9, 10, 11, 12, 13, 13, 15], maxLen: 9 },
    { kind: "number", name: "k", label: "k", default: 8, min: 1, max: 9 },
  ],
  entry: (a) => `kthSmallest(matrix, ${a.k})`,
  run({ fn, line, gmark, vars, heap, narrate }, args) {
    const matrix = build(args)
    const n = matrix.length
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), n * n)
    const show = (pq: [number, number, number][]) => pq.map(([v, r, c]) => `${v} @(${r},${c})`)
    const go = fn(
      "kthSmallest",
      (): number => {
        // min-heap simulated as an array sorted ASCENDING → pq[0] is the root
        const pq: [number, number, number][] = []
        line(2, `n = ${n}. Each row is sorted, so the matrix is really <b>${n} sorted lists</b> — this is "merge k sorted lists" in disguise.`)
        for (let r = 0; r < n; r++) {
          let p = 0
          while (p < pq.length && pq[p][0] <= matrix[r][0]) p++
          pq.splice(p, 0, [matrix[r][0], r, 0])
          heap("pq", show(pq))
          line(5, `Seed row ${r}'s head: push(<b>${matrix[r][0]}</b> @(${r},0)).`)
        }
        gmark("window", pq.map(([, r, c]) => [r, c] as [number, number]))
        let val = -1
        const done: [number, number][] = []
        const popped: number[] = []
        for (let i = 1; i <= k; i++) {
          const [v, r, c] = pq.shift() as [number, number, number]
          heap("pq", show(pq))
          val = v
          popped.push(v)
          heap("output", popped)
          gmark("focus", [[r, c]])
          vars({ i, popped: v })
          line(8, `pop #${i} → <b>${v}</b> @(${r},${c}). The root beats every row frontier, so ${v} is the <b>${i}-th smallest</b> overall.`)
          done.push([r, c])
          gmark("done", [...done])
          if (c + 1 < n) {
            const nv = matrix[r][c + 1]
            let p = 0
            while (p < pq.length && pq[p][0] <= nv) p++
            pq.splice(p, 0, [nv, r, c + 1])
            heap("pq", show(pq))
            line(11, `Row ${r}'s frontier advances: push(<b>${nv}</b> @(${r},${c + 1})). Only the popped cell's right-neighbor can be the next candidate from that row.`)
          } else {
            line(10, `Row ${r} is exhausted — nothing to push.`)
          }
          gmark("window", pq.map(([, r2, c2]) => [r2, c2] as [number, number]))
          if (i === k) {
            gmark("focus", [])
            gmark("good", [[r, c]])
          }
        }
        line(13, `The ${k}-th pop is the answer: <b>${val}</b>. Cost: O(k log n) with a heap of at most n entries — never touches most of the matrix.`)
        return val
      },
      1,
    )
    narrate(`The heap holds one frontier cell per row; popping ${k} times walks the matrix in globally sorted order.`)
    return go()
  },
}
