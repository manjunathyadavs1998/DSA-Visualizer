import type { SolutionDef } from "@/engine/types"

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]

export const spiralMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// four shrinking walls: top, bottom, left, right
function spiral() {
  let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++)  visit(top, j);
    top++;                                // top wall moves down
    for (let i = top; i <= bottom; i++)  visit(i, right);
    right--;                              // right wall moves in
    if (top > bottom || left > right) break;
    for (let j = right; j >= left; j--)  visit(bottom, j);
    bottom--;                             // bottom wall moves up
    for (let i = bottom; i >= top; i--)  visit(i, left);
    left++;                               // left wall moves in
  }
}`,
  codeJava: `// four shrinking walls: top, bottom, left, right
void spiral() {
  int top = 0, bottom = rows - 1, left = 0, right = cols - 1;
  while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++)  visit(top, j);
    top++;                                // top wall moves down
    for (int i = top; i <= bottom; i++)  visit(i, right);
    right--;                              // right wall moves in
    if (top > bottom || left > right) break;
    for (int j = right; j >= left; j--)  visit(bottom, j);
    bottom--;                             // bottom wall moves up
    for (int i = bottom; i >= top; i--)  visit(i, left);
    left++;                               // left wall moves in
  }
}`,
  inputs: [],
  entry: () => `spiral()  // 4×4 matrix`,
  run({ fn, line, gptr, gmark, vars }) {
    const path: [number, number][] = []
    const go = fn(
      "spiral",
      (): number => {
        let top = 0, bottom = 3, left = 0, right = 3
        const walls = () => {
          gptr("top", top, -1); gptr("bot", bottom, -1); gptr("L", -1, left); gptr("R", -1, right)
          vars({ top, bottom, left, right })
        }
        const visit = (i: number, j: number, ln: number, msg: string) => {
          gmark("focus", [[i, j]]); path.push([i, j]); gmark("good", [...path]); line(ln, msg)
        }
        walls()
        line(2, `Four walls fence the unvisited area. Each pass eats one wall inward.`)
        while (top <= bottom && left <= right) {
          for (let j = left; j <= right; j++) visit(top, j, 4, `→ along the top wall (row ${top}), j = ${j}.`)
          top++; walls(); line(5, `Top wall done → <b>top moves down to row ${top}</b>.`)
          for (let i = top; i <= bottom; i++) visit(i, right, 6, `↓ along the right wall (col ${right}), i = ${i}.`)
          right--; walls(); line(7, `Right wall done → <b>right moves in to col ${right}</b>.`)
          if (top > bottom || left > right) break
          for (let j = right; j >= left; j--) visit(bottom, j, 9, `← along the bottom wall (row ${bottom}), j = ${j}.`)
          bottom--; walls(); line(10, `Bottom wall done → <b>bottom moves up to row ${bottom}</b>.`)
          for (let i = bottom; i >= top; i--) visit(i, left, 11, `↑ along the left wall (col ${left}), i = ${i}.`)
          left++; walls(); line(12, `Left wall done → <b>left moves in to col ${left}</b>.`)
        }
        gmark("focus", [])
        line(13, `Walls crossed — every cell visited exactly once, in a spiral.`)
        return path.length
      },
      1,
    )
    return go()
  },
}
