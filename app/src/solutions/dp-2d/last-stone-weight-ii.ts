import type { SolutionDef } from "@/engine/types"

export const lastStoneWeightII: SolutionDef = {
  code: `// smash(i, d): d = (pile A − pile B) so far; memo column = d + total
function smash(i, d) {
  if (i === stones.length) return Math.abs(d);
  const key = i + "," + (d + total);
  if (memo[key] !== undefined) return memo[key];
  memo[key] = Math.min(smash(i + 1, d + stones[i]), smash(i + 1, d - stones[i]));
  return memo[key];
}`,
  codeJava: `// smash(i, d): d = (pile A − pile B) so far; memo column = d + total
int smash(int i, int d) {
  if (i == stones.length) return Math.abs(d);
  String key = i + "," + (d + total);
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, Math.min(smash(i + 1, d + stones[i]), smash(i + 1, d - stones[i])));
  return memo.get(key);
}`,
  inputs: [{ kind: "numbers", name: "stones", label: "stones", default: [1, 2, 4, 3], maxLen: 5 }],
  entry: (a) => `smash(0, 0)  // stones=[${(a.stones as number[]).join(",")}]`,
  run({ fn, memo, line, narrate }, args) {
    const stones = (args.stones as number[]).map((v) => Math.max(0, Math.min(9, Math.trunc(v))))
    const total = stones.reduce((x, y) => x + y, 0)
    const smash = fn(
      "smash",
      (i: number, d: number): number => {
        line(2, `smash(${i}, d=${d}): all stones placed? (${i === stones.length ? `<b>yes — final smash leaves |${d}| = ${Math.abs(d)}</b>` : "no"})`)
        if (i === stones.length) return Math.abs(d)
        const key = i + "," + (d + total)
        line(4, `smash(${i}, ${d}): checking memo["${key}"] (column = ${d} + ${total} shifts d ≥ 0)…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `stone ${stones[i]} joins pile A (d→${d + stones[i]}) or pile B (d→${d - stones[i]}) — keep the smaller final gap.`)
        memo[key] = Math.min(smash(i + 1, d + stones[i]), smash(i + 1, d - stones[i]))
        line(6, `smash(${i}, ${d}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("The hidden reframe: any smash sequence ends at |sumA − sumB| for SOME split into two piles. So it's partition-the-stones, minimizing the gap.")
    return smash(0, 0)
  },
}
