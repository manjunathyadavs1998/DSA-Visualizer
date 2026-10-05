import type { SolutionDef } from "@/engine/types"

export const pascalsTriangleII: SolutionDef = {
  code: `// row r of Pascal's triangle = [C(r,0) … C(r,r)]
function C(n, k) {
  if (k === 0 || k === n) return 1;
  return C(n - 1, k - 1) + C(n - 1, k);
}
function getRow(r) {
  const row = [];
  for (let k = 0; k <= r; k++) row.push(C(r, k));
  return row;
}`,
  codeJava: `// row r of Pascal's triangle = [C(r,0) … C(r,r)]
int C(int n, int k) {
  if (k == 0 || k == n) return 1;
  return C(n - 1, k - 1) + C(n - 1, k);
}
List<Integer> getRow(int r) {
  List<Integer> row = new ArrayList<>();
  for (int k = 0; k <= r; k++) row.add(C(r, k));
  return row;
}`,
  inputs: [{ kind: "number", name: "rowIndex", label: "rowIndex", default: 4, min: 0, max: 6 }],
  entry: (a) => `getRow(${a.rowIndex})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const r = args.rowIndex as number
    const C = fn(
      "C",
      (n: number, k: number): number => {
        line(2, `C(${n},${k}): on the edge of the triangle? (${k === 0 || k === n ? "<b>yes — edges are always 1</b>" : "no"})`)
        if (k === 0 || k === n) return 1
        line(3, `C(${n},${k}): sum the two parents above — C(${n - 1},${k - 1}) + C(${n - 1},${k}).`)
        const val = C(n - 1, k - 1) + C(n - 1, k)
        line(3, `C(${n},${k}) = <b>${val}</b> — pure recursion, so this value is recomputed every time it's needed.`)
        return val
      },
      1,
    )
    const row: number[] = []
    const getRow = fn(
      "getRow",
      (): string => {
        line(6, `Row ${r} has <b>${r + 1}</b> entries — compute each C(${r}, k) left to right.`)
        for (let k = 0; k <= r; k++) {
          vars({ k, row: `[${row.join(", ")}]` })
          line(7, `k=${k}: row[${k}] = C(${r},${k}) — a fresh recursion tree for this cell.`)
          row.push(C(r, k))
          heap("row", row)
        }
        line(8, `Row ${r} complete: <b>[${row.join(", ")}]</b>.`)
        return JSON.stringify(row)
      },
      5,
    )
    narrate("Each entry recurses on its two parents above with no memo — watch the tree recompute the same C(n,k) again and again; that overlap is exactly what memoization would remove.")
    return getRow()
  },
}
