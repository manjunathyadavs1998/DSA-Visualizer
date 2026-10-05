import type { SolutionDef } from "@/engine/types"

export const stoneGame: SolutionDef = {
  code: `// gain(i,j) = (current player − opponent) best margin on piles[i..j]
function gain(i, j) {
  if (i > j) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  const takeLeft = piles[i] - gain(i + 1, j);
  const takeRight = piles[j] - gain(i, j - 1);
  memo[key] = Math.max(takeLeft, takeRight);
  return memo[key];
}
// Alice wins ⇔ gain(0, n-1) > 0`,
  codeJava: `// gain(i,j) = (current player − opponent) best margin on piles[i..j]
int gain(int i, int j) {
  if (i > j) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  int takeLeft = piles[i] - gain(i + 1, j);
  int takeRight = piles[j] - gain(i, j - 1);
  memo.put(key, Math.max(takeLeft, takeRight));
  return memo.get(key);
}
// Alice wins ⇔ gain(0, n-1) > 0`,
  inputs: [{ kind: "numbers", name: "piles", label: "piles (even count)", default: [5, 3, 4, 5], maxLen: 6 }],
  entry: (a) => `gain(0, ${(a.piles as number[]).length - 1})  // piles=[${(a.piles as number[]).join(",")}]`,
  run({ fn, memo, line, narrate }, args) {
    const piles = (args.piles as number[]).map((v) => Math.max(1, Math.min(99, Math.trunc(Math.abs(v)))))
    const gain = fn(
      "gain",
      (i: number, j: number): number => {
        line(2, `gain(${i},${j}): piles all taken? (${i > j ? "<b>yes — margin 0</b>" : "no"})`)
        if (i > j) return 0
        const key = i + "," + j
        line(4, `gain(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `take LEFT pile ${piles[i]} — then the opponent plays optimally on [${i + 1}..${j}], so subtract their margin.`)
        const takeLeft = piles[i] - gain(i + 1, j)
        line(6, `take RIGHT pile ${piles[j]} — subtract the opponent's margin on [${i}..${j - 1}].`)
        const takeRight = piles[j] - gain(i, j - 1)
        memo[key] = Math.max(takeLeft, takeRight)
        line(7, `gain(${i},${j}) = max(left ${takeLeft}, right ${takeRight}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Minimax in one number: gain = my stones minus yours. 'Opponent plays best' is just the SAME function — their gain is subtracted from mine.")
    const n = piles.length
    const margin = gain(0, n - 1)
    return `${margin > 0} (Alice's margin: ${margin})`
  },
}
