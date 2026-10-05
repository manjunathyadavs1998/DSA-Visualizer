import type { SolutionDef } from "@/engine/types"

export const middleOfTheLinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums below becomes the linked list
function middleNode(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps
  }
  return slow;                // slow sits at the middle
}`,
  codeJava: `// int[] nums below becomes the linked list
ListNode middleNode(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps
  }
  return slow;                // slow sits at the middle
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6, 7, 8], maxLen: 12 }],
  entry: (a) => `middleNode([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const middleNode = fn(
      "middleNode",
      (): string => {
        if (n === 0) return "null"
        let slow = 0
        let fast = 0
        ptr("slow", slow); ptr("fast", fast)
        vars({ slow: nums[slow], fast: nums[fast] })
        line(2, `slow and fast both start at the head (node ${nums[0]}).`)
        narrate(`The 2× argument: fast covers <b>twice</b> the distance of slow. So the moment fast has covered the whole list (n steps), slow has covered n/2 — exactly the middle. One pass, no counting.`)
        while (fast < n && fast + 1 < n) {
          slow++
          ptr("slow", slow)
          line(4, `slow takes 1 step → node ${nums[slow]} (index ${slow}). It has walked ${slow} steps.`)
          fast += 2
          ptr("fast", fast < n ? fast : -1)
          line(5, `fast takes 2 steps → ${fast < n ? `node ${nums[fast]} (index ${fast})` : "past the end (<b>null</b>)"} . It has walked ${fast} steps — always exactly 2× slow's ${slow}.`)
          vars({ slow: nums[slow], fast: fast < n ? nums[fast] : "null" })
        }
        mark("good", [slow])
        line(7, `fast ${fast >= n ? "is <b>null</b>" : `(node ${nums[fast]}) has no 2 steps left`} — the list is exhausted at double speed, so slow sits at index ${slow}: ${n % 2 === 0 ? "the <b>second</b> of the two middles (even length)" : "the exact middle"}. Answer: node <b>${nums[slow]}</b>.`)
        return `node ${nums[slow]}`
      },
      1,
    )
    return middleNode()
  },
}
