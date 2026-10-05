import type { SolutionDef } from "@/engine/types"

const clean = (a: unknown, fallback: number[]) => {
  const v = (a as number[]) ?? []
  return v.length > 0 ? v : fallback
}

export const mergeInBetweenLinkedLists: SolutionDef = {
  view: "array",
  array: (a) => [...clean(a.list1, [0, 1, 2, 3, 4, 5]), "·", ...clean(a.list2, [100, 101, 102])],
  code: `// replace list1 nodes a..b with all of list2
function mergeInBetween(list1, a, b, list2) {
  let before = list1;
  for (let i = 0; i < a - 1; i++) before = before.next;
  let after = before;
  for (let i = 0; i < b - a + 2; i++) after = after.next;
  before.next = list2;           // attach list2's head
  let tail = list2;
  while (tail.next !== null) tail = tail.next;
  tail.next = after;             // reattach the rest
  return list1;
}`,
  codeJava: `// replace list1 nodes a..b with all of list2
ListNode mergeInBetween(ListNode l1, int a, int b, ListNode l2) {
  ListNode before = l1;
  for (int i = 0; i < a - 1; i++) before = before.next;
  ListNode after = before;
  for (int i = 0; i < b - a + 2; i++) after = after.next;
  before.next = l2;              // attach list2's head
  ListNode tail = l2;
  while (tail.next != null) tail = tail.next;
  tail.next = after;             // reattach the rest
  return l1;
}`,
  inputs: [
    { kind: "numbers", name: "list1", label: "list1", default: [0, 1, 2, 3, 4, 5], maxLen: 8 },
    { kind: "number", name: "a", label: "a (first removed index)", default: 2, min: 1, max: 10 },
    { kind: "number", name: "b", label: "b (last removed index)", default: 4, min: 1, max: 10 },
    { kind: "numbers", name: "list2", label: "list2", default: [100, 101, 102], maxLen: 5 },
  ],
  entry: (a) => `mergeInBetween([${clean(a.list1, [0, 1, 2, 3, 4, 5]).join("→")}], ${a.a}, ${a.b}, …)`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const l1 = clean(args.list1, [0, 1, 2, 3, 4, 5])
    const l2 = clean(args.list2, [100, 101, 102])
    const n = l1.length
    // LC guarantees 1 <= a <= b < n - 1 — clamp user input into that window
    const a = Math.min(Math.max(1, Math.trunc(args.a as number)), Math.max(1, n - 2))
    const b = Math.min(Math.max(a, Math.trunc(args.b as number)), Math.max(a, n - 2))
    const off = n + 1 // list2 cells start after the "·" separator
    let result: number[] = []
    const mergeInBetween = fn(
      "mergeInBetween",
      (): string => {
        vars({ a, b })
        line(2, `Goal: cut list1 nodes <b>${a}..${b}</b> (values ${l1.slice(a, b + 1).join("→")}) and wire list2 into the gap. First find the node <b>just before</b> the cut.`)
        let before = 0
        ptr("before", before)
        for (let i = 0; i < a - 1; i++) {
          before++
          ptr("before", before)
          line(3, `before steps to index ${before} (node <b>${l1[before]}</b>) — needs ${a - 1 - before} more step${a - 1 - before === 1 ? "" : "s"} to reach index ${a - 1}.`)
        }
        line(3, `before stands at index ${a - 1} (node <b>${l1[a - 1]}</b>) — the last surviving node before the cut.`)
        let after = before
        ptr("after", after)
        line(4, `after starts where before stands and must walk <b>past the whole doomed block</b>.`)
        for (let i = 0; i < b - a + 2; i++) {
          after++
          ptr("after", after < n ? after : -1)
          line(5, `after steps to ${after < n ? `index ${after} (node <b>${l1[after]}</b>)` : "<b>null</b>"}.`)
        }
        mark("bad", Array.from({ length: b - a + 1 }, (_, x) => a + x))
        line(5, `after now points at ${after < n ? `node <b>${l1[after]}</b>` : "null"} — the first node to KEEP after the cut. The red block ${l1.slice(a, b + 1).join("→")} is about to be dropped.`)
        mark("window", l2.map((_, i) => off + i))
        line(6, `<b>Rewire:</b> ${l1[a - 1]}.next = list2's head (<b>${l2[0]}</b>) — the red block is now unreachable.`)
        let tail = 0
        ptr("tail", off)
        line(7, `tail starts at list2's head (${l2[0]}).`)
        while (tail < l2.length - 1) {
          tail++
          ptr("tail", off + tail)
          line(8, `tail.next ≠ null → tail walks to <b>${l2[tail]}</b>.`)
        }
        line(8, `tail.next is null → <b>${l2[l2.length - 1]}</b> is list2's last node.`)
        result = [...l1.slice(0, a), ...l2, ...l1.slice(b + 1)]
        heap("result", result)
        mark("good", [
          ...Array.from({ length: a }, (_, x) => x),
          ...l2.map((_, i) => off + i),
          ...Array.from({ length: n - b - 1 }, (_, x) => b + 1 + x),
        ])
        line(9, `<b>Rewire:</b> ${l2[l2.length - 1]}.next = ${after < n ? l1[after] : "null"} — list1's tail is reattached: <b>${result.join("→")}</b>.`)
        line(10, `Return list1's head. Two rewires total — O(n + m) walk, O(1) extra space.`)
        return result.join("→")
      },
      1,
    )
    mergeInBetween()
    return JSON.stringify(result)
  },
}
