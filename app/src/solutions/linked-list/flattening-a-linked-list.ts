import type { SolutionDef } from "@/engine/types"

// Split nums into 3 chunks and sort each — the 3 sorted sub-lists of the demo.
const split = (nums: number[]): number[][] => {
  const s = Math.max(Math.ceil(nums.length / 3), 1)
  return [nums.slice(0, s), nums.slice(s, 2 * s), nums.slice(2 * s)].map((c) => [...c].sort((x, y) => x - y))
}

export const flatteningALinkedList: SolutionDef = {
  view: "array",
  array: (a) => {
    const [c1, c2, c3] = split(a.nums as number[])
    return [...c1, "·", ...c2, "·", ...c3]
  },
  code: `// nums is split into 3 sorted sub-lists below
function flatten(lists) {
  let flat = lists[0];            // start with list 1
  for (let i = 1; i < lists.length; i++) {
    flat = merge(flat, lists[i]); // fold in the next list
  }
  return flat;
}
function merge(a, b) {  // classic two-list sorted merge
  const out = [];
  while (a.length > 0 && b.length > 0)
    out.push(a[0] <= b[0] ? a.shift() : b.shift());
  return [...out, ...a, ...b];    // append the leftover
}`,
  codeJava: `// nums is split into 3 sorted sub-lists below
List<Integer> flatten(List<List<Integer>> lists) {
  List<Integer> flat = lists.get(0);  // start with list 1
  for (int i = 1; i < lists.size(); i++) {
    flat = merge(flat, lists.get(i)); // fold in the next
  }
  return flat;
}
List<Integer> merge(List<Integer> a, List<Integer> b) {
  List<Integer> out = new ArrayList<>();
  while (a.size() > 0 && b.size() > 0)
    out.add(a.get(0) <= b.get(0) ? a.remove(0) : b.remove(0));
  out.addAll(a); out.addAll(b); return out; // leftover
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (split into 3 sub-lists)", default: [3, 6, 8, 1, 4, 7, 2, 5, 9], maxLen: 9 }],
  entry: (a) => {
    const [c1, c2, c3] = split(a.nums as number[])
    return `flatten([${c1.join("→")}], [${c2.join("→")}], [${c3.join("→")}])`
  },
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const chunks = split(args.nums as number[])
    const offsets = [0, chunks[0].length + 1, chunks[0].length + chunks[1].length + 2]
    let flat: number[] = []
    const flatten = fn(
      "flatten",
      (): string => {
        narrate(`Each sub-list is already sorted (like the down-lists in the classic problem). Flattening = folding them into one sorted list, <b>one merge at a time</b>.`)
        flat = [...chunks[0]]
        const done: number[] = chunks[0].map((_, x) => x)
        mark("done", [...done])
        heap("flat", flat)
        line(2, `flat starts as the whole first sub-list: ${flat.join("→") || "(empty)"}.`)
        for (let i = 1; i < 3; i++) {
          const b = chunks[i]
          line(4, `Fold in sub-list ${i + 1}: merge(flat, ${b.join("→") || "(empty)"}) — merging two sorted lists.`)
          const a = flat
          const out: number[] = []
          let ai = 0
          let bi = 0
          while (ai < a.length && bi < b.length) {
            ptr("b", offsets[i] + bi)
            vars({ "a front": a[ai], "b front": b[bi] })
            if (a[ai] <= b[bi]) {
              line(11, `flat's front ${a[ai]} ≤ sub-list's front ${b[bi]} → take <b>${a[ai]}</b> from flat.`)
              out.push(a[ai])
              ai++
            } else {
              line(11, `sub-list's front ${b[bi]} < flat's front ${a[ai]} → take <b>${b[bi]}</b> from the sub-list.`)
              out.push(b[bi])
              done.push(offsets[i] + bi)
              mark("done", [...done])
              bi++
            }
            heap("flat", [...out])
          }
          for (let x = bi; x < b.length; x++) done.push(offsets[i] + x)
          mark("done", [...done])
          flat = [...out, ...a.slice(ai), ...b.slice(bi)]
          heap("flat", flat)
          line(12, `One side ran dry — append the leftover ${(ai < a.length ? a.slice(ai) : b.slice(bi)).join("→") || "(nothing)"} . flat = ${flat.join("→")}.`)
          ptr("b", -1)
        }
        line(6, `All 3 sub-lists folded in — the flattened list is <b>${flat.join("→")}</b>.`)
        return flat.join("→")
      },
      1,
    )
    flatten()
    return JSON.stringify(flat)
  },
}
