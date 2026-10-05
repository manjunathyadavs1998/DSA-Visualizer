import type { SolutionDef } from "@/engine/types"

const sorted = (a: unknown, fallback: number[]) => {
  const v = (a as number[]) ?? []
  return (v.length > 0 ? [...v] : [...fallback]).sort((x, y) => x - y)
}

export const mergeKSortedLists: SolutionDef = {
  view: "array",
  array: (a) => [
    ...sorted(a.list1, [1, 4, 5]), "·",
    ...sorted(a.list2, [1, 3, 4]), "·",
    ...sorted(a.list3, [2, 6]),
  ],
  code: `// merge the k lists pairwise until one remains
function mergeKLists(lists) {
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(mergeTwo(l1, l2));   // sorted merge
    }
    lists = merged;        // half as many lists
  }
  return lists.length > 0 ? lists[0] : null;
}`,
  codeJava: `// merge the k lists pairwise until one remains
ListNode mergeKLists(ListNode[] lists) {
  while (lists.length > 1) {
    List<ListNode> merged = new ArrayList<>();
    for (int i = 0; i < lists.length; i += 2) {
      ListNode l1 = lists[i];
      ListNode l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.add(mergeTwo(l1, l2));    // sorted merge
    }
    lists = merged.toArray(new ListNode[0]);   // halved
  }
  return lists.length > 0 ? lists[0] : null;
}`,
  inputs: [
    { kind: "numbers", name: "list1", label: "list 1 (sorted)", default: [1, 4, 5], maxLen: 5 },
    { kind: "numbers", name: "list2", label: "list 2 (sorted)", default: [1, 3, 4], maxLen: 5 },
    { kind: "numbers", name: "list3", label: "list 3 (sorted)", default: [2, 6], maxLen: 5 },
  ],
  entry: (a) =>
    `mergeKLists([[${sorted(a.list1, [1, 4, 5]).join("→")}], [${sorted(a.list2, [1, 3, 4]).join("→")}], [${sorted(a.list3, [2, 6]).join("→")}]])`,
  run({ fn, line, mark, vars, heap }, args) {
    const l1 = sorted(args.list1, [1, 4, 5])
    const l2 = sorted(args.list2, [1, 3, 4])
    const l3 = sorted(args.list3, [2, 6])
    let lists: number[][] = [l1, l2, l3]
    const mergeKLists = fn(
      "mergeKLists",
      (): string => {
        heap("lists", lists.map((l) => l.join("→")))
        let round = 0
        line(2, `${lists.length} lists remain — pairwise merging halves the count each round, so every node is merged only <b>log k</b> times (vs k−1 times if we merged one-by-one).`)
        while (lists.length > 1) {
          round++
          const merged: number[][] = []
          line(3, `<b>Round ${round}:</b> start a fresh collection of merged lists.`)
          for (let i = 0; i < lists.length; i += 2) {
            const a = lists[i]
            const b = i + 1 < lists.length ? lists[i + 1] : null
            vars({ l1: a.join("→"), l2: b ? b.join("→") : "null" })
            line(5, `Pair up lists[${i}] = [${a.join("→")}]…`)
            line(6, b ? `…with lists[${i + 1}] = [${b.join("→")}].` : `…but lists[${i + 1}] doesn't exist — the odd one out rides along unmerged.`)
            if (!b) {
              merged.push(a)
              line(7, `mergeTwo([${a.join("→")}], null) = [${a.join("→")}] — unchanged.`)
            } else {
              const out: number[] = []
              let x = 0
              let y = 0
              while (x < a.length && y < b.length) {
                if (a[x] <= b[y]) {
                  out.push(a[x])
                  line(7, `mergeTwo: ${a[x]} ≤ ${b[y]} → take <b>${a[x]}</b> from the left list → ${out.join("→")}.`)
                  x++
                } else {
                  out.push(b[y])
                  line(7, `mergeTwo: ${b[y]} < ${a[x]} → take <b>${b[y]}</b> from the right list → ${out.join("→")}.`)
                  y++
                }
              }
              while (x < a.length) out.push(a[x++])
              while (y < b.length) out.push(b[y++])
              merged.push(out)
              line(7, `One side ran dry — append the sorted remainder: result <b>[${out.join("→")}]</b>.`)
            }
            heap("merged this round", merged.map((l) => l.join("→")))
          }
          lists = merged
          heap("lists", lists.map((l) => l.join("→")))
          line(9, `Round ${round} done — <b>${lists.length}</b> list${lists.length === 1 ? "" : "s"} remain${lists.length === 1 ? "s" : ""}: ${lists.map((l) => `[${l.join("→")}]`).join(", ")}.`)
        }
        const result = lists.length > 0 ? lists[0] : []
        const sep1 = l1.length
        const sep2 = l1.length + l2.length + 1
        mark("good", Array.from({ length: l1.length + l2.length + l3.length + 2 }, (_, x) => x).filter((x) => x !== sep1 && x !== sep2))
        line(11, `Only one list is left — return it: <b>${result.join("→") || "null"}</b>. Total work: O(N log k) for N nodes across k lists.`)
        return result.join("→") || "null"
      },
      1,
    )
    mergeKLists()
    return JSON.stringify(lists[0] ?? [])
  },
}
