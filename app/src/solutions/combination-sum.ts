import type { SolutionDef } from "@/engine/types"

export const combinationSum: SolutionDef = {
  code: `// candidates & target editable (reuse allowed)
function combo(start, remain, cur) {
  if (remain === 0) { result.push([...cur]); return; }
  if (remain < 0) return;           // overshot — dead end
  for (let k = start; k < candidates.length; k++) {
    cur.push(candidates[k]);
    combo(k, remain - candidates[k], cur);  // k, not k+1
    cur.pop();                      // backtrack
  }
}`,
  codeJava: `// int[] candidates; int target (reuse allowed)
void combo(int start, int remain, List<Integer> cur) {
  if (remain == 0) { result.add(new ArrayList<>(cur)); return; }
  if (remain < 0) return;             // overshot — dead end
  for (int k = start; k < candidates.length; k++) {
    cur.add(candidates[k]);
    combo(k, remain - candidates[k], cur);  // k, not k+1
    cur.remove(cur.size() - 1);       // backtrack
  }
}`,
  inputs: [
    { kind: "numbers", name: "candidates", label: "candidates", default: [2, 3, 5], maxLen: 4 },
    { kind: "number", name: "target", label: "target", default: 8, min: 1, max: 12 },
  ],
  entry: (a) => `combo(0, ${a.target}, [])`,
  run({ fn, heap, line, narrate }, args) {
    const candidates = args.candidates as number[]
    const result: number[][] = []
    const path: number[] = []
    const combo = fn(
      "combo",
      (start: number, remain: number, cur: number[]): string => {
        line(2, `remain = ${remain}: hit the target exactly? (${remain === 0 ? "<b>yes!</b>" : "no"})`)
        if (remain === 0) {
          result.push([...cur])
          heap("result", result)
          return "hit: " + cur.join("+")
        }
        line(3, `remain = ${remain}: overshot? (${remain < 0 ? "<b>yes — dead end, prune</b>" : "no"})`)
        if (remain < 0) return "dead"
        for (let k = start; k < candidates.length; k++) {
          line(6, `Pick ${candidates[k]} (again allowed) → {${[...cur, candidates[k]].join(",")}}, remain ${remain - candidates[k]}.`)
          cur.push(candidates[k])
          heap("cur", cur)
          combo(k, remain - candidates[k], cur)
          line(7, `Backtrack: drop ${candidates[k]}.`)
          cur.pop()
          heap("cur", cur)
        }
        return "✓"
      },
      1,
    )
    narrate("Dead ends return immediately; 'start' stops duplicate combos like [3,2,3] vs [2,3,3].")
    heap("candidates", candidates)
    heap("cur", path)
    heap("result", result)
    combo(0, args.target as number, path)
    return JSON.stringify(result)
  },
}
