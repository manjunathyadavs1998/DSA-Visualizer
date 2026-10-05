import type { SolutionDef } from "@/engine/types"

const M = [
  [1, 3, 1, 2],
  [1, 5, 1, 3],
  [4, 2, 1, 1],
]

export const minPathSum: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// DP in place: each cell becomes "cheapest cost to reach me"
function minPathSum() {
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) continue;         // start cell
      const top  = i > 0 ? g[i - 1][j] : Infinity;
      const left = j > 0 ? g[i][j - 1] : Infinity;
      g[i][j] += Math.min(top, left);
    }
  return g[rows - 1][cols - 1];
}`,
  codeJava: `// DP in place: each cell becomes "cheapest cost to reach me"
int minPathSum() {
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++) {
      if (i == 0 && j == 0) continue;           // start cell
      int top  = i > 0 ? g[i - 1][j] : INF;
      int left = j > 0 ? g[i][j - 1] : INF;
      g[i][j] += Math.min(top, left);
    }
  return g[rows - 1][cols - 1];
}`,
  inputs: [],
  entry: () => `minPathSum()  // 3×4, move only right/down`,
  run({ fn, line, gmark, gset, vars }) {
    const g = M.map((r) => [...r])
    const go = fn(
      "minPathSum",
      (): number => {
        line(2, `Fill in reading order — by the time we reach a cell, its top and left are already final.`)
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 4; j++) {
            if (i === 0 && j === 0) continue
            const top = i > 0 ? g[i - 1][j] : Infinity
            const left = j > 0 ? g[i][j - 1] : Infinity
            const deps: [number, number][] = []
            if (i > 0) deps.push([i - 1, j])
            if (j > 0) deps.push([i, j - 1])
            gmark("focus", [[i, j]]); gmark("window", deps)
            vars({ i, j, cost: M[i][j], top: top === Infinity ? "—" : top, left: left === Infinity ? "—" : left })
            line(7, `(${i},${j}): my cost ${M[i][j]} + min(top ${top === Infinity ? "∞" : top}, left ${left === Infinity ? "∞" : left}) = <b>${M[i][j] + Math.min(top, left)}</b>.`)
            g[i][j] += Math.min(top, left)
            gset(i, j, g[i][j])
            gmark("good", [[i, j]])
          }
        gmark("focus", []); gmark("window", []); gmark("good", [[2, 3]])
        line(9, `Bottom-right holds the answer: cheapest path costs <b>${g[2][3]}</b>.`)
        return g[2][3]
      },
      1,
    )
    return go()
  },
}
