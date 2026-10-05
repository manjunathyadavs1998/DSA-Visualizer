import type { SolutionDef } from "@/engine/types"

export const removeDuplicatesFromSortedListII: SolutionDef = {
  view: "array",
  array: (a) => [...(a.nums as number[])].sort((x, y) => x - y),
  code: `// sorted nums; drop EVERY value that repeats
function deleteDuplicates(head) {
  const dummy = { next: head };
  let prev = dummy, cur = head;
  while (cur !== null) {
    if (cur.next !== null && cur.val === cur.next.val) {
      const v = cur.val;         // a duplicated value
      while (cur !== null && cur.val === v)
        cur = cur.next;          // skip the whole run
      prev.next = cur;           // splice the run out
    } else {
      prev = cur;                // unique — keep it
      cur = cur.next;
    }
  }
  return dummy.next;
}`,
  codeJava: `// sorted list; drop EVERY value that repeats
ListNode deleteDuplicates(ListNode head) {
  ListNode dummy = new ListNode(0, head);
  ListNode prev = dummy, cur = head;
  while (cur != null) {
    if (cur.next != null && cur.val == cur.next.val) {
      int v = cur.val;           // a duplicated value
      while (cur != null && cur.val == v)
        cur = cur.next;          // skip the whole run
      prev.next = cur;           // splice the run out
    } else {
      prev = cur;                // unique — keep it
      cur = cur.next;
    }
  }
  return dummy.next;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "sorted list nodes", default: [1, 2, 3, 3, 4, 4, 5], maxLen: 10 }],
  entry: (a) => `deleteDuplicates([${[...(a.nums as number[])].sort((x, y) => x - y).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    // duplicates must be adjacent for the run-skip to work — keep the list sorted
    const nums = [...(args.nums as number[])].sort((x, y) => x - y)
    const n = nums.length
    const kept: number[] = []
    const removed: number[] = []
    const deleteDuplicates = fn(
      "deleteDuplicates",
      (): string => {
        let prev = -1 // -1 = dummy
        let cur = n > 0 ? 0 : -1
        ptr("prev", -1)
        ptr("cur", cur)
        heap("kept", [...kept])
        line(3, `prev starts on <b>dummy</b> (last node that is certain to survive), cur on the head. Unlike LL I, even the <b>first copy</b> of a repeated value must die — that's why we need prev.`)
        while (cur !== -1) {
          mark("focus", [cur])
          vars({ prev: prev === -1 ? "dummy" : nums[prev], "cur.val": nums[cur] })
          const isRun = cur + 1 < n && nums[cur] === nums[cur + 1]
          if (isRun) {
            const v = nums[cur]
            line(5, `cur.val ${v} == cur.next.val ${nums[cur + 1]} → value <b>${v}</b> repeats, so <b>every</b> copy must go.`)
            line(6, `Remember v = <b>${v}</b> and walk past the whole run.`)
            const runStart = cur
            while (cur !== -1 && nums[cur] === v) {
              removed.push(cur)
              mark("bad", [...removed])
              cur = cur + 1 < n ? cur + 1 : -1
              ptr("cur", cur)
              line(8, `cur.val is still ${v} → step over it. cur is now ${cur === -1 ? "<b>null</b>" : `node <b>${nums[cur]}</b>`}.`)
            }
            line(9, `Splice: ${prev === -1 ? "dummy" : nums[prev]}.next jumps from the dead run (indices ${runStart}–${removed[removed.length - 1]}) straight to ${cur === -1 ? "<b>null</b>" : `<b>${nums[cur]}</b>`}. prev did <b>not</b> move — the next value might repeat too.`)
          } else {
            line(5, `cur.val ${nums[cur]} ${cur + 1 < n ? `≠ next ${nums[cur + 1]}` : "has no next"} → <b>${nums[cur]}</b> appears exactly once.`)
            kept.push(nums[cur])
            heap("kept", [...kept])
            mark("good", kept.map((_, i) => nums.indexOf(kept[i])))
            prev = cur
            ptr("prev", prev)
            line(11, `It survives — prev advances onto <b>${nums[cur]}</b>.`)
            cur = cur + 1 < n ? cur + 1 : -1
            ptr("cur", cur)
            line(12, `cur advances to ${cur === -1 ? "<b>null</b>" : `node <b>${nums[cur]}</b>`}.`)
          }
        }
        mark("focus", [])
        line(15, `cur is <b>null</b>. Return dummy.next → <b>${kept.length > 0 ? kept.join("→") : "null"}</b> (red runs were spliced out entirely).`)
        return kept.length > 0 ? kept.join("→") : "null"
      },
      1,
    )
    deleteDuplicates()
    return JSON.stringify(kept)
  },
}
