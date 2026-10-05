import type { SolutionDef } from "@/engine/types"

const M = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
  [0, 0, 0],
]
const ROWS = 4, COLS = 3

export const gameOfLife: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// O(1) space: bit 2 stores the NEXT state, bit 1 keeps the CURRENT
function gameOfLife(board) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const live = countLiveNeighbors(r, c); // reads bit 1 only
      if ((board[r][c] & 1) === 1) {
        if (live === 2 || live === 3) board[r][c] = 3; // 11: alive → alive
      } else if (live === 3) board[r][c] = 2;          // 10: dead → alive
    }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      board[r][c] >>= 1;                               // reveal next state
}`,
  codeJava: `// O(1) space: bit 2 stores the NEXT state, bit 1 keeps the CURRENT
void gameOfLife(int[][] board) {
  for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++) {
      int live = countLiveNeighbors(r, c); // reads bit 1 only
      if ((board[r][c] & 1) == 1) {
        if (live == 2 || live == 3) board[r][c] = 3;   // 11: alive → alive
      } else if (live == 3) board[r][c] = 2;           // 10: dead → alive
    }
  for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
      board[r][c] >>= 1;                               // reveal next state
}`,
  inputs: [],
  entry: () => `gameOfLife()  // glider: 1 = live, 0 = dead`,
  run({ fn, line, gmark, gset, vars }) {
    const board = M.map((r) => [...r])
    const nbrs = (r: number, c: number): [number, number][] => {
      const out: [number, number][] = []
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc])
        }
      return out
    }
    const go = fn(
      "gameOfLife",
      (): string => {
        line(2, `<b>Pass 1:</b> decide every cell's fate — but never overwrite the present. Both states share one int: bit 1 = now, bit 2 = next.`)
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++) {
            const around = nbrs(r, c)
            const live = around.filter(([nr, nc]) => (board[nr][nc] & 1) === 1).length
            const encoded = around.find(([nr, nc]) => board[nr][nc] >= 2)
            const note = encoded
              ? ` Neighbor (${encoded[0]},${encoded[1]}) shows ${board[encoded[0]][encoded[1]]}, but its low bit ${board[encoded[0]][encoded[1]] & 1} is what counts.`
              : ""
            gmark("focus", [[r, c]])
            gmark("window", around)
            vars({ r, c, live })
            if ((board[r][c] & 1) === 1) {
              if (live === 2 || live === 3) {
                board[r][c] = 3
                gset(r, c, 3)
                line(6, `(${r},${c}) is <b>alive</b> with ${live} live neighbors → survives. Write <b>3</b> (binary 11): alive next AND alive now.${note}`)
              } else {
                line(5, `(${r},${c}) is <b>alive</b> with ${live} live neighbor(s) → ${live < 2 ? "underpopulation" : "overpopulation"}, it dies. Leave <b>1</b> (binary 01): bit 2 already says dead, yet neighbors still see it alive.${note}`)
              }
            } else if (live === 3) {
              board[r][c] = 2
              gset(r, c, 2)
              line(7, `(${r},${c}) is <b>dead</b> with exactly 3 live neighbors → reproduction! Write <b>2</b> (binary 10): alive next, but the low bit 0 keeps it dead for pass 1.${note}`)
            } else {
              line(7, `(${r},${c}) is <b>dead</b> with ${live} live neighbor(s) — birth needs exactly 3. Stays 0.${note}`)
            }
          }
        gmark("window", [])
        line(9, `<b>Pass 2:</b> every fate is stored in bit 2 — one right-shift per cell reveals the next generation.`)
        for (let r = 0; r < ROWS; r++) {
          const before = board[r].join(" ")
          for (let c = 0; c < COLS; c++) {
            board[r][c] >>= 1
            gset(r, c, board[r][c])
          }
          gmark("focus", board[r].map((_, c) => [r, c] as [number, number]))
          line(11, `Row ${r}: [${before}] >> 1 → [${board[r].join(" ")}].`)
        }
        const alive: [number, number][] = []
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 1) alive.push([r, c])
        gmark("focus", [])
        gmark("good", alive)
        line(12, `The glider advanced one generation — in place, O(1) extra space, and no cell ever saw a half-updated neighbor.`)
        return "done"
      },
      1,
    )
    go()
    return JSON.stringify(board)
  },
}
