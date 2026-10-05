import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (a: number[]) => a.map((v) => Math.max(1, Math.trunc(v)))

export const minimumOperationsToReduceXToZero: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// remove ends summing to x == keep the longest middle summing total-x
function minOperations(nums, x) {
  let total = 0;
  for (const v of nums) total += v;
  const target = total - x;           // what the kept middle must sum to
  if (target < 0) return -1;
  let left = 0, sum = 0, best = -1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) {            // overshoot: shrink
      sum -= nums[left];
      left++;
    }
    if (sum === target) best = Math.max(best, right - left + 1);
  }
  return best === -1 ? -1 : nums.length - best;
}`,
  codeJava: `// remove ends summing to x == keep the longest middle summing total-x
int minOperations(int[] nums, int x) {
  int total = 0;
  for (int v : nums) total += v;
  int target = total - x;             // what the kept middle must sum to
  if (target < 0) return -1;
  int left = 0, sum = 0, best = -1;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) {            // overshoot: shrink
      sum -= nums[left];
      left++;
    }
    if (sum == target) best = Math.max(best, right - left + 1);
  }
  return best == -1 ? -1 : nums.length - best;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (≥1)", default: [3, 2, 20, 1, 1, 3], maxLen: 12 },
    { kind: "number", name: "x", label: "x", default: 10, min: 1, max: 100 },
  ],
  entry: (a) => `minOperations([${clean(a.nums as number[]).join(",")}], ${a.x})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const x = Math.max(1, Math.trunc(args.x as number))
    const go = fn(
      "minOperations",
      (): number => {
        let total = 0
        for (const v of nums) total += v
        line(3, `total = <b>${total}</b>. Removing ends that sum to x = ${x} ⇔ keeping a middle window that sums to total − x.`)
        const target = total - x
        line(4, `target for the kept middle = ${total} − ${x} = <b>${target}</b>.`)
        if (target < 0) {
          line(5, `target < 0 — even taking everything can't reach x. Return <b>−1</b>.`)
          return -1
        }
        let left = 0
        let sum = 0
        let best = -1
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(6, `Find the <b>longest</b> window summing to exactly ${target} — fewer removals means a longer middle.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += nums[right]
          mark("window", win(left, right))
          line(8, `sum += nums[${right}] = ${nums[right]} → sum = <b>${sum}</b>.`)
          while (sum > target) {
            sum -= nums[left]
            line(10, `sum ${sum + nums[left]} > ${target}: drop nums[${left}] = ${nums[left]} → sum = <b>${sum}</b>.`)
            left++
            ptr("left", left)
            mark("window", win(left, right))
          }
          if (sum === target && right - left + 1 > best) {
            best = right - left + 1
            bestRange = [left, right]
            line(13, `sum = target = ${target} with length <b>${best}</b> — new longest keepable middle!`)
          } else if (sum === target) {
            line(13, `sum hits target ${target} again, but length ${right - left + 1} ≤ best ${best}.`)
          } else {
            line(13, `sum = ${sum} ≠ ${target} — keep sliding.`)
          }
          vars({ left, right, sum, best })
        }
        mark("focus", [])
        mark("window", [])
        if (best === -1) {
          line(15, `No window sums to ${target} → return <b>−1</b>.`)
          return -1
        }
        mark("good", win(bestRange[0], bestRange[1]))
        mark("bad", [...win(0, bestRange[0] - 1), ...win(bestRange[1] + 1, nums.length - 1)])
        line(15, `Keep the green middle (len ${best}), remove the ${nums.length - best} red end elements → <b>${nums.length - best}</b> operations.`)
        return nums.length - best
      },
      1,
    )
    return go()
  },
}
