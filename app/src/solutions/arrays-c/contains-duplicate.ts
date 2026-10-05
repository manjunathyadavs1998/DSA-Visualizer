import type { SolutionDef } from "@/engine/types"

export const containsDuplicate: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// true if any value appears at least twice
function containsDuplicate(nums) {
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i]))
      return true;          // nums[i] was seen before
    seen.add(nums[i]);
  }
  return false;             // all values distinct
}`,
  codeJava: `// true if any value appears at least twice
boolean containsDuplicate(int[] nums) {
  Set<Integer> seen = new HashSet<>();
  for (int i = 0; i < nums.length; i++) {
    if (seen.contains(nums[i]))
      return true;          // nums[i] was seen before
    seen.add(nums[i]);
  }
  return false;             // all values distinct
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [3, 1, 4, 2, 5, 1, 6], maxLen: 12 }],
  entry: (a) => `containsDuplicate([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "containsDuplicate",
      (): boolean => {
        const seen = new Map<number, number>() // value → first index (for teaching)
        heap("map", {})
        line(2, `Start with an <b>empty hash set</b> — membership checks will be O(1).`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          const firstAt = seen.get(nums[i])
          line(4, `Is <b>${nums[i]}</b> already in the set? (${firstAt !== undefined ? "<b>yes!</b>" : "no"})`)
          if (firstAt !== undefined) {
            mark("good", [firstAt, i])
            vars({ i, duplicate: nums[i] })
            line(5, `<b>${nums[i]}</b> first appeared at index ${firstAt} and again at index ${i} → return <b>true</b>.`)
            return true
          }
          seen.set(nums[i], i)
          heap("map", Object.fromEntries([...seen].map(([v, idx]) => [v, `first @ ${idx}`])))
          vars({ i, setSize: seen.size })
          line(6, `New value — add <b>${nums[i]}</b> to the set (size ${seen.size}).`)
        }
        mark("focus", [])
        line(8, `Scanned all ${nums.length} values without a repeat → return <b>false</b>.`)
        return false
      },
      1,
    )
    narrate("A hash set trades O(n) extra memory for O(1) lookups — one pass instead of comparing every pair.")
    return go()
  },
}
