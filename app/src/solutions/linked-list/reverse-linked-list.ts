import type { SolutionDef } from "@/engine/types"

export const reverseLinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums below becomes the linked list
function reverse(head) {
  let prev = null, cur = head;
  while (cur !== null) {
    const next = cur.next;    // save the rest
    cur.next = prev;          // flip the arrow
    prev = cur;               // reversed prefix grows
    cur = next;               // advance
  }
  return prev;                // prev is the new head
}`,
  codeJava: `// int[] nums below becomes the linked list
ListNode reverse(ListNode head) {
  ListNode prev = null, cur = head;
  while (cur != null) {
    ListNode next = cur.next; // save the rest
    cur.next = prev;          // flip the arrow
    prev = cur;               // reversed prefix grows
    cur = next;               // advance
  }
  return prev;                // prev is the new head
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 5, 8], maxLen: 10 }],
  entry: (a) => `reverse([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const reverse = fn(
      "reverse",
      (): string => {
        let prev = -1
        let cur = n > 0 ? 0 : -1
        ptr("prev", -1); ptr("cur", cur); ptr("next", -1)
        vars({ prev: "null", cur: cur === -1 ? "null" : nums[cur] })
        line(2, `prev = <b>null</b> (nothing reversed yet), cur = the head${n > 0 ? ` (node ${nums[0]})` : " (null)"}.`)
        heap("reversed", [])
        while (cur !== -1) {
          const next = cur + 1 < n ? cur + 1 : -1
          ptr("next", next)
          vars({ prev: prev === -1 ? "null" : nums[prev], cur: nums[cur], next: next === -1 ? "null" : nums[next] })
          line(4, `Save next = ${next === -1 ? "<b>null</b> — cur is the tail" : `node <b>${nums[next]}</b>`}, otherwise the rest of the list is lost after the rewire.`)
          line(5, `<b>Rewire:</b> ${nums[cur]}.next now points back to ${prev === -1 ? "<b>null</b>" : `<b>${nums[prev]}</b>`} — this arrow is flipped forever.`)
          mark("good", Array.from({ length: cur + 1 }, (_, i) => i))
          heap("reversed", nums.slice(0, cur + 1).reverse())
          line(6, `prev advances onto ${nums[cur]} — the reversed prefix (green) now ends here.`)
          prev = cur
          ptr("prev", prev)
          line(7, `cur advances to ${next === -1 ? "null" : nums[next]}.`)
          cur = next
          ptr("cur", cur)
        }
        line(9, `cur is <b>null</b> — every arrow is flipped. prev${prev === -1 ? "" : ` (node ${nums[prev]})`} is the new head.`)
        return prev === -1 ? "null" : `head = ${nums[prev]}`
      },
      1,
    )
    reverse()
    return JSON.stringify([...nums].reverse())
  },
}
