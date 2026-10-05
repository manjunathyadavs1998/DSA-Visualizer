import type { SolutionDef } from "@/engine/types"

export const permutations: SolutionDef = {
  code: `// nums is editable below
function permute(cur) {
  if (cur.length === nums.length) {
    result.push([...cur]);
    return;
  }
  for (const x of nums) {
    if (cur.includes(x)) continue;  // already used
    cur.push(x);
    permute(cur);
    cur.pop();                      // backtrack
  }
}`,
  codeJava: `// int[] nums is editable below
void permute(List<Integer> cur) {
  if (cur.size() == nums.length) {
    result.add(new ArrayList<>(cur));
    return;
  }
  for (int x : nums) {
    if (cur.contains(x)) continue;  // already used
    cur.add(x);
    permute(cur);
    cur.remove(cur.size() - 1);     // backtrack
  }
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3], maxLen: 4 }],
  entry: () => `permute([])`,
  run({ fn, heap, line, narrate }, args) {
    const nums = args.nums as number[]
    const result: number[][] = []
    const start: number[] = []
    const permute = fn(
      "permute",
      (cur: number[]): string => {
        line(2, `[${cur.join(",")}]: all ${nums.length} picked? (${cur.length === nums.length ? "<b>yes — a full permutation</b>" : "no"})`)
        if (cur.length === nums.length) {
          result.push([...cur])
          heap("result", result)
          return cur.join(",")
        }
        for (const x of nums) {
          if (cur.includes(x)) continue
          line(8, `Pick ${x} (unused) → [${[...cur, x].join(",")}].`)
          cur.push(x)
          heap("cur", cur)
          permute(cur)
          line(10, `Backtrack: drop ${x}.`)
          cur.pop()
          heap("cur", cur)
        }
        return "✓"
      },
      1,
    )
    narrate("Each level picks one unused number — n! leaves, one per permutation.")
    heap("nums", nums)
    heap("cur", start)
    heap("result", result)
    permute(start)
    return JSON.stringify(result)
  },
}
