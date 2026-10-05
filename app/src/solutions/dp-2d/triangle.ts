import type { SolutionDef, Args } from "@/engine/types"

// flat list → triangle rows [ [a], [b,c], [d,e,f], ... ] (largest complete triangle)
const toTriangle = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => Math.max(-9, Math.min(9, Math.trunc(v))))
  let rows = 0
  while (((rows + 1) * (rows + 2)) / 2 <= flat.length) rows++
  if (rows < 1) return [[2], [3, 4], [6, 5, 7], [4, 1, 8]]
  const tri: number[][] = []
  let k = 0
  for (let r = 0; r < rows; r++) tri.push(flat.slice(k, (k += r + 1)))
  return tri
}

export const triangle: SolutionDef = {
  view: "grid",
  grid: (a: Args) => {
    const tri = toTriangle(a.tri)
    return tri.map((row) => [...row, ...Array(tri.length - row.length).fill("")])
  },
  code: `// best(r,c) = min path sum from (r,c) down to the bottom row
function best(r, c) {
  if (r === rows) return 0;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  const down = best(r + 1, c);
  const diag = best(r + 1, c + 1);
  memo[key] = tri[r][c] + Math.min(down, diag);
  return memo[key];
}`,
  codeJava: `// best(r,c) = min path sum from (r,c) down to the bottom row
int best(int r, int c) {
  if (r == rows) return 0;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  int down = best(r + 1, c);
  int diag = best(r + 1, c + 1);
  memo.put(key, tri[r][c] + Math.min(down, diag));
  return memo.get(key);
}`,
  inputs: [
    { kind: "numbers", name: "tri", label: "triangle (flat rows: 1+2+3+4 numbers)", default: [2, 3, 4, 6, 5, 7, 4, 1, 8, 3], maxLen: 10 },
  ],
  entry: () => `best(0, 0)  // minimum total from the apex`,
  run({ fn, memo, line, gptr, gmark, narrate }, args) {
    const tri = toTriangle(args.tri)
    const rows = tri.length
    const best = fn(
      "best",
      (r: number, c: number): number => {
        if (r < rows) gptr("rc", r, c)
        line(2, `best(${r},${c}): fell off the bottom? (${r === rows ? "<b>yes — path complete, cost 0</b>" : "no"})`)
        if (r === rows) return 0
        gmark("focus", [[r, c]])
        const key = r + "," + c
        line(4, `best(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `from ${tri[r][c]} at (${r},${c}): explore straight <b>down</b> to (${r + 1},${c})…`)
        const down = best(r + 1, c)
        line(6, `…and <b>diagonal</b> to (${r + 1},${c + 1}).`)
        const diag = best(r + 1, c + 1)
        memo[key] = tri[r][c] + Math.min(down, diag)
        line(7, `best(${r},${c}) = ${tri[r][c]} + min(${down}, ${diag}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Each cell asks only its two children below. Without the memo the two paths meeting at a cell would recompute its whole subtree.")
    return best(0, 0)
  },
}
