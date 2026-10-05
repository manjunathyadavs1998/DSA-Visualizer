import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const countNumberOfNiceSubarrays: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nice = exactly k odd numbers; exactly(k) = atMost(k) - atMost(k-1)
function numberOfSubarrays(nums, k) {
  return atMost(nums, k) - atMost(nums, k - 1);
}
function atMost(nums, k) {
  if (k < 0) return 0;
  let left = 0, odds = 0, count = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] % 2 === 1) odds++;
    while (odds > k) {                // too many odds: shrink
      if (nums[left] % 2 === 1) odds--;
      left++;
    }
    count += right - left + 1;        // windows ending at right
  }
  return count;
}`,
  codeJava: `// nice = exactly k odd numbers; exactly(k) = atMost(k) - atMost(k-1)
int numberOfSubarrays(int[] nums, int k) {
  return atMost(nums, k) - atMost(nums, k - 1);
}
int atMost(int[] nums, int k) {
  if (k < 0) return 0;
  int left = 0, odds = 0, count = 0;
  for (int right = 0; right < nums.length; right++) {
    if (nums[right] % 2 == 1) odds++;
    while (odds > k) {                // too many odds: shrink
      if (nums[left] % 2 == 1) odds--;
      left++;
    }
    count += right - left + 1;        // windows ending at right
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 1, 2, 1, 1], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 12 },
  ],
  entry: (a) => `numberOfSubarrays([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = (args.nums as number[]).map((v) => Math.abs(Math.trunc(v)))
    const k = Math.max(1, Math.trunc(args.k as number))
    const atMost = fn(
      "atMost",
      (kk: number): number => {
        if (kk < 0) {
          line(5, `atMost(−1): no window can have ≤ −1 odds → <b>0</b>.`)
          return 0
        }
        let left = 0
        let odds = 0
        let count = 0
        ptr("left", 0)
        line(6, `atMost(${kk}): count windows with ≤ <b>${kk}</b> odd numbers.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          if (nums[right] % 2 === 1) {
            odds++
            line(8, `nums[${right}] = ${nums[right]} is <b>odd</b> → odds = ${odds}.`)
          } else {
            line(8, `nums[${right}] = ${nums[right]} is even — odds stays ${odds}.`)
          }
          mark("window", win(left, right))
          while (odds > kk) {
            if (nums[left] % 2 === 1) {
              odds--
              line(10, `odds ${odds + 1} > ${kk}: drop odd nums[${left}] = ${nums[left]} → odds = <b>${odds}</b>.`)
            } else {
              line(10, `odds > ${kk}: drop even nums[${left}] = ${nums[left]}.`)
            }
            left++
            ptr("left", left)
            mark("window", win(left, right))
          }
          count += right - left + 1
          line(13, `+${right - left + 1} windows ending at ${right} → count = <b>${count}</b>.`)
          vars({ k: kk, left, right, odds, count })
        }
        mark("focus", [])
        mark("window", [])
        line(15, `atMost(${kk}) = <b>${count}</b>.`)
        return count
      },
      4,
    )
    const go = fn(
      "numberOfSubarrays",
      (): number => {
        line(2, `A window with <b>exactly ${k}</b> odds can't be shrunk greedily — use atMost(${k}) − atMost(${k - 1}).`)
        const hi = atMost(k)
        const lo = atMost(k - 1)
        line(2, `nice subarrays = ${hi} − ${lo} = <b>${hi - lo}</b>.`)
        return hi - lo
      },
      1,
    )
    return go()
  },
}
