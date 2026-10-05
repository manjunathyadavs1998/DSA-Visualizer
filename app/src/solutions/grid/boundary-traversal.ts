import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

export const boundaryTraversal: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// walk the border clockwise: top → right → bottom → left
function boundary() {
  for (let j = 0; j < cols; j++)      visit(0, j);        // top row →
  for (let i = 1; i < rows; i++)      visit(i, cols - 1); // right col ↓
  for (let j = cols - 2; j >= 0; j--) visit(rows - 1, j); // bottom ←
  for (let i = rows - 2; i > 0; i--)  visit(i, 0);        // left col ↑
}`,
  codeJava: `// walk the border clockwise: top → right → bottom → left
void boundary() {
  for (int j = 0; j < cols; j++)      visit(0, j);        // top row →
  for (int i = 1; i < rows; i++)      visit(i, cols - 1); // right col ↓
  for (int j = cols - 2; j >= 0; j--) visit(rows - 1, j); // bottom ←
  for (int i = rows - 2; i > 0; i--)  visit(i, 0);        // left col ↑
}`,
  inputs: [],
  entry: () => `boundary()  // 3×4 matrix`,
  run({ fn, line, gptr, gmark, vars }) {
    const path: [number, number][] = []
    const go = fn(
      "boundary",
      (): number => {
        const visit = (i: number, j: number, ln: number, msg: string) => {
          gptr("rc", i, j)
          gmark("focus", [[i, j]])
          vars({ i, j, value: M[i][j] })
          path.push([i, j])
          gmark("good", [...path])
          line(ln, msg)
        }
        for (let j = 0; j < 4; j++) visit(0, j, 2, `Top row: row stays 0, <b>j = ${j}</b> moves right.`)
        for (let i = 1; i < 3; i++) visit(i, 3, 3, `Right column: col stays ${3}, <b>i = ${i}</b> moves down.`)
        for (let j = 2; j >= 0; j--) visit(2, j, 4, `Bottom row backwards: row stays 2, <b>j = ${j}</b> moves left.`)
        for (let i = 1; i > 0; i--) visit(i, 0, 5, `Left column upwards: col stays 0, <b>i = ${i}</b> moves up. (Note: corners visited only once!)`)
        gmark("focus", [])
        line(6, `Full clockwise border. Each side fixes one index and moves the other.`)
        return path.length
      },
      1,
    )
    return go()
  },
}
