import type { SolutionDef } from "@/engine/types"

export const uniquePaths: SolutionDef = {
  code: `// paths(i, j): ways to reach cell (i, j) from (0, 0)
function paths(i, j) {
  if (i === 0 || j === 0) return 1;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = paths(i - 1, j) + paths(i, j - 1);
  return memo[key];
}`,
  codeJava: `// paths(i, j): ways to reach cell (i, j) from (0, 0)
int paths(int i, int j) {   // Map<String,Integer> memo
  if (i == 0 || j == 0) return 1;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, paths(i - 1, j) + paths(i, j - 1));
  return memo.get(key);
}`,
  inputs: [
    { kind: "number", name: "i", label: "rows − 1 (i)", default: 2, min: 0, max: 6 },
    { kind: "number", name: "j", label: "cols − 1 (j)", default: 3, min: 0, max: 6 },
  ],
  entry: (a) => `paths(${a.i}, ${a.j})`,
  run({ fn, memo, line, narrate }, args) {
    const paths = fn(
      "paths",
      (i: number, j: number): number => {
        line(2, `paths(${i},${j}): on the top row or left column? (${i === 0 || j === 0 ? "<b>yes — only 1 way</b>" : "no"})`)
        if (i === 0 || j === 0) return 1
        const key = i + "," + j
        line(4, `paths(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `paths(${i},${j}) = from above (${i - 1},${j}) + from the left (${i},${j - 1}).`)
        memo[key] = paths(i - 1, j) + paths(i, j - 1)
        line(6, `paths(${i},${j}): ${memo[key]} ways.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Every cell = ways from above + ways from the left. Watch the 2D table fill diagonally.")
    return paths(args.i as number, args.j as number)
  },
}
