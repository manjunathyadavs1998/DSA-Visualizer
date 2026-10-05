import type { SolutionDef } from "@/engine/types"

export const palindromeLinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums below becomes the linked list
function isPalindrome(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next; fast = fast.next.next;
  }
  if (fast !== null) slow = slow.next; // odd: skip middle
  let second = reverse(slow);   // reverse the 2nd half
  let p1 = head, p2 = second, ok = true;
  while (p2 !== null) {
    if (p1.val !== p2.val) ok = false;
    p1 = p1.next; p2 = p2.next;
  }
  reverse(second);              // restore the list
  return ok;
}`,
  codeJava: `// int[] nums below becomes the linked list
boolean isPalindrome(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
  }
  if (fast != null) slow = slow.next;  // odd: skip middle
  ListNode second = reverse(slow); // reverse the 2nd half
  ListNode p1 = head, p2 = second; boolean ok = true;
  while (p2 != null) {
    if (p1.val != p2.val) ok = false;
    p1 = p1.next; p2 = p2.next;
  }
  reverse(second);              // restore the list
  return ok;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 3, 2, 1], maxLen: 12 }],
  entry: (a) => `isPalindrome([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, aset, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const isPalindrome = fn(
      "isPalindrome",
      (): boolean => {
        if (n === 0) return true
        let slow = 0
        let fast = 0
        ptr("slow", 0); ptr("fast", 0)
        line(2, `Phase 1 — find the middle: slow and fast start at the head.`)
        while (fast < n && fast + 1 < n) {
          slow++
          fast += 2
          ptr("slow", slow)
          ptr("fast", fast < n ? fast : -1)
          line(4, `slow → node ${nums[slow]} (1 step); fast → ${fast < n ? `node ${nums[fast]}` : "<b>null</b>"} (2 steps).`)
        }
        const odd = fast < n
        if (odd) {
          slow++
          ptr("slow", slow)
          line(6, `Odd length: skip the middle node (${nums[slow - 1]}) — it matches itself, no need to compare it.`)
        }
        const m = slow
        ptr("fast", -1)
        const second = nums.slice(m).reverse()
        line(7, `Phase 2 — reverse the second half [index ${m}…${n - 1}] <b>in place</b> (same prev/cur/next rewiring as Reverse Linked List).`)
        for (let i = 0; i < second.length; i++) aset(m + i, second[i])
        mark("window", Array.from({ length: n - m }, (_, i) => m + i))
        narrate(`The second half now reads ${second.join("→")} — comparing the ends inward became comparing <b>left-to-right in lockstep</b>.`)
        let p1 = 0
        let p2 = m
        let ok = true
        const matched: number[] = []
        while (p2 < n) {
          ptr("p1", p1); ptr("p2", p2)
          const a = nums[p1]
          const b = second[p2 - m]
          if (a === b) {
            matched.push(p1, p2)
            mark("good", [...matched])
            line(10, `Compare p1 (${a}) with p2 (${b}) — <b>match</b>.`)
          } else {
            ok = false
            mark("bad", [p1, p2])
            line(10, `Compare p1 (${a}) with p2 (${b}) — <b>mismatch</b>! Not a palindrome (we still finish, to restore the list).`)
          }
          p1++
          p2++
        }
        line(13, `Phase 3 — reverse the second half again to <b>restore</b> the caller's list: a good algorithm leaves no trace.`)
        for (let i = m; i < n; i++) aset(i, nums[i])
        mark("window", [])
        ptr("p1", -1); ptr("p2", -1)
        line(14, `Return <b>${ok}</b>.`)
        return ok
      },
      1,
    )
    return isPalindrome()
  },
}
