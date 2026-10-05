import type { SolutionDef } from "@/engine/types"

export const deleteTheMiddleNodeOfALinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// delete the floor(n/2)-th node (0-indexed)
function deleteMiddle(head) {
  if (head.next === null) return null;
  let slow = head, fast = head.next.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;         // trails the middle
    fast = fast.next.next;    // moves 2x
  }
  slow.next = slow.next.next; // unlink the middle
  return head;
}`,
  codeJava: `// delete the floor(n/2)-th node (0-indexed)
ListNode deleteMiddle(ListNode head) {
  if (head.next == null) return null;
  ListNode slow = head, fast = head.next.next;
  while (fast != null && fast.next != null) {
    slow = slow.next;         // trails the middle
    fast = fast.next.next;    // moves 2x
  }
  slow.next = slow.next.next; // unlink the middle
  return head;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 3, 4, 7, 1, 2, 6], maxLen: 10 }],
  entry: (a) => `deleteMiddle([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const raw = args.nums as number[]
    const nums = raw.length > 0 ? raw : [1, 3, 4, 7, 1, 2, 6] // LC guarantees ≥ 1 node
    const n = nums.length
    let result: number[] = []
    const deleteMiddle = fn(
      "deleteMiddle",
      (): string => {
        line(2, n === 1
          ? `Single node — deleting the middle (index 0) leaves <b>null</b>.`
          : `More than one node — find the middle with slow/fast runners.`)
        if (n === 1) {
          mark("bad", [0])
          return "null"
        }
        let slow = 0
        let fast = 2 <= n - 1 ? 2 : -1
        ptr("slow", slow)
        ptr("fast", fast)
        vars({ "slow.val": nums[slow], "fast.val": fast === -1 ? "null" : nums[fast] })
        line(3, `The trick: slow must stop <b>one before</b> the middle (to rewire around it), so fast gets a <b>2-node head start</b>: fast = head.next.next = ${fast === -1 ? "<b>null</b>" : `node <b>${nums[fast]}</b>`}.`)
        while (fast !== -1 && fast + 1 < n) {
          slow++
          fast = fast + 2 < n ? fast + 2 : -1
          ptr("slow", slow)
          ptr("fast", fast)
          vars({ "slow.val": nums[slow], "fast.val": fast === -1 ? "null" : nums[fast] })
          line(5, `slow trails to <b>${nums[slow]}</b> (index ${slow})…`)
          line(6, `…while fast leaps to ${fast === -1 ? "<b>null</b>" : `<b>${nums[fast]}</b> (index ${fast})`}.`)
        }
        const mid = slow + 1
        mark("bad", [mid])
        line(4, `fast ran off the end — slow (index ${slow}) sits right <b>before</b> the middle. The victim is index ${mid} = ⌊${n}/2⌋: node <b>${nums[mid]}</b> (red).`)
        result = [...nums.slice(0, mid), ...nums.slice(mid + 1)]
        heap("list", result)
        line(8, `<b>Unlink:</b> ${nums[slow]}.next skips over ${nums[mid]} to ${mid + 1 < n ? `node <b>${nums[mid + 1]}</b>` : "<b>null</b>"} — the middle is gone without ever counting the nodes.`)
        mark("good", Array.from({ length: n }, (_, x) => x).filter((x) => x !== mid))
        line(9, `Return head → <b>${result.join("→")}</b>. One pass, O(1) space.`)
        return result.join("→")
      },
      1,
    )
    deleteMiddle()
    return JSON.stringify(result)
  },
}
