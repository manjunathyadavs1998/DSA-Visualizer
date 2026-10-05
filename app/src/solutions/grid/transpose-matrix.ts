import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

export const transposeMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// in-place transpose: swap across the main diagonal
function transpose() {
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {  // j starts PAST i:
      swap(mat, i, j);                 // only the upper triangle,
    }                                  // or you'd swap twice!
  }
}`,
  codeJava: `// in-place transpose: swap across the main diagonal
void transpose() {
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {  // j starts PAST i:
      swap(mat, i, j);                 // only the upper triangle,
    }                                  // or you'd swap twice!
  }
}`,
  inputs: [],
  entry: () => `transpose()  // 3×3, mat[i][j] ↔ mat[j][i]`,
  run({ fn, line, gptr, gmark, gset, vars }) {
    const mat = M.map((r) => [...r])
    const go = fn(
      "transpose",
      (): string => {
        gmark("window", [[0, 0], [1, 1], [2, 2]])
        line(2, `The main diagonal (i = j) never moves — everything else mirrors across it.`)
        for (let i = 0; i < 3; i++) {
          for (let j = i + 1; j < 3; j++) {
            gptr("i", i, -1); gptr("j", -1, j)
            gmark("focus", [[i, j], [j, i]])
            vars({ i, j, [`mat[${i}][${j}]`]: mat[i][j], [`mat[${j}][${i}]`]: mat[j][i] })
            line(4, `Swap mat[<b>${i}</b>][<b>${j}</b>] = ${mat[i][j]} with mat[<b>${j}</b>][<b>${i}</b>] = ${mat[j][i]} — indices mirrored.`)
            const t = mat[i][j]; mat[i][j] = mat[j][i]; mat[j][i] = t
            gset(i, j, mat[i][j]); gset(j, i, mat[j][i])
          }
        }
        gmark("focus", []); gmark("good", [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]])
        line(6, `Rows became columns. This is also step 1 of Rotate Image.`)
        return "transposed"
      },
      1,
    )
    return go()
  },
}
