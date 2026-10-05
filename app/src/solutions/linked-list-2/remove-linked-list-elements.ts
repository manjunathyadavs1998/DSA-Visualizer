import type { SolutionDef } from "@/engine/types"

export const removeLinkedListElements: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// delete every node whose value equals val
function removeElements(head, val) {
  const dummy = { next: head };
  let prev = dummy, cur = head;
  while (cur !== null) {
    if (cur.val === val) {
      prev.next = cur.next;   // unlink cur
    } else {
      prev = cur;             // keep cur
    }
    cur = cur.next;
  }
  return dummy.next;
}`,
  codeJava: `// delete every node whose value equals val
ListNode removeElements(ListNode head, int val) {
  ListNode dummy = new ListNode(0, head);
  ListNode prev = dummy, cur = head;
  while (cur != null) {
    if (cur.val == val) {
      prev.next = cur.next;   // unlink cur
    } else {
      prev = cur;             // keep cur
    }
    cur = cur.next;
  }
  return dummy.next;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 6, 3, 4, 5, 6], maxLen: 10 },
    { kind: "number", name: "val", label: "val (to delete)", default: 6, min: -9, max: 20 },
  ],
  entry: (a) => `removeElements([${(a.nums as number[]).join("→")}], ${a.val})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const val = args.val as number
    const n = nums.length
    const kept: number[] = []
    const removed: number[] = []
    const keptIdx: number[] = []
    const removeElements = fn(
      "removeElements",
      (): string => {
        line(2, `A dummy before the head means deleting the <b>head itself</b> needs no special case — prev always exists.`)
        let prev = -1 // -1 = dummy
        ptr("prev", -1)
        ptr("cur", n > 0 ? 0 : -1)
        heap("kept", [...kept])
        line(3, `prev on dummy, cur on the head${n > 0 ? ` (node <b>${nums[0]}</b>)` : " (null)"}.`)
        for (let cur = 0; cur < n; cur++) {
          ptr("cur", cur)
          mark("focus", [cur])
          vars({ "cur.val": nums[cur], val, prev: prev === -1 ? "dummy" : nums[prev] })
          if (nums[cur] === val) {
            removed.push(cur)
            mark("bad", [...removed])
            line(6, `cur.val == <b>${val}</b> → unlink: ${prev === -1 ? "dummy" : nums[prev]}.next skips to ${cur + 1 < n ? `node ${nums[cur + 1]}` : "<b>null</b>"}. prev stays — the next node might be a ${val} too.`)
          } else {
            kept.push(nums[cur])
            keptIdx.push(cur)
            heap("kept", [...kept])
            mark("good", [...keptIdx])
            prev = cur
            ptr("prev", prev)
            line(8, `cur.val ${nums[cur]} ≠ ${val} → keep it; prev advances onto <b>${nums[cur]}</b>.`)
          }
          line(10, `cur advances to ${cur + 1 < n ? `node <b>${nums[cur + 1]}</b>` : "<b>null</b>"}.`)
        }
        ptr("cur", -1)
        mark("focus", [])
        line(12, `cur is <b>null</b> — done. Return dummy.next → <b>${kept.join("→") || "null"}</b> (${removed.length} node${removed.length === 1 ? "" : "s"} removed, red).`)
        return kept.join("→") || "null"
      },
      1,
    )
    removeElements()
    return JSON.stringify(kept)
  },
}
