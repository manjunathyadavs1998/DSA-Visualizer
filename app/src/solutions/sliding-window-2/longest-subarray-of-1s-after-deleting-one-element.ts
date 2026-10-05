import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (a: number[]) => a.map((v) => (v === 1 ? 1 : 0))

export const longestSubarrayOf1sAfterDeletingOneElement: SolutionDef = {
  view: "array",
  array: (a) => clean(a.nums as number[]),
  code: `// longest run of 1s after deleting exactly one element
function longestSubarray(nums) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > 1) {               // >1 zero: shrink
      if (nums[left] === 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left);  // window minus 1 deletion
  }
  return best;
}`,
  codeJava: `// longest run of 1s after deleting exactly one element
int longestSubarray(int[] nums) {
  int left = 0, zeros = 0, best = 0;
  for (int right = 0; right < nums.length; right++) {
    if (nums[right] == 0) zeros++;
    while (zeros > 1) {               // >1 zero: shrink
      if (nums[left] == 0) zeros--;
      left++;
    }
    best = Math.max(best, right - left);  // window minus 1 deletion
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (0/1)", default: [0, 1, 1, 1, 0, 1, 1, 0, 1], maxLen: 12 }],
  entry: (a) => `longestSubarray([${clean(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = clean(args.nums as number[])
    const go = fn(
      "longestSubarray",
      (): number => {
        let left = 0
        let zeros = 0
        let best = 0
        let bestRange: [number, number] = [0, 0]
        ptr("left", 0)
        line(2, `Keep a window with <b>at most one 0</b> — that 0 is the element we delete. Answer = window length − 1.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          if (nums[right] === 0) {
            zeros++
            line(4, `nums[${right}] = 0 enters → zeros = <b>${zeros}</b>.`)
          } else {
            line(4, `nums[${right}] = 1 enters — zeros stays ${zeros}.`)
          }
          while (zeros > 1) {
            if (nums[left] === 0) {
              zeros--
              line(6, `Two zeros is one too many: drop nums[${left}] = 0 → zeros = <b>${zeros}</b>.`)
            } else {
              line(6, `Still two zeros: drop nums[${left}] = 1.`)
            }
            left++
            ptr("left", left)
            line(7, `left → ${left}.`)
          }
          mark("window", win(left, right))
          if (right - left > best) {
            best = right - left
            bestRange = [left, right]
            line(9, `Window [${left}..${right}] (len ${right - left + 1}) minus the forced deletion → <b>${best}</b> ones. New best!`)
          } else {
            line(9, `Window [${left}..${right}] gives ${right - left} after deletion — best stays ${best}.`)
          }
          vars({ left, right, zeros, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestRange[0], bestRange[1]))
        line(11, `Even an all-1s array must delete something — that's why we return len−1 → <b>${best}</b>.`)
        return best
      },
      1,
    )
    return go()
  },
}
