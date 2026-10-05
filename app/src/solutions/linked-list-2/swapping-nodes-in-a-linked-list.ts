import type { SolutionDef } from "@/engine/types"

export const swappingNodesInALinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// swap the k-th values from the front and back
function swapNodes(head, k) {
  let first = head;
  for (let i = 1; i < k; i++) first = first.next;
  let second = head, probe = first;
  while (probe.next !== null) {
    probe = probe.next;      // keep a fixed gap
    second = second.next;    // lands k-th from end
  }
  const tmp = first.val;     // swap values only
  first.val = second.val;
  second.val = tmp;
  return head;
}`,
  codeJava: `// swap the k-th values from the front and back
ListNode swapNodes(ListNode head, int k) {
  ListNode first = head;
  for (int i = 1; i < k; i++) first = first.next;
  ListNode second = head, probe = first;
  while (probe.next != null) {
    probe = probe.next;      // keep a fixed gap
    second = second.next;    // lands k-th from end
  }
  int tmp = first.val;       // swap values only
  first.val = second.val;
  second.val = tmp;
  return head;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [7, 9, 6, 6, 7, 8, 3, 0, 9, 5], maxLen: 10 },
    { kind: "number", name: "k", label: "k (1-based)", default: 5, min: 1, max: 10 },
  ],
  entry: (a) => `swapNodes([${(a.nums as number[]).join("→")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap, aset }, args) {
    const raw = args.nums as number[]
    const nums = raw.length > 0 ? [...raw] : [1, 2, 3, 4, 5] // need at least one node
    const n = nums.length
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), n) // 1 ≤ k ≤ n
    const swapNodes = fn(
      "swapNodes",
      (): string => {
        vars({ k, n })
        let first = 0
        ptr("first", first)
        line(2, `<b>Pass A:</b> walk first exactly k−1 = ${k - 1} step${k - 1 === 1 ? "" : "s"} to the k-th node from the front.`)
        for (let i = 1; i < k; i++) {
          first++
          ptr("first", first)
          line(3, `step ${i}: first → node <b>${nums[first]}</b> (index ${first}).`)
        }
        mark("focus", [first])
        line(3, `first stands on <b>${nums[first]}</b> — the k-th from the front.`)
        let second = 0
        let probe = first
        ptr("second", second)
        ptr("probe", probe)
        line(4, `<b>Pass B — the two-pointer trick:</b> probe starts where first is, second at the head. The gap between them is exactly <b>k−1 nodes</b> and never changes.`)
        while (probe + 1 < n) {
          probe++
          second++
          ptr("probe", probe)
          ptr("second", second)
          vars({ "probe.val": nums[probe], "second.val": nums[second] })
          line(6, `probe → <b>${nums[probe]}</b>${probe === n - 1 ? " (the tail!)" : ""}, second → <b>${nums[second]}</b> — the gap rides along.`)
        }
        mark("focus", [first, second])
        line(7, `probe hit the tail, so second is <b>${k}-th from the end</b>: node <b>${nums[second]}</b>${first === second ? " — same node as first (k points at the middle), swap is a no-op" : ""}.`)
        const tmp = nums[first]
        line(9, `tmp = first.val = <b>${tmp}</b>. We swap the <b>values</b>, not the nodes — far simpler, same result.`)
        nums[first] = nums[second]
        aset(first, nums[first])
        line(10, `first.val = <b>${nums[first]}</b>.`)
        nums[second] = tmp
        aset(second, tmp)
        heap("list", [...nums])
        line(11, `second.val = <b>${tmp}</b> — swap complete.`)
        mark("good", [first, second])
        line(12, `Return head → <b>${nums.join("→")}</b>. One and a half passes, O(1) space.`)
        return nums.join("→")
      },
      1,
    )
    swapNodes()
    return JSON.stringify(nums)
  },
}
