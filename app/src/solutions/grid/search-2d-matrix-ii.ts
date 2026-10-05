import type { SolutionDef } from "@/engine/types"

const M = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]]

export const search2dMatrixII: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// rows sorted AND columns sorted → start at the TOP-RIGHT
function search(target) {
  let r = 0, c = cols - 1;      // top-right corner
  while (r < rows && c >= 0) {
    if (mat[r][c] === target) return true;
    if (mat[r][c] > target) c--;  // too big → step LEFT
    else r++;                     // too small → step DOWN
  }
  return false;
}`,
  codeJava: `// rows sorted AND columns sorted → start at the TOP-RIGHT
boolean search(int target) {
  int r = 0, c = cols - 1;      // top-right corner
  while (r < rows && c >= 0) {
    if (mat[r][c] == target) return true;
    if (mat[r][c] > target) c--;  // too big → step LEFT
    else r++;                     // too small → step DOWN
  }
  return false;
}`,
  inputs: [{ kind: "number", name: "target", label: "target", default: 9, min: 0, max: 20 }],
  entry: (a) => `search(${a.target})  // staircase from top-right`,
  run({ fn, line, gptr, gmark, vars }, args) {
    const target = args.target as number
    const trail: [number, number][] = []
    const go = fn(
      "search",
      (): boolean => {
        let r = 0, c = 3
        gptr("r", 0, -1); gptr("c", -1, 3)
        line(2, `Top-right is magic: everything LEFT of it is smaller, everything BELOW is bigger — one comparison kills a whole row or column.`)
        while (r < 4 && c >= 0) {
          gptr("r", r, -1); gptr("c", -1, c); gmark("focus", [[r, c]])
          vars({ r, c, value: M[r][c], target })
          line(4, `mat[<b>${r}</b>][<b>${c}</b>] = ${M[r][c]} vs target ${target}.`)
          if (M[r][c] === target) {
            gmark("good", [[r, c]]); gmark("focus", [])
            line(4, `<b>Found it at (${r},${c})!</b>`)
            return true
          }
          trail.push([r, c]); gmark("done", [...trail])
          if (M[r][c] > target) {
            line(5, `${M[r][c]} > ${target} → this whole COLUMN below is even bigger → step <b>left</b> (c−−).`)
            c--
          } else {
            line(6, `${M[r][c]} < ${target} → this whole ROW to the left is even smaller → step <b>down</b> (r++).`)
            r++
          }
        }
        gmark("focus", [])
        line(8, `Walked off the matrix — ${target} isn't here. Total steps ≤ rows + cols.`)
        return false
      },
      1,
    )
    return go()
  },
}
