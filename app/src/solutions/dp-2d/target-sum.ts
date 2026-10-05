import type { SolutionDef } from "@/engine/types"

export const targetSum: SolutionDef = {
  code: `// ways(i, cur): give nums[i..] + or - signs; memo column = cur + total
function ways(i, cur) {
  if (i === nums.length) return cur === target ? 1 : 0;
  const key = i + "," + (cur + total);
  if (memo[key] !== undefined) return memo[key];
  memo[key] = ways(i + 1, cur + nums[i]) + ways(i + 1, cur - nums[i]);
  return memo[key];
}`,
  codeJava: `// ways(i, cur): give nums[i..] + or - signs; memo column = cur + total
int ways(int i, int cur) {
  if (i == nums.length) return cur == target ? 1 : 0;
  String key = i + "," + (cur + total);
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, ways(i + 1, cur + nums[i]) + ways(i + 1, cur - nums[i]));
  return memo.get(key);
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 1, 1, 1, 1], maxLen: 5 },
    { kind: "number", name: "target", label: "target", default: 3, min: -9, max: 9 },
  ],
  entry: (a) => `ways(0, 0)  // nums=[${(a.nums as number[]).join(",")}], target=${a.target}`,
  run({ fn, memo, line, narrate }, args) {
    // negatives fold into the sign choice anyway — keep values small non-negative ints
    const nums = (args.nums as number[]).map((v) => Math.min(9, Math.abs(Math.trunc(v))))
    const target = args.target as number
    const total = nums.reduce((x, y) => x + y, 0)
    const ways = fn(
      "ways",
      (i: number, cur: number): number => {
        line(2, `ways(${i}, ${cur}): all signed? (${i === nums.length ? `<b>yes — sum ${cur} ${cur === target ? "HITS" : "misses"} target ${target} → ${cur === target ? 1 : 0}</b>` : "no"})`)
        if (i === nums.length) return cur === target ? 1 : 0
        const key = i + "," + (cur + total)
        line(4, `ways(${i}, ${cur}): checking memo["${key}"] (column = ${cur} + ${total} keeps keys ≥ 0)…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `split on nums[${i}]=${nums[i]}: <b>+${nums[i]}</b> → cur ${cur + nums[i]}, or <b>−${nums[i]}</b> → cur ${cur - nums[i]}. Count BOTH worlds.`)
        memo[key] = ways(i + 1, cur + nums[i]) + ways(i + 1, cur - nums[i])
        line(6, `ways(${i}, ${cur}) = <b>${memo[key]}</b> way(s).`)
        return memo[key] as number
      },
      1,
    )
    narrate("A ± sign per number is 2ⁿ leaves — but many prefixes land on the same running sum, so (index, sum) memoization collapses the tree.")
    return ways(0, 0)
  },
}
