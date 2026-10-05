import type { SolutionDef } from "@/engine/types"

export const knapsack01: SolutionDef = {
  code: `// wt, val and cap are editable below
function knap(i, cap) {
  if (i === wt.length || cap === 0) return 0;
  const key = i + "," + cap;
  if (memo[key] !== undefined) return memo[key];
  let best = knap(i + 1, cap);            // SKIP item i
  if (wt[i] <= cap)                       // does it fit?
    best = Math.max(best,
      val[i] + knap(i + 1, cap - wt[i])); // TAKE item i
  memo[key] = best;
  return best;
}`,
  codeJava: `// int[] wt, val; int cap; Map<String,Integer> memo
int knap(int i, int cap) {
  if (i == wt.length || cap == 0) return 0;
  String key = i + "," + cap;
  if (memo.get(key) != null) return memo.get(key);
  int best = knap(i + 1, cap);            // SKIP item i
  if (wt[i] <= cap)                       // does it fit?
    best = Math.max(best,
      val[i] + knap(i + 1, cap - wt[i])); // TAKE item i
  memo.put(key, best);
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "wt", label: "weights", default: [2, 1, 1, 3], maxLen: 4 },
    { kind: "numbers", name: "val", label: "values", default: [20, 14, 16, 35], maxLen: 4 },
    { kind: "number", name: "cap", label: "capacity", default: 5, min: 0, max: 8 },
  ],
  entry: (a) => `knap(0, ${a.cap})`,
  run({ fn, memo, line, narrate }, args) {
    const wt = args.wt as number[]
    const val = args.val as number[]
    const n = Math.min(wt.length, val.length)
    const knap = fn(
      "knap",
      (i: number, cap: number): number => {
        line(2, `knap(${i},${cap}): out of items or space? (${i === n || cap === 0 ? "<b>yes — nothing more fits, worth 0</b>" : "no"})`)
        if (i === n || cap === 0) return 0
        const key = i + "," + cap
        line(4, `knap(${i},${cap}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `<b>SKIP</b> item ${i} (w=${wt[i]}, v=${val[i]}): best from the rest with capacity ${cap} untouched.`)
        let best = knap(i + 1, cap)
        line(6, `Does item ${i} fit? w=${wt[i]} ${wt[i] <= cap ? "≤" : ">"} cap=${cap} → ${wt[i] <= cap ? "yes" : "<b>no — TAKE is off the table</b>"}.`)
        if (wt[i] <= cap) {
          line(8, `<b>TAKE</b> item ${i}: pocket v=${val[i]}, capacity drops to ${cap - wt[i]}.`)
          best = Math.max(best, val[i] + knap(i + 1, cap - wt[i]))
        }
        line(9, `knap(${i},${cap}) = <b>${best}</b> — best of TAKE vs SKIP.`)
        memo[key] = best
        return best
      },
      1,
    )
    narrate("Every item is a fork: take it (pay its weight) or skip it. The 2-D memo is keyed by (item, capacity).")
    return knap(0, args.cap as number)
  },
}
