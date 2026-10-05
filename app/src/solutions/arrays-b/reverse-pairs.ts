import type { SolutionDef } from "@/engine/types"

export const reversePairs: SolutionDef = {
  code: `// nums is editable below
function mergeSort(lo, hi) {
  if (lo >= hi) return 0;
  const mid = (lo + hi) >> 1;
  let count = mergeSort(lo, mid) + mergeSort(mid + 1, hi);
  let j = mid + 1;
  for (let i = lo; i <= mid; i++) {
    while (j <= hi && nums[i] > 2 * nums[j]) j++;
    count += j - (mid + 1);
  }
  merge(lo, mid, hi);   // standard sorted merge
  return count;
}`,
  codeJava: `// int[] nums is editable below
int mergeSort(int lo, int hi) {
  if (lo >= hi) return 0;
  int mid = (lo + hi) >> 1;
  int count = mergeSort(lo, mid) + mergeSort(mid + 1, hi);
  int j = mid + 1;
  for (int i = lo; i <= mid; i++) {
    while (j <= hi && (long) nums[i] > 2L * nums[j]) j++;
    count += j - (mid + 1);
  }
  merge(lo, mid, hi);   // standard sorted merge
  return count;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 3, 2, 3, 1], maxLen: 8 }],
  entry: (a) => `mergeSort(0, ${(a.nums as number[]).length - 1})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const nums = [...(args.nums as number[])]
    const mergeSort = fn(
      "mergeSort",
      (lo: number, hi: number): number => {
        line(2, `mergeSort(${lo}, ${hi}): single element or empty? (${lo >= hi ? "<b>yes — 0 pairs here</b>" : "no"})`)
        if (lo >= hi) return 0
        const mid = (lo + hi) >> 1
        line(4, `Split [${lo}..${hi}] at mid = ${mid} → count pairs inside each sorted half first.`)
        let count = mergeSort(lo, mid) + mergeSort(mid + 1, hi)
        vars({ lo, hi, mid, count })
        line(5, `Both halves sorted: left = [${nums.slice(lo, mid + 1).join(",")}], right = [${nums.slice(mid + 1, hi + 1).join(",")}]. Sweep j to count <b>cross</b> pairs.`)
        let j = mid + 1
        for (let i = lo; i <= mid; i++) {
          while (j <= hi && nums[i] > 2 * nums[j]) j++
          const add = j - (mid + 1)
          count += add
          vars({ lo, hi, mid, count })
          line(8, `nums[i]=${nums[i]}: right values with ${nums[i]} > 2·value → <b>${add}</b> pair${add === 1 ? "" : "s"} (j never moves back — the halves are sorted). count = ${count}.`)
        }
        const merged: number[] = []
        let a = lo, b = mid + 1
        while (a <= mid && b <= hi) merged.push(nums[a] <= nums[b] ? nums[a++] : nums[b++])
        while (a <= mid) merged.push(nums[a++])
        while (b <= hi) merged.push(nums[b++])
        for (let k = 0; k < merged.length; k++) nums[lo + k] = merged[k]
        heap("merged", merged)
        line(10, `Merge the halves so the parent sees a sorted [${lo}..${hi}] = [${merged.join(",")}].`)
        line(11, `Return <b>${count}</b> reverse pairs from range [${lo}..${hi}].`)
        return count
      },
      1,
    )
    narrate("Merge sort with a twist: before merging, a linear i/j sweep counts pairs with nums[i] > 2·nums[j] across the two sorted halves.")
    return mergeSort(0, nums.length - 1)
  },
}
