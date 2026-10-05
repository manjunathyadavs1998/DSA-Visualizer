import type { SolutionDef, Args } from "@/engine/types"

const prep1 = (args: Args): number[] => [...(args.nums1 as number[])].map(Math.trunc).sort((a, b) => a - b)
const prep2 = (args: Args): number[] => [...(args.nums2 as number[])].map(Math.trunc).sort((a, b) => a - b)

export const intersectionOfTwoArraysIi: SolutionDef = {
  view: "array",
  // show both sorted arrays side by side: [ nums1… | nums2… ]
  array: (a) => [...prep1(a), "|", ...prep2(a)],
  code: `// sort both; advance the smaller side, collect on equality
function intersect(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const out = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j])      { i++; }   // nums1's value too small
    else if (nums1[i] > nums2[j]) { j++; }   // nums2's value too small
    else { out.push(nums1[i]); i++; j++; }   // match — consume BOTH copies
  }
  return out;
}`,
  codeJava: `// sort both; advance the smaller side, collect on equality
int[] intersect(int[] nums1, int[] nums2) {
  Arrays.sort(nums1);
  Arrays.sort(nums2);
  List<Integer> out = new ArrayList<>();
  int i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j])      { i++; }   // nums1's value too small
    else if (nums1[i] > nums2[j]) { j++; }   // nums2's value too small
    else { out.add(nums1[i]); i++; j++; }    // match — consume BOTH copies
  }
  return out.stream().mapToInt(v -> v).toArray();
}`,
  inputs: [
    { kind: "numbers", name: "nums1", label: "nums1", default: [9, 2, 1, 5, 2, 4], maxLen: 6 },
    { kind: "numbers", name: "nums2", label: "nums2", default: [3, 2, 9, 5, 2, 9], maxLen: 6 },
  ],
  entry: (a) => `intersect([${prep1(a).join(",")}], [${prep2(a).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const nums1 = prep1(args)
    const nums2 = prep2(args)
    const off = nums1.length + 1 // nums2 starts after the "|" separator
    const go = fn(
      "intersect",
      (): string => {
        line(2, `nums1 sorted: [${nums1.join(", ")}] (left of |).`)
        line(3, `nums2 sorted: [${nums2.join(", ")}] (right of |). Sorted order lets equal values meet like a merge.`)
        const out: number[] = []
        heap("output", out)
        let i = 0
        let j = 0
        ptr("i", nums1.length ? 0 : -1)
        ptr("j", nums2.length ? off : -1)
        line(5, `i = 0, j = 0 — march both pointers forward, never backward.`)
        while (i < nums1.length && j < nums2.length) {
          mark("focus", [i, off + j])
          if (nums1[i] < nums2[j]) {
            mark("bad", [i])
            line(7, `${nums1[i]} < ${nums2[j]} — nums1[${i}] can't match anything ahead in nums2; i → ${i + 1}.`)
            i++
            ptr("i", i < nums1.length ? i : -1)
          } else if (nums1[i] > nums2[j]) {
            mark("bad", [off + j])
            line(8, `${nums1[i]} > ${nums2[j]} — nums2[${j}] can't match anything ahead in nums1; j → ${j + 1}.`)
            j++
            ptr("j", j < nums2.length ? off + j : -1)
          } else {
            out.push(nums1[i])
            heap("output", out)
            mark("good", [i, off + j])
            line(9, `Match on <b>${nums1[i]}</b>! Collect it and consume one copy from <b>each</b> side (duplicates count per occurrence).`)
            i++
            j++
            ptr("i", i < nums1.length ? i : -1)
            ptr("j", j < nums2.length ? off + j : -1)
          }
          vars({ i, j, out: `[${out.join(",")}]` })
        }
        mark("focus", [])
        line(11, `One side is exhausted → intersection (with multiplicity): [<b>${out.join(", ")}</b>].`)
        return `[${out.join(",")}]`
      },
      1,
    )
    return go()
  },
}
