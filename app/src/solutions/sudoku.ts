import type { SolutionDef } from "@/engine/types"

const PUZZLE = [
  [1, 0, 3, 0],
  [0, 4, 0, 2],
  [0, 1, 4, 0],
  [4, 0, 0, 1],
]

export const sudoku: SolutionDef = {
  code: `// 4×4 Sudoku (2×2 boxes) — the board below fills live
function solve(pos) {
  if (pos === 16) return true;         // all cells filled
  const r = (pos / 4) | 0, c = pos % 4;
  if (board[r][c] !== 0) return solve(pos + 1); // given
  for (let d = 1; d <= 4; d++) {
    if (!valid(r, c, d)) continue;     // clashes — skip
    board[r][c] = d;                   // try digit d
    if (solve(pos + 1)) return true;
    board[r][c] = 0;                   // backtrack
  }
  return false;                        // no digit fits here
}`,
  codeJava: `// 4×4 Sudoku (2×2 boxes) — the board below fills live
boolean solve(int pos) {
  if (pos == 16) return true;          // all cells filled
  int r = pos / 4, c = pos % 4;
  if (board[r][c] != 0) return solve(pos + 1); // given
  for (int d = 1; d <= 4; d++) {
    if (!valid(r, c, d)) continue;     // clashes — skip
    board[r][c] = d;                   // try digit d
    if (solve(pos + 1)) return true;
    board[r][c] = 0;                   // backtrack
  }
  return false;                        // no digit fits here
}`,
  inputs: [],
  entry: () => `solve(0)`,
  run({ fn, line, memo, narrate }) {
    const board = PUZZLE.map((r) => [...r])
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) memo[`${r},${c}`] = board[r][c] === 0 ? "·" : String(board[r][c])
    const valid = (r: number, c: number, d: number) => {
      for (let i = 0; i < 4; i++) if (board[r][i] === d || board[i][c] === d) return false
      const br = r - (r % 2), bc = c - (c % 2)
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (board[br + i][bc + j] === d) return false
      return true
    }
    const solve = fn(
      "solve",
      (pos: number): boolean => {
        line(2, `pos = ${pos}: past the last cell? (${pos === 16 ? "<b>yes — solved!</b>" : "no"})`)
        if (pos === 16) return true
        const r = (pos / 4) | 0, c = pos % 4
        if (board[r][c] !== 0) {
          line(4, `(${r},${c}) is a given ${board[r][c]} → move on.`)
          return solve(pos + 1)
        }
        for (let d = 1; d <= 4; d++) {
          if (!valid(r, c, d)) {
            line(6, `${d} clashes in row ${r}, column ${c}, or its 2×2 box → skip.`)
            continue
          }
          line(7, `(${r},${c}): <b>try ${d}</b> — it fits so far.`)
          board[r][c] = d
          memo[`${r},${c}`] = String(d)
          if (solve(pos + 1)) return true
          line(9, `${d} at (${r},${c}) led to a dead end → <b>erase it and try the next digit</b>.`)
          board[r][c] = 0
          memo[`${r},${c}`] = "·"
        }
        line(11, `No digit fits (${r},${c}) → tell the caller to rethink an earlier cell.`)
        return false
      },
      1,
    )
    narrate("Backtracking in its purest form: fill left-to-right, erase on contradiction. Watch the board below.")
    return solve(0)
  },
}
