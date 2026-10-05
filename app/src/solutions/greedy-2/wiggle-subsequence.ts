import type { SolutionDef } from "@/engine/types"

const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.trunc(v))
  return out.length ? out : [1, 7, 4, 9, 2, 5, 5, 3]
}

export const wiggleSubsequence: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// up/down = longest wiggle ending on a rise / a fall
function wiggleMaxLength(nums) {
  if (nums.length < 2) return nums.length;
  let up = 1, down = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) up = down + 1;
    else if (nums[i] < nums[i - 1]) down = up + 1;
  }
  return Math.max(up, down);
}`,
  codeJava: `// up/down = longest wiggle ending on a rise / a fall
int wiggleMaxLength(int[] nums) {
  if (nums.length < 2) return nums.length;
  int up = 1, down = 1;
  for (int i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) up = down + 1;
    else if (nums[i] < nums[i - 1]) down = up + 1;
  }
  return Math.max(up, down);
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 7, 4, 9, 2, 5, 5, 3], maxLen: 12 },
  ],
  entry: (a) => `wiggleMaxLength([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const solve = fn(
      "wiggleMaxLength",
      (): number => {
        line(2, `${nums.length} element${nums.length === 1 ? "" : "s"} — ${nums.length < 2 ? `trivially a wiggle of length <b>${nums.length}</b>` : "worth scanning"}.`)
        if (nums.length < 2) return nums.length
        let up = 1
        let down = 1
        vars({ up, down })
        line(3, `<b>up</b> = best wiggle length ending with a rise, <b>down</b> = ending with a fall. Both start at 1 (a single element).`)
        const turns: number[] = [0]
        for (let i = 1; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i - 1, i])
          if (nums[i] > nums[i - 1]) {
            const grew = down + 1 > up
            up = down + 1
            vars({ up, down })
            if (grew) turns.push(i)
            mark("good", [...turns])
            line(5, `${nums[i - 1]} → ${nums[i]} rises: a rise can only extend a wiggle that last <b>fell</b> → up = down + 1 = <b>${up}</b>${grew ? "" : " (same as before — consecutive rises don't stack)"}.`)
          } else if (nums[i] < nums[i - 1]) {
            const grew = up + 1 > down
            down = up + 1
            vars({ up, down })
            if (grew) turns.push(i)
            mark("good", [...turns])
            line(6, `${nums[i - 1]} → ${nums[i]} falls: a fall extends the best wiggle that last <b>rose</b> → down = up + 1 = <b>${down}</b>${grew ? "" : " (same as before — consecutive falls don't stack)"}.`)
          } else {
            line(6, `${nums[i - 1]} → ${nums[i]} is flat — flats never create a wiggle; up and down are unchanged.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        line(8, `Longest wiggle subsequence: max(${up}, ${down}) = <b>${Math.max(up, down)}</b>.`)
        return Math.max(up, down)
      },
      1,
    )
    narrate(`Greedy = keep only the turning points of the zig-zag; equal neighbors contribute nothing. Two counters replace O(n²) DP.`)
    return solve()
  },
}
