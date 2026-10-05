import type { SolutionDef } from "@/engine/types"

export const shortestUnsortedContinuousSubarray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// sweep from both ends: the LAST element that breaks order marks a boundary
function findUnsortedSubarray(nums) {
  const n = nums.length;
  let end = -1, maxSeen = -Infinity;
  for (let i = 0; i < n; i++) {        // left→right sweep
    if (nums[i] < maxSeen) end = i;    // i sits below a bigger left value
    else maxSeen = nums[i];
  }
  let start = n, minSeen = Infinity;
  for (let i = n - 1; i >= 0; i--) {   // right→left sweep
    if (nums[i] > minSeen) start = i;  // i sits above a smaller right value
    else minSeen = nums[i];
  }
  return end > start ? end - start + 1 : 0;
}`,
  codeJava: `// sweep from both ends: the LAST element that breaks order marks a boundary
int findUnsortedSubarray(int[] nums) {
  int n = nums.length;
  int end = -1, maxSeen = Integer.MIN_VALUE;
  for (int i = 0; i < n; i++) {        // left→right sweep
    if (nums[i] < maxSeen) end = i;    // i sits below a bigger left value
    else maxSeen = nums[i];
  }
  int start = n, minSeen = Integer.MAX_VALUE;
  for (int i = n - 1; i >= 0; i--) {   // right→left sweep
    if (nums[i] > minSeen) start = i;  // i sits above a smaller right value
    else minSeen = nums[i];
  }
  return end > start ? end - start + 1 : 0;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [2, 6, 4, 8, 10, 9, 15], maxLen: 12 }],
  entry: (a) => `findUnsortedSubarray([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = (args.nums as number[]).map(Math.trunc)
    const go = fn(
      "findUnsortedSubarray",
      (): number => {
        const n = nums.length
        let end = -1
        let maxSeen = -Infinity
        line(3, `Sweep →: carry the running max. Any element <b>smaller</b> than it is out of place; the LAST such index is where sorting must end.`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (nums[i] < maxSeen) {
            end = i
            ptr("end", end)
            mark("bad", [i])
            line(5, `nums[${i}] = ${nums[i]} < maxSeen = ${maxSeen} — out of order; end = <b>${i}</b>.`)
          } else {
            maxSeen = nums[i]
            line(6, `nums[${i}] = ${nums[i]} keeps the climb — maxSeen = <b>${maxSeen}</b>.`)
          }
          vars({ i, maxSeen: maxSeen === -Infinity ? "−∞" : maxSeen, end })
        }
        let start = n
        let minSeen = Infinity
        line(8, `Sweep ←: mirror argument with the running min — the LAST violation (leftmost index) is where sorting must start.`)
        for (let i = n - 1; i >= 0; i--) {
          ptr("i", i)
          mark("focus", [i])
          if (nums[i] > minSeen) {
            start = i
            ptr("start", start)
            mark("bad", [i])
            line(10, `nums[${i}] = ${nums[i]} > minSeen = ${minSeen} — out of order; start = <b>${i}</b>.`)
          } else {
            minSeen = nums[i]
            line(11, `nums[${i}] = ${nums[i]} keeps the descent — minSeen = <b>${minSeen}</b>.`)
          }
          vars({ i, minSeen: minSeen === Infinity ? "∞" : minSeen, start })
        }
        ptr("i", -1)
        mark("focus", [])
        mark("bad", [])
        const ans = end > start ? end - start + 1 : 0
        if (ans > 0) mark("window", Array.from({ length: ans }, (_, x) => start + x))
        line(14, ans > 0
          ? `Sort nums[${start}..${end}] and the whole array is sorted → length <b>${ans}</b>.`
          : `No violations in either sweep — the array is already sorted → <b>0</b>.`)
        return ans
      },
      1,
    )
    return go()
  },
}
