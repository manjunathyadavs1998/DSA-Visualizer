import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const maximumAverageSubarrayI: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// best average over any window of exactly k elements
function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];   // first window
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];       // slide by one
    best = Math.max(best, sum);
  }
  return best / k;
}`,
  codeJava: `// best average over any window of exactly k elements
double findMaxAverage(int[] nums, int k) {
  int sum = 0;
  for (int i = 0; i < k; i++) sum += nums[i];   // first window
  int best = sum;
  for (int right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];       // slide by one
    best = Math.max(best, sum);
  }
  return (double) best / k;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 12, -5, -6, 50, 3, -2, 8, 11, -4], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 4, min: 1, max: 12 },
  ],
  entry: (a) => `findMaxAverage([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = args.nums as number[]
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), nums.length)
    const go = fn(
      "findMaxAverage",
      (): number => {
        let sum = 0
        line(2, `Max average over fixed length k = ${k} ⇔ <b>max sum</b> over length ${k} — divide once at the end.`)
        for (let i = 0; i < k; i++) {
          sum += nums[i]
          mark("focus", [i])
          mark("window", win(0, i))
          line(3, `Build the first window: sum += nums[${i}] = ${nums[i]} → sum = <b>${sum}</b>.`)
        }
        let best = sum
        let bestEnd = k - 1
        ptr("left", 0)
        ptr("right", k - 1)
        line(4, `First window [0..${k - 1}] sums to <b>${sum}</b> — the best so far.`)
        for (let right = k; right < nums.length; right++) {
          ptr("right", right)
          ptr("left", right - k + 1)
          mark("focus", [right])
          mark("bad", [right - k])
          sum += nums[right] - nums[right - k]
          mark("window", win(right - k + 1, right))
          line(6, `Slide: +nums[${right}] (${nums[right]}) and −nums[${right - k}] (${nums[right - k]}) → sum = <b>${sum}</b>. No re-summing!`)
          if (sum > best) {
            best = sum
            bestEnd = right
            line(7, `sum ${sum} beats best — <b>new best window</b> [${right - k + 1}..${right}].`)
          } else {
            line(7, `sum ${sum} ≤ best ${best} — keep the old window.`)
          }
          vars({ right, sum, best })
        }
        mark("focus", [])
        mark("bad", [])
        mark("window", [])
        mark("good", win(bestEnd - k + 1, bestEnd))
        const avg = best / k
        line(9, `Best sum ${best} over k = ${k} → average <b>${avg}</b>. One pass, O(1) per slide.`)
        return avg
      },
      1,
    )
    return go()
  },
}
