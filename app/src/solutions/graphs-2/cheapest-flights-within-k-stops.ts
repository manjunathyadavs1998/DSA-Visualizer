import type { SolutionDef } from "@/engine/types"

// 5 airports; directed flights [from, to, price]:
//   0→1 $100   1→2 $100   0→2 $500   2→3 $100   1→3 $600   3→4 $50
// Route 0→3: direct chains cost 700 / 600 (1 stop) or 300 (2 stops).
const N = 5
const FLIGHTS: [number, number, number][] = [
  [0, 1, 100],
  [1, 2, 100],
  [0, 2, 500],
  [2, 3, 100],
  [1, 3, 600],
  [3, 4, 50],
]
const SRC = 0
const DST = 3

export const cheapestFlightsWithinKStops: SolutionDef = {
  view: "array",
  // the array below is dist[v] — cheapest known fare from airport 0
  array: () => Array.from({ length: N }, (_, i) => (i === SRC ? 0 : "∞")),
  code: `// 0→1:$100 1→2:$100 0→2:$500 2→3:$100 1→3:$600 3→4:$50
function findCheapestPrice(src, dst, k) {
  let dist = Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) { // k stops = k+1 legs
    const next = [...dist];       // relax from LAST round's values
    for (const [u, v, w] of flights) {
      if (dist[u] === Infinity) continue;  // u unreachable so far
      if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
  codeJava: `// 0→1:$100 1→2:$100 0→2:$500 2→3:$100 1→3:$600 3→4:$50
int findCheapestPrice(int src, int dst, int k) {
  int[] dist = new int[n]; Arrays.fill(dist, INF);
  dist[src] = 0;
  for (int round = 0; round <= k; round++) {  // k stops = k+1 legs
    int[] next = dist.clone();    // relax from LAST round's values
    for (int[] f : flights) { int u = f[0], v = f[1], w = f[2];
      if (dist[u] == INF) continue;        // u unreachable so far
      if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    }
    dist = next;
  }
  return dist[dst] == INF ? -1 : dist[dst];
}`,
  inputs: [{ kind: "number", name: "k", label: "max stops (k)", default: 1, min: 0, max: 4 }],
  entry: (a) => `findCheapestPrice(${SRC}, ${DST}, k = ${a.k})`,
  run({ fn, line, vars, aset, mark, narrate }, args) {
    const k = Math.max(0, Math.min(4, Math.trunc(args.k as number)))
    const show = (x: number) => (x === Infinity ? "∞" : `$${x}`)
    const go = fn(
      "findCheapestPrice",
      (): number => {
        let dist: number[] = Array(N).fill(Infinity)
        dist[SRC] = 0
        line(3, `dist[${SRC}] = $0, everything else ∞. We may use at most <b>${k} stop${k === 1 ? "" : "s"} = ${k + 1} flight legs</b>.`)
        for (let round = 0; round <= k; round++) {
          const next = [...dist]
          vars({ round, legsAllowed: round + 1 })
          line(5, `Round ${round + 1}/${k + 1}: copy dist → next. Reading old dist / writing next caps every route at <b>${round + 1} legs</b>.`)
          for (const [u, v, w] of FLIGHTS) {
            mark("focus", [v])
            if (dist[u] === Infinity) {
              line(7, `Flight ${u}→${v} ($${w}): airport ${u} still unreachable — skip.`)
              continue
            }
            if (dist[u] + w < next[v]) {
              const old = next[v]
              next[v] = dist[u] + w
              aset(v, next[v])
              line(8, `Flight ${u}→${v} ($${w}): ${show(dist[u])} + $${w} = <b>${show(next[v])}</b> beats ${show(old)} — cheaper way to ${v}!`)
            } else {
              line(8, `Flight ${u}→${v} ($${w}): ${show(dist[u])} + $${w} = ${show(dist[u] + w)} — no better than ${show(next[v])}, keep it.`)
            }
          }
          dist = next
          line(10, `Round done — lock in next as dist: [${dist.map(show).join(", ")}].`)
        }
        mark("focus", [])
        if (dist[DST] === Infinity) {
          mark("bad", [DST])
          line(12, `dist[${DST}] is still ∞ — airport ${DST} unreachable within ${k} stops → <b>-1</b>.`)
          return -1
        }
        mark("good", [DST])
        line(12, `Cheapest fare ${SRC}→${DST} with ≤ ${k} stop${k === 1 ? "" : "s"}: <b>$${dist[DST]}</b>.${k < 2 ? " (Allow one more stop and the $300 route 0→1→2→3 opens up.)" : ""}`)
        return dist[DST]
      },
      1,
    )
    narrate(`This is Bellman-Ford with a leash: round r only extends routes to exactly ≤ r legs, so stopping after k+1 rounds enforces the stop limit for free.`)
    return go()
  },
}
