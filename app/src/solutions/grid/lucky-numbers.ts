import type { SolutionDef } from "@/engine/types"

const M = [
  [3, 7, 8],
  [9, 11, 13],
  [15, 16, 17],
]

export const luckyNumbers: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// lucky = MINIMUM of its row AND MAXIMUM of its column
function luckyNumbers() {
  const lucky = [];
  for (let i = 0; i < rows; i++) {
    let jMin = 0;                       // scan ROW i for its min
    for (let j = 1; j < cols; j++)
      if (mat[i][j] < mat[i][jMin]) jMin = j;
    let isMax = true;                   // scan COLUMN jMin
    for (let k = 0; k < rows; k++)
      if (mat[k][jMin] > mat[i][jMin]) isMax = false;
    if (isMax) lucky.push(mat[i][jMin]);
  }
  return lucky;
}`,
  codeJava: `// lucky = MINIMUM of its row AND MAXIMUM of its column
List<Integer> luckyNumbers() {
  List<Integer> lucky = new ArrayList<>();
  for (int i = 0; i < rows; i++) {
    int jMin = 0;                       // scan ROW i for its min
    for (int j = 1; j < cols; j++)
      if (mat[i][j] < mat[i][jMin]) jMin = j;
    boolean isMax = true;               // scan COLUMN jMin
    for (int k = 0; k < rows; k++)
      if (mat[k][jMin] > mat[i][jMin]) isMax = false;
    if (isMax) lucky.add(mat[i][jMin]);
  }
  return lucky;
}`,
  inputs: [],
  entry: () => `luckyNumbers()  // 3×3`,
  run({ fn, line, gptr, gmark, vars }) {
    const go = fn(
      "luckyNumbers",
      (): string => {
        const lucky: number[] = []
        for (let i = 0; i < 3; i++) {
          gptr("i", i, -1)
          gmark("window", [0, 1, 2].map((j) => [i, j] as [number, number]))
          line(4, `<b>Row ${i}</b> (highlighted band): find its minimum by moving j.`)
          let jMin = 0
          for (let j = 1; j < 3; j++) if (M[i][j] < M[i][jMin]) jMin = j
          gptr("jMin", -1, jMin)
          gmark("focus", [[i, jMin]])
          vars({ i, jMin, "row min": M[i][jMin] })
          line(7, `Row ${i}'s minimum is ${M[i][jMin]} at column ${jMin}. Now flip the axis…`)
          gmark("window", [0, 1, 2].map((k) => [k, jMin] as [number, number]))
          line(9, `<b>Column ${jMin}</b> (band now vertical!): is ${M[i][jMin]} also the biggest here?`)
          const isMax = [0, 1, 2].every((k) => M[k][jMin] <= M[i][jMin])
          if (isMax) {
            lucky.push(M[i][jMin])
            gmark("good", [[i, jMin]])
            line(11, `Yes — ${M[i][jMin]} is min of row ${i} AND max of column ${jMin}. <b>Lucky!</b>`)
          } else {
            gmark("bad", [[i, jMin]])
            line(10, `No — something in column ${jMin} is bigger. Not lucky.`)
          }
        }
        gmark("focus", []); gmark("window", [])
        line(13, `Done. Lucky numbers: [${lucky.join(", ")}]. One value, two perspectives — row-wise then column-wise.`)
        return JSON.stringify(lucky)
      },
      1,
    )
    return go()
  },
}
