import type { SolutionDef } from "@/engine/types"

export const partitionEqualSubsetSum: SolutionDef = {
  code: `// nums is editable below
function canPartition(nums) {
  let total = 0; for (const x of nums) total += x;
  if (total % 2 === 1) return false; // odd: impossible
  return can(0, total / 2);          // half-sum or bust
}
function can(i, target) {
  if (target === 0) return true;   // hit half exactly
  if (i === nums.length || target < 0) return false;
  const key = i + "," + target;
  if (memo[key] !== undefined) return memo[key];
  const take = can(i + 1, target - nums[i]);
  const skip = can(i + 1, target);
  memo[key] = take || skip;
  return memo[key];
}`,
  codeJava: `// int[] nums editable below; Map<String,Boolean> memo
boolean canPartition(int[] nums) {
  int total = 0; for (int x : nums) total += x;
  if (total % 2 == 1) return false;  // odd: impossible
  return can(0, total / 2);          // half-sum or bust
}
boolean can(int i, int target) {
  if (target == 0) return true;    // hit half exactly
  if (i == nums.length || target < 0) return false;
  String key = i + "," + target;
  if (memo.get(key) != null) return memo.get(key);
  boolean take = can(i + 1, target - nums[i]);
  boolean skip = can(i + 1, target);
  memo.put(key, take || skip);
  return memo.get(key);
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 5, 11, 5], maxLen: 6 }],
  entry: (a) => `canPartition([${(a.nums as number[]).join(", ")}])`,
  run({ fn, memo, line, narrate }, args) {
    const nums = args.nums as number[]
    const can = fn(
      "can",
      (i: number, target: number): boolean => {
        line(7, `can(${i},${target}): target hit exactly? (${target === 0 ? "<b>yes — this pile sums to half!</b>" : "no"})`)
        if (target === 0) return true
        line(8, `Out of numbers or overshot? (${i === nums.length || target < 0 ? "<b>yes — bust, this path fails</b>" : "no"})`)
        if (i === nums.length || target < 0) return false
        const key = i + "," + target
        line(10, `can(${i},${target}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as boolean
        line(11, `<b>TAKE</b> ${nums[i]} into the pile → still need ${target - nums[i]}.`)
        const take = can(i + 1, target - nums[i])
        line(12, `<b>SKIP</b> ${nums[i]} → still need ${target}.`)
        const skip = can(i + 1, target)
        memo[key] = take || skip
        line(13, `can(${i},${target}) = take(${take}) || skip(${skip}) = <b>${memo[key]}</b>.`)
        return memo[key] as boolean
      },
      6,
    )
    const canPartition = fn(
      "canPartition",
      (): boolean => {
        let total = 0
        for (const x of nums) total += x
        line(2, `total = ${total}. Equal halves would each be ${total % 2 === 1 ? "…impossible" : total / 2}.`)
        line(3, `Is the total odd? (${total % 2 === 1 ? "<b>yes — you can't split an odd number in half. Done.</b>" : "no"})`)
        if (total % 2 === 1) return false
        line(4, `<b>Half-sum or bust</b>: find any subset that sums to ${total / 2} — the rest is automatically the other half.`)
        return can(0, total / 2)
      },
      1,
    )
    narrate("Odd total? Impossible. Otherwise this is just subset-sum to total/2 — take or skip each number.")
    return canPartition()
  },
}
