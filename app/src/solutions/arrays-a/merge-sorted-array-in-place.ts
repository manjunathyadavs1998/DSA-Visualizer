import type { Args, SolutionDef } from "@/engine/types"

/** Sort both inputs defensively so the merge invariant always holds. */
const build = (a: Args) => {
  const m1 = [...(a.nums1 as number[])].sort((x, y) => x - y)
  const m2 = [...(a.nums2 as number[])].sort((x, y) => x - y)
  return { m1, m2 }
}

export const mergeSortedArrayInPlace: SolutionDef = {
  view: "array",
  array: (a) => {
    const { m1, m2 } = build(a)
    return [...m1, ...new Array<number>(m2.length).fill(0)]
  },
  code: `// nums1 has trailing empty slots to hold all of nums2
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];   // nums1's tail is bigger
    } else {
      nums1[k--] = nums2[j--];   // nums2's tail is bigger
    }
  }
  return nums1;
}`,
  codeJava: `// nums1 has trailing empty slots to hold all of nums2
int[] merge(int[] nums1, int m, int[] nums2, int n) {
  int i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];   // nums1's tail is bigger
    } else {
      nums1[k--] = nums2[j--];   // nums2's tail is bigger
    }
  }
  return nums1;
}`,
  inputs: [
    { kind: "numbers", name: "nums1", label: "nums1 (sorted, real part)", default: [1, 3, 5, 7], maxLen: 6 },
    { kind: "numbers", name: "nums2", label: "nums2 (sorted)", default: [2, 4, 6], maxLen: 6 },
  ],
  entry: (a) => `merge(nums1, ${(a.nums1 as number[]).length}, nums2, ${(a.nums2 as number[]).length})`,
  run({ fn, line, ptr, mark, aset, heap, vars, narrate }, args) {
    const { m1, m2 } = build(args)
    const m = m1.length, n = m2.length
    const nums1: number[] = [...m1, ...new Array<number>(n).fill(0)]
    const go = fn(
      "merge",
      (): string => {
        let i = m - 1, j = n - 1, k = m + n - 1
        ptr("i", i)
        ptr("k", k)
        vars({ i, j, k })
        heap("nums2", m2)
        line(2, `Start at the backs: i = ${i} (last real value of nums1), j = ${j} (last of nums2), k = ${k} (last empty slot). Writing from the back means we <b>never overwrite unread data</b>.`)
        while (j >= 0) {
          mark("focus", [k])
          if (i >= 0 && nums1[i] > m2[j]) {
            line(4, `Compare tails: nums1[${i}] = ${nums1[i]} vs nums2[${j}] = ${m2[j]} — nums1's is bigger, so it belongs at slot ${k}.`)
            nums1[k] = nums1[i]
            aset(k, nums1[k])
            line(5, `Write ${nums1[k]} into index ${k}; step i and k left.`)
            i--
            k--
          } else {
            line(4, i >= 0
              ? `Compare tails: nums1[${i}] = ${nums1[i]} vs nums2[${j}] = ${m2[j]} — nums2's is bigger (or equal), so it belongs at slot ${k}.`
              : `nums1's real values are exhausted (i < 0) — copy the rest of nums2 straight in.`)
            nums1[k] = m2[j]
            aset(k, nums1[k])
            heap("nums2", m2.slice(0, j))
            line(7, `Write ${nums1[k]} into index ${k}; step j and k left.`)
            j--
            k--
          }
          ptr("i", i)
          ptr("k", k)
          vars({ i, j, k })
        }
        ptr("i", -1)
        ptr("k", -1)
        mark("focus", [])
        mark("good", nums1.map((_, idx) => idx))
        line(10, `nums2 is empty — anything left in nums1 was already in place. Merged: [${nums1.join(", ")}].`)
        return `[${nums1.join(", ")}]`
      },
      1,
    )
    narrate("The classic trick: merge BACKWARDS into the empty tail of nums1 — no extra array, no overwrites.")
    go()
    return JSON.stringify(nums1)
  },
}
