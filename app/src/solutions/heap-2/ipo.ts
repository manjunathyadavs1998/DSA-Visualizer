import type { SolutionDef } from "@/engine/types"

const build = (a: Record<string, unknown>): [number, number][] => {
  const cap = (a.capital as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const pro = (a.profits as number[]).map((x) => Math.max(0, Math.trunc(x)))
  const n = Math.min(cap.length, pro.length)
  const proj: [number, number][] = []
  for (let i = 0; i < n; i++) proj.push([cap[i], pro[i]])
  if (!proj.length) proj.push([0, 1], [1, 2], [1, 3])
  proj.sort((x, y) => x[0] - y[0])
  return proj
}

export const ipo: SolutionDef = {
  code: `// unlock projects as capital grows; always run the best unlocked
function findMaximizedCapital(k, w, profits, capital) {
  const proj = capital.map((c, i) => [c, profits[i]]);
  proj.sort((a, b) => a[0] - b[0]);   // cheapest requirement first
  const pq = new MaxHeap();           // profits of unlocked projects
  let i = 0;
  for (let round = 1; round <= k; round++) {
    while (i < proj.length && proj[i][0] <= w)
      pq.push(proj[i++][1]);          // now affordable → unlock it
    if (pq.isEmpty()) break;          // nothing affordable — stuck
    w += pq.pop();                    // run the most profitable
  }
  return w;
}`,
  codeJava: `// unlock projects as capital grows; always run the best unlocked
int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
  int[][] proj = new int[profits.length][2];  // (capital, profit)
  Arrays.sort(proj, (a, b) -> a[0] - b[0]);
  PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
  int i = 0;
  for (int round = 1; round <= k; round++) {
    while (i < proj.length && proj[i][0] <= w)
      pq.offer(proj[i++][1]);         // now affordable → unlock it
    if (pq.isEmpty()) break;          // nothing affordable — stuck
    w += pq.poll();                   // run the most profitable
  }
  return w;
}`,
  inputs: [
    { kind: "number", name: "k", label: "k projects", default: 3, min: 1, max: 8 },
    { kind: "number", name: "w", label: "starting capital w", default: 0, min: 0, max: 20 },
    { kind: "numbers", name: "profits", label: "profits", default: [1, 2, 3, 5], maxLen: 8 },
    { kind: "numbers", name: "capital", label: "capital required", default: [0, 1, 1, 3], maxLen: 8 },
  ],
  entry: (a) => `findMaximizedCapital(${a.k}, ${a.w}, …)`,
  run({ fn, line, vars, heap, narrate }, args) {
    const proj = build(args)
    const k = Math.max(1, Math.min(8, Math.trunc(args.k as number)))
    let w = Math.max(0, Math.trunc(args.w as number))
    const go = fn(
      "findMaximizedCapital",
      (): number => {
        line(3, `Projects sorted by required capital: ${proj.map(([c, p]) => `(need ${c} → +${p})`).join(" ")}.`)
        // max-heap simulated as an array sorted by profit DESCENDING
        const pq: number[] = []
        heap("pq", [])
        heap("locked", proj.map(([c, p]) => `need ${c} → +${p}`))
        line(4, `Two structures: a sorted "locked" list (by capital needed) and a <b>max-heap of profits</b> for everything we can already afford.`)
        let i = 0
        for (let round = 1; round <= k; round++) {
          line(6, `Round ${round}/${k}: capital w = <b>${w}</b>.`)
          while (i < proj.length && proj[i][0] <= w) {
            const p = proj[i][1]
            let q = 0
            while (q < pq.length && pq[q] >= p) q++
            pq.splice(q, 0, p)
            heap("pq", [...pq])
            heap("locked", proj.slice(i + 1).map(([c, pr]) => `need ${c} → +${pr}`))
            line(8, `Project (need ${proj[i][0]} → +${p}) is affordable with w=${w} → <b>unlock</b> its profit into the heap: [${pq.join(", ")}].`)
            i++
          }
          if (!pq.length) {
            line(9, `No unlocked project — every remaining one needs more than ${w}, and capital can only grow by running projects. <b>Stuck</b>: stop early.`)
            break
          }
          const best = pq.shift() as number
          heap("pq", [...pq])
          w += best
          heap("output", [`after round ${round}: w = ${w}`])
          vars({ round, w, "unlocked": pq.length })
          line(10, `Run the most profitable unlocked project: w += <b>${best}</b> → w = <b>${w}</b>. (Capital requirements are sunk, not spent — profit is pure gain.)`)
        }
        line(12, `Final capital after at most ${k} projects: <b>${w}</b>.`)
        return w
      },
      1,
    )
    narrate("Greedy exchange: among affordable projects only profit matters (capital is not consumed), so taking the max-profit one each round is optimal.")
    return go()
  },
}
