import type { SolutionDef } from "@/engine/types"

export const partitionToKEqualSumSubsets: SolutionDef = {
  code: `// nums sorted descending; buckets = new Array(k).fill(0)
function canPartition() {
  const total = sum(nums), target = total / k;
  if (total % k !== 0) return false;
  return backtrack(0);
}
function backtrack(i) {
  if (i === nums.length) return true;   // every number placed
  for (let b = 0; b < k; b++) {
    if (buckets[b] + nums[i] > target) continue;  // would overflow
    if (b > 0 && buckets[b] === buckets[b - 1]) continue; // mirror state
    buckets[b] += nums[i];       // put nums[i] in bucket b
    if (backtrack(i + 1)) return true;
    buckets[b] -= nums[i];       // backtrack
  }
  return false;                  // nums[i] fits nowhere
}`,
  codeJava: `// nums sorted descending; int[] buckets = new int[k]
boolean canPartition() {
  int total = IntStream.of(nums).sum(), target = total / k;
  if (total % k != 0) return false;
  return backtrack(0);
}
boolean backtrack(int i) {
  if (i == nums.length) return true;    // every number placed
  for (int b = 0; b < k; b++) {
    if (buckets[b] + nums[i] > target) continue;  // would overflow
    if (b > 0 && buckets[b] == buckets[b - 1]) continue;  // mirror state
    buckets[b] += nums[i];       // put nums[i] in bucket b
    if (backtrack(i + 1)) return true;
    buckets[b] -= nums[i];       // backtrack
  }
  return false;                  // nums[i] fits nowhere
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [6, 5, 4, 2, 1], maxLen: 6 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 4 },
  ],
  entry: () => `canPartition()`,
  run({ fn, heap, line, vars, narrate }, args) {
    const nums = (args.nums as number[])
      .map(Math.trunc)
      .filter((x) => x > 0)
      .sort((a, b) => b - a)
    if (!nums.length) nums.push(6, 5, 4, 2, 1)
    const k = Math.max(1, Math.min(args.k as number, nums.length))
    const total = nums.reduce((a, b) => a + b, 0)
    const target = total / k
    const buckets: number[] = new Array(k).fill(0)
    const backtrack = fn(
      "backtrack",
      (i: number): boolean => {
        vars({ i, buckets: `[${buckets.join(",")}]` })
        line(7, `backtrack(${i}): all ${nums.length} numbers placed? (${i === nums.length ? "<b>yes — k equal subsets!</b>" : "no"})`)
        if (i === nums.length) return true
        for (let b = 0; b < k; b++) {
          if (buckets[b] + nums[i] > target) {
            line(9, `Bucket ${b} holds ${buckets[b]}; +${nums[i]} → ${buckets[b] + nums[i]} <b>&gt; target ${target}</b> — skip.`)
            continue
          }
          if (b > 0 && buckets[b] === buckets[b - 1]) {
            line(10, `Bucket ${b} = bucket ${b - 1} = ${buckets[b]} — identical bucket, <b>same subtree already failed</b>: skip.`)
            continue
          }
          line(11, `Drop <b>${nums[i]}</b> into bucket ${b}: ${buckets[b]} → ${buckets[b] + nums[i]} (target ${target}).`)
          buckets[b] += nums[i]
          heap("buckets", buckets)
          if (backtrack(i + 1)) {
            line(12, `Everything after fit too — <b>bubble true up</b>.`)
            return true
          }
          line(13, `Backtrack: pull ${nums[i]} out of bucket ${b}: ${buckets[b]} → ${buckets[b] - nums[i]}.`)
          buckets[b] -= nums[i]
          heap("buckets", buckets)
        }
        line(15, `${nums[i]} fits in <b>no bucket</b> — return false and undo an earlier choice.`)
        return false
      },
      6,
    )
    const canPartition = fn(
      "canPartition",
      (): boolean => {
        line(2, `total = ${nums.join("+")} = <b>${total}</b>, k = ${k} → each subset must sum to ${total % k === 0 ? `<b>${target}</b>` : `${total}/${k} — not an integer`}.`)
        line(3, `total % k = ${total % k}: ${total % k !== 0 ? "<b>impossible, stop before searching</b>" : "divisible — search."}`)
        if (total % k !== 0) return false
        line(4, `Sorted descending (${nums.join(",")}): placing big numbers first makes dead ends appear near the root.`)
        return backtrack(0)
      },
      1,
    )
    narrate(`Matchsticks-to-Square generalized: ${k} buckets instead of 4. Same template — try each bucket, overflow-prune, equal-bucket prune.`)
    heap("nums (sorted)", nums)
    heap("buckets", buckets)
    return canPartition()
  },
}
