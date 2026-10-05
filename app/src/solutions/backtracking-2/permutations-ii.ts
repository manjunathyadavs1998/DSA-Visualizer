import type { SolutionDef } from "@/engine/types"

export const permutationsII: SolutionDef = {
  code: `// nums (sorted first) may contain duplicates
function backtrack(cur) {
  if (cur.length === nums.length) {
    output.push([...cur]);     // one full permutation
    return;
  }
  for (let i = 0; i < nums.length; i++) {
    if (used[i]) continue;     // already in cur
    if (i > 0 && nums[i] === nums[i-1] && !used[i-1])
      continue;                // duplicate: keep left-first order
    used[i] = true; cur.push(nums[i]);
    backtrack(cur);
    used[i] = false; cur.pop();        // backtrack
  }
}`,
  codeJava: `// int[] nums (sorted first) may contain duplicates
void backtrack(List<Integer> cur) {
  if (cur.size() == nums.length) {
    output.add(new ArrayList<>(cur));  // one full permutation
    return;
  }
  for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;     // already in cur
    if (i > 0 && nums[i] == nums[i-1] && !used[i-1])
      continue;                // duplicate: keep left-first order
    used[i] = true; cur.add(nums[i]);
    backtrack(cur);
    used[i] = false; cur.remove(cur.size() - 1);  // backtrack
  }
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 1, 2], maxLen: 4 }],
  entry: () => `backtrack([])`,
  run({ fn, heap, line, vars, narrate }, args) {
    const nums = [...(args.nums as number[])].sort((a, b) => a - b)
    const used: boolean[] = nums.map(() => false)
    const output: number[][] = []
    const backtrack = fn(
      "backtrack",
      (cur: number[]): string => {
        vars({ cur: `[${cur.join(",")}]`, used: used.map((u) => (u ? 1 : 0)).join("") })
        line(2, `cur = [${cur.join(",") || " "}] has ${cur.length}/${nums.length} slots filled — done? (${cur.length === nums.length ? "<b>yes</b>" : "no"})`)
        if (cur.length === nums.length) {
          line(3, `<b>Leaf!</b> Record permutation [${cur.join(",")}].`)
          output.push([...cur])
          heap("output", output)
          return `[${cur.join(",")}]`
        }
        for (let i = 0; i < nums.length; i++) {
          if (used[i]) {
            line(7, `nums[${i}] = ${nums[i]} is <b>already used</b> — skip.`)
            continue
          }
          if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
            line(9, `nums[${i}] = ${nums[i]} duplicates nums[${i - 1}] and the left copy is <b>unused</b> — pruning this branch avoids a repeat permutation.`)
            continue
          }
          line(10, `Place nums[${i}] = <b>${nums[i]}</b> → cur = [${[...cur, nums[i]].join(",")}].`)
          used[i] = true
          cur.push(nums[i])
          heap("cur", cur)
          backtrack(cur)
          line(12, `Backtrack: free nums[${i}] = ${nums[i]} → cur = [${cur.slice(0, -1).join(",") || " "}].`)
          used[i] = false
          cur.pop()
          heap("cur", cur)
        }
        return "✓"
      },
      1,
    )
    narrate(`Sorted nums put duplicates side by side; the "!used[i-1]" rule says: among equal values, always pick the leftmost unused one first.`)
    heap("nums (sorted)", nums)
    heap("output", output)
    backtrack([])
    return JSON.stringify(output)
  },
}
