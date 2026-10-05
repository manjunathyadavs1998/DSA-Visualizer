import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

export const colTraversal: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// SWAPPED loops: outer j (column), inner i (row)
function traverse() {
  for (let j = 0; j < cols; j++) {     // outer: which column
    for (let i = 0; i < rows; i++) {   // inner: walk DOWN it
      visit(mat[i][j]);  // still mat[row][col] — never mat[j][i]!
    }
  }
}`,
  codeJava: `// SWAPPED loops: outer j (column), inner i (row)
void traverse() {
  for (int j = 0; j < cols; j++) {     // outer: which column
    for (int i = 0; i < rows; i++) {   // inner: walk DOWN it
      visit(mat[i][j]);  // still mat[row][col] — never mat[j][i]!
    }
  }
}`,
  inputs: [],
  entry: () => `traverse()  // 3×4 matrix, column by column`,
  run({ fn, line, gptr, gmark, vars }) {
    const visited: [number, number][] = []
    const go = fn(
      "traverse",
      (): number => {
        for (let j = 0; j < 4; j++) {
          gptr("j", -1, j)
          line(2, `<b>j = ${j}</b> — the column pointer parks on column ${j}. Now i walks DOWN it.`)
          for (let i = 0; i < 3; i++) {
            gptr("i", i, -1)
            gmark("focus", [[i, j]])
            vars({ j, i, "mat[i][j]": M[i][j] })
            visited.push([i, j])
            gmark("good", [...visited])
            line(4, `mat[<b>${i}</b>][<b>${j}</b>] = ${M[i][j]} — the index order in brackets NEVER changes, only which loop is outside.`)
          }
        }
        gmark("focus", [])
        line(6, `Same 12 cells, different order: top→bottom, then next column right.`)
        return 12
      },
      1,
    )
    return go()
  },
}
