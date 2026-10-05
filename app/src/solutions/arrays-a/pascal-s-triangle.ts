import type { SolutionDef } from "@/engine/types"

export const pascalsTriangle: SolutionDef = {
  view: "grid",
  grid: (a) => {
    const n = a.n as number
    return Array.from({ length: n }, () => new Array<string>(n).fill(""))
  },
  code: `// build n rows; each inner cell = sum of the two above
function generate(n) {
  const tri = [];
  for (let r = 0; r < n; r++) {
    tri.push(new Array(r + 1).fill(1));
    for (let c = 1; c < r; c++) {
      tri[r][c] = tri[r-1][c-1] + tri[r-1][c];
    }
  }
  return tri;
}`,
  codeJava: `// build n rows; each inner cell = sum of the two above
List<List<Integer>> generate(int n) {
  List<List<Integer>> tri = new ArrayList<>();
  for (int r = 0; r < n; r++) {
    tri.add(rowOfOnes(r + 1));
    for (int c = 1; c < r; c++) {
      tri.get(r).set(c, tri.get(r-1).get(c-1) + tri.get(r-1).get(c));
    }
  }
  return tri;
}`,
  inputs: [{ kind: "number", name: "n", label: "rows", default: 5, min: 1, max: 6 }],
  entry: (a) => `generate(${a.n})`,
  run({ fn, line, gset, gmark, vars, narrate }, args) {
    const n = args.n as number
    const tri: number[][] = []
    const go = fn(
      "generate",
      (): string => {
        line(2, `Start with an empty triangle — we will build <b>${n}</b> row(s), top to bottom.`)
        for (let r = 0; r < n; r++) {
          tri.push(new Array<number>(r + 1).fill(1))
          gset(r, 0, 1)
          gset(r, r, 1)
          vars({ r })
          line(4, `Row ${r}: the two edges are always <b>1</b>${r < 2 ? " — this row has no inner cells." : "; now fill the inner cells from the row above."}`)
          for (let c = 1; c < r; c++) {
            gmark("focus", [[r - 1, c - 1], [r - 1, c]] as [number, number][])
            tri[r][c] = tri[r - 1][c - 1] + tri[r - 1][c]
            gset(r, c, tri[r][c])
            line(6, `tri[${r}][${c}] = ${tri[r - 1][c - 1]} + ${tri[r - 1][c]} = <b>${tri[r][c]}</b> — the sum of its two parents above (highlighted).`)
          }
        }
        gmark("focus", [])
        line(9, `All ${n} row(s) built — every cell is C(row, col), a binomial coefficient.`)
        return JSON.stringify(tri)
      },
      1,
    )
    narrate("Each cell has exactly two parents in the row above; the edges are always 1.")
    go()
    return JSON.stringify(tri)
  },
}
