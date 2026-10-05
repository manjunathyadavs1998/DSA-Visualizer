import type { SolutionDef } from "@/engine/types"

export const eggDroppingPuzzle: SolutionDef = {
  code: `// eggs and floors are editable below
function solve(eggs, floors) {
  if (floors <= 1) return floors;  // 0 or 1 floor: trivial
  if (eggs === 1) return floors;   // scan floor by floor
  const key = eggs + "," + floors;
  if (memo[key] !== undefined) return memo[key];
  let best = Infinity;
  for (let x = 1; x <= floors; x++) {          // drop at x
    const breaks = solve(eggs - 1, x - 1);     // it breaks
    const survives = solve(eggs, floors - x);  // it survives
    best = Math.min(best, 1 + Math.max(breaks, survives));
  }
  memo[key] = best;
  return best;
}`,
  codeJava: `// int eggs, floors editable; Map<String,Integer> memo
int solve(int eggs, int floors) {
  if (floors <= 1) return floors;  // 0 or 1 floor: trivial
  if (eggs == 1) return floors;    // scan floor by floor
  String key = eggs + "," + floors;
  if (memo.get(key) != null) return memo.get(key);
  int best = Integer.MAX_VALUE;
  for (int x = 1; x <= floors; x++) {          // drop at x
    int breaks = solve(eggs - 1, x - 1);       // it breaks
    int survives = solve(eggs, floors - x);    // it survives
    best = Math.min(best, 1 + Math.max(breaks, survives));
  }
  memo.put(key, best);
  return best;
}`,
  inputs: [
    { kind: "number", name: "eggs", label: "eggs", default: 2, min: 1, max: 3 },
    { kind: "number", name: "floors", label: "floors", default: 6, min: 1, max: 6 },
  ],
  entry: (a) => `solve(${a.eggs}, ${a.floors})`,
  run({ fn, memo, line, narrate }, args) {
    const solve = fn(
      "solve",
      (eggs: number, floors: number): number => {
        line(2, `solve(${eggs},${floors}): ${floors <= 1 ? `<b>${floors} floor${floors === 1 ? "" : "s"} — ${floors} trial${floors === 1 ? "" : "s"} settles it</b>` : floors + " floors to pin down"}.`)
        if (floors <= 1) return floors
        line(3, `Only one egg? (${eggs === 1 ? `<b>yes — can't risk it: scan from floor 1 up, worst case ${floors} drops</b>` : "no, " + eggs + " eggs"})`)
        if (eggs === 1) return floors
        const key = eggs + "," + floors
        line(5, `solve(${eggs},${floors}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let best = Infinity
        for (let x = 1; x <= floors; x++) {
          line(7, `Drop an egg from floor ${x} (of the ${floors} in question)…`)
          const breaks = solve(eggs - 1, x - 1)
          const survives = solve(eggs, floors - x)
          const worst = Math.max(breaks, survives)
          best = Math.min(best, 1 + worst)
          line(10, `floor ${x}: breaks → ${breaks} more (${eggs - 1} egg${eggs - 1 === 1 ? "" : "s"}, ${x - 1} below); survives → ${survives} more (${floors - x} above). Worst case max = ${worst}, so 1+${worst} = ${1 + worst}; best so far <b>${best}</b>.`)
        }
        line(12, `solve(${eggs},${floors}) = <b>${best}</b> — the drop floor that minimizes the worst case.`)
        memo[key] = best
        return best
      },
      1,
    )
    narrate("Pick a drop floor x: the adversary hands you the WORSE of break vs survive. Minimize that maximum.")
    return solve(args.eggs as number, args.floors as number)
  },
}
