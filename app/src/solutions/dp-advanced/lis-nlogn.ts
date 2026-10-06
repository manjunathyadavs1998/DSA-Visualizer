import type { SolutionDef } from "@/engine/types"

export const lisNLogN: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below — patience sorting
function lengthOfLIS(nums) {
  const tails = []; // tails[i] = smallest tail of IS of length i+1
  for (const x of nums) {
    // binary search: first tail >= x
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    tails[lo] = x;   // extend or replace
  }
  return tails.length;
}`,
  codeJava: `int lengthOfLIS(int[] nums) {
  List<Integer> tails = new ArrayList<>();
  for (int x : nums) {
    int lo = 0, hi = tails.size();
    while (lo < hi) {
      int mid = (lo+hi)>>1;
      if (tails.get(mid) < x) lo=mid+1; else hi=mid;
    }
    if (lo == tails.size()) tails.add(x);
    else tails.set(lo, x);
  }
  return tails.size();
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [10, 9, 2, 5, 3, 7, 101, 18], maxLen: 10 }],
  entry: (a) => `lengthOfLIS([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const go = fn("lengthOfLIS", (): number => {
      const tails: number[] = []
      const resolved: number[] = []
      heap("tails", [...tails])
      line(1, `tails[i] = smallest possible tail of an increasing subsequence of length i+1. Binary search keeps it O(n log n).`)
      for (let idx = 0; idx < nums.length; idx++) {
        const x = nums[idx]
        ptr("i", idx)
        mark("focus", [idx])
        vars({ x, tailsLen: tails.length })
        let lo = 0, hi = tails.length
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (tails[mid] < x) lo = mid + 1; else hi = mid
        }
        const action = lo === tails.length ? "extend" : "replace"
        tails[lo] = x
        heap("tails", [...tails])
        if (action === "extend") {
          resolved.push(idx)
          mark("good", [...resolved])
          line(9, `x=${x}: no tail ≥ x — <b>extend</b> tails to length ${tails.length}. tails=[${tails.join(",")}].`)
        } else {
          mark("window", [idx])
          line(9, `x=${x}: <b>replace</b> tails[${lo}]=${tails[lo]} with ${x} (smaller tail, same LIS length). tails=[${tails.join(",")}].`)
        }
      }
      ptr("i", -1)
      mark("focus", [])
      line(11, `LIS length: <b>${tails.length}</b>. (tails array length = LIS length, but tails itself may not be the actual LIS.)`)
      return tails.length
    }, 1)
    return go()
  },
}
