import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] => [...(args.nums as number[])].map(Math.trunc).sort((a, b) => a - b)

export const maxNumberOfKSumPairs: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// sort; it's Two Sum II, but every match REMOVES both numbers
function maxOperations(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1, ops = 0;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === k)    { ops++; left++; right--; }  // pair found
    else if (sum < k) { left++; }     // need a bigger sum
    else              { right--; }    // need a smaller sum
  }
  return ops;
}`,
  codeJava: `// sort; it's Two Sum II, but every match REMOVES both numbers
int maxOperations(int[] nums, int k) {
  Arrays.sort(nums);
  int left = 0, right = nums.length - 1, ops = 0;
  while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == k)     { ops++; left++; right--; }  // pair found
    else if (sum < k) { left++; }     // need a bigger sum
    else              { right--; }    // need a smaller sum
  }
  return ops;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 2, 3, 4, 4, 5, 6, 7, 8], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 9, min: 1, max: 50 },
  ],
  entry: (a) => `maxOperations([${prep(a).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = prep(args)
    const k = args.k as number
    const go = fn(
      "maxOperations",
      (): number => {
        line(2, `Sorted: [${nums.join(", ")}]. Smallest + largest tells us which side to move — classic converging pointers.`)
        let left = 0
        let right = nums.length - 1
        let ops = 0
        ptr("left", left)
        ptr("right", right >= 0 ? right : -1)
        line(3, `left = ${left}, right = ${right}, ops = 0 (pairs removed so far).`)
        while (left < right) {
          mark("focus", [left, right])
          const sum = nums[left] + nums[right]
          line(5, `sum = ${nums[left]} + ${nums[right]} = <b>${sum}</b> vs k = ${k}.`)
          if (sum === k) {
            ops++
            mark("good", [left, right])
            line(6, `Exactly k! Remove the pair (${nums[left]}, ${nums[right]}) → ops = <b>${ops}</b>; both pointers step inward.`)
            left++
            right--
            ptr("left", left)
            ptr("right", right)
          } else if (sum < k) {
            mark("bad", [left])
            line(7, `${sum} < ${k}: ${nums[left]} is too small to pair with ANY remaining number — discard it, left → ${left + 1}.`)
            left++
            ptr("left", left)
          } else {
            mark("bad", [right])
            line(8, `${sum} > ${k}: ${nums[right]} is too big to pair with ANY remaining number — discard it, right → ${right - 1}.`)
            right--
            ptr("right", right)
          }
          vars({ left, right, ops })
        }
        mark("focus", [])
        mark("bad", [])
        line(10, `No pairs left to make: maximum operations = <b>${ops}</b>.`)
        return ops
      },
      1,
    )
    return go()
  },
}
