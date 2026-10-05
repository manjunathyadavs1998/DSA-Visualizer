import type { SolutionDef } from "@/engine/types"

export const oddEvenLinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// odd positions first, then even (1-based index)
function oddEvenList(head) {
  if (head === null) return head;
  let odd = head, even = head.next;
  const evenHead = even;
  while (even !== null && even.next !== null) {
    odd.next = even.next;    // skip to the next odd
    odd = odd.next;
    even.next = odd.next;    // skip to the next even
    even = even.next;
  }
  odd.next = evenHead;       // append the even chain
  return head;
}`,
  codeJava: `// odd positions first, then even (1-based index)
ListNode oddEvenList(ListNode head) {
  if (head == null) return head;
  ListNode odd = head, even = head.next;
  ListNode evenHead = even;
  while (even != null && even.next != null) {
    odd.next = even.next;    // skip to the next odd
    odd = odd.next;
    even.next = odd.next;    // skip to the next even
    even = even.next;
  }
  odd.next = evenHead;       // append the even chain
  return head;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6, 7], maxLen: 10 }],
  entry: (a) => `oddEvenList([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const oddChain: number[] = []
    const evenChain: number[] = []
    let result: number[] = []
    const oddEvenList = fn(
      "oddEvenList",
      (): string => {
        line(2, n === 0 ? `head is <b>null</b> — nothing to rearrange.` : `List is non-empty — proceed.`)
        if (n === 0) return "null"
        let odd = 0
        let even = n > 1 ? 1 : -1
        oddChain.push(nums[0])
        if (even !== -1) evenChain.push(nums[1])
        ptr("odd", odd)
        ptr("even", even)
        heap("odd chain", [...oddChain])
        heap("even chain", [...evenChain])
        line(3, `odd starts at position 1 (node <b>${nums[0]}</b>), even at position 2 (${even === -1 ? "<b>null</b>" : `node <b>${nums[1]}</b>`}). Each pointer will leapfrog over the other's chain.`)
        line(4, `Remember evenHead = ${even === -1 ? "null" : `<b>${nums[1]}</b>`} — we'll need it to glue the chains at the end.`)
        const oddIdx = [0]
        const evenIdx = even === -1 ? [] : [1]
        mark("good", [...oddIdx])
        mark("window", [...evenIdx])
        while (even !== -1 && even + 1 < n) {
          vars({ "odd.val": nums[odd], "even.val": nums[even] })
          odd = even + 1
          oddChain.push(nums[odd])
          oddIdx.push(odd)
          heap("odd chain", [...oddChain])
          mark("good", [...oddIdx])
          line(6, `odd.next skips over even node ${nums[even]} to <b>${nums[odd]}</b> — the odd chain is now ${oddChain.join("→")}.`)
          ptr("odd", odd)
          line(7, `odd advances onto <b>${nums[odd]}</b>.`)
          const nextEven = odd + 1 < n ? odd + 1 : -1
          if (nextEven !== -1) {
            evenChain.push(nums[nextEven])
            evenIdx.push(nextEven)
            heap("even chain", [...evenChain])
            mark("window", [...evenIdx])
          }
          line(8, `even.next skips over odd node ${nums[odd]} to ${nextEven === -1 ? "<b>null</b>" : `<b>${nums[nextEven]}</b>`} — the even chain is now ${evenChain.join("→")}${nextEven === -1 ? " (ends here)" : ""}.`)
          even = nextEven
          ptr("even", even)
          line(9, `even advances to ${even === -1 ? "<b>null</b>" : `<b>${nums[even]}</b>`}.`)
        }
        line(5, `even ${even === -1 ? "is <b>null</b>" : `(node ${nums[even]}) has no next`} — both chains are complete.`)
        result = [...oddChain, ...evenChain]
        heap("result", result)
        line(11, `Glue: ${oddChain[oddChain.length - 1]}.next = evenHead ${evenChain.length > 0 ? `(<b>${evenChain[0]}</b>)` : "(null)"} → <b>${result.join("→")}</b>. One pass, O(1) extra space.`)
        line(12, `Return head — odd positions (green) now all precede even positions (blue).`)
        return result.join("→")
      },
      1,
    )
    oddEvenList()
    return JSON.stringify(result)
  },
}
