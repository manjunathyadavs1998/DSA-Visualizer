import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const maximumErasureValue: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// max sum over windows where every element is unique
function maximumUniqueSubarray(nums) {
  const seen = new Set();
  let left = 0, sum = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    while (seen.has(nums[right])) {   // duplicate: shrink past it
      seen.delete(nums[left]);
      sum -= nums[left];
      left++;
    }
    seen.add(nums[right]);
    sum += nums[right];
    best = Math.max(best, sum);
  }
  return best;
}`,
  codeJava: `// max sum over windows where every element is unique
int maximumUniqueSubarray(int[] nums) {
  Set<Integer> seen = new HashSet<>();
  int left = 0, sum = 0, best = 0;
  for (int right = 0; right < nums.length; right++) {
    while (seen.contains(nums[right])) {
      seen.remove(nums[left]);
      sum -= nums[left];
      left++;
    }
    seen.add(nums[right]);
    sum += nums[right];
    best = Math.max(best, sum);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 2, 4, 5, 6, 2, 5], maxLen: 12 }],
  entry: (a) => `maximumUniqueSubarray([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = (args.nums as number[]).map((v) => Math.max(0, Math.trunc(v)))
    const go = fn(
      "maximumUniqueSubarray",
      (): number => {
        const seen = new Set<number>()
        let left = 0
        let sum = 0
        let best = 0
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(2, `Same skeleton as "longest substring without repeats" — but we maximize the <b>sum</b>, not the length.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          while (seen.has(nums[right])) {
            line(5, `nums[${right}] = <b>${nums[right]}</b> is already in the window — shrink until the old copy leaves.`)
            seen.delete(nums[left])
            sum -= nums[left]
            mark("bad", [left])
            line(7, `Drop nums[${left}] = ${nums[left]} → sum = ${sum}.`)
            left++
            ptr("left", left)
            mark("bad", [])
            heap("seen", [...seen])
            line(8, `left → ${left}.`)
          }
          seen.add(nums[right])
          sum += nums[right]
          heap("seen", [...seen])
          mark("window", win(left, right))
          line(11, `Take nums[${right}] = ${nums[right]} → sum = <b>${sum}</b>, window all-unique.`)
          if (sum > best) {
            best = sum
            bestRange = [left, right]
            line(12, `sum ${sum} is a <b>new best</b>!`)
          } else {
            line(12, `best stays ${best}.`)
          }
          vars({ left, right, sum, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestRange[0], bestRange[1]))
        line(14, `Best unique-element window (green) scores <b>${best}</b>.`)
        return best
      },
      1,
    )
    return go()
  },
}
