import type { SolutionDef } from "@/engine/types"

const M = [
  [1, 4, 9],
  [2, 5, 6],
  [3, 7, 8],
]

export const matrixMedian: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// rows sorted → binary search the VALUE range, count per row
function matrixMedian(mat) {
  let lo = 1, hi = 9;               // min .. max value
  const need = 5;                   // (9 + 1) / 2 — median rank
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let count = 0;
    for (let r = 0; r < 3; r++)
      count += lessEq(mat[r], mid);   // row is sorted
    if (count < need) lo = mid + 1;   // mid is too small
    else hi = mid;                    // mid could be the median
  }
  return lo;
}`,
  codeJava: `// rows sorted → binary search the VALUE range, count per row
int matrixMedian(int[][] mat) {
  int lo = 1, hi = 9;               // min .. max value
  int need = 5;                     // (9 + 1) / 2 — median rank
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    int count = 0;
    for (int r = 0; r < 3; r++)
      count += lessEq(mat[r], mid);   // row is sorted
    if (count < need) lo = mid + 1;   // mid is too small
    else hi = mid;                    // mid could be the median
  }
  return lo;
}`,
  inputs: [],
  entry: () => `matrixMedian(mat)  // 3×3, each ROW sorted`,
  run({ fn, line, gptr, gmark, vars }, _args) {
    const go = fn(
      "matrixMedian",
      (): number => {
        let lo = 1, hi = 9
        const need = 5
        vars({ lo, hi, need })
        line(2, `Only rows are sorted, so we can't index into a merged order. Instead binary search the <b>value range</b> 1..9.`)
        line(3, `9 values total → the median is the value with at least <b>5</b> elements ≤ it (need = 5).`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          let count = 0
          const counted: [number, number][] = []
          gmark("window", []); gmark("focus", [])
          vars({ lo, hi, mid, count })
          line(5, `Guess mid = <b>${mid}</b>: how many matrix elements are ≤ ${mid}?`)
          for (let r = 0; r < 3; r++) {
            let c = 0
            while (c < 3 && M[r][c] <= mid) {
              counted.push([r, c])
              c++
            }
            gptr("scan", r, Math.min(c, 2))
            gmark("window", [...counted])
            count += c
            vars({ lo, hi, mid, count })
            line(8, `Row ${r} is sorted — walk it: <b>${c}</b> value(s) ≤ ${mid}. Running count = <b>${count}</b>.`)
          }
          if (count < need) {
            line(9, `count = ${count} < ${need} → ${mid} sits <b>below the median</b>. Raise the floor: lo = ${mid + 1}.`)
            lo = mid + 1
          } else {
            line(10, `count = ${count} ≥ ${need} → the median is <b>≤ ${mid}</b>. Lower the ceiling: hi = ${mid}.`)
            hi = mid
          }
          vars({ lo, hi, count })
        }
        gmark("window", [])
        gmark("good", (() => {
          const cells: [number, number][] = []
          for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (M[r][c] === lo) cells.push([r, c])
          return cells
        })())
        line(12, `lo met hi at <b>${lo}</b> — the smallest value with ≥ 5 elements ≤ it. That is the median.`)
        return lo
      },
      1,
    )
    return go()
  },
}
