import type { SolutionDef } from "@/engine/types"

export const subarraySumEqualsK: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// count subarrays whose elements sum to k
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);  // empty prefix
  let sum = 0, total = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (count.has(sum - k))
      total += count.get(sum - k);  // one hit per earlier prefix
    count.set(sum, (count.get(sum) ?? 0) + 1);
  }
  return total;
}`,
  codeJava: `// count subarrays whose elements sum to k
int subarraySum(int[] nums, int k) {
  Map<Integer,Integer> count = new HashMap<>(Map.of(0, 1));
  int sum = 0, total = 0;
  for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (count.containsKey(sum - k))
      total += count.get(sum - k);  // one hit per earlier prefix
    count.merge(sum, 1, Integer::sum);
  }
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 1, 2, 1], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 3, min: -20, max: 20 },
  ],
  entry: (a) => `subarraySum([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const k = args.k as number
    const go = fn(
      "subarraySum",
      (): number => {
        const count = new Map<number, number>([[0, 1]])
        let sum = 0
        let total = 0
        heap("map", { 0: 1 })
        line(2, `Seed the map with prefix sum <b>0 → 1</b>: the empty prefix (before index 0).`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          sum += nums[i]
          vars({ i, sum, total })
          line(5, `Prefix sum through index ${i}: sum = <b>${sum}</b>.`)
          const need = sum - k
          const hits = count.get(need) ?? 0
          line(6, `A subarray ending here sums to ${k} ⇔ some earlier prefix = sum − k = <b>${need}</b>. Seen? (${hits > 0 ? `<b>yes, ×${hits}</b>` : "no"})`)
          if (hits > 0) {
            total += hits
            vars({ i, sum, total })
            line(7, `${hits} earlier prefix${hits > 1 ? "es" : ""} equal${hits > 1 ? "" : "s"} ${need} → <b>${hits} new subarray${hits > 1 ? "s" : ""}</b> end at index ${i}. total = <b>${total}</b>.`)
            mark("good", [i])
          }
          count.set(sum, (count.get(sum) ?? 0) + 1)
          heap("map", Object.fromEntries([...count].map(([s, c]) => [s, c])))
          line(8, `Record this prefix: map[${sum}] = ${count.get(sum)}.`)
        }
        ptr("i", -1)
        mark("focus", [])
        line(10, `Every subarray was counted exactly once at its right end → total = <b>${total}</b>.`)
        return total
      },
      1,
    )
    narrate("sum(i..j) = prefix(j) − prefix(i−1). Fix the right end, and the map instantly counts every valid left end.")
    return go()
  },
}
