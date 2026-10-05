import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

export const rowTraversal: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// mat[i][j] — i picks the ROW, j picks the COLUMN
function traverse() {
  for (let i = 0; i < rows; i++) {     // outer: which row
    for (let j = 0; j < cols; j++) {   // inner: walk that row
      visit(mat[i][j]);
    }
  }
}`,
  codeJava: `// mat[i][j] — i picks the ROW, j picks the COLUMN
void traverse() {
  for (int i = 0; i < rows; i++) {     // outer: which row
    for (int j = 0; j < cols; j++) {   // inner: walk that row
      visit(mat[i][j]);
    }
  }
}`,
  inputs: [],
  entry: () => `traverse()  // 3×4 matrix`,
  run({ fn, line, gptr, gmark, vars }) {
    const visited: [number, number][] = []
    const go = fn(
      "traverse",
      (): number => {
        for (let i = 0; i < 3; i++) {
          gptr("i", i, -1)
          line(2, `<b>i = ${i}</b> — the row pointer drops to row ${i}. It will now stay put while j sweeps.`)
          for (let j = 0; j < 4; j++) {
            gptr("j", -1, j)
            gmark("focus", [[i, j]])
            vars({ i, j, "mat[i][j]": M[i][j] })
            visited.push([i, j])
            gmark("good", [...visited])
            line(4, `mat[<b>${i}</b>][<b>${j}</b>] = ${M[i][j]} — row ${i} fixed, column ${j} moving →`)
          }
        }
        gmark("focus", [])
        line(6, `Every cell visited in reading order: left→right, then next row down.`)
        return 12
      },
      1,
    )
    return go()
  },
}
