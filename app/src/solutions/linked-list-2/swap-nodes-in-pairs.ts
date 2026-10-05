import type { SolutionDef } from "@/engine/types"

export const swapNodesInPairs: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums below becomes the linked list
function swapPairs(head) {
  const dummy = { next: head };
  let prev = dummy;
  while (prev.next !== null && prev.next.next !== null) {
    const first = prev.next;
    const second = first.next;
    first.next = second.next;   // first skips ahead
    second.next = first;        // second points back
    prev.next = second;         // stitch the pair in
    prev = first;               // first is now the tail
  }
  return dummy.next;
}`,
  codeJava: `// int[] nums below becomes the linked list
ListNode swapPairs(ListNode head) {
  ListNode dummy = new ListNode(0, head);
  ListNode prev = dummy;
  while (prev.next != null && prev.next.next != null) {
    ListNode first = prev.next;
    ListNode second = first.next;
    first.next = second.next;   // first skips ahead
    second.next = first;        // second points back
    prev.next = second;         // stitch the pair in
    prev = first;               // first is now the tail
  }
  return dummy.next;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6], maxLen: 10 }],
  entry: (a) => `swapPairs([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const arr = [...nums] // display copy that we mutate pairwise
    const swapPairs = fn(
      "swapPairs",
      (): string => {
        line(2, `dummy sits in front of the head so the <b>first pair</b> needs no special case.`)
        line(3, `prev starts on dummy — it always sits just <b>before</b> the pair being swapped.`)
        heap("list", [...arr])
        let i = 0
        while (i + 1 < n) {
          ptr("first", i)
          ptr("second", i + 1)
          mark("focus", [i, i + 1])
          vars({ "first.val": arr[i], "second.val": arr[i + 1] })
          line(5, `first = node <b>${arr[i]}</b> (prev.next).`)
          line(6, `second = node <b>${arr[i + 1]}</b> (first.next) — this pair will swap.`)
          line(7, `${arr[i]}.next jumps over ${arr[i + 1]} to ${i + 2 < n ? `node <b>${arr[i + 2]}</b>` : "<b>null</b>"} — first will be the pair's tail.`)
          line(8, `<b>Rewire:</b> ${arr[i + 1]}.next points back to <b>${arr[i]}</b> — the pair is reversed.`)
          const a = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = a
          mark("good", Array.from({ length: i + 2 }, (_, x) => x))
          heap("list", [...arr])
          line(9, `prev.next = <b>${arr[i]}</b> — the swapped pair ${arr[i]}→${arr[i + 1]} is stitched into the result (green prefix).`)
          line(10, `prev advances onto <b>${arr[i + 1]}</b>, the tail of this pair — ready for the next pair.`)
          i += 2
          vars({ prev: arr[i - 1] })
        }
        ptr("first", -1)
        ptr("second", -1)
        mark("focus", [])
        if (i < n) {
          mark("good", Array.from({ length: n }, (_, x) => x))
          line(4, `Only node <b>${arr[i]}</b> remains — a lone node has no partner, it stays put.`)
        } else {
          line(4, `No nodes left — every pair is swapped.`)
        }
        line(12, `Return dummy.next → <b>${arr.join("→")}</b>.`)
        return arr.join("→")
      },
      1,
    )
    swapPairs()
    return JSON.stringify(arr)
  },
}
