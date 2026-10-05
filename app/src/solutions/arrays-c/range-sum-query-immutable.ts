import type { SolutionDef } from "@/engine/types"

export const rangeSumQueryImmutable: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// precompute prefix sums; answer sumRange in O(1)
function rangeSum(nums, l, r) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  // sumRange(l, r): built once, every query is O(1)
  return prefix[r + 1] - prefix[l];
}`,
  codeJava: `// precompute prefix sums; answer sumRange in O(1)
int rangeSum(int[] nums, int l, int r) {
  int[] prefix = new int[nums.length + 1];
  for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  // sumRange(l, r): built once, every query is O(1)
  return prefix[r + 1] - prefix[l];
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [-2, 0, 3, -5, 2, -1], maxLen: 12 },
    { kind: "number", name: "l", label: "left", default: 2, min: 0, max: 11 },
    { kind: "number", name: "r", label: "right", default: 5, min: 0, max: 11 },
  ],
  entry: (a) => `rangeSum([${(a.nums as number[]).join(",")}], ${a.l}, ${a.r})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    // sanitize: clamp the query into bounds and order it
    let l = Math.min(Math.max(0, Math.trunc(args.l as number)), nums.length - 1)
    let r = Math.min(Math.max(0, Math.trunc(args.r as number)), nums.length - 1)
    if (l > r) [l, r] = [r, l]
    const go = fn(
      "rangeSum",
      (): number => {
        const prefix: number[] = new Array(nums.length + 1).fill(0)
        heap("prefix", [...prefix])
        line(2, `Allocate prefix[0..${nums.length}]; <b>prefix[i] = sum of the first i numbers</b> (prefix[0] = 0 = empty sum).`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: i + 1 }, (_, k) => k))
          prefix[i + 1] = prefix[i] + nums[i]
          heap("prefix", [...prefix])
          vars({ i, "prefix[i+1]": prefix[i + 1] })
          line(4, `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${prefix[i]} + ${nums[i]} = <b>${prefix[i + 1]}</b>.`)
        }
        ptr("i", -1)
        mark("focus", [])
        mark("window", [])
        line(6, `Build done — the array itself is never touched again; any sumRange(l, r) is now <b>one subtraction</b>.`)
        ptr("l", l)
        ptr("r", r)
        mark("good", Array.from({ length: r - l + 1 }, (_, k) => l + k))
        const ans = prefix[r + 1] - prefix[l]
        vars({ l, r, ans })
        line(7, `sumRange(${l}, ${r}) = prefix[${r + 1}] − prefix[${l}] = ${prefix[r + 1]} − ${prefix[l]} = <b>${ans}</b>.`)
        return ans
      },
      1,
    )
    narrate("Pay O(n) once at construction; after that every range sum is prefix[r+1] − prefix[l] — the sum up to r minus the part before l.")
    return go()
  },
}
