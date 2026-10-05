import type { SolutionDef } from "@/engine/types"

const M = [
  [0, 1, 1, 0, 0],
  [0, 1, 0, 0, 1],
  [0, 1, 1, 0, 1],
  [0, 0, 0, 0, 1],
]

export const maxAreaIsland: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// like Number of Islands, but DFS RETURNS the area
function maxArea() {
  let best = 0;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (g[i][j] === 1) best = Math.max(best, area(i, j));
  return best;
}
function area(r, c) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (g[r][c] !== 1) return 0;
  g[r][c] = 0;
  return 1 + area(r+1,c) + area(r-1,c) + area(r,c+1) + area(r,c-1);
}`,
  codeJava: `// like Number of Islands, but DFS RETURNS the area
int maxArea() {
  int best = 0;
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
      if (g[i][j] == 1) best = Math.max(best, area(i, j));
  return best;
}
int area(int r, int c) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
  if (g[r][c] != 1) return 0;
  g[r][c] = 0;
  return 1 + area(r+1,c) + area(r-1,c) + area(r,c+1) + area(r,c-1);
}`,
  inputs: [],
  entry: () => `maxArea()  // 4×5 grid`,
  run({ fn, line, gmark, gset, vars }) {
    const g = M.map((r) => [...r])
    const area = fn(
      "area",
      (r: number, c: number): number => {
        if (r < 0 || c < 0 || r >= 4 || c >= 5) return 0
        if (g[r][c] !== 1) return 0
        g[r][c] = 0
        gset(r, c, "·")
        gmark("good", [[r, c]])
        line(13, `(${r},${c}): count me (1) + whatever the four neighbors return.`)
        return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)
      },
      9,
    )
    const maxArea = fn(
      "maxArea",
      (): number => {
        let best = 0
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 5; j++) {
            gmark("focus", [[i, j]])
            if (g[i][j] === 1) {
              line(5, `New island found at (${i},${j}) — measuring it…`)
              const a = area(i, j)
              best = Math.max(best, a)
              vars({ i, j, "this island": a, best })
              line(5, `Island size = <b>${a}</b>; best so far = ${best}.`)
            }
          }
        gmark("focus", [])
        line(6, `Largest island area: <b>${best}</b>.`)
        return best
      },
      1,
    )
    return maxArea()
  },
}
