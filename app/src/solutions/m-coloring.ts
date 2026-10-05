import type { SolutionDef } from "@/engine/types"

// square 0-1-2-3-0 plus diagonal 0-2 → needs 3 colors
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]

export const mColoring: SolutionDef = {
  code: `// graph: square 0-1-2-3 + diagonal 0-2; m editable
function color(node) {
  if (node === 4) return true;      // all nodes colored
  for (let c = 1; c <= m; c++) {
    if (!ok(node, c)) continue;     // a neighbor has c — skip
    colors[node] = c;               // paint node with c
    if (color(node + 1)) return true;
    colors[node] = 0;               // backtrack
  }
  return false;                     // no color fits this node
}`,
  codeJava: `// graph: square 0-1-2-3 + diagonal 0-2; int m
boolean color(int node) {
  if (node == 4) return true;       // all nodes colored
  for (int c = 1; c <= m; c++) {
    if (!ok(node, c)) continue;     // a neighbor has c — skip
    colors[node] = c;               // paint node with c
    if (color(node + 1)) return true;
    colors[node] = 0;               // backtrack
  }
  return false;                     // no color fits this node
}`,
  inputs: [{ kind: "number", name: "m", label: "m (colors)", default: 3, min: 2, max: 4 }],
  entry: (a) => `color(0)  // m = ${a.m}`,
  run({ fn, line, memo, vars, narrate }, args) {
    const m = args.m as number
    const colors = [0, 0, 0, 0]
    const NAMES = ["-", "R", "G", "B", "Y"]
    for (let i = 0; i < 4; i++) memo[i] = "-"
    const ok = (node: number, c: number) =>
      EDGES.every(([a, b]) => !((a === node && colors[b] === c) || (b === node && colors[a] === c)))
    const color = fn(
      "color",
      (node: number): boolean => {
        line(2, `Node ${node}: all four painted? (${node === 4 ? "<b>yes — valid coloring found!</b>" : "no"})`)
        if (node === 4) return true
        for (let c = 1; c <= m; c++) {
          if (!ok(node, c)) {
            line(4, `Color ${NAMES[c]} clashes with a neighbor of node ${node} → skip.`)
            continue
          }
          line(5, `Paint node ${node} with <b>${NAMES[c]}</b>.`)
          colors[node] = c
          memo[node] = NAMES[c]
          vars({ colors: colors.map((x) => NAMES[x]).join(" ") })
          if (color(node + 1)) return true
          line(7, `${NAMES[c]} on node ${node} led nowhere → <b>wash it off</b>.`)
          colors[node] = 0
          memo[node] = "-"
        }
        line(9, `No color fits node ${node} with only m = ${m} → backtrack further.`)
        return false
      },
      1,
    )
    narrate(`Edges: 0-1, 1-2, 2-3, 3-0 and the diagonal 0-2. With m = 2 this must fail (odd cycle) — try it!`)
    return color(0)
  },
}
