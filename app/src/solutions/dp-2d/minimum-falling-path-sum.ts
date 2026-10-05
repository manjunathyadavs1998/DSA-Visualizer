import type { SolutionDef, Args } from "@/engine/types"

// flat list → square matrix (1×1 up to 3×3)
const toGrid = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => Math.max(-99, Math.min(99, Math.trunc(v))))
  const n = Math.max(1, Math.min(3, Math.floor(Math.sqrt(flat.length))))
  if (flat.length < n * n) return [[2, 1, 3], [6, 5, 4], [7, 8, 9]]
  return Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n))
}

export const minimumFallingPathSum: SolutionDef = {
  view: "grid",
  grid: (a: Args) => toGrid(a.cells).map((r) => [...r]),
  code: `// fall(r,c) = cheapest path from (r,c) falling to the bottom
function fall(r, c) {
  if (c < 0 || c >= n) return INF;
  if (r === n) return 0;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  const next = Math.min(fall(r + 1, c - 1), fall(r + 1, c), fall(r + 1, c + 1));
  memo[key] = g[r][c] + next;
  return memo[key];
}
function minFallingPath() {
  let best = INF;
  for (let c = 0; c < n; c++)
    best = Math.min(best, fall(0, c));
  return best;
}`,
  codeJava: `// int INF = 1_000_000; fall(r,c) = cheapest fall from (r,c)
int fall(int r, int c) {
  if (c < 0 || c >= n) return INF;
  if (r == n) return 0;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  int next = Math.min(fall(r + 1, c - 1), Math.min(fall(r + 1, c), fall(r + 1, c + 1)));
  memo.put(key, g[r][c] + next);
  return memo.get(key);
}
int minFallingPath() {
  int best = INF;
  for (int c = 0; c < n; c++)
    best = Math.min(best, fall(0, c));
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "cells", label: "matrix (flat, 9 = 3×3)", default: [2, 1, 3, 6, 5, 4, 7, 8, 9], maxLen: 9 },
  ],
  entry: () => `minFallingPath()  // best start column on row 0`,
  run({ fn, memo, line, gptr, narrate }, args) {
    const g = toGrid(args.cells)
    const n = g.length
    const INF = 1_000_000
    const fall = fn(
      "fall",
      (r: number, c: number): number => {
        line(2, `fall(${r},${c}): drifted off the sides? (${c < 0 || c >= n ? "<b>yes — INF, illegal</b>" : "no"})`)
        if (c < 0 || c >= n) return INF
        line(3, `fall(${r},${c}): reached below the bottom row? (${r === n ? "<b>yes — path done, cost 0</b>" : "no"})`)
        if (r === n) return 0
        gptr("rc", r, c)
        const key = r + "," + c
        line(5, `fall(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(6, `from (${r},${c}): fall ↙ (${r + 1},${c - 1}), ↓ (${r + 1},${c}), ↘ (${r + 1},${c + 1}) — take the cheapest.`)
        const next = Math.min(fall(r + 1, c - 1), fall(r + 1, c), fall(r + 1, c + 1))
        memo[key] = g[r][c] + next
        line(7, `fall(${r},${c}) = ${g[r][c]} + ${next} = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    const minFallingPath = fn(
      "minFallingPath",
      (): number => {
        let best = INF
        for (let c = 0; c < n; c++) {
          line(13, `driver: try starting the fall at column ${c}…`)
          best = Math.min(best, fall(0, c))
          line(13, `best after column ${c} = <b>${best}</b>.`)
        }
        line(14, `cheapest falling path = <b>${best}</b>.`)
        return best
      },
      10,
    )
    narrate("Any start column is allowed, so the driver races all of them — the shared memo means later columns reuse the earlier columns' work.")
    return minFallingPath()
  },
}
