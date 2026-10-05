import type { SolutionDef } from "@/engine/types"

export const mergeTwoSortedLists: SolutionDef = {
  view: "array",
  array: (a) => [...(a.list1 as number[]), "·", ...(a.list2 as number[])],
  code: `// list1 and list2 (both sorted) are editable below
function mergeTwoLists(list1, list2) {
  const dummy = new Node(0);
  let tail = dummy, p1 = list1, p2 = list2;
  while (p1 !== null && p2 !== null) {
    if (p1.val <= p2.val) { tail.next = p1; p1 = p1.next; }
    else                  { tail.next = p2; p2 = p2.next; }
    tail = tail.next;
  }
  tail.next = (p1 !== null) ? p1 : p2;  // append leftover
  return dummy.next;
}`,
  codeJava: `// ListNode list1, list2 (both sorted) editable below
ListNode mergeTwoLists(ListNode list1, ListNode list2) {
  ListNode dummy = new ListNode(0);
  ListNode tail = dummy, p1 = list1, p2 = list2;
  while (p1 != null && p2 != null) {
    if (p1.val <= p2.val) { tail.next = p1; p1 = p1.next; }
    else                  { tail.next = p2; p2 = p2.next; }
    tail = tail.next;
  }
  tail.next = (p1 != null) ? p1 : p2;   // append leftover
  return dummy.next;
}`,
  inputs: [
    { kind: "numbers", name: "list1", label: "list1 (sorted)", default: [1, 3, 5], maxLen: 5 },
    { kind: "numbers", name: "list2", label: "list2 (sorted)", default: [2, 4, 6], maxLen: 5 },
  ],
  entry: (a) => `mergeTwoLists([${(a.list1 as number[]).join("→")}], [${(a.list2 as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const l1 = args.list1 as number[]
    const l2 = args.list2 as number[]
    const off = l1.length + 1 // list2 cells start after the "·" separator
    const merged: number[] = []
    const mergeTwoLists = fn(
      "mergeTwoLists",
      (): string => {
        let i = 0
        let j = 0
        const done: number[] = []
        ptr("p1", l1.length > 0 ? 0 : -1)
        ptr("p2", l2.length > 0 ? off : -1)
        line(3, `p1 on list1's head, p2 on list2's head (the "·" cell just separates the two lists). tail sits on a dummy node so we never special-case the first append.`)
        heap("merged", merged)
        while (i < l1.length && j < l2.length) {
          mark("focus", [i, off + j])
          vars({ "p1.val": l1[i], "p2.val": l2[j] })
          if (l1[i] <= l2[j]) {
            line(5, `${l1[i]} ≤ ${l2[j]} → the smaller front wins: tail.next takes <b>${l1[i]}</b> from list1, p1 advances.`)
            merged.push(l1[i])
            done.push(i)
            i++
          } else {
            line(6, `${l2[j]} < ${l1[i]} → tail.next takes <b>${l2[j]}</b> from list2, p2 advances.`)
            merged.push(l2[j])
            done.push(off + j)
            j++
          }
          heap("merged", merged)
          mark("done", [...done])
          ptr("p1", i < l1.length ? i : -1)
          ptr("p2", j < l2.length ? off + j : -1)
          line(7, `tail advances onto ${merged[merged.length - 1]} — merged so far: ${merged.join("→")}.`)
        }
        mark("focus", [])
        const restIs1 = i < l1.length
        const rest = restIs1 ? l1.slice(i) : l2.slice(j)
        line(9, rest.length > 0
          ? `${restIs1 ? "list2" : "list1"} is empty, but ${restIs1 ? "list1" : "list2"} still has ${rest.join("→")} — it's already sorted, so link the <b>whole remainder</b> in one move.`
          : `Both lists are exhausted at the same time — nothing left to append.`)
        for (let x = 0; x < rest.length; x++) done.push(restIs1 ? i + x : off + j + x)
        merged.push(...rest)
        heap("merged", merged)
        mark("done", [...done])
        ptr("p1", -1); ptr("p2", -1)
        line(10, `Return dummy.next — the merged list reads <b>${merged.join("→")}</b>, sorted by construction.`)
        return merged.join("→")
      },
      1,
    )
    mergeTwoLists()
    return JSON.stringify(merged)
  },
}
