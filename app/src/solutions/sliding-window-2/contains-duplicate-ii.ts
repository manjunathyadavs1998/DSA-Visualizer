import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const containsDuplicateII: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// any duplicate within distance k? keep a rolling Set of size k
function containsNearbyDuplicate(nums, k) {
  const window = new Set();
  for (let right = 0; right < nums.length; right++) {
    if (window.has(nums[right])) return true;
    window.add(nums[right]);
    if (window.size > k)
      window.delete(nums[right - k]);   // too far back to matter
  }
  return false;
}`,
  codeJava: `// any duplicate within distance k? keep a rolling Set of size k
boolean containsNearbyDuplicate(int[] nums, int k) {
  Set<Integer> window = new HashSet<>();
  for (int right = 0; right < nums.length; right++) {
    if (window.contains(nums[right])) return true;
    window.add(nums[right]);
    if (window.size() > k)
      window.remove(nums[right - k]);   // too far back to matter
  }
  return false;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3, 4, 5, 1, 2, 3], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 4, min: 0, max: 12 },
  ],
  entry: (a) => `containsNearbyDuplicate([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = (args.nums as number[]).map((v) => Math.trunc(v))
    const k = Math.max(0, Math.trunc(args.k as number))
    const go = fn(
      "containsNearbyDuplicate",
      (): boolean => {
        const window = new Set<number>()
        heap("window", [...window])
        line(2, `Keep a Set of the <b>last ${k}</b> values — a hit inside it means a duplicate at distance ≤ ${k}.`)
        for (let right = 0; right < nums.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          mark("window", win(Math.max(0, right - k), right - 1))
          if (window.has(nums[right])) {
            const j = nums.lastIndexOf(nums[right], right - 1)
            mark("good", [j, right])
            line(4, `nums[${right}] = <b>${nums[right]}</b> is already in the window (index ${j}, distance ${right - j} ≤ ${k}) → return <b>true</b>.`)
            return true
          }
          line(4, `nums[${right}] = ${nums[right]} not in the window — no nearby duplicate here.`)
          window.add(nums[right])
          heap("window", [...window])
          line(5, `Add ${nums[right]} → window Set = {${[...window].join(", ")}}.`)
          if (window.size > k) {
            window.delete(nums[right - k])
            heap("window", [...window])
            mark("bad", [right - k])
            line(7, `Set grew past k = ${k}: evict nums[${right - k}] = ${nums[right - k]} — any future match to it would be too far.`)
            mark("bad", [])
          }
          vars({ right, k, windowSize: window.size })
        }
        mark("focus", [])
        mark("window", [])
        line(9, `Scanned everything — no value repeated within distance ${k} → return <b>false</b>.`)
        return false
      },
      1,
    )
    return go()
  },
}
