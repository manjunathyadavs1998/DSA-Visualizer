import type { SolutionDef } from "@/engine/types"

const MOVES: [number, number][] = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]

export const knightProbabilityInChessboard: SolutionDef = {
  code: `// p(k,r,c): chance the knight is still on-board after k more moves
// memo key packs the square into one column: r * n + c
function p(k, r, c) {
  if (r < 0 || c < 0 || r >= n || c >= n) return 0;
  if (k === 0) return 1;
  const key = k + "," + (r * n + c);
  if (memo[key] !== undefined) return memo[key];
  let sum = 0;
  for (const [dr, dc] of MOVES)
    sum += p(k - 1, r + dr, c + dc) / 8;
  memo[key] = sum;
  return sum;
}`,
  codeJava: `// p(k,r,c): chance the knight is still on-board after k more moves
// memo key packs the square into one column: r * n + c
double p(int k, int r, int c) {
  if (r < 0 || c < 0 || r >= n || c >= n) return 0;
  if (k == 0) return 1;
  String key = k + "," + (r * n + c);
  if (memo.get(key) != null) return memo.get(key);
  double sum = 0;
  for (int[] m : MOVES)
    sum += p(k - 1, r + m[0], c + m[1]) / 8.0;
  memo.put(key, sum);
  return sum;
}`,
  inputs: [
    { kind: "number", name: "n", label: "board size n", default: 3, min: 2, max: 4 },
    { kind: "number", name: "k", label: "moves k", default: 2, min: 1, max: 3 },
    { kind: "number", name: "row", label: "start row", default: 0, min: 0, max: 3 },
    { kind: "number", name: "col", label: "start col", default: 0, min: 0, max: 3 },
  ],
  entry: (a) => `p(${a.k}, ${a.row}, ${a.col})  // ${a.n}×${a.n} board`,
  run({ fn, memo, line, vars, narrate }, args) {
    const n = args.n as number
    const k0 = args.k as number
    const r0 = Math.min(n - 1, args.row as number)
    const c0 = Math.min(n - 1, args.col as number)
    const p = fn(
      "p",
      (k: number, r: number, c: number): number => {
        line(3, `p(${k},${r},${c}): off the ${n}×${n} board? (${r < 0 || c < 0 || r >= n || c >= n ? "<b>yes — this branch's probability is 0</b>" : "no"})`)
        if (r < 0 || c < 0 || r >= n || c >= n) return 0
        line(4, `p(${k},${r},${c}): no moves left? (${k === 0 ? "<b>yes — safely on board, probability 1</b>" : "no"})`)
        if (k === 0) return 1
        const key = k + "," + (r * n + c)
        line(6, `checking memo["${key}"] — column ${r}·${n}+${c} = ${r * n + c} encodes square (${r},${c}).`)
        if (memo[key] !== undefined) return memo[key] as number
        let sum = 0
        line(9, `fan out: each of the 8 knight moves happens with probability <b>1/8</b>.`)
        for (const [dr, dc] of MOVES) {
          sum += p(k - 1, r + dr, c + dc) / 8
        }
        vars({ k, r, c, sum })
        memo[key] = sum
        line(11, `p(${k},${r},${c}) = <b>${sum}</b> (sum of the 8 children ÷ 8).`)
        return sum
      },
      2,
    )
    narrate("Expectation DP: a cell's survival chance is the average of its 8 children one move later. States repeat fast — (k, square) memo kills 8^k.")
    return p(k0, r0, c0)
  },
}
