import type { SolutionDef } from "@/engine/types"

export const maximumProductSubarray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below
function maxProduct(nums) {
  let curMax = nums[0], curMin = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    if (x < 0) [curMax, curMin] = [curMin, curMax];
    curMax = Math.max(x, curMax * x);
    curMin = Math.min(x, curMin * x);
    best = Math.max(best, curMax);
  }
  return best;
}`,
  codeJava: `// int[] nums is editable below
int maxProduct(int[] nums) {
  int curMax = nums[0], curMin = nums[0], best = nums[0];
  for (int i = 1; i < nums.length; i++) {
    int x = nums[i];
    if (x < 0) { int t = curMax; curMax = curMin; curMin = t; }
    curMax = Math.max(x, curMax * x);
    curMin = Math.min(x, curMin * x);
    best = Math.max(best, curMax);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [2, -3, 4, -2, 5], maxLen: 8 }],
  entry: (a) => `maxProduct([${(a.nums as number[]).join(", ")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const maxProduct = fn(
      "maxProduct",
      (): number => {
        if (nums.length === 0) return 0
        let curMax = nums[0], curMin = nums[0], best = nums[0]
        let maxStart = 0, minStart = 0, bestL = 0, bestR = 0
        ptr("i", 0)
        mark("good", [0])
        vars({ curMax, curMin, best })
        line(2, `Start at nums[0] = ${nums[0]}: it's the biggest AND smallest product so far.`)
        for (let i = 1; i < nums.length; i++) {
          const x = nums[i]
          ptr("i", i)
          mark("focus", [i])
          line(4, `x = nums[${i}] = <b>${x}</b>. So far: curMax=${curMax}, curMin=${curMin} (best/worst product ending at ${i - 1}).`)
          if (x < 0) {
            ;[curMax, curMin] = [curMin, curMax]
            ;[maxStart, minStart] = [minStart, maxStart]
            line(5, `${x} is <b>negative</b> — multiplying flips big↔small, so <b>swap</b> curMax↔curMin (now curMax=${curMax}, curMin=${curMin}). The most-negative product may become the biggest.`)
          }
          const extMax = curMax * x
          if (x >= extMax) { curMax = x; maxStart = i } else { curMax = extMax }
          line(6, `curMax = max(${x}, ${extMax}) = <b>${curMax}</b> — biggest product of a subarray ending at ${i}.`)
          const extMin = curMin * x
          if (x <= extMin) { curMin = x; minStart = i } else { curMin = extMin }
          line(7, `curMin = min(${x}, ${extMin}) = <b>${curMin}</b> — kept alive because one future negative could flip it into the max.`)
          if (curMax > best) {
            best = curMax; bestL = maxStart; bestR = i
            mark("good", Array.from({ length: bestR - bestL + 1 }, (_, k) => bestL + k))
            line(8, `curMax ${curMax} beats best → <b>new best = ${best}</b>, from window [${bestL}..${bestR}].`)
          } else {
            line(8, `best stays <b>${best}</b> (curMax ${curMax} doesn't beat it).`)
          }
          vars({ i, x, curMax, curMin, best })
        }
        mark("focus", [])
        ptr("i", -1)
        line(10, `Answer: <b>${best}</b> — the product of the highlighted window.`)
        return best
      },
      1,
    )
    narrate("Track the biggest AND smallest product ending here — a negative x swaps their roles.")
    return maxProduct()
  },
}
