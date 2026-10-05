import type { SolutionDef, Args } from "@/engine/types"

// flat 0/1 list → square grid (1 = obstacle)
const toGrid = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => (v > 0 ? 1 : 0))
  const n = Math.max(1, Math.min(3, Math.floor(Math.sqrt(flat.length))))
  if (flat.length < n * n) return [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
  const g = Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n))
  g[0][0] = 0 // a blocked start would make every trace trivially empty
  return g
}

export const uniquePathsII: SolutionDef = {
  view: "grid",
  grid: (a: Args) => toGrid(a.cells).map((r) => [...r]),
  code: `// paths(r,c) = ways to reach bottom-right dodging obstacles (1s)
function paths(r, c) {
  if (r === n || c === n || g[r][c] === 1) return 0;
  if (r === n - 1 && c === n - 1) return 1;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = paths(r + 1, c) + paths(r, c + 1);
  return memo[key];
}`,
  codeJava: `// paths(r,c) = ways to reach bottom-right dodging obstacles (1s)
int paths(int r, int c) {
  if (r == n || c == n || g[r][c] == 1) return 0;
  if (r == n - 1 && c == n - 1) return 1;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, paths(r + 1, c) + paths(r, c + 1));
  return memo.get(key);
}`,
  inputs: [
    { kind: "numbers", name: "cells", label: "grid (flat 0/1, 1 = obstacle)", default: [0, 0, 0, 0, 1, 0, 0, 0, 0], maxLen: 9 },
  ],
  entry: () => `paths(0, 0)  // robot walks only → and ↓`,
  run({ fn, memo, line, gptr, gmark, narrate }, args) {
    const g = toGrid(args.cells)
    const n = g.length
    const obstacles: [number, number][] = []
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (g[r][c] === 1) obstacles.push([r, c])
    gmark("bad", obstacles)
    const paths = fn(
      "paths",
      (r: number, c: number): number => {
        const off = r === n || c === n
        line(2, `paths(${r},${c}): ${off ? "<b>off the grid → 0 ways</b>" : g[r][c] === 1 ? "<b>obstacle! → 0 ways through here</b>" : "cell is open"}.`)
        if (off || g[r][c] === 1) return 0
        gptr("rc", r, c)
        line(3, `paths(${r},${c}): is this the goal? (${r === n - 1 && c === n - 1 ? "<b>yes — exactly 1 way: stand still</b>" : "no"})`)
        if (r === n - 1 && c === n - 1) {
          gmark("good", [[r, c]])
          return 1
        }
        const key = r + "," + c
        line(5, `paths(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(6, `every route from (${r},${c}) starts ↓ to (${r + 1},${c}) or → to (${r},${c + 1}) — <b>add</b> the two counts.`)
        memo[key] = paths(r + 1, c) + paths(r, c + 1)
        line(7, `paths(${r},${c}) = <b>${memo[key]}</b> way(s).`)
        return memo[key] as number
      },
      1,
    )
    narrate("Unique Paths plus one twist: an obstacle is just a cell whose count is 0 — the recurrence routes everything around it automatically.")
    return paths(0, 0)
  },
}
