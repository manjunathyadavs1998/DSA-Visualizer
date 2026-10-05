import type { SolutionDef } from "@/engine/types"

export const combinationSumIII: SolutionDef = {
  code: `// k numbers from 1..9 (each once) summing to n
function backtrack(start, left, cur) {
  if (cur.length === k && left === 0) {
    output.push([...cur]);     // perfect: k picks, sum n
    return;
  }
  if (cur.length === k || left <= 0) return;  // dead end
  for (let x = start; x <= 9; x++) {
    if (x > left) break;       // x (and larger) overshoot
    cur.push(x);               // choose x
    backtrack(x + 1, left - x, cur);
    cur.pop();                 // backtrack
  }
}`,
  codeJava: `// k numbers from 1..9 (each once) summing to n
void backtrack(int start, int left, List<Integer> cur) {
  if (cur.size() == k && left == 0) {
    output.add(new ArrayList<>(cur));  // perfect: k picks, sum n
    return;
  }
  if (cur.size() == k || left <= 0) return;   // dead end
  for (int x = start; x <= 9; x++) {
    if (x > left) break;       // x (and larger) overshoot
    cur.add(x);                // choose x
    backtrack(x + 1, left - x, cur);
    cur.remove(cur.size() - 1);        // backtrack
  }
}`,
  inputs: [
    { kind: "number", name: "k", label: "k (count)", default: 3, min: 2, max: 4 },
    { kind: "number", name: "n", label: "n (target sum)", default: 9, min: 1, max: 15 },
  ],
  entry: (a) => `backtrack(1, ${a.n}, [])`,
  run({ fn, heap, line, vars, narrate }, args) {
    const k = args.k as number
    const n = args.n as number
    const output: number[][] = []
    const backtrack = fn(
      "backtrack",
      (start: number, left: number, cur: number[]): string => {
        vars({ start, left, cur: `[${cur.join(",")}]` })
        line(2, `cur = {${cur.join(",") || "∅"}} (${cur.length}/${k} picks), left = ${left}: perfect hit? (${cur.length === k && left === 0 ? "<b>yes!</b>" : "no"})`)
        if (cur.length === k && left === 0) {
          line(3, `<b>Leaf!</b> {${cur.join(",")}} uses exactly ${k} numbers and sums to ${n}.`)
          output.push([...cur])
          heap("output", output)
          return `{${cur.join(",")}}`
        }
        line(6, `Dead end? picks full: ${cur.length === k ? "<b>yes</b>" : "no"}, overshot: ${left <= 0 ? "<b>yes</b>" : "no"}.`)
        if (cur.length === k || left <= 0) return "✗ dead"
        for (let x = start; x <= 9; x++) {
          if (x > left) {
            line(8, `x = ${x} &gt; left = ${left} — every later x is bigger too: <b>break</b>.`)
            break
          }
          line(9, `Choose <b>${x}</b> → cur = {${[...cur, x].join(",")}}, left = ${left} − ${x} = ${left - x}.`)
          cur.push(x)
          heap("cur", cur)
          backtrack(x + 1, left - x, cur)
          line(11, `Backtrack: drop ${x} → cur = {${cur.slice(0, -1).join(",") || "∅"}}, left back to ${left}.`)
          cur.pop()
          heap("cur", cur)
        }
        return "✓"
      },
      1,
    )
    narrate(`Combinations + a sum budget: 'start' forbids reuse and duplicates, 'x > left → break' prunes whole suffixes at once.`)
    heap("output", output)
    backtrack(1, n, [])
    return JSON.stringify(output)
  },
}
