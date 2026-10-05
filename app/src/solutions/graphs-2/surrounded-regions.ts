import type { SolutionDef } from "@/engine/types"

// 4×4 board (LeetCode's example):
//   X X X X      The O-region {(1,1),(1,2),(2,2)} is sealed → captured.
//   X O O X      The O at (3,1) touches the bottom border → safe.
//   X X O X
//   X O X X
const BOARD: string[][] = [
  ["X", "X", "X", "X"],
  ["X", "O", "O", "X"],
  ["X", "X", "O", "X"],
  ["X", "O", "X", "X"],
]
const R = 4
const C = 4

export const surroundedRegions: SolutionDef = {
  view: "grid",
  grid: () => BOARD.map((r) => [...r]),
  code: `// capture every O-region NOT touching the border
function solve(board) {
  for (let r = 0; r < R; r++)      // start a rescue-DFS from
    for (let c = 0; c < C; c++)    // every border O
      if (onBorder(r, c) && board[r][c] === "O") save(r, c);
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (board[r][c] === "O") board[r][c] = "X"; // trapped
      if (board[r][c] === "T") board[r][c] = "O"; // was safe
    }
}
function save(r, c) {              // flood-fill O → T (temp-safe)
  if (r < 0 || c < 0 || r >= R || c >= C) return;
  if (board[r][c] !== "O") return;
  board[r][c] = "T";               // T = connected to border
  save(r+1, c); save(r-1, c); save(r, c+1); save(r, c-1);
}`,
  codeJava: `// capture every O-region NOT touching the border
void solve(char[][] board) {
  for (int r = 0; r < R; r++)      // start a rescue-DFS from
    for (int c = 0; c < C; c++)    // every border O
      if (onBorder(r, c) && board[r][c] == 'O') save(r, c);
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++) {
      if (board[r][c] == 'O') board[r][c] = 'X'; // trapped
      if (board[r][c] == 'T') board[r][c] = 'O'; // was safe
    }
}
void save(int r, int c) {          // flood-fill O → T (temp-safe)
  if (r < 0 || c < 0 || r >= R || c >= C) return;
  if (board[r][c] != 'O') return;
  board[r][c] = 'T';               // T = connected to border
  save(r+1, c); save(r-1, c); save(r, c+1); save(r, c-1);
}`,
  inputs: [],
  entry: () => `solve(board)  // 4×4`,
  run({ fn, line, gmark, gset, gptr, narrate }) {
    const b = BOARD.map((r) => [...r])
    const onBorder = (r: number, c: number) => r === 0 || c === 0 || r === R - 1 || c === C - 1
    const save = fn(
      "save",
      (r: number, c: number): string => {
        if (r < 0 || c < 0 || r >= R || c >= C) {
          line(12, `(${r},${c}) is off the board — stop.`)
          return "off"
        }
        gptr("rc", r, c)
        if (b[r][c] !== "O") {
          line(13, `(${r},${c}) = "${b[r][c]}" — not an O (or already saved), stop.`)
          return "skip"
        }
        b[r][c] = "T"
        gset(r, c, "T")
        line(14, `(${r},${c}) is an O connected to the border — stamp it <b>T</b> (temporarily safe), then spread 4 ways.`)
        save(r + 1, c)
        save(r - 1, c)
        save(r, c + 1)
        save(r, c - 1)
        return "saved"
      },
      11,
    )
    const go = fn(
      "solve",
      (): string => {
        line(2, `Flip the problem: don't look for trapped regions — <b>rescue the border-connected ones</b>, capture whatever's left.`)
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++)
            if (onBorder(r, c) && b[r][c] === "O") {
              gmark("focus", [[r, c]])
              line(4, `Border cell (${r},${c}) holds an O — its whole region can breathe. Rescue-DFS from here.`)
              save(r, c)
            }
        gmark("focus", [])
        line(5, `Rescue pass done. Every O still on the board is sealed on all sides.`)
        let captured = 0
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++) {
            if (b[r][c] === "O") {
              b[r][c] = "X"
              gset(r, c, "X")
              gmark("bad", [[r, c]])
              captured++
              line(7, `(${r},${c}): trapped O → <b>captured</b>, becomes X.`)
            } else if (b[r][c] === "T") {
              b[r][c] = "O"
              gset(r, c, "O")
              gmark("good", [[r, c]])
              line(8, `(${r},${c}): T was border-safe → restore it to <b>O</b>.`)
            }
          }
        line(9, `Done — <b>${captured}</b> cell${captured === 1 ? "" : "s"} captured; the border region survived.`)
        return `${captured} captured`
      },
      1,
    )
    narrate(`Inverting the question ("which O's are SAFE?") turns an awkward containment test into two plain flood-fills from the border.`)
    return go()
  },
}
