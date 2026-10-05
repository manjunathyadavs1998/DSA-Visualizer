import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const sorted = (a: number[]) => [...a].map((v) => Math.trunc(v)).sort((x, y) => x - y)

export const frequencyOfTheMostFrequentElement: SolutionDef = {
  view: "array",
  array: (a) => sorted(a.nums as number[]),
  code: `// sort; a window is fixable if len*max - sum <= k increments
function maxFrequency(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, sum = 0, best = 1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while ((right - left + 1) * nums[right] - sum > k) {
      sum -= nums[left];              // too costly: shrink
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// sort; a window is fixable if len*max - sum <= k increments
int maxFrequency(int[] nums, int k) {
  Arrays.sort(nums);
  int left = 0; long sum = 0; int best = 1;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while ((long)(right - left + 1) * nums[right] - sum > k) {
      sum -= nums[left];              // too costly: shrink
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 4, 8, 13, 13, 2], maxLen: 12 },
    { kind: "number", name: "k", label: "k (increments)", default: 5, min: 0, max: 50 },
  ],
  entry: (a) => `maxFrequency([${sorted(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = sorted(args.nums as number[])
    const k = Math.max(0, Math.trunc(args.k as number))
    const go = fn(
      "maxFrequency",
      (): number => {
        line(2, `Sorted: [${nums.join(", ")}]. In sorted order, the elements we'd raise to match a value sit <b>right next to it</b>.`)
        let left = 0
        let sum = 0
        let best = 1
        let bestRange: [number, number] = [0, 0]
        ptr("left", 0)
        line(3, `A window ending at nums[right] costs (len × nums[right]) − sum to make all equal. Budget: k = ${k}.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += nums[right]
          mark("window", win(left, right))
          line(5, `sum += nums[${right}] = ${nums[right]} → sum = <b>${sum}</b>.`)
          while ((right - left + 1) * nums[right] - sum > k) {
            const cost = (right - left + 1) * nums[right] - sum
            line(6, `Cost = ${right - left + 1}×${nums[right]} − ${sum} = <b>${cost}</b> > k = ${k} — can't afford it.`)
            sum -= nums[left]
            line(7, `Shrink: drop nums[${left}] = ${nums[left]} → sum = ${sum}.`)
            left++
            ptr("left", left)
            mark("window", win(left, right))
          }
          const cost = (right - left + 1) * nums[right] - sum
          if (right - left + 1 > best) {
            best = right - left + 1
            bestRange = [left, right]
            line(10, `Cost ${cost} ≤ ${k}: raise [${left}..${right}] to ${nums[right]} → frequency <b>${best}</b>. New best!`)
          } else {
            line(10, `Window [${left}..${right}] is affordable (cost ${cost}) — best stays ${best}.`)
          }
          vars({ left, right, sum, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestRange[0], bestRange[1]))
        line(12, `With ${k} increments, value <b>${nums[bestRange[1]]}</b> can appear <b>${best}</b> times (green window).`)
        return best
      },
      1,
    )
    return go()
  },
}
