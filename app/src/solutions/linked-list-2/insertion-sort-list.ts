import type { SolutionDef } from "@/engine/types"

export const insertionSortList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// grow a sorted list; insert each node in place
function insertionSortList(head) {
  const dummy = { next: null };
  let cur = head;
  while (cur !== null) {
    const next = cur.next;       // detach cur
    let prev = dummy;
    while (prev.next !== null && prev.next.val < cur.val) {
      prev = prev.next;          // scan for the spot
    }
    cur.next = prev.next;        // splice cur in
    prev.next = cur;
    cur = next;                  // next unsorted node
  }
  return dummy.next;
}`,
  codeJava: `// grow a sorted list; insert each node in place
ListNode insertionSortList(ListNode head) {
  ListNode dummy = new ListNode(0);
  ListNode cur = head;
  while (cur != null) {
    ListNode next = cur.next;    // detach cur
    ListNode prev = dummy;
    while (prev.next != null && prev.next.val < cur.val) {
      prev = prev.next;          // scan for the spot
    }
    cur.next = prev.next;        // splice cur in
    prev.next = cur;
    cur = next;                  // next unsorted node
  }
  return dummy.next;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [4, 2, 1, 3, 5], maxLen: 8 }],
  entry: (a) => `insertionSortList([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const sorted: number[] = []
    const insertionSort = fn(
      "insertionSortList",
      (): string => {
        line(2, `dummy heads an initially <b>empty sorted list</b>. Each original node will be pulled off and inserted at its right spot.`)
        heap("sorted", [...sorted])
        for (let cur = 0; cur < nums.length; cur++) {
          ptr("cur", cur)
          mark("focus", [cur])
          vars({ "cur.val": nums[cur], sorted: sorted.join("→") || "∅" })
          line(5, `Detach node <b>${nums[cur]}</b>; remember next = ${cur + 1 < nums.length ? nums[cur + 1] : "null"} so the unsorted rest isn't lost.`)
          let pos = 0
          line(6, `prev rewinds to <b>dummy</b> — the scan always restarts from the front (that's the O(n²)).`)
          while (pos < sorted.length && sorted[pos] < nums[cur]) {
            line(8, `prev.next.val ${sorted[pos]} < ${nums[cur]} → not far enough, prev advances onto <b>${sorted[pos]}</b>.`)
            pos++
          }
          line(7, pos < sorted.length
            ? `prev.next.val ${sorted[pos]} ≥ ${nums[cur]} → stop: insert <b>before ${sorted[pos]}</b>.`
            : `prev.next is <b>null</b> → ${nums[cur]} is the largest so far, insert at the <b>end</b>.`)
          sorted.splice(pos, 0, nums[cur])
          heap("sorted", [...sorted])
          line(10, `${nums[cur]}.next = ${pos + 1 < sorted.length ? sorted[pos + 1] : "null"} — cur takes over the tail of the spot.`)
          line(11, `prev.next = <b>${nums[cur]}</b> — spliced in. Sorted list: <b>${sorted.join("→")}</b>.`)
          mark("done", Array.from({ length: cur + 1 }, (_, x) => x))
          line(12, `cur moves on to ${cur + 1 < nums.length ? `node <b>${nums[cur + 1]}</b>` : "<b>null</b>"}.`)
        }
        ptr("cur", -1)
        mark("focus", [])
        mark("good", Array.from({ length: nums.length }, (_, x) => x))
        line(14, `cur is <b>null</b> — every node has been inserted. Return dummy.next → <b>${sorted.join("→") || "null"}</b>.`)
        return sorted.join("→") || "null"
      },
      1,
    )
    insertionSort()
    return JSON.stringify(sorted)
  },
}
