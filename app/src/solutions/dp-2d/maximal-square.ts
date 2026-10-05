import type { SolutionDef, Args } from "@/engine/types"

// flat 0/1 list → largest square matrix it can fill (1×1 up to 3×3)
const toGrid = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => (v > 0 ? 1 : 0))
  const n = Math.max(1, Math.min(3, Math.floor(Math.sqrt(flat.length))))
  if (flat.length < n * n) return [[1, 1, 0], [1, 1, 1], [0, 1, 1]]
  return Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n))
}

export const maximalSquare: SolutionDef = {
  view: "grid",
  grid: (a: Args) => toGrid(a.cells).map((r) => [...r]),
  code: `// side(r,c) = largest all-1s square whose bottom-right is (r,c)
function side(r, c) {
  if (r < 0 || c < 0 || g[r][c] === 0) return 0;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = 1 + Math.min(side(r - 1, c), side(r, c - 1), side(r - 1, c - 1));
  return memo[key];
}
function maximalSquare() {
  let best = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      best = Math.max(best, side(r, c));
  return best * best;
}`,
  codeJava: `// side(r,c) = largest all-1s square whose bottom-right is (r,c)
int side(int r, int c) {
  if (r < 0 || c < 0 || g[r][c] == 0) return 0;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, 1 + Math.min(side(r - 1, c), Math.min(side(r, c - 1), side(r - 1, c - 1))));
  return memo.get(key);
}
int maximalSquare() {
  int best = 0;
  for (int r = 0; r < n; r++)
    for (int c = 0; c < n; c++)
      best = Math.max(best, side(r, c));
  return best * best;
}`,
  inputs: [
    { kind: "numbers", name: "cells", label: "grid (flat 0/1, 9 = 3×3)", default: [1, 1, 0, 1, 1, 1, 0, 1, 1], maxLen: 9 },
  ],
  entry: () => `maximalSquare()  // area of the biggest all-1s square`,
  run({ fn, memo, line, vars, gptr, gmark, narrate }, args) {
    const g = toGrid(args.cells)
    const n = g.length
    const side = fn(
      "side",
      (r: number, c: number): number => {
        line(2, `side(${r},${c}): ${r < 0 || c < 0 ? "<b>off the grid → 0</b>" : g[r][c] === 0 ? "cell is <b>0 → no square ends here</b>" : "cell is 1, keep going"}.`)
        if (r < 0 || c < 0 || g[r][c] === 0) return 0
        const key = r + "," + c
        line(4, `side(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `side(${r},${c}) = 1 + min(↑ above, ← left, ↖ diagonal) — the <b>weakest neighbor caps the square</b>.`)
        memo[key] = 1 + Math.min(side(r - 1, c), side(r, c - 1), side(r - 1, c - 1))
        line(6, `side(${r},${c}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    const maximalSquareFn = fn(
      "maximalSquare",
      (): number => {
        let best = 0
        let bestAt: [number, number] = [-1, -1]
        for (let r = 0; r < n; r++)
          for (let c = 0; c < n; c++) {
            gptr("rc", r, c)
            line(12, `driver: ask side(${r},${c})…`)
            const s = side(r, c)
            if (s > best) { best = s; bestAt = [r, c] }
            line(12, `best so far = <b>${best}</b> (side at (${bestAt[0]},${bestAt[1]})).`)
            vars({ r, c, best })
          }
        const [br, bc] = bestAt
        const cells: [number, number][] = []
        for (let r = br - best + 1; r <= br; r++) for (let c = bc - best + 1; c <= bc; c++) cells.push([r, c])
        gmark("good", cells)
        line(13, `biggest side = ${best} → area = ${best}×${best} = <b>${best * best}</b>.`)
        return best * best
      },
      8,
    )
    narrate("The classic reframe: don't look FOR squares, define side(r,c) = biggest square ENDING at (r,c). Its three neighbors already know the answer.")
    return maximalSquareFn()
  },
}
