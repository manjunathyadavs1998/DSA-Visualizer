import type { SolutionDef } from "@/engine/types"

const M = [[1, 4, 7, 11], [15, 20, 25, 30], [34, 40, 45, 50]]

export const search2dMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// fully sorted matrix = one long sorted array in disguise
function search(target) {
  let lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const r = Math.floor(mid / cols), c = mid % cols; // THE trick
    if (mat[r][c] === target) return true;
    if (mat[r][c] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
  codeJava: `// fully sorted matrix = one long sorted array in disguise
boolean search(int target) {
  int lo = 0, hi = rows * cols - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    int r = mid / cols, c = mid % cols;  // THE trick
    if (mat[r][c] == target) return true;
    if (mat[r][c] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
  inputs: [{ kind: "number", name: "target", label: "target", default: 25, min: 0, max: 60 }],
  entry: (a) => `search(${a.target})  // 3×4, fully sorted`,
  run({ fn, line, gmark, vars }, args) {
    const target = args.target as number
    const cols = 4
    const go = fn(
      "search",
      (): boolean => {
        let lo = 0, hi = 11
        line(2, `Pretend the 3×4 matrix is a sorted array of 12 — binary search on positions 0..11.`)
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          const r = Math.floor(mid / cols), c = mid % cols
          gmark("focus", [[r, c]])
          vars({ lo, hi, mid, "r = mid/cols": `${mid}/4 = ${r}`, "c = mid%cols": `${mid}%4 = ${c}`, value: M[r][c] })
          line(5, `mid = ${mid} → row = ${mid} ÷ 4 = <b>${r}</b>, col = ${mid} mod 4 = <b>${c}</b> → mat[${r}][${c}] = ${M[r][c]}.`)
          if (M[r][c] === target) {
            gmark("good", [[r, c]]); gmark("focus", [])
            line(6, `${M[r][c]} equals the target — <b>found!</b>`)
            return true
          }
          if (M[r][c] < target) {
            line(7, `${M[r][c]} < ${target} → discard positions ${lo}..${mid}.`)
            gmark("done", Array.from({ length: mid - lo + 1 }, (_, x) => [Math.floor((lo + x) / cols), (lo + x) % cols] as [number, number]))
            lo = mid + 1
          } else {
            line(8, `${M[r][c]} > ${target} → discard positions ${mid}..${hi}.`)
            gmark("done", Array.from({ length: hi - mid + 1 }, (_, x) => [Math.floor((mid + x) / cols), (mid + x) % cols] as [number, number]))
            hi = mid - 1
          }
        }
        gmark("focus", [])
        line(10, `Search space exhausted — ${target} is not in the matrix.`)
        return false
      },
      1,
    )
    return go()
  },
}
