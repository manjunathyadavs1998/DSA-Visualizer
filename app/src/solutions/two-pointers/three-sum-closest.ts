import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] => {
  const nums = (args.nums as number[]).map(Math.trunc)
  while (nums.length < 3) nums.push(0)
  return [...nums].sort((a, b) => a - b)
}

export const threeSumClosest: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// sort, then fix i and scan the rest with two pointers
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum;     // can't get closer than exact
      if (sum < target) left++;           // need a bigger sum
      else right--;                       // need a smaller sum
    }
  }
  return best;
}`,
  codeJava: `// sort, then fix i and scan the rest with two pointers
int threeSumClosest(int[] nums, int target) {
  Arrays.sort(nums);
  int best = nums[0] + nums[1] + nums[2];
  for (int i = 0; i < nums.length - 2; i++) {
    int left = i + 1, right = nums.length - 1;
    while (left < right) {
      int sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum == target) return sum;      // can't get closer than exact
      if (sum < target) left++;           // need a bigger sum
      else right--;                       // need a smaller sum
    }
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [-4, -1, 1, 2, 5, 7], maxLen: 10 },
    { kind: "number", name: "target", label: "target", default: 6, min: -30, max: 30 },
  ],
  entry: (a) => `threeSumClosest([${prep(a).join(",")}], ${a.target})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = prep(args)
    const target = args.target as number
    const go = fn(
      "threeSumClosest",
      (): number => {
        line(2, `Sorted: [${nums.join(", ")}]. Sorting lets a too-small sum say "move left up" and a too-big sum say "move right down".`)
        let best = nums[0] + nums[1] + nums[2]
        line(3, `Seed best with the first triple: ${nums[0]} + ${nums[1]} + ${nums[2]} = <b>${best}</b>.`)
        for (let i = 0; i < nums.length - 2; i++) {
          ptr("i", i)
          mark("focus", [i])
          let left = i + 1
          let right = nums.length - 1
          ptr("left", left)
          ptr("right", right)
          line(5, `Fix nums[${i}] = <b>${nums[i]}</b>; scan the suffix with left = ${left}, right = ${right}.`)
          while (left < right) {
            mark("window", span(left, right))
            const sum = nums[i] + nums[left] + nums[right]
            line(7, `sum = ${nums[i]} + ${nums[left]} + ${nums[right]} = <b>${sum}</b> (target ${target}).`)
            if (Math.abs(sum - target) < Math.abs(best - target)) {
              best = sum
              line(8, `|${sum} − ${target}| = ${Math.abs(sum - target)} is the closest yet → best = <b>${best}</b>.`)
            } else {
              line(8, `|${sum} − ${target}| = ${Math.abs(sum - target)} ≥ |${best} − ${target}| = ${Math.abs(best - target)} — keep best = ${best}.`)
            }
            vars({ i, left, right, sum, best })
            if (sum === target) {
              mark("good", [i, left, right])
              line(9, `Exact hit! sum = target = <b>${sum}</b> — nothing can be closer, return immediately.`)
              return sum
            }
            if (sum < target) {
              left++
              ptr("left", left)
              line(10, `Sum too small → raise it: left moves to <b>${left}</b>.`)
            } else {
              right--
              ptr("right", right)
              line(11, `Sum too big → lower it: right moves to <b>${right}</b>.`)
            }
          }
        }
        mark("window", [])
        mark("focus", [])
        ptr("left", -1)
        ptr("right", -1)
        ptr("i", -1)
        line(14, `All anchors tried. Closest achievable sum: <b>${best}</b>.`)
        return best
      },
      1,
    )
    return go()
  },
}

const span = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
