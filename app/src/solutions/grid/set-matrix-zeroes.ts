import type { SolutionDef } from "@/engine/types"

const M = [[1, 1, 1, 1], [1, 0, 1, 1], [1, 1, 1, 0]]

export const setMatrixZeroes: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// pass 1: find zeros; pass 2: wipe their rows + columns
function setZeroes() {
  const zr = new Set(), zc = new Set();
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (mat[i][j] === 0) { zr.add(i); zc.add(j); }
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (zr.has(i) || zc.has(j)) mat[i][j] = 0;
}`,
  codeJava: `// pass 1: find zeros; pass 2: wipe their rows + columns
void setZeroes() {
  Set<Integer> zr = new HashSet<>(), zc = new HashSet<>();
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
      if (mat[i][j] == 0) { zr.add(i); zc.add(j); }
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
      if (zr.contains(i) || zc.contains(j)) mat[i][j] = 0;
}`,
  inputs: [],
  entry: () => `setZeroes()  // zeros at (1,1) and (2,3)`,
  run({ fn, line, gmark, gset, vars }) {
    const mat = M.map((r) => [...r])
    const go = fn(
      "setZeroes",
      (): string => {
        const zr = new Set<number>(), zc = new Set<number>()
        line(3, `<b>Pass 1:</b> scan every cell, remember which rows and columns contain a 0.`)
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 4; j++) {
            if (mat[i][j] === 0) {
              gmark("bad", [[i, j]])
              vars({ "zero rows": [...zr, i].join(","), "zero cols": [...zc, j].join(",") })
              line(5, `Found a 0 at (${i},${j}) → row ${i} and column ${j} are doomed.`)
              zr.add(i); zc.add(j)
            }
          }
        line(6, `<b>Pass 2:</b> wipe every cell whose row or column was marked. (Why two passes? Zeroing during pass 1 would create fake zeros!)`)
        const wiped: [number, number][] = []
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 4; j++)
            if (zr.has(i) || zc.has(j)) {
              gmark("focus", [[i, j]])
              line(8, `(${i},${j}): row ${i} ${zr.has(i) ? "IS" : "isn't"} marked, col ${j} ${zc.has(j) ? "IS" : "isn't"} → zero it.`)
              mat[i][j] = 0
              gset(i, j, 0)
              wiped.push([i, j])
              gmark("good", [...wiped])
            }
        gmark("focus", [])
        line(9, `Rows {${[...zr]}} and columns {${[...zc]}} are now all zeros.`)
        return "done"
      },
      1,
    )
    return go()
  },
}
