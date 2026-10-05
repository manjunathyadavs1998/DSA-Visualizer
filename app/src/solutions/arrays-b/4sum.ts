import type { SolutionDef } from "@/engine/types"

export const fourSum: SolutionDef = {
  view: "array",
  array: (a) => [...(a.nums as number[])].sort((x, y) => x - y),
  code: `// nums (shown pre-sorted) and target are editable below
function fourSum(nums, target) {
  const result = [];
  for (let a = 0; a < nums.length - 3; a++) {
    if (a > 0 && nums[a] === nums[a - 1]) continue;
    for (let b = a + 1; b < nums.length - 2; b++) {
      if (b > a + 1 && nums[b] === nums[b - 1]) continue;
      let l = b + 1, r = nums.length - 1;
      while (l < r) {
        const sum = nums[a] + nums[b] + nums[l] + nums[r];
        if (sum < target) l++;
        else if (sum > target) r--;
        else {
          result.push([nums[a], nums[b], nums[l], nums[r]]);
          while (l < r && nums[l] === nums[l + 1]) l++;
          l++; r--;
        }
      }
    }
  }
  return result;
}`,
  codeJava: `// int[] nums (shown pre-sorted) and int target editable
List<List<Integer>> fourSum(int[] nums, int target) {
  List<List<Integer>> result = new ArrayList<>();
  for (int a = 0; a < nums.length - 3; a++) {
    if (a > 0 && nums[a] == nums[a - 1]) continue;
    for (int b = a + 1; b < nums.length - 2; b++) {
      if (b > a + 1 && nums[b] == nums[b - 1]) continue;
      int l = b + 1, r = nums.length - 1;
      while (l < r) {
        int sum = nums[a] + nums[b] + nums[l] + nums[r];
        if (sum < target) l++;
        else if (sum > target) r--;
        else {
          result.add(List.of(nums[a], nums[b], nums[l], nums[r]));
          while (l < r && nums[l] == nums[l + 1]) l++;
          l++; r--;
        }
      }
    }
  }
  return result;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 0, -1, 0, -2, 2], maxLen: 7 },
    { kind: "number", name: "target", label: "target", default: 0, min: -30, max: 30 },
  ],
  entry: (a) => `fourSum(nums, ${a.target})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = [...(args.nums as number[])].sort((x, y) => x - y)
    const target = args.target as number
    const result: number[][] = []
    const goodIdx: number[] = []
    const go = fn(
      "fourSum",
      (): string => {
        for (let a = 0; a < nums.length - 3; a++) {
          ptr("a", a)
          if (a > 0 && nums[a] === nums[a - 1]) {
            line(4, `nums[${a}] = ${nums[a]} repeats nums[${a - 1}] — skip to avoid duplicate quads.`)
            continue
          }
          for (let b = a + 1; b < nums.length - 2; b++) {
            ptr("b", b)
            if (b > a + 1 && nums[b] === nums[b - 1]) {
              line(6, `nums[${b}] = ${nums[b]} repeats nums[${b - 1}] — skip the duplicate second fix.`)
              continue
            }
            let l = b + 1, r = nums.length - 1
            ptr("l", l); ptr("r", r); vars({ a, b, l, r })
            line(7, `Fix nums[${a}] = <b>${nums[a]}</b> and nums[${b}] = <b>${nums[b]}</b>; squeeze l/r for the remaining ${target - nums[a] - nums[b]}.`)
            while (l < r) {
              const sum = nums[a] + nums[b] + nums[l] + nums[r]
              mark("focus", [a, b, l, r]); vars({ a, b, l, r, sum })
              line(9, `sum = ${nums[a]} + ${nums[b]} + ${nums[l]} + ${nums[r]} = <b>${sum}</b> (target ${target}).`)
              if (sum < target) {
                line(10, `${sum} < ${target} → need <b>bigger</b> → l moves right.`)
                l++
              } else if (sum > target) {
                line(11, `${sum} > ${target} → need <b>smaller</b> → r moves left.`)
                r--
              } else {
                result.push([nums[a], nums[b], nums[l], nums[r]])
                heap("result", result)
                goodIdx.push(a, b, l, r)
                mark("good", [...goodIdx])
                line(13, `<b>Hit ${target}!</b> Quad found: [${nums[a]}, ${nums[b]}, ${nums[l]}, ${nums[r]}].`)
                while (l < r && nums[l] === nums[l + 1]) {
                  line(14, `nums[${l}] = nums[${l + 1}] = ${nums[l]} — skip the duplicate.`)
                  l++
                }
                line(15, `Move both inner pointers inward for the next distinct pair.`)
                l++; r--
              }
              ptr("l", l); ptr("r", r)
            }
          }
        }
        mark("focus", [])
        line(20, `Every (a, b) pair tried — <b>${result.length}</b> unique quad${result.length === 1 ? "" : "s"}.`)
        return JSON.stringify(result)
      },
      1,
    )
    narrate("3Sum, one level deeper: two fixed pointers a/b plus the l/r squeeze — sorting makes both the squeeze and duplicate-skipping possible.")
    heap("result", result)
    return go()
  },
}
