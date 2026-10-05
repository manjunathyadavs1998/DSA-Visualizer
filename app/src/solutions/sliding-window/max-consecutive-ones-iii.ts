import type { SolutionDef } from "@/engine/types"

export const maxConsecutiveOnesIII: SolutionDef = {
  view: "array",
  array: (a) => (a.nums as number[]).map((v) => (v ? 1 : 0)),
  code: `// longest run of 1s if you may flip k zeros
function longestOnes(nums, k) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;               // too many zeros — shrink
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// longest run of 1s if you may flip k zeros
int longestOnes(int[] nums, int k) {
  int left = 0, zeros = 0, best = 0;
  for (int right = 0; right < nums.length; right++) {
    if (nums[right] == 0) zeros++;
    while (zeros > k) {
      if (nums[left] == 0) zeros--;
      left++;               // too many zeros — shrink
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "bits", default: [1, 1, 0, 0, 1, 1, 1, 0, 1], maxLen: 12 },
    { kind: "number", name: "k", label: "k (flips)", default: 2, min: 0, max: 5 },
  ],
  entry: (a) => `longestOnes([${(a.nums as number[]).map((v) => (v ? 1 : 0)).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = (args.nums as number[]).map((v) => (v ? 1 : 0))
    const k = args.k as number
    const go = fn(
      "longestOnes",
      (): number => {
        let left = 0
        let zeros = 0
        let best = 0
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(2, `Reframe: find the longest window holding at most ${k} zeros — those are the flips.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          if (nums[right] === 0) {
            zeros++
            line(4, `nums[${right}] is a 0 → zeros in window = <b>${zeros}</b>.`)
          } else {
            line(4, `nums[${right}] is a 1 — free to take.`)
          }
          while (zeros > k) {
            const d = nums[left]
            mark("bad", [left])
            if (d === 0) {
              zeros--
              line(6, `Too many zeros (${zeros + 1} > ${k}) → the zero at ${left} leaves → zeros = ${zeros}.`)
            } else {
              line(6, `Drop the 1 at ${left} while hunting for the extra zero.`)
            }
            left++
            ptr("left", left)
            mark("bad", [])
          }
          const len = right - left + 1
          mark("window", Array.from({ length: len }, (_, x) => left + x))
          if (len > best) {
            best = len
            bestRange = [left, right]
            line(9, `Window [${left}..${right}] uses ${zeros} flip${zeros === 1 ? '' : 's'} — <b>best = ${best}</b>.`)
          } else {
            line(9, `Window length ${len} — best stays ${best}.`)
          }
          vars({ left, zeros, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, x) => bestRange[0] + x))
        line(11, `Longest run of 1s with ≤ ${k} flips: <b>${best}</b> (green).`)
        return best
      },
      1,
    )
    return go()
  },
}
