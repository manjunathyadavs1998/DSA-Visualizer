import type { SolutionDef } from "@/engine/types"

export const reorderList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// reorder: L0 -> Ln -> L1 -> Ln-1 -> ...
function reorderList(head) {
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next; fast = fast.next.next;
  }
  let second = reverse(slow.next);  // back half flipped
  slow.next = null;                 // cut in two
  let first = head;
  while (second !== null) {
    const n1 = first.next, n2 = second.next;
    first.next = second;     // weave from the back
    second.next = n1;        // weave from the front
    first = n1; second = n2;
  }
}`,
  codeJava: `// reorder: L0 -> Ln -> L1 -> Ln-1 -> ...
void reorderList(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast.next != null && fast.next.next != null) {
    slow = slow.next; fast = fast.next.next;
  }
  ListNode second = reverse(slow.next); // back half
  slow.next = null;                 // cut in two
  ListNode first = head;
  while (second != null) {
    ListNode n1 = first.next, n2 = second.next;
    first.next = second;     // weave from the back
    second.next = n1;        // weave from the front
    first = n1; second = n2;
  }
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6], maxLen: 10 }],
  entry: (a) => `reorderList([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const raw = args.nums as number[]
    const nums = raw.length > 0 ? raw : [1, 2, 3, 4, 5, 6] // the algorithm assumes a non-empty list
    const n = nums.length
    const reordered: number[] = []
    const reorder = fn(
      "reorderList",
      (): string => {
        // Phase 1: slow/fast to find the end of the front half
        let slow = 0
        let fast = 0
        ptr("slow", slow)
        ptr("fast", fast)
        line(2, `<b>Phase 1 — find the middle.</b> slow and fast both start at the head (node ${nums[0]}).`)
        while (fast + 2 < n) {
          slow += 1
          fast += 2
          ptr("slow", slow)
          ptr("fast", fast)
          vars({ "slow.val": nums[slow], "fast.val": nums[fast] })
          line(4, `fast still has 2 nodes ahead → slow steps to <b>${nums[slow]}</b>, fast jumps to <b>${nums[fast]}</b>.`)
        }
        const mid = slow
        mark("window", Array.from({ length: n - mid - 1 }, (_, x) => mid + 1 + x))
        line(5, `fast ran out of road → slow stands on <b>${nums[mid]}</b>, the last node of the front half. The back half (blue) is ${nums.slice(mid + 1).join("→") || "empty"}.`)
        // Phase 2: reverse the back half
        const back = nums.slice(mid + 1).reverse()
        heap("back (reversed)", [...back])
        line(6, `<b>Phase 2 — reverse the back half</b> (the three-pointer trick from Reverse Linked List): ${nums.slice(mid + 1).join("→") || "∅"} becomes <b>${back.join("→") || "∅"}</b>.`)
        line(7, `Cut the list: ${nums[mid]}.next = <b>null</b> — front = ${nums.slice(0, mid + 1).join("→")}, second = ${back.join("→") || "null"}.`)
        // Phase 3: weave the two halves
        ptr("fast", -1)
        ptr("slow", -1)
        let i = 0 // index into front half
        let j = n - 1 // original index of second's head (back is reversed)
        ptr("first", i)
        ptr("second", j >= mid + 1 ? j : -1)
        reordered.push(nums[0])
        heap("reordered", [...reordered])
        line(8, `<b>Phase 3 — weave.</b> first starts at the front's head (${nums[0]}), second at the back's head (${j > mid ? nums[j] : "null"}). Alternate: one from the front, one from the back.`)
        while (j > mid) {
          vars({ "first.val": nums[i], "second.val": nums[j] })
          mark("focus", [i, j])
          const n1 = i + 1 <= mid ? i + 1 : -1
          const n2 = j - 1 > mid ? j - 1 : -1
          line(10, `Save n1 = ${n1 === -1 ? "null" : nums[n1]} (front's rest) and n2 = ${n2 === -1 ? "null" : nums[n2]} (back's rest) before any rewiring.`)
          reordered.push(nums[j])
          heap("reordered", [...reordered])
          line(11, `${nums[i]}.next = <b>${nums[j]}</b> — a node from the <b>back</b> is woven in: ${reordered.join("→")}.`)
          if (n1 !== -1) {
            reordered.push(nums[n1])
            heap("reordered", [...reordered])
          }
          line(12, `${nums[j]}.next = ${n1 === -1 ? "<b>null</b> — the front is exhausted" : `<b>${nums[n1]}</b> — back to the front half`}${n1 === -1 ? "" : `: ${reordered.join("→")}`}.`)
          i = n1
          j = n2 === -1 ? mid : n2
          ptr("first", i)
          ptr("second", n2)
          line(13, `Advance: first → ${i === -1 ? "null" : nums[i]}, second → ${n2 === -1 ? "null" : nums[n2]}.`)
          if (n2 === -1) break
        }
        mark("focus", [])
        mark("good", Array.from({ length: n }, (_, x) => x))
        line(9, `second is <b>null</b> — weaving done in place: <b>${reordered.join("→")}</b>. No values were copied, only pointers moved.`)
        return reordered.join("→")
      },
      1,
    )
    reorder()
    return JSON.stringify(reordered)
  },
}
