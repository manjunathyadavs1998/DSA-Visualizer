import type { SolutionDef } from "@/engine/types"

export const nQueens: SolutionDef = {
  code: `// n editable — one queen per row; board fills below
function place(row) {
  if (row === n) { result.push([...queens]); return; }
  for (let col = 0; col < n; col++) {
    if (!safe(row, col)) continue;  // attacked — skip
    queens[row] = col;              // place queen
    place(row + 1);
    queens[row] = -1;               // backtrack
  }
}`,
  codeJava: `// int n — one queen per row; board fills below
void place(int row) {
  if (row == n) { result.add(copyOf(queens)); return; }
  for (int col = 0; col < n; col++) {
    if (!safe(row, col)) continue;  // attacked — skip
    queens[row] = col;              // place queen
    place(row + 1);
    queens[row] = -1;               // backtrack
  }
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 4, min: 4, max: 6 }],
  entry: (a) => `place(0)  // ${a.n}×${a.n} board`,
  run({ fn, line, vars, memo, narrate }, args) {
    const n = args.n as number
    const queens: number[] = Array(n).fill(-1)
    const result: number[][] = []
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) memo[`${r},${c}`] = "·"
    const safe = (row: number, col: number) => {
      for (let r = 0; r < row; r++) {
        const c = queens[r]
        if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false
      }
      return true
    }
    const place = fn(
      "place",
      (row: number): string => {
        line(2, `Row ${row}: all rows filled? (${row === n ? "<b>yes — a full solution! ♛ positions: [" + queens.join(",") + "]</b>" : "no"})`)
        if (row === n) {
          result.push([...queens])
          return "solution " + queens.join(",")
        }
        for (let col = 0; col < n; col++) {
          if (!safe(row, col)) {
            line(4, `(${row},${col}) is attacked by an earlier queen → skip.`)
            continue
          }
          line(5, `(${row},${col}) is safe → <b>place a queen</b> and go to row ${row + 1}.`)
          queens[row] = col
          memo[`${row},${col}`] = "♛"
          vars({ queens: queens.map((q) => (q < 0 ? "·" : q)).join("") })
          place(row + 1)
          line(7, `No luck below (or exploring more) → <b>remove the queen from (${row},${col})</b>.`)
          queens[row] = -1
          memo[`${row},${col}`] = "·"
        }
        return "✓"
      },
      1,
    )
    narrate(`One queen per row; columns and diagonals must stay clear. Watch the board below — ♛ appear and vanish as it backtracks.`)
    place(0)
    return `${result.length} solutions`
  },
}
