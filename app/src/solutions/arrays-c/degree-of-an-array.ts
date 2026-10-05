import type { SolutionDef } from "@/engine/types"

export const degreeOfAnArray: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// shortest subarray with the same degree as nums
function findShortestSubArray(nums) {
  const first = new Map(), count = new Map();
  let degree = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    if (!first.has(nums[i])) first.set(nums[i], i);
    count.set(nums[i], (count.get(nums[i]) ?? 0) + 1);
    const c = count.get(nums[i]);
    const len = i - first.get(nums[i]) + 1;
    if (c > degree || (c === degree && len < best)) {
      degree = c; best = len;  // new champion value
    }
  }
  return best;
}`,
  codeJava: `// shortest subarray with the same degree as nums
int findShortestSubArray(int[] nums) {
  Map<Integer,Integer> first = new HashMap<>(), count = new HashMap<>();
  int degree = 0, best = 0;
  for (int i = 0; i < nums.length; i++) {
    first.putIfAbsent(nums[i], i);
    count.merge(nums[i], 1, Integer::sum);
    int c = count.get(nums[i]);
    int len = i - first.get(nums[i]) + 1;
    if (c > degree || (c == degree && len < best)) {
      degree = c; best = len;  // new champion value
    }
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 2, 2, 3, 1, 4, 2], maxLen: 12 }],
  entry: (a) => `findShortestSubArray([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "findShortestSubArray",
      (): number => {
        const first = new Map<number, number>()
        const count = new Map<number, number>()
        let degree = 0
        let best = 0
        let bestRange: [number, number] = [0, -1]
        heap("map", {})
        line(2, `Two maps: <b>first</b> index of each value, and its running <b>count</b>.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (!first.has(nums[i])) {
            first.set(nums[i], i)
            line(5, `First sighting of <b>${nums[i]}</b> — remember first[${nums[i]}] = ${i}.`)
          } else {
            line(5, `${nums[i]} already has first[${nums[i]}] = ${first.get(nums[i])} — keep the earliest.`)
          }
          count.set(nums[i], (count.get(nums[i]) ?? 0) + 1)
          const c = count.get(nums[i])!
          heap("map", Object.fromEntries([...count].map(([v, cnt]) => [v, `×${cnt}, first @ ${first.get(v)}`])))
          line(7, `count[${nums[i]}] → <b>${c}</b>.`)
          const len = i - first.get(nums[i])! + 1
          vars({ i, c, len, degree, best })
          line(8, `If ${nums[i]} is the degree value, its span is first..here = <b>${len}</b> cells.`)
          if (c > degree || (c === degree && len < best)) {
            const reason = c > degree ? `count ${c} beats degree ${degree}` : `same degree ${degree} but shorter span (${len} < ${best})`
            degree = c
            best = len
            bestRange = [first.get(nums[i])!, i]
            mark("good", Array.from({ length: len }, (_, k) => bestRange[0] + k))
            vars({ i, degree, best })
            line(10, `<b>New champion:</b> ${reason} → degree = ${degree}, best = <b>${best}</b>.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        line(13, `Degree is <b>${degree}</b>; the shortest subarray carrying it spans indices ${bestRange[0]}..${bestRange[1]} → length <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("The shortest subarray with full degree must run from a value's FIRST occurrence to its current one — so track first index and count per value.")
    return go()
  },
}
