import type { SolutionDef } from "@/engine/types"

export const removeDuplicatesFromSortedList: SolutionDef = {
  view: "array",
  array: (a) => [...(a.nums as number[])].sort((x, y) => x - y),
  code: `// sorted nums below becomes the linked list
function deleteDuplicates(head) {
  let cur = head;
  while (cur !== null && cur.next !== null) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;  // unlink duplicate
    } else {
      cur = cur.next;            // distinct — advance
    }
  }
  return head;
}`,
  codeJava: `// sorted int[] nums below becomes the linked list
ListNode deleteDuplicates(ListNode head) {
  ListNode cur = head;
  while (cur != null && cur.next != null) {
    if (cur.val == cur.next.val) {
      cur.next = cur.next.next;  // unlink duplicate
    } else {
      cur = cur.next;            // distinct — advance
    }
  }
  return head;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "sorted list nodes", default: [1, 1, 2, 3, 3, 3, 4], maxLen: 10 }],
  entry: (a) => `deleteDuplicates([${[...(a.nums as number[])].sort((x, y) => x - y).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    // the algorithm relies on equal values being adjacent — keep the list sorted
    const nums = [...(args.nums as number[])].sort((x, y) => x - y)
    const n = nums.length
    const kept: number[] = n > 0 ? [nums[0]] : []
    const removed: number[] = []
    const deleteDuplicates = fn(
      "deleteDuplicates",
      (): string => {
        let cur = n > 0 ? 0 : -1
        let next = cur !== -1 && cur + 1 < n ? cur + 1 : -1
        ptr("cur", cur)
        ptr("next", next)
        heap("kept", [...kept])
        line(2, `cur starts at the head${n > 0 ? ` (node <b>${nums[0]}</b>)` : " (null)"}. Sorted order means duplicates sit <b>side by side</b>.`)
        while (cur !== -1 && next !== -1) {
          mark("focus", [cur, next])
          vars({ "cur.val": nums[cur], "cur.next.val": nums[next] })
          if (nums[cur] === nums[next]) {
            line(4, `cur.val ${nums[cur]} == next ${nums[next]} → node at index ${next} is a <b>duplicate</b>.`)
            removed.push(next)
            mark("bad", [...removed])
            next = next + 1 < n ? next + 1 : -1
            ptr("next", next)
            line(5, `cur.next skips the duplicate and now points to ${next === -1 ? "<b>null</b>" : `node <b>${nums[next]}</b>`} — cur stays put in case more copies follow.`)
          } else {
            line(4, `cur.val ${nums[cur]} ≠ next ${nums[next]} → <b>${nums[next]}</b> is a new value, keep it.`)
            kept.push(nums[next])
            heap("kept", [...kept])
            cur = next
            next = next + 1 < n ? next + 1 : -1
            ptr("cur", cur)
            ptr("next", next)
            line(7, `cur advances onto <b>${nums[cur]}</b> — it becomes the survivor for the next value run.`)
          }
        }
        mark("focus", [])
        ptr("next", -1)
        line(9, `cur.next is <b>null</b> — the sweep is done. Each value survives exactly once.`)
        line(10, `Return head → <b>${kept.join("→")}</b> (${removed.length} duplicate${removed.length === 1 ? "" : "s"} unlinked, shown red).`)
        return kept.join("→")
      },
      1,
    )
    deleteDuplicates()
    return JSON.stringify(kept)
  },
}
