import type { SolutionDef } from "@/engine/types"

export const maxConsecutiveOnes: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums (0s and 1s) is editable below
function maxOnes(nums) {
  let run = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) run++;
    else run = 0;
    best = Math.max(best, run);
  }
  return best;
}`,
  codeJava: `// int[] nums (0s and 1s) editable below
int maxOnes(int[] nums) {
  int run = 0, best = 0;
  for (int i = 0; i < nums.length; i++) {
    if (nums[i] == 1) run++;
    else run = 0;
    best = Math.max(best, run);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 1, 0, 1, 1, 1, 0, 1], maxLen: 12 }],
  entry: () => `maxOnes(nums)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "maxOnes",
      (): number => {
        let run = 0, best = 0
        let bestIdx: number[] = []
        vars({ run, best })
        line(2, `run counts the current streak of 1s; best remembers the longest so far.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          if (nums[i] === 1) {
            run++
            mark("window", Array.from({ length: run }, (_, k) => i - run + 1 + k))
            vars({ i, run, best })
            line(4, `nums[${i}] = 1 → streak extends to <b>${run}</b>.`)
          } else {
            run = 0
            mark("window", [])
            vars({ i, run, best })
            line(5, `nums[${i}] = 0 → streak <b>breaks</b>, run resets to 0.`)
          }
          if (run > best) {
            best = run
            bestIdx = Array.from({ length: run }, (_, k) => i - run + 1 + k)
            mark("good", bestIdx)
            vars({ i, run, best })
            line(6, `New record! best = <b>${best}</b>.`)
          }
        }
        mark("window", [])
        line(8, `Longest run of consecutive 1s = <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("The simplest sliding window: extend the run on every 1, reset on every 0, and keep the best length seen.")
    return go()
  },
}
