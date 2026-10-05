import type { SolutionDef } from "@/engine/types"

export const subsetsII: SolutionDef = {
  code: `// sorted nums with duplicates (editable)
function subsetsII(start, cur) {
  result.push([...cur]);
  for (let k = start; k < nums.length; k++) {
    if (k > start && nums[k] === nums[k - 1]) continue; // skip dup
    cur.push(nums[k]);
    subsetsII(k + 1, cur);
    cur.pop();                    // backtrack
  }
}`,
  codeJava: `// sorted int[] nums with duplicates (editable)
void subsetsII(int start, List<Integer> cur) {
  result.add(new ArrayList<>(cur));
  for (int k = start; k < nums.length; k++) {
    if (k > start && nums[k] == nums[k - 1]) continue; // skip dup
    cur.add(nums[k]);
    subsetsII(k + 1, cur);
    cur.remove(cur.size() - 1);   // backtrack
  }
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "sorted nums", default: [1, 2, 2], maxLen: 4 }],
  entry: () => `subsetsII(0, [])`,
  run({ fn, line, narrate }, args) {
    const nums = [...(args.nums as number[])].sort((a, b) => a - b)
    const result: number[][] = []
    const go = fn(
      "subsetsII",
      (start: number, cur: number[]): string => {
        line(2, `Record {${cur.join(",") || "∅"}} — every node is a valid subset here, not just leaves.`)
        result.push([...cur])
        for (let k = start; k < nums.length; k++) {
          if (k > start && nums[k] === nums[k - 1]) {
            line(4, `nums[${k}] = ${nums[k]} repeats nums[${k - 1}] at the same level → <b>skip to avoid a duplicate subset</b>.`)
            continue
          }
          line(5, `Take nums[${k}] = ${nums[k]} → {${[...cur, nums[k]].join(",")}}.`)
          cur.push(nums[k])
          go(k + 1, cur)
          line(7, `Backtrack: drop ${nums[k]}.`)
          cur.pop()
        }
        return "✓"
      },
      1,
    )
    narrate("Sorted input + 'skip equal neighbor at the same level' = no duplicate subsets, no set needed.")
    go(0, [])
    return JSON.stringify(result)
  },
}
