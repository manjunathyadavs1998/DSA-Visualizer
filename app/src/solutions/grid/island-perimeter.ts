import type { SolutionDef } from "@/engine/types"

const M = [
  [0, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 0],
  [1, 1, 0, 0],
]

export const islandPerimeter: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// each land cell adds 4 sides, minus 2 per land neighbor pair
function perimeter() {
  let p = 0;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (g[i][j] !== 1) continue;
      p += 4;
      if (i > 0 && g[i - 1][j] === 1) p -= 2; // shared edge up
      if (j > 0 && g[i][j - 1] === 1) p -= 2; // shared edge left
    }
  return p;
}`,
  codeJava: `// each land cell adds 4 sides, minus 2 per land neighbor pair
int perimeter() {
  int p = 0;
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++) {
      if (g[i][j] != 1) continue;
      p += 4;
      if (i > 0 && g[i - 1][j] == 1) p -= 2; // shared edge up
      if (j > 0 && g[i][j - 1] == 1) p -= 2; // shared edge left
    }
  return p;
}`,
  inputs: [],
  entry: () => `perimeter()  // 4×4 grid`,
  run({ fn, line, gmark, vars }) {
    const seen: [number, number][] = []
    const go = fn(
      "perimeter",
      (): number => {
        let p = 0
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++) {
            gmark("focus", [[i, j]])
            if (M[i][j] !== 1) continue
            p += 4
            let msg = `(${i},${j}) is land → +4 sides`
            if (i > 0 && M[i - 1][j] === 1) { p -= 2; msg += `, −2 for the neighbor above` }
            if (j > 0 && M[i][j - 1] === 1) { p -= 2; msg += `, −2 for the neighbor left` }
            vars({ i, j, perimeter: p })
            line(6, msg + ` → running total ${p}. (Only up/left checked — each shared edge counted once.)`)
            seen.push([i, j])
            gmark("good", [...seen])
          }
        gmark("focus", [])
        line(11, `Total perimeter: <b>${p}</b> — no DFS needed, one clean scan.`)
        return p
      },
      1,
    )
    return go()
  },
}
