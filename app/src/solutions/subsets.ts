import type { SolutionDef } from "@/engine/types"

export const subsets: SolutionDef = {
  code: `// nums is editable below
function subsets(i, cur) {
  if (i === nums.length) {
    result.push([...cur]);
    return;
  }
  cur.push(nums[i]);      // include nums[i]
  subsets(i + 1, cur);
  cur.pop();              // backtrack
  subsets(i + 1, cur);    // exclude nums[i]
}`,
  codeJava: `// int[] nums is editable below
void subsets(int i, List<Integer> cur) {
  if (i == nums.length) {
    result.add(new ArrayList<>(cur));
    return;
  }
  cur.add(nums[i]);            // include nums[i]
  subsets(i + 1, cur);
  cur.remove(cur.size() - 1);  // backtrack
  subsets(i + 1, cur);         // exclude nums[i]
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3], maxLen: 4 }],
  entry: () => `subsets(0, [])`,
  run({ fn, heap, line, narrate }, args) {
    const nums = args.nums as number[]
    const result: number[][] = []
    const cur: number[] = []
    const go = fn(
      "subsets",
      (i: number, cur: number[]): string => {
        line(2, `subsets(${i}): decided for all ${nums.length} elements? (${i === nums.length ? "<b>yes</b>" : "no"})`)
        if (i === nums.length) {
          line(3, `<b>Leaf!</b> Recording subset {${cur.join(",") || "∅"}}.`)
          result.push([...cur])
          heap("result", result)
          return cur.length ? cur.join(",") : "∅"
        }
        line(6, `Level ${i}: <b>include</b> ${nums[i]} → {${[...cur, nums[i]].join(",")}}.`)
        cur.push(nums[i])
        heap("cur", cur)
        go(i + 1, cur)
        line(8, `Backtrack: remove ${nums[i]} again.`)
        cur.pop()
        heap("cur", cur)
        line(9, `Level ${i}: now <b>exclude</b> ${nums[i]} → {${cur.join(",") || "∅"}}.`)
        go(i + 1, cur)
        return "✓"
      },
      1,
    )
    narrate(`Backtracking: each level decides include/exclude for one element — 2^${nums.length} = ${2 ** nums.length} leaves.`)
    heap("nums", nums)
    heap("cur", cur)
    heap("result", result)
    go(0, cur)
    return JSON.stringify(result)
  },
}
