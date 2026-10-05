import type { SolutionDef } from "@/engine/types"

export const maxSubarray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below (Kadane's algorithm)
function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
  codeJava: `// int[] nums editable below (Kadane's algorithm)
int maxSubArray(int[] nums) {
  int cur = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [-2, 1, -3, 4, -1, 2, 1, -5, 4], maxLen: 12 }],
  entry: () => `maxSubArray(nums)`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "maxSubArray",
      (): number => {
        let cur = nums[0], best = nums[0], start = 0
        let bestRange: [number, number] = [0, 0]
        ptr("i", 0); vars({ cur, best })
        mark("window", [0]); mark("good", [0])
        line(2, `Start: the best subarray so far is just [${nums[0]}].`)
        for (let i = 1; i < nums.length; i++) {
          ptr("i", i); mark("focus", [i])
          const extend = cur + nums[i]
          if (nums[i] > extend) {
            line(4, `cur+${nums[i]} = ${extend} is worse than starting fresh at ${nums[i]} → <b>drop the old run</b>.`)
            cur = nums[i]
            start = i
          } else {
            line(4, `Extending the run: cur = ${cur} + ${nums[i]} = ${extend}.`)
            cur = extend
          }
          mark("window", Array.from({ length: i - start + 1 }, (_, x) => start + x))
          vars({ i, cur, best })
          if (cur > best) {
            best = cur
            bestRange = [start, i]
            line(5, `New best! ${best} — remembering this window.`)
            mark("good", Array.from({ length: i - start + 1 }, (_, x) => start + x))
          } else {
            line(5, `best stays ${best}.`)
          }
          vars({ i, cur, best })
        }
        mark("focus", []); mark("window", [])
        mark("good", Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, x) => bestRange[0] + x))
        line(7, `Done — the maximum subarray sum is <b>${best}</b> (green cells).`)
        return best
      },
      1,
    )
    return go()
  },
}
