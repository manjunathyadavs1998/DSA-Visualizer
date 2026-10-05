import type { SolutionDef } from "@/engine/types"

const MAZE = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 1, 1, 1],
]

export const ratInMaze: SolutionDef = {
  code: `// 4×4 maze: 1 = open, 0 = wall — reach (3,3); board below
function go(r, c) {
  if (r < 0 || c < 0 || r > 3 || c > 3) return false; // off grid
  if (maze[r][c] !== 1) return false;  // wall or visited
  maze[r][c] = 2;                      // step here (mark path)
  if (r === 3 && c === 3) return true; // reached the exit!
  if (go(r+1,c) || go(r,c+1) || go(r-1,c) || go(r,c-1)) return true;
  maze[r][c] = 1;                      // dead end — step back
  return false;
}`,
  codeJava: `// 4×4 maze: 1 = open, 0 = wall — reach (3,3)
boolean go(int r, int c) {
  if (r < 0 || c < 0 || r > 3 || c > 3) return false; // off grid
  if (maze[r][c] != 1) return false;   // wall or visited
  maze[r][c] = 2;                      // step here (mark path)
  if (r == 3 && c == 3) return true;   // reached the exit!
  if (go(r+1,c) || go(r,c+1) || go(r-1,c) || go(r,c-1)) return true;
  maze[r][c] = 1;                      // dead end — step back
  return false;
}`,
  inputs: [],
  entry: () => `go(0, 0)`,
  run({ fn, line, memo, narrate }) {
    const maze = MAZE.map((r) => [...r])
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) memo[`${r},${c}`] = maze[r][c] === 0 ? "■" : "·"
    const go = fn(
      "go",
      (r: number, c: number): boolean => {
        if (r < 0 || c < 0 || r > 3 || c > 3) {
          line(2, `(${r},${c}) is off the grid → dead end.`)
          return false
        }
        if (maze[r][c] !== 1) {
          line(3, `(${r},${c}) is ${MAZE[r]?.[c] === 0 ? "a wall" : "already on the path"} → can't step there.`)
          return false
        }
        line(4, `Step onto (${r},${c}) — marking it as part of the path.`)
        maze[r][c] = 2
        memo[`${r},${c}`] = "🐀"
        if (r === 3 && c === 3) {
          line(5, `<b>That's the exit! Path found.</b>`)
          return true
        }
        line(6, `From (${r},${c}) try Down, Right, Up, Left — in that order.`)
        if (go(r + 1, c) || go(r, c + 1) || go(r - 1, c) || go(r, c - 1)) return true
        line(7, `Every direction from (${r},${c}) failed → <b>step back off it</b>.`)
        maze[r][c] = 1
        memo[`${r},${c}`] = "·"
        return false
      },
      1,
    )
    narrate("The rat marks cells as it walks and un-marks them at dead ends — watch the trail in the board below.")
    return go(0, 0)
  },
}
