import type { SolutionDef } from "@/engine/types"

export const subsetSums: SolutionDef = {
  code: `// nums is editable below
function subsetSums(i, sum) {
  if (i === nums.length) {
    result.push(sum);
    return;
  }
  subsetSums(i + 1, sum + nums[i]); // include nums[i]
  subsetSums(i + 1, sum);           // exclude nums[i]
}`,
  codeJava: `// int[] nums is editable below
void subsetSums(int i, int sum) {
  if (i == nums.length) {
    result.add(sum);
    return;
  }
  subsetSums(i + 1, sum + nums[i]); // include nums[i]
  subsetSums(i + 1, sum);           // exclude nums[i]
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [3, 1, 2], maxLen: 4 }],
  entry: () => `subsetSums(0, 0)`,
  run({ fn, heap, line, narrate }, args) {
    const nums = args.nums as number[]
    const result: number[] = []
    heap("nums", nums)
    heap("result", result)
    const go = fn(
      "subsetSums",
      (i: number, sum: number): string => {
        line(2, `i = ${i}, running sum = ${sum}: all elements decided? (${i === nums.length ? "<b>yes — record " + sum + "</b>" : "no"})`)
        if (i === nums.length) {
          result.push(sum)
          heap("result", result)
          return `sum ${sum}`
        }
        line(6, `<b>Include</b> nums[${i}] = ${nums[i]} → sum becomes ${sum + nums[i]}.`)
        go(i + 1, sum + nums[i])
        line(7, `<b>Exclude</b> nums[${i}] = ${nums[i]} → sum stays ${sum}.`)
        go(i + 1, sum)
        return "✓"
      },
      1,
    )
    narrate(`Every element is either in or out — 2^${nums.length} = ${2 ** nums.length} sums at the leaves.`)
    go(0, 0)
    return result.join(", ")
  },
}
