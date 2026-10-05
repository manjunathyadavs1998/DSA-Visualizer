import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]

export const rotateImage: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// rotate 90° clockwise = transpose + reverse each row
function rotate() {
  for (let i = 0; i < n; i++)          // step 1: transpose
    for (let j = i + 1; j < n; j++)
      swap(mat[i][j], mat[j][i]);
  for (let i = 0; i < n; i++)          // step 2: reverse rows
    for (let l = 0, r = n - 1; l < r; l++, r--)
      swap(mat[i][l], mat[i][r]);
}`,
  codeJava: `// rotate 90° clockwise = transpose + reverse each row
void rotate() {
  for (int i = 0; i < n; i++)          // step 1: transpose
    for (int j = i + 1; j < n; j++)
      swap(mat, i, j, j, i);
  for (int i = 0; i < n; i++)          // step 2: reverse rows
    for (int l = 0, r = n - 1; l < r; l++, r--)
      swap(mat, i, l, i, r);
}`,
  inputs: [],
  entry: () => `rotate()  // 4×4, 90° clockwise, in place`,
  run({ fn, line, gptr, gmark, gset, vars }) {
    const mat = M.map((r) => [...r])
    const go = fn(
      "rotate",
      (): string => {
        line(2, `<b>Step 1 — transpose:</b> mirror across the main diagonal.`)
        for (let i = 0; i < 4; i++)
          for (let j = i + 1; j < 4; j++) {
            gmark("focus", [[i, j], [j, i]])
            vars({ phase: "transpose", i, j })
            line(4, `Swap mat[${i}][${j}] = ${mat[i][j]} ↔ mat[${j}][${i}] = ${mat[j][i]}.`)
            const t = mat[i][j]; mat[i][j] = mat[j][i]; mat[j][i] = t
            gset(i, j, mat[i][j]); gset(j, i, mat[j][i])
          }
        line(5, `<b>Step 2 — reverse every row:</b> two pointers l and r squeeze inward.`)
        for (let i = 0; i < 4; i++) {
          gptr("i", i, -1)
          for (let l = 0, r = 3; l < r; l++, r--) {
            gptr("l", -1, l); gptr("r", -1, r)
            gmark("focus", [[i, l], [i, r]])
            vars({ phase: "reverse", i, l, r })
            line(7, `Row ${i}: swap mat[${i}][${l}] = ${mat[i][l]} ↔ mat[${i}][${r}] = ${mat[i][r]}.`)
            const t = mat[i][l]; mat[i][l] = mat[i][r]; mat[i][r] = t
            gset(i, l, mat[i][l]); gset(i, r, mat[i][r])
          }
        }
        gmark("focus", []); gptr("l", -2, 0); gptr("r", -2, 0)
        line(8, `Transpose + row-reverse = 90° clockwise. (Counter-clockwise? Reverse columns instead.)`)
        return "rotated"
      },
      1,
    )
    return go()
  },
}
