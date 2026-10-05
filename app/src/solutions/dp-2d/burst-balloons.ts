import type { SolutionDef } from "@/engine/types"

export const burstBalloons: SolutionDef = {
  code: `// a = [1, ...nums, 1]; best(l,r) = max coins bursting strictly inside (l,r)
function best(l, r) {
  if (l + 1 === r) return 0;
  const key = l + "," + r;
  if (memo[key] !== undefined) return memo[key];
  let top = 0;
  for (let k = l + 1; k < r; k++) {
    const coins = a[l] * a[k] * a[r] + best(l, k) + best(k, r);
    top = Math.max(top, coins);
  }
  memo[key] = top;
  return top;
}`,
  codeJava: `// a = [1, ...nums, 1]; best(l,r) = max coins bursting strictly inside (l,r)
int best(int l, int r) {
  if (l + 1 == r) return 0;
  String key = l + "," + r;
  if (memo.get(key) != null) return memo.get(key);
  int top = 0;
  for (int k = l + 1; k < r; k++) {
    int coins = a[l] * a[k] * a[r] + best(l, k) + best(k, r);
    top = Math.max(top, coins);
  }
  memo.put(key, top);
  return top;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "balloons", default: [3, 1, 5, 8], maxLen: 4 }],
  entry: (x) => `best(0, ${(x.nums as number[]).length + 1})  // a = [1,${(x.nums as number[]).join(",")},1]`,
  run({ fn, memo, line, vars, narrate }, args) {
    const nums = (args.nums as number[]).map((v) => Math.max(0, Math.min(9, Math.trunc(Math.abs(v)))))
    const a = [1, ...nums, 1]
    const best = fn(
      "best",
      (l: number, r: number): number => {
        line(2, `best(${l},${r}): nothing strictly between? (${l + 1 === r ? "<b>yes — 0 coins</b>" : "no"})`)
        if (l + 1 === r) return 0
        const key = l + "," + r
        line(4, `best(${l},${r}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let top = 0
        for (let k = l + 1; k < r; k++) {
          line(7, `let balloon k=${k} (value ${a[k]}) be the <b>LAST</b> burst in (${l},${r}) → its neighbors then are the borders ${a[l]} and ${a[r]}.`)
          const coins = a[l] * a[k] * a[r] + best(l, k) + best(k, r)
          top = Math.max(top, coins)
          line(8, `k=${k}: ${a[l]}·${a[k]}·${a[r]} + left + right = ${coins}; top = <b>${top}</b>.`)
          vars({ l, r, k, top })
        }
        memo[key] = top
        line(10, `best(${l},${r}) = <b>${top}</b>.`)
        return top
      },
      1,
    )
    narrate("Thinking 'which balloon pops FIRST' entangles everything. Flip it: pick the LAST survivor of each interval — its neighbors are the fixed borders.")
    return best(0, a.length - 1)
  },
}
