import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]]

export const toeplitzMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// Toeplitz: every ↘ diagonal holds a single value
function isToeplitz() {
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (mat[i][j] !== mat[i - 1][j - 1]) return false;
    } // compare each cell to its upper-left neighbor
  }
  return true;
}`,
  codeJava: `// Toeplitz: every ↘ diagonal holds a single value
boolean isToeplitz() {
  for (int i = 1; i < rows; i++) {
    for (int j = 1; j < cols; j++) {
      if (mat[i][j] != mat[i - 1][j - 1]) return false;
    } // compare each cell to its upper-left neighbor
  }
  return true;
}`,
  inputs: [],
  entry: () => `isToeplitz()  // 3×4`,
  run({ fn, line, gmark, vars }) {
    const ok: [number, number][] = []
    const go = fn(
      "isToeplitz",
      (): boolean => {
        line(2, `Start from (1,1) — row 0 and column 0 have no upper-left neighbor to disagree with.`)
        for (let i = 1; i < 3; i++)
          for (let j = 1; j < 4; j++) {
            gmark("focus", [[i, j], [i - 1, j - 1]])
            vars({ i, j, [`mat[${i}][${j}]`]: M[i][j], "upper-left": M[i - 1][j - 1] })
            line(4, `mat[${i}][${j}] = ${M[i][j]} vs mat[${i - 1}][${j - 1}] = ${M[i - 1][j - 1]} → ${M[i][j] === M[i - 1][j - 1] ? "same ✓" : "<b>different — not Toeplitz!</b>"}`)
            if (M[i][j] !== M[i - 1][j - 1]) {
              gmark("bad", [[i, j], [i - 1, j - 1]])
              return false
            }
            ok.push([i, j])
            gmark("good", [...ok])
          }
        gmark("focus", [])
        line(7, `All (i,j) match their (i−1, j−1) — every diagonal is constant. <b>Toeplitz ✓</b>`)
        return true
      },
      1,
    )
    return go()
  },
}
