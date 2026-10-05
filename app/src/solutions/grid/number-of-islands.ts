import type { SolutionDef } from "@/engine/types"

const M = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1],
  [0, 1, 0, 0, 0],
]

export const numberOfIslands: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// scan every cell; each unvisited 1 = a new island → sink it
function countIslands() {
  let count = 0;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (g[i][j] === 1) { count++; sink(i, j); }
  return count;
}
function sink(r, c) {   // DFS: turn the whole island to 0
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (g[r][c] !== 1) return;
  g[r][c] = 0;          // sunk — never counted again
  sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1);
}`,
  codeJava: `// scan every cell; each unvisited 1 = a new island → sink it
int countIslands() {
  int count = 0;
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
      if (g[i][j] == 1) { count++; sink(i, j); }
  return count;
}
void sink(int r, int c) { // DFS: turn the whole island to 0
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (g[r][c] != 1) return;
  g[r][c] = 0;            // sunk — never counted again
  sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1);
}`,
  inputs: [],
  entry: () => `countIslands()  // 4×5 grid`,
  run({ fn, line, gmark, gset, vars }) {
    const g = M.map((r) => [...r])
    let count = 0
    const sink = fn(
      "sink",
      (r: number, c: number): string => {
        if (r < 0 || c < 0 || r >= 4 || c >= 5) return "off"
        if (g[r][c] !== 1) return "water"
        line(12, `(${r},${c}) is land → sink it (mark visited) and spread to 4 neighbors.`)
        g[r][c] = 0
        gset(r, c, "·")
        gmark("good", [[r, c]])
        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
        return "sunk"
      },
      9,
    )
    const countIslands = fn(
      "countIslands",
      (): number => {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 5; j++) {
            gmark("focus", [[i, j]])
            if (g[i][j] === 1) {
              count++
              vars({ i, j, count })
              line(5, `(${i},${j}) is unsunk land → <b>island #${count} discovered!</b> Sink all of it so it's never recounted.`)
              sink(i, j)
            }
          }
        gmark("focus", [])
        line(7, `Scan complete — <b>${count} islands</b>. Each land cell was visited exactly once.`)
        return count
      },
      1,
    )
    return countIslands()
  },
}
