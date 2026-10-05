import type { SolutionDef } from "@/engine/types"

export const predictTheWinner: SolutionDef = {
  code: `// lead(i,j) = best (me − you) score margin on nums[i..j]
function lead(i, j) {
  if (i === j) return nums[i];
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  const left = nums[i] - lead(i + 1, j);
  const right = nums[j] - lead(i, j - 1);
  memo[key] = Math.max(left, right);
  return memo[key];
}
// player 1 wins ⇔ lead(0, n-1) >= 0`,
  codeJava: `// lead(i,j) = best (me − you) score margin on nums[i..j]
int lead(int i, int j) {
  if (i == j) return nums[i];
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  int left = nums[i] - lead(i + 1, j);
  int right = nums[j] - lead(i, j - 1);
  memo.put(key, Math.max(left, right));
  return memo.get(key);
}
// player 1 wins ⇔ lead(0, n-1) >= 0`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 5, 233, 7], maxLen: 6 }],
  entry: (a) => `lead(0, ${(a.nums as number[]).length - 1})  // nums=[${(a.nums as number[]).join(",")}]`,
  run({ fn, memo, line, narrate }, args) {
    const nums = (args.nums as number[]).map((v) => Math.max(0, Math.min(999, Math.trunc(Math.abs(v)))))
    const lead = fn(
      "lead",
      (i: number, j: number): number => {
        line(2, `lead(${i},${j}): one number left? (${i === j ? `<b>yes — forced to take ${nums[i]}</b>` : "no"})`)
        if (i === j) return nums[i]
        const key = i + "," + j
        line(4, `lead(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `grab LEFT ${nums[i]} → opponent then earns lead(${i + 1},${j}) against me.`)
        const left = nums[i] - lead(i + 1, j)
        line(6, `grab RIGHT ${nums[j]} → opponent then earns lead(${i},${j - 1}) against me.`)
        const right = nums[j] - lead(i, j - 1)
        memo[key] = Math.max(left, right)
        line(7, `lead(${i},${j}) = max(${left}, ${right}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Same minimax trick as Stone Game, no even-count guarantee: a non-negative final margin (ties count!) means player 1 cannot lose.")
    const margin = lead(0, nums.length - 1)
    return `${margin >= 0} (player 1 margin: ${margin})`
  },
}
