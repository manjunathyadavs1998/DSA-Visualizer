import type { SolutionDef } from "@/engine/types"

// 4×4 grid: 1 = land, 0 = water. Two islands:
//   . 1 . .      island A = {(0,1),(1,0),(1,1)} → area 3
//   1 1 . .      island B = {(2,2),(2,3),(3,2),(3,3)} → area 4  ← answer
//   . . 1 1
//   . . 1 1
const M: number[][] = [
  [0, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 1, 1],
]
const R = 4
const C = 4

export const maxAreaOfIsland: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// 1 = land, 0 = water — find the biggest island
function maxAreaOfIsland(grid) {
  let best = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === 1)
        best = Math.max(best, area(r, c));
  return best;
}
function area(r, c) {        // sink the island while counting it
  if (r < 0 || c < 0 || r >= R || c >= C) return 0;
  if (grid[r][c] !== 1) return 0;  // water, or already counted
  grid[r][c] = 0;                  // sink → never recount
  return 1 + area(r+1, c) + area(r-1, c)
           + area(r, c+1) + area(r, c-1);
}`,
  codeJava: `// 1 = land, 0 = water — find the biggest island
int maxAreaOfIsland(int[][] grid) {
  int best = 0;
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
      if (grid[r][c] == 1)
        best = Math.max(best, area(r, c));
  return best;
}
int area(int r, int c) {     // sink the island while counting it
  if (r < 0 || c < 0 || r >= R || c >= C) return 0;
  if (grid[r][c] != 1) return 0;   // water, or already counted
  grid[r][c] = 0;                  // sink → never recount
  return 1 + area(r+1, c) + area(r-1, c)
           + area(r, c+1) + area(r, c-1);
}`,
  inputs: [],
  entry: () => `maxAreaOfIsland(grid)  // 4×4`,
  run({ fn, line, vars, gmark, gset, gptr, narrate }) {
    const g = M.map((r) => [...r])
    let island: [number, number][] = []
    const area = fn(
      "area",
      (r: number, c: number): number => {
        if (r < 0 || c < 0 || r >= R || c >= C) {
          line(10, `(${r},${c}) is off the map → contributes 0.`)
          return 0
        }
        gptr("rc", r, c)
        if (g[r][c] !== 1) {
          line(11, `(${r},${c}) is ${M[r][c] === 0 ? "water" : "land already counted (sunk)"} → 0.`)
          return 0
        }
        g[r][c] = 0
        gset(r, c, "·")
        island.push([r, c])
        gmark("focus", [...island])
        line(12, `(${r},${c}) is fresh land — count it (+1) and <b>sink it</b> so no path counts it twice.`)
        const a = 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)
        line(13, `(${r},${c}): own cell + all 4 directions = <b>${a}</b> cells reachable from here.`)
        return a
      },
      9,
    )
    const go = fn(
      "maxAreaOfIsland",
      (): number => {
        let best = 0
        let bestCells: [number, number][] = []
        line(2, `Scan every cell; each time we step on fresh land, flood-fill measures that whole island.`)
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++) {
            if (g[r][c] === 1) {
              island = []
              line(6, `Fresh land at (${r},${c}) — launch a measuring DFS.`)
              const a = area(r, c)
              vars({ at: `(${r},${c})`, size: a, best: Math.max(best, a) })
              if (a > best) {
                best = a
                bestCells = [...island]
                line(6, `Island of size ${a} — <b>new record</b> (best was smaller).`)
              } else {
                line(6, `Island of size ${a} — best stays ${best}.`)
              }
            }
          }
        gmark("focus", [])
        gmark("good", bestCells)
        line(7, `All cells scanned. Largest island (green) has <b>${best}</b> cells.`)
        return best
      },
      1,
    )
    narrate(`Sinking visited land (grid[r][c] = 0) makes the grid its own visited-set — the classic Number of Islands trick, plus a size counter.`)
    return go()
  },
}
