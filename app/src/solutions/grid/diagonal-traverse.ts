import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

export const diagonalTraverse: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// every anti-diagonal shares one secret: i + j = d
function traverse() {
  for (let d = 0; d < rows + cols - 1; d++) {
    for (let i = 0; i < rows; i++) {
      const j = d - i;              // because i + j = d
      if (j < 0 || j >= cols) continue;
      visit(mat[i][j]);
    }
  }
}`,
  codeJava: `// every anti-diagonal shares one secret: i + j = d
void traverse() {
  for (int d = 0; d < rows + cols - 1; d++) {
    for (int i = 0; i < rows; i++) {
      int j = d - i;                // because i + j = d
      if (j < 0 || j >= cols) continue;
      visit(mat[i][j]);
    }
  }
}`,
  inputs: [],
  entry: () => `traverse()  // 3×4, diagonals d = 0..5`,
  run({ fn, line, gptr, gmark, vars }) {
    const done: [number, number][] = []
    const go = fn(
      "traverse",
      (): number => {
        for (let d = 0; d < 6; d++) {
          const diag: [number, number][] = []
          for (let i = 0; i < 3; i++) if (d - i >= 0 && d - i < 4) diag.push([i, d - i])
          gmark("window", diag)
          line(2, `<b>d = ${d}</b>: all cells where i + j = ${d} — that's the highlighted diagonal.`)
          for (let i = 0; i < 3; i++) {
            const j = d - i
            gptr("i", i, -1)
            vars({ d, i, "j = d − i": `${d} − ${i} = ${j}` })
            line(4, `i = ${i}: compute j = d − i = ${d} − ${i} = <b>${j}</b>.`)
            if (j < 0 || j >= 4) {
              line(5, `j = ${j} is outside columns 0..3 → <b>continue</b> — this (i, j) falls off the matrix, nothing to visit.`)
              continue
            }
            line(5, `j = ${j} is inside 0..3 ✓ — no skip.`)
            gptr("j", -1, j); gmark("focus", [[i, j]])
            vars({ d, i, j, value: M[i][j] })
            done.push([i, j])
            gmark("good", [...done])
            line(6, `visit mat[${i}][${j}] = ${M[i][j]} — one more cell of the d = ${d} diagonal.`)
          }
        }
        gmark("focus", []); gmark("window", [])
        line(8, `12 cells in 6 diagonal stripes — the i + j = d trick powers LC 498, 1424 and friends.`)
        return 12
      },
      1,
    )
    return go()
  },
}
