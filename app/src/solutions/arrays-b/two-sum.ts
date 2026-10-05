import type { SolutionDef } from "@/engine/types"

export const twoSum: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums and target are editable below
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (memo[need] !== undefined)
      return [memo[need], i];
    memo[nums[i]] = i;    // remember value → index
  }
  return [-1, -1];
}`,
  codeJava: `// int[] nums and int target editable below
int[] twoSum(int[] nums, int target) {
  for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (memo.containsKey(need))
      return new int[]{memo.get(need), i};
    memo.put(nums[i], i);  // remember value → index
  }
  return new int[]{-1, -1};
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [3, 1, 8, 5, 11, 7], maxLen: 10 },
    { kind: "number", name: "target", label: "target", default: 12, min: -99, max: 99 },
  ],
  entry: (a) => `twoSum(nums, ${a.target})`,
  run({ fn, memo, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const target = args.target as number
    const go = fn(
      "twoSum",
      (): string => {
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          const need = target - nums[i]
          vars({ i, need })
          line(3, `nums[${i}] = ${nums[i]} → its partner must be ${target} − ${nums[i]} = <b>${need}</b>.`)
          const hit = memo[String(need)]
          line(4, `Is ${need} already in the seen-map? (${hit !== undefined ? "<b>yes — cache hit!</b>" : "no"})`)
          if (hit !== undefined) {
            mark("good", [hit as number, i])
            mark("focus", [])
            line(5, `The cache hit IS the answer: ${need} was seen at index ${hit} → return <b>[${hit}, ${i}]</b>.`)
            return JSON.stringify([hit, i])
          }
          memo[String(nums[i])] = i
          line(6, `Remember <b>${nums[i]} → ${i}</b> so a future element can find it in O(1).`)
        }
        mark("focus", [])
        line(8, `Scanned everything — <b>no pair sums to ${target}</b>.`)
        return JSON.stringify([-1, -1])
      },
      1,
    )
    narrate("One pass: the memo is the seen-map (value → index). A hit on target − current means the pair is complete.")
    return go()
  },
}
