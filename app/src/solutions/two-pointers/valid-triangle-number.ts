import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] =>
  [...(args.nums as number[])].map((x) => Math.max(0, Math.trunc(x))).sort((a, b) => a - b)

export const validTriangleNumber: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// sort; fix the LARGEST side, then count pairs two-pointer style
function triangleNumber(nums) {
  nums.sort((a, b) => a - b);
  let count = 0;
  for (let k = nums.length - 1; k >= 2; k--) {
    let left = 0, right = k - 1;
    while (left < right) {
      if (nums[left] + nums[right] > nums[k]) {
        count += right - left;  // all of left..right-1 also work with right
        right--;
      } else {
        left++;
      }
    }
  }
  return count;
}`,
  codeJava: `// sort; fix the LARGEST side, then count pairs two-pointer style
int triangleNumber(int[] nums) {
  Arrays.sort(nums);
  int count = 0;
  for (int k = nums.length - 1; k >= 2; k--) {
    int left = 0, right = k - 1;
    while (left < right) {
      if (nums[left] + nums[right] > nums[k]) {
        count += right - left;  // all of left..right-1 also work with right
        right--;
      } else {
        left++;
      }
    }
  }
  return count;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (side lengths)", default: [4, 2, 3, 4, 6], maxLen: 10 }],
  entry: (a) => `triangleNumber([${prep(a).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = prep(args)
    const go = fn(
      "triangleNumber",
      (): number => {
        line(2, `Sorted: [${nums.join(", ")}]. With sides sorted, only <b>one</b> inequality matters: a + b > c for the largest c.`)
        let count = 0
        line(3, `count = 0.`)
        for (let k = nums.length - 1; k >= 2; k--) {
          ptr("k", k)
          mark("focus", [k])
          let left = 0
          let right = k - 1
          ptr("left", left)
          ptr("right", right)
          line(5, `Longest side nums[${k}] = <b>${nums[k]}</b>; look for pairs in [0..${k - 1}] with sum > ${nums[k]}.`)
          while (left < right) {
            mark("window", Array.from({ length: right - left + 1 }, (_, i) => left + i))
            if (nums[left] + nums[right] > nums[k]) {
              count += right - left
              mark("good", Array.from({ length: right - left }, (_, i) => left + i))
              line(8, `${nums[left]} + ${nums[right]} > ${nums[k]} — then EVERY left in [${left}..${right - 1}] works with ${nums[right]}: +<b>${right - left}</b> → count = <b>${count}</b>.`)
              right--
              ptr("right", right)
              line(9, `right → ${right} to count pairs with a smaller second side.`)
            } else {
              line(7, `${nums[left]} + ${nums[right]} = ${nums[left] + nums[right]} ≤ ${nums[k]} — too flat to close a triangle.`)
              left++
              ptr("left", left)
              line(11, `left → ${left}: need a bigger smallest side.`)
            }
            vars({ k, left, right, count })
          }
        }
        mark("window", [])
        mark("focus", [])
        mark("good", [])
        ptr("left", -1)
        ptr("right", -1)
        ptr("k", -1)
        line(15, `Total valid triangles: <b>${count}</b> — O(n²) instead of trying all O(n³) triples.`)
        return count
      },
      1,
    )
    return go()
  },
}
