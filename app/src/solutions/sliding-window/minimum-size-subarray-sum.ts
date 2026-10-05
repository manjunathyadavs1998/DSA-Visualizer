import type { SolutionDef } from "@/engine/types"

export const minimumSizeSubarraySum: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// smallest window with sum >= target
function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;               // shrink from the left
    }
  }
  return best === Infinity ? 0 : best;
}`,
  codeJava: `// smallest window with sum >= target
int minSubArrayLen(int target, int[] nums) {
  int left = 0, sum = 0, best = Integer.MAX_VALUE;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;               // shrink from the left
    }
  }
  return best == Integer.MAX_VALUE ? 0 : best;
}`,
  inputs: [
    { kind: "number", name: "target", label: "target", default: 7, min: 1, max: 50 },
    { kind: "numbers", name: "nums", label: "nums", default: [2, 3, 1, 2, 4, 3], maxLen: 10 },
  ],
  entry: (a) => `minSubArrayLen(${a.target}, [${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const target = args.target as number
    const nums = args.nums as number[]
    const go = fn(
      "minSubArrayLen",
      (): number => {
        let left = 0
        let sum = 0
        let best = Infinity
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(2, `Grow right until sum ≥ ${target}, then shrink left as far as the sum allows.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += nums[right]
          mark("window", Array.from({ length: right - left + 1 }, (_, x) => left + x))
          line(4, `Take nums[${right}] = ${nums[right]} in → sum = <b>${sum}</b>.`)
          while (sum >= target) {
            const len = right - left + 1
            if (len < best) {
              best = len
              bestRange = [left, right]
              line(6, `sum ${sum} ≥ ${target} with length ${len} — <b>new shortest!</b>`)
            } else {
              line(6, `sum ${sum} ≥ ${target} with length ${len} — not shorter than ${best}.`)
            }
            sum -= nums[left]
            mark("bad", [left])
            line(7, `Shrink: drop nums[${left}] = ${nums[left]} → sum = ${sum}.`)
            left++
            ptr("left", left)
            mark("bad", [])
            mark("window", Array.from({ length: right - left + 1 }, (_, x) => left + x))
          }
          vars({ left, sum, best: best === Infinity ? "∞" : best })
        }
        mark("focus", [])
        mark("window", [])
        if (best === Infinity) {
          line(11, `The whole array never reached ${target} → return <b>0</b>.`)
          return 0
        }
        mark("good", Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, x) => bestRange[0] + x))
        line(11, `Shortest window with sum ≥ ${target}: length <b>${best}</b> (green). Both pointers only move forward — O(n).`)
        return best
      },
      1,
    )
    return go()
  },
}
