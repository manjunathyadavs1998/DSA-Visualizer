import type { SolutionDef } from "@/engine/types"

export const threeSum: SolutionDef = {
  view: "array",
  array: (a) => [...(a.nums as number[])].sort((x, y) => x - y),
  code: `// nums is editable below (shown pre-sorted)
function threeSum(nums) {
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        l++; r--;
      }
    }
  }
  return result;
}`,
  codeJava: `// int[] nums editable below (shown pre-sorted)
List<List<Integer>> threeSum(int[] nums) {
  List<List<Integer>> result = new ArrayList<>();
  for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
      int sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        result.add(List.of(nums[i], nums[l], nums[r]));
        while (l < r && nums[l] == nums[l + 1]) l++;
        l++; r--;
      }
    }
  }
  return result;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [-4, -1, -1, 0, 1, 2], maxLen: 8 }],
  entry: () => `threeSum(nums)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = [...(args.nums as number[])].sort((x, y) => x - y)
    const result: number[][] = []
    const goodIdx: number[] = []
    const go = fn(
      "threeSum",
      (): string => {
        for (let i = 0; i < nums.length - 2; i++) {
          ptr("i", i)
          if (i > 0 && nums[i] === nums[i - 1]) {
            line(4, `nums[${i}] = ${nums[i]} equals nums[${i - 1}] — same fixed value would rebuild the <b>same triplets</b>, so skip it.`)
            continue
          }
          let l = i + 1, r = nums.length - 1
          ptr("l", l); ptr("r", r); vars({ i, l, r })
          line(5, `Fix nums[${i}] = <b>${nums[i]}</b>; squeeze l/r through the rest looking for two numbers summing to ${-nums[i]}.`)
          while (l < r) {
            const sum = nums[i] + nums[l] + nums[r]
            mark("focus", [i, l, r]); vars({ i, l, r, sum })
            line(7, `sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = <b>${sum}</b>.`)
            if (sum < 0) {
              line(8, `${sum} < 0 → need a <b>bigger</b> sum → move l right.`)
              l++
            } else if (sum > 0) {
              line(9, `${sum} > 0 → need a <b>smaller</b> sum → move r left.`)
              r--
            } else {
              result.push([nums[i], nums[l], nums[r]])
              heap("result", result)
              goodIdx.push(i, l, r)
              mark("good", [...goodIdx])
              line(11, `<b>Zero!</b> Triplet found: [${nums[i]}, ${nums[l]}, ${nums[r]}].`)
              while (l < r && nums[l] === nums[l + 1]) {
                line(12, `nums[${l}] = nums[${l + 1}] = ${nums[l]} — skip the duplicate so the triplet isn't recorded twice.`)
                l++
              }
              line(13, `Move both pointers inward to hunt for the next distinct pair.`)
              l++; r--
            }
            ptr("l", l); ptr("r", r)
          }
        }
        mark("focus", [])
        line(17, `All fixed values tried — <b>${result.length}</b> unique triplet${result.length === 1 ? "" : "s"}.`)
        return JSON.stringify(result)
      },
      1,
    )
    narrate("Sorting first is the whole trick: fix one number, then a two-pointer squeeze finds the other two in O(n) — duplicates are skipped, never deduped later.")
    heap("result", result)
    return go()
  },
}
