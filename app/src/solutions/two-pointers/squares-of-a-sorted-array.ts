import type { SolutionDef } from "@/engine/types"

export const squaresOfASortedArray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// the largest square sits at an end — fill the result from the back
function sortedSquares(nums) {
  const n = nums.length, result = new Array(n);
  let left = 0, right = n - 1;
  for (let fill = n - 1; fill >= 0; fill--) {
    if (Math.abs(nums[left]) > Math.abs(nums[right])) {
      result[fill] = nums[left] * nums[left]; left++;
    } else {
      result[fill] = nums[right] * nums[right]; right--;
    }
  }
  return result;
}`,
  codeJava: `// the largest square sits at an end — fill the result from the back
int[] sortedSquares(int[] nums) {
  int n = nums.length; int[] result = new int[n];
  int left = 0, right = n - 1;
  for (int fill = n - 1; fill >= 0; fill--) {
    if (Math.abs(nums[left]) > Math.abs(nums[right])) {
      result[fill] = nums[left] * nums[left]; left++;
    } else {
      result[fill] = nums[right] * nums[right]; right--;
    }
  }
  return result;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (sorted)", default: [-7, -4, -1, 0, 3, 10], maxLen: 12 },
  ],
  entry: (a) => `sortedSquares([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    // the input must be sorted ascending for the two-pointer argument to hold
    const nums = [...(args.nums as number[])].map(Math.trunc).sort((a, b) => a - b)
    const go = fn(
      "sortedSquares",
      (): string => {
        const n = nums.length
        const result: number[] = new Array(n).fill(0)
        const shown: (number | string)[] = new Array(n).fill("·")
        line(2, `Squaring kills the sign, so the <b>biggest</b> square is at one of the two ends — never the middle.`)
        let left = 0
        let right = n - 1
        ptr("left", left)
        ptr("right", right)
        heap("output", shown)
        line(3, `Compare |ends|, write the bigger square at the <b>back</b> of result, step that pointer inward.`)
        for (let fill = n - 1; fill >= 0; fill--) {
          mark("focus", [left, right])
          if (Math.abs(nums[left]) > Math.abs(nums[right])) {
            line(5, `|nums[${left}]| = ${Math.abs(nums[left])} > |nums[${right}]| = ${Math.abs(nums[right])} — the left end wins.`)
            result[fill] = nums[left] * nums[left]
            shown[fill] = result[fill]
            heap("output", shown)
            mark("bad", [left])
            line(6, `result[${fill}] = ${nums[left]}² = <b>${result[fill]}</b>; left → ${left + 1}.`)
            left++
            ptr("left", left)
          } else {
            line(5, `|nums[${left}]| = ${Math.abs(nums[left])} ≤ |nums[${right}]| = ${Math.abs(nums[right])} — the right end wins.`)
            result[fill] = nums[right] * nums[right]
            shown[fill] = result[fill]
            heap("output", shown)
            mark("bad", [right])
            line(8, `result[${fill}] = ${nums[right]}² = <b>${result[fill]}</b>; right → ${right - 1}.`)
            right--
            ptr("right", right)
          }
          vars({ left, right, fill })
        }
        mark("focus", [])
        mark("bad", [])
        line(11, `Filled back-to-front in one pass — sorted squares without an O(n log n) sort: [${result.join(", ")}].`)
        return `[${result.join(",")}]`
      },
      1,
    )
    return go()
  },
}
