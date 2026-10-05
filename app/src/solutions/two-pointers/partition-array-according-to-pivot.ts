import type { SolutionDef } from "@/engine/types"

export const partitionArrayAccordingToPivot: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// three STABLE buckets: less, equal, greater — then write back
function pivotArray(nums, pivot) {
  const less = [], equal = [], greater = [];
  for (const x of nums) {
    if (x < pivot) less.push(x);
    else if (x === pivot) equal.push(x);
    else greater.push(x);
  }
  const out = [...less, ...equal, ...greater];
  for (let i = 0; i < nums.length; i++) nums[i] = out[i];
  return nums;
}`,
  codeJava: `// three STABLE buckets: less, equal, greater — then write back
int[] pivotArray(int[] nums, int pivot) {
  List<Integer> less = new ArrayList<>(), equal = new ArrayList<>(), greater = new ArrayList<>();
  for (int x : nums) {
    if (x < pivot) less.add(x);
    else if (x == pivot) equal.add(x);
    else greater.add(x);
  }
  int[] out = Stream.of(less, equal, greater).flatMap(List::stream).mapToInt(v -> v).toArray();
  for (int i = 0; i < nums.length; i++) nums[i] = out[i];
  return nums;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [9, 12, 5, 10, 14, 3, 10], maxLen: 12 },
    { kind: "number", name: "pivot", label: "pivot", default: 10, min: -20, max: 20 },
  ],
  entry: (a) => `pivotArray([${(a.nums as number[]).join(",")}], ${a.pivot})`,
  run({ fn, line, ptr, mark, aset, heap, vars }, args) {
    const nums = [...(args.nums as number[])].map(Math.trunc)
    const pivot = args.pivot as number
    const go = fn(
      "pivotArray",
      (): string => {
        const less: number[] = []
        const equal: number[] = []
        const greater: number[] = []
        heap("less", less)
        heap("equal", equal)
        heap("greater", greater)
        line(2, `In-place partition (quicksort-style) would scramble order — but this problem demands <b>stability</b>, so we bucket.`)
        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          ptr("read", i)
          mark("focus", [i])
          if (x < pivot) {
            less.push(x)
            heap("less", less)
            line(4, `nums[${i}] = ${x} < ${pivot} → <b>less</b> bucket (now [${less.join(", ")}]).`)
          } else if (x === pivot) {
            equal.push(x)
            heap("equal", equal)
            line(5, `nums[${i}] = ${x} = pivot → <b>equal</b> bucket (now [${equal.join(", ")}]).`)
          } else {
            greater.push(x)
            heap("greater", greater)
            line(6, `nums[${i}] = ${x} > ${pivot} → <b>greater</b> bucket (now [${greater.join(", ")}]).`)
          }
          vars({ i, x })
        }
        ptr("read", -1)
        mark("focus", [])
        const out = [...less, ...equal, ...greater]
        heap("output", out)
        line(8, `Concatenate the buckets — each kept arrival order, so the result is stable: [${out.join(", ")}].`)
        for (let i = 0; i < nums.length; i++) {
          nums[i] = out[i]
          aset(i, out[i])
          ptr("write", i)
          mark("good", i < less.length ? [i] : [])
          mark("window", i >= less.length && i < less.length + equal.length ? [i] : [])
          line(9, `Write back: nums[${i}] = <b>${out[i]}</b> (${i < less.length ? "less" : i < less.length + equal.length ? "equal" : "greater"} zone).`)
        }
        ptr("write", -1)
        mark("good", Array.from({ length: less.length }, (_, i) => i))
        mark("window", Array.from({ length: equal.length }, (_, i) => less.length + i))
        line(10, `Done: ${less.length} below, ${equal.length} equal, ${greater.length} above the pivot ${pivot} — O(n) time, O(n) space.`)
        return `[${nums.join(",")}]`
      },
      1,
    )
    return go()
  },
}
