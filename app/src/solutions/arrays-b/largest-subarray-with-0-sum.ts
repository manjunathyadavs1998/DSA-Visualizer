import type { SolutionDef } from "@/engine/types"

export const largestSubarrayZeroSum: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below
function maxLen(nums) {
  let sum = 0, best = 0;
  memo[0] = -1;             // empty prefix sums to 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (memo[sum] !== undefined)
      best = Math.max(best, i - memo[sum]);
    else
      memo[sum] = i;        // first index with this prefix sum
  }
  return best;
}`,
  codeJava: `// int[] nums is editable below
int maxLen(int[] nums) {
  int sum = 0, best = 0;
  memo.put(0, -1);          // empty prefix sums to 0
  for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (memo.containsKey(sum))
      best = Math.max(best, i - memo.get(sum));
    else
      memo.put(sum, i);     // first index with this prefix sum
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [15, -2, 2, -8, 1, 7, 10, 23], maxLen: 10 }],
  entry: () => `maxLen(nums)`,
  run({ fn, memo, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "maxLen",
      (): number => {
        let sum = 0, best = 0
        memo["0"] = -1
        vars({ sum, best })
        line(3, `Seed the memo: the <b>empty prefix</b> (before index 0) already has sum 0.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          sum += nums[i]
          vars({ i, sum, best })
          line(5, `Running prefix sum through index ${i}: sum = <b>${sum}</b>.`)
          const first = memo[String(sum)]
          line(6, `Seen prefix sum ${sum} before? (${first !== undefined ? "<b>yes — cache hit!</b>" : "no"})`)
          if (first !== undefined) {
            const start = (first as number) + 1
            const len = i - (first as number)
            if (len > best) {
              best = len
              mark("good", Array.from({ length: len }, (_, k) => start + k))
            }
            vars({ i, sum, best })
            line(7, `Same sum at index ${first} and ${i} → everything between (indices ${start}..${i}) <b>sums to 0</b>, length ${len}. best = ${best}.`)
          } else {
            memo[String(sum)] = i
            line(9, `First time seeing sum ${sum} — record <b>${sum} → ${i}</b> (keep the FIRST index for the longest window).`)
          }
        }
        line(11, `Longest zero-sum subarray has length <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("Prefix sums turn the question around: if the same running sum appears twice, the slice between the two positions must sum to zero.")
    return go()
  },
}
