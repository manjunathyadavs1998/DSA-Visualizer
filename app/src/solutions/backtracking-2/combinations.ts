import type { SolutionDef } from "@/engine/types"

export const combinations: SolutionDef = {
  code: `// choose k numbers from 1..n (both editable)
function backtrack(start, cur) {
  if (cur.length === k) {
    output.push([...cur]);     // k picks made
    return;
  }
  for (let x = start; x <= n; x++) {
    cur.push(x);               // choose x
    backtrack(x + 1, cur);     // only larger numbers next
    cur.pop();                 // un-choose (backtrack)
  }
}`,
  codeJava: `// choose k numbers from 1..n (both editable)
void backtrack(int start, List<Integer> cur) {
  if (cur.size() == k) {
    output.add(new ArrayList<>(cur));  // k picks made
    return;
  }
  for (int x = start; x <= n; x++) {
    cur.add(x);                // choose x
    backtrack(x + 1, cur);     // only larger numbers next
    cur.remove(cur.size() - 1);        // un-choose (backtrack)
  }
}`,
  inputs: [
    { kind: "number", name: "n", label: "n", default: 4, min: 1, max: 5 },
    { kind: "number", name: "k", label: "k", default: 2, min: 1, max: 4 },
  ],
  entry: () => `backtrack(1, [])`,
  run({ fn, heap, line, vars, narrate }, args) {
    const n = args.n as number
    const k = Math.min(args.k as number, n) // k > n would simply yield nothing
    const output: number[][] = []
    const cur: number[] = []
    const backtrack = fn(
      "backtrack",
      (start: number, path: number[]): string => {
        vars({ start, cur: `[${path.join(",")}]` })
        line(2, `cur = {${path.join(",") || "∅"}} has ${path.length}/${k} numbers — done? (${path.length === k ? "<b>yes</b>" : "no"})`)
        if (path.length === k) {
          line(3, `<b>Leaf!</b> Record combination {${path.join(",")}}.`)
          output.push([...path])
          heap("output", output)
          return `{${path.join(",")}}`
        }
        for (let x = start; x <= n; x++) {
          line(7, `Choose <b>${x}</b> → cur = {${[...path, x].join(",")}}.`)
          path.push(x)
          heap("cur", path)
          line(8, `Recurse with start = ${x + 1}: only numbers > ${x} may follow — that's what kills duplicates like {2,1}.`)
          backtrack(x + 1, path)
          line(9, `Backtrack: remove <b>${x}</b> → cur = {${path.slice(0, -1).join(",") || "∅"}}.`)
          path.pop()
          heap("cur", path)
        }
        return "✓"
      },
      1,
    )
    narrate(`C(${n},${k}) = ${binom(n, k)} combinations. The 'start' index enforces ascending order, so each set appears exactly once.`)
    heap("cur", cur)
    heap("output", output)
    backtrack(1, cur)
    return JSON.stringify(output)
  },
}

function binom(n: number, k: number): number {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}
