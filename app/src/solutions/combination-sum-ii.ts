import type { SolutionDef } from "@/engine/types"

export const combinationSumII: SolutionDef = {
  code: `// sorted candidates, target editable (each used once)
function combo2(start, remain, cur) {
  if (remain === 0) { result.push([...cur]); return; }
  if (remain < 0) return;               // overshot — dead end
  for (let k = start; k < cand.length; k++) {
    if (k > start && cand[k] === cand[k - 1]) continue; // skip dup
    cur.push(cand[k]);
    combo2(k + 1, remain - cand[k], cur);  // k+1: use once
    cur.pop();                          // backtrack
  }
}`,
  codeJava: `// sorted int[] cand, int target (each used once)
void combo2(int start, int remain, List<Integer> cur) {
  if (remain == 0) { result.add(new ArrayList<>(cur)); return; }
  if (remain < 0) return;               // overshot — dead end
  for (int k = start; k < cand.length; k++) {
    if (k > start && cand[k] == cand[k - 1]) continue; // skip dup
    cur.add(cand[k]);
    combo2(k + 1, remain - cand[k], cur);  // k+1: use once
    cur.remove(cur.size() - 1);         // backtrack
  }
}`,
  inputs: [
    { kind: "numbers", name: "cand", label: "candidates", default: [1, 1, 2, 5], maxLen: 5 },
    { kind: "number", name: "target", label: "target", default: 4, min: 1, max: 12 },
  ],
  entry: (a) => `combo2(0, ${a.target}, [])`,
  run({ fn, line, narrate }, args) {
    const cand = [...(args.cand as number[])].sort((a, b) => a - b)
    const result: number[][] = []
    const combo2 = fn(
      "combo2",
      (start: number, remain: number, cur: number[]): string => {
        line(2, `remain = ${remain}: exact hit? (${remain === 0 ? "<b>yes! record {" + cur.join(",") + "}</b>" : "no"})`)
        if (remain === 0) {
          result.push([...cur])
          return "hit: " + cur.join("+")
        }
        line(3, `remain = ${remain}: overshot? (${remain < 0 ? "<b>yes — prune</b>" : "no"})`)
        if (remain < 0) return "dead"
        for (let k = start; k < cand.length; k++) {
          if (k > start && cand[k] === cand[k - 1]) {
            line(5, `cand[${k}] = ${cand[k]} repeats at this level → <b>skip the duplicate branch</b>.`)
            continue
          }
          line(6, `Take cand[${k}] = ${cand[k]} once → remain ${remain - cand[k]}.`)
          cur.push(cand[k])
          combo2(k + 1, remain - cand[k], cur)
          line(8, `Backtrack: put ${cand[k]} back.`)
          cur.pop()
        }
        return "✓"
      },
      1,
    )
    narrate("Like Combination Sum, but k+1 (single use) and duplicate-skip at each level.")
    combo2(0, args.target as number, [])
    return JSON.stringify(result)
  },
}
