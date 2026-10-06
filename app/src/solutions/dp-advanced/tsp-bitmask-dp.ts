import type { SolutionDef } from "@/engine/types"

// TSP on 4 cities — bitmask DP
// dist[i][j] = distance between city i and j
const DIST = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
]
const N = 4

export const tspBitmaskDP: SolutionDef = {
  view: "array",
  array: () => Array(N).fill(Infinity).map((_, i) => i === 0 ? 0 : Infinity),
  code: `// dist[i][j] = cost; n cities; start and end at city 0
function tsp(dist, n) {
  const FULL = (1 << n) - 1;
  // dp[mask][i] = min cost to visit cities in mask, ending at i
  const dp = Array.from({length: 1<<n}, () => Array(n).fill(Infinity));
  dp[1][0] = 0;  // visited only city 0, at city 0, cost 0
  for (let mask = 1; mask <= FULL; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;  // u not in mask
      if (dp[mask][u] === Infinity) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;   // v already visited
        const newMask = mask | (1 << v);
        dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
      }
    }
  }
  // return to start
  let ans = Infinity;
  for (let u = 1; u < n; u++)
    ans = Math.min(ans, dp[FULL][u] + dist[u][0]);
  return ans;
}`,
  codeJava: `int tsp(int[][] dist, int n) {
  int FULL = (1<<n)-1;
  int[][] dp = new int[1<<n][n];
  for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE/2);
  dp[1][0] = 0;
  for (int mask = 1; mask <= FULL; mask++)
    for (int u = 0; u < n; u++) {
      if ((mask&(1<<u))==0 || dp[mask][u]==Integer.MAX_VALUE/2) continue;
      for (int v = 0; v < n; v++) {
        if ((mask&(1<<v))!=0) continue;
        int nm = mask|(1<<v);
        dp[nm][v] = Math.min(dp[nm][v], dp[mask][u]+dist[u][v]);
      }
    }
  int ans = Integer.MAX_VALUE;
  for (int u = 1; u < n; u++)
    ans = Math.min(ans, dp[FULL][u]+dist[u][0]);
  return ans;
}`,
  inputs: [],
  entry: () => `tsp(4 cities, start=0)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const go = fn("tsp", (): number => {
      const FULL = (1 << N) - 1
      const dp: number[][] = Array.from({ length: 1 << N }, () => Array(N).fill(Infinity))
      dp[1][0] = 0
      heap("dp[1]", [...dp[1]])
      line(4, `dp[mask][i] = min cost to visit exactly the cities in <b>mask</b>, ending at city i. Start: dp[0001][0]=0.`)
      for (let mask = 1; mask <= FULL; mask++) {
        for (let u = 0; u < N; u++) {
          if (!(mask & (1 << u))) continue
          if (dp[mask][u] === Infinity) continue
          mark("focus", [u])
          vars({ mask: mask.toString(2).padStart(N, "0"), u, cost: dp[mask][u] })
          for (let v = 0; v < N; v++) {
            if (mask & (1 << v)) continue
            const newMask = mask | (1 << v)
            const newCost = dp[mask][u] + DIST[u][v]
            if (newCost < dp[newMask][v]) {
              dp[newMask][v] = newCost
              aset(v, newCost)
              vars({ mask: mask.toString(2).padStart(N, "0"), u, v, newMask: newMask.toString(2).padStart(N, "0"), newCost })
              line(12, `mask=${mask.toString(2).padStart(N,"0")}, u=${u}→v=${v}: cost=${dp[mask][u]}+${DIST[u][v]}=<b>${newCost}</b>. dp[${newMask.toString(2).padStart(N,"0")}][${v}]=${newCost}.`)
            }
          }
        }
      }
      mark("focus", [])
      let ans = Infinity
      for (let u = 1; u < N; u++) {
        const total = dp[FULL][u] + DIST[u][0]
        if (total < ans) ans = total
        line(17, `Return from city ${u}: dp[1111][${u}]=${dp[FULL][u]} + dist[${u}][0]=${DIST[u][0]} = ${total}.`)
      }
      heap("dp[FULL]", [...dp[FULL]])
      line(18, `Minimum TSP tour cost: <b>${ans}</b>.`)
      return ans
    }, 1)
    narrate("Bitmask DP: mask encodes the set of visited cities. dp[mask][u] = cheapest way to visit exactly those cities ending at u. 2ⁿ·n states, n² transitions.")
    return go()
  },
}
