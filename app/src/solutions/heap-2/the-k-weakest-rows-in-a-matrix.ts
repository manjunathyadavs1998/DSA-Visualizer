import type { SolutionDef } from "@/engine/types"

const soldiers = (a: Record<string, unknown>): number[] => {
  const s = (a.soldiers as number[]).map((x) => Math.max(0, Math.min(6, Math.trunc(x))))
  if (!s.length) s.push(2, 4, 1, 2, 5)
  return s
}
const build = (a: Record<string, unknown>): number[][] => {
  const s = soldiers(a)
  const w = Math.max(1, ...s)
  return s.map((c) => Array.from({ length: w }, (_, j) => (j < c ? 1 : 0)))
}

export const theKWeakestRowsInAMatrix: SolutionDef = {
  view: "grid",
  grid: (a) => build(a),
  code: `// weakest = fewest soldiers, ties broken by lower row index
function kWeakestRows(mat, k) {
  const pq = new MinHeap();          // (soldiers, row), lexicographic
  for (let r = 0; r < mat.length; r++) {
    let s = 0;                       // soldiers sit before civilians,
    while (s < mat[r].length && mat[r][s] === 1) s++;
    pq.push([s, r]);                 // so counting = scanning the 1s
  }
  const ans = [];
  for (let i = 0; i < k; i++)
    ans.push(pq.pop()[1]);           // next weakest row
  return ans;
}`,
  codeJava: `// weakest = fewest soldiers, ties broken by lower row index
int[] kWeakestRows(int[][] mat, int k) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
  for (int r = 0; r < mat.length; r++) {
    int s = 0;                       // soldiers sit before civilians,
    while (s < mat[r].length && mat[r][s] == 1) s++;
    pq.offer(new int[]{s, r});       // so counting = scanning the 1s
  }
  int[] ans = new int[k];
  for (int i = 0; i < k; i++)
    ans[i] = pq.poll()[1];           // next weakest row
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "soldiers", label: "soldiers per row (builds the matrix)", default: [2, 4, 1, 2, 5], maxLen: 6 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 6 },
  ],
  entry: (a) => `kWeakestRows(mat, ${a.k})`,
  run({ fn, line, gptr, gmark, vars, heap, narrate }, args) {
    const mat = build(args)
    const k = Math.max(1, Math.min(mat.length, Math.trunc(args.k as number)))
    const show = (pq: [number, number][]) => pq.map(([s, r]) => `row ${r}: ${s} soldier(s)`)
    const go = fn(
      "kWeakestRows",
      (): string => {
        // min-heap simulated as an array sorted by (soldiers, row) ASCENDING
        const pq: [number, number][] = []
        heap("pq", [])
        line(2, `Min-heap ordered by <b>(soldiers, row index)</b> — the tuple comparison bakes the tie-break right into the heap.`)
        for (let r = 0; r < mat.length; r++) {
          gptr("r", r, -1)
          let s = 0
          while (s < mat[r].length && mat[r][s] === 1) s++
          gmark("focus", Array.from({ length: s }, (_, j) => [r, j] as [number, number]))
          line(5, `Row ${r}: soldiers (1s) are all left of civilians (0s) — scan stops at column ${s} → <b>${s} soldier(s)</b>.`)
          let p = 0
          while (p < pq.length && (pq[p][0] < s || (pq[p][0] === s && pq[p][1] < r))) p++
          pq.splice(p, 0, [s, r])
          heap("pq", show(pq))
          vars({ row: r, soldiers: s })
          line(6, `push((${s}, row ${r})) → heap: [${pq.map(([s2, r2]) => `(${s2},r${r2})`).join(", ")}].`)
        }
        gptr("r", -1, -1)
        gmark("focus", [])
        const ans: number[] = []
        for (let i = 0; i < k; i++) {
          const [s, r] = pq.shift() as [number, number]
          heap("pq", show(pq))
          ans.push(r)
          heap("output", [...ans])
          gmark("good", ans.map((row) => [row, 0] as [number, number]))
          line(10, `pop #${i + 1} → row <b>${r}</b> (${s} soldier(s))${pq.length && pq[0][0] === s ? ` — tied with row ${pq[0][1]}, but ${r} < ${pq[0][1]} wins` : ""}.`)
        }
        line(11, `The ${k} weakest rows, weakest first: <b>[${ans.join(", ")}]</b>.`)
        return `[${ans.join(", ")}]`
      },
      1,
    )
    narrate("Each row is sorted (soldiers before civilians), so its strength is just 'where does the first 0 appear' — then a heap ranks the rows.")
    return go()
  },
}
