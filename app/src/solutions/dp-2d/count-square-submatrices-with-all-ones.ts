import type { SolutionDef, Args } from "@/engine/types"

// flat 0/1 list → largest square matrix it can fill (1×1 up to 3×3)
const toGrid = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => (v > 0 ? 1 : 0))
  const n = Math.max(1, Math.min(3, Math.floor(Math.sqrt(flat.length))))
  if (flat.length < n * n) return [[0, 1, 1], [1, 1, 1], [0, 1, 1]]
  return Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n))
}

export const countSquareSubmatricesWithAllOnes: SolutionDef = {
  view: "grid",
  grid: (a: Args) => toGrid(a.cells).map((r) => [...r]),
  code: `// side(r,c) = biggest all-1s square ending at (r,c)
// KEY INSIGHT: side(r,c) also COUNTS the squares ending at (r,c)!
function side(r, c) {
  if (r < 0 || c < 0 || g[r][c] === 0) return 0;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = 1 + Math.min(side(r - 1, c), side(r, c - 1), side(r - 1, c - 1));
  return memo[key];
}
function countSquares() {
  let total = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      total += side(r, c);
  return total;
}`,
  codeJava: `// side(r,c) = biggest all-1s square ending at (r,c)
// KEY INSIGHT: side(r,c) also COUNTS the squares ending at (r,c)!
int side(int r, int c) {
  if (r < 0 || c < 0 || g[r][c] == 0) return 0;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, 1 + Math.min(side(r - 1, c), Math.min(side(r, c - 1), side(r - 1, c - 1))));
  return memo.get(key);
}
int countSquares() {
  int total = 0;
  for (int r = 0; r < n; r++)
    for (int c = 0; c < n; c++)
      total += side(r, c);
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "cells", label: "grid (flat 0/1, 9 = 3×3)", default: [0, 1, 1, 1, 1, 1, 0, 1, 1], maxLen: 9 },
  ],
  entry: () => `countSquares()  // every all-1s square, any size`,
  run({ fn, memo, line, vars, gptr, gmark, narrate }, args) {
    const g = toGrid(args.cells)
    const n = g.length
    const side = fn(
      "side",
      (r: number, c: number): number => {
        line(3, `side(${r},${c}): ${r < 0 || c < 0 ? "<b>off the grid → 0</b>" : g[r][c] === 0 ? "cell is <b>0 → nothing ends here</b>" : "cell is 1"}.`)
        if (r < 0 || c < 0 || g[r][c] === 0) return 0
        const key = r + "," + c
        line(5, `side(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(6, `1 + min of the ↑ ← ↖ neighbors — each size 1..side is one countable square.`)
        memo[key] = 1 + Math.min(side(r - 1, c), side(r, c - 1), side(r - 1, c - 1))
        line(7, `side(${r},${c}) = <b>${memo[key]}</b> → ${memo[key]} square(s) end at (${r},${c}).`)
        return memo[key] as number
      },
      2,
    )
    const countSquares = fn(
      "countSquares",
      (): number => {
        let total = 0
        for (let r = 0; r < n; r++)
          for (let c = 0; c < n; c++) {
            gptr("rc", r, c)
            line(13, `driver: add side(${r},${c}) to the running total…`)
            const s = side(r, c)
            total += s
            if (s > 0) gmark("good", [[r, c]])
            line(13, `total += ${s} → <b>${total}</b>.`)
            vars({ r, c, total })
          }
        line(14, `every square counted exactly once, at its bottom-right corner → <b>${total}</b>.`)
        return total
      },
      9,
    )
    narrate("side(r,c)=3 means squares of size 1, 2 AND 3 end at (r,c) — so summing side over all cells counts every square exactly once.")
    return countSquares()
  },
}
