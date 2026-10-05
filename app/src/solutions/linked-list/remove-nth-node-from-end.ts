import type { SolutionDef } from "@/engine/types"

export const removeNthNodeFromEnd: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums = the list; n = editable below
function removeNthFromEnd(head, n) {
  const dummy = new Node(0, head);
  let lead = head, trail = dummy;
  for (let i = 0; i < n; i++) lead = lead.next; // gap = n
  while (lead !== null) {       // walk together
    lead = lead.next;
    trail = trail.next;
  }
  trail.next = trail.next.next; // skip the nth-from-end
  return dummy.next;
}`,
  codeJava: `// int[] nums = the list; int n = editable below
ListNode removeNthFromEnd(ListNode head, int n) {
  ListNode dummy = new ListNode(0, head);
  ListNode lead = head, trail = dummy;
  for (int i = 0; i < n; i++) lead = lead.next; // gap = n
  while (lead != null) {        // walk together
    lead = lead.next;
    trail = trail.next;
  }
  trail.next = trail.next.next; // skip the nth-from-end
  return dummy.next;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6], maxLen: 10 },
    { kind: "number", name: "n", label: "n (from the end)", default: 2, min: 1, max: 10 },
  ],
  entry: (a) => `removeNthFromEnd([${(a.nums as number[]).join("→")}], ${a.n})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const len = nums.length
    const nRaw = args.n as number
    const n = Math.min(Math.max(nRaw, 1), Math.max(len, 1))
    const removeNthFromEnd = fn(
      "removeNthFromEnd",
      (): string => {
        if (len === 0) return "[]"
        if (n !== nRaw) narrate(`n = ${nRaw} is larger than the list — clamped to ${n} for this demo.`)
        line(2, `A dummy node sits just before the head — it guarantees trail stops <b>before</b> the node to remove, even when that node is the head itself.`)
        let lead = 0
        let trail = -1 // -1 = the dummy, one step before index 0
        ptr("lead", 0)
        ptr("trail", -1)
        vars({ lead: nums[0], trail: "dummy" })
        line(3, `lead starts on the head; trail starts on the dummy (off-screen, left of cell 0).`)
        for (let i = 0; i < n; i++) {
          lead++
          ptr("lead", lead < len ? lead : -1)
          line(4, `Head start ${i + 1} of ${n}: lead → ${lead < len ? `node ${nums[lead]}` : "<b>null</b>"} . The lead–trail gap is now ${i + 1}.`)
        }
        narrate(`The one-pass trick: keep the gap at exactly <b>${n}</b>. When lead falls off the end, trail is automatically ${n} nodes before it — right in front of the node to delete. No length-counting pass needed.`)
        while (lead < len) {
          lead++
          trail++
          ptr("lead", lead < len ? lead : -1)
          ptr("trail", trail)
          vars({ lead: lead < len ? nums[lead] : "null", trail: nums[trail], gap: n })
          line(6, `lead → ${lead < len ? `node ${nums[lead]}` : "<b>null</b>"}.`)
          line(7, `trail → node ${nums[trail]} — the gap stays ${n}.`)
        }
        const target = len - n
        mark("bad", [target])
        line(9, `lead is null, so trail (${trail === -1 ? "dummy" : `node ${nums[trail]}`}) is right before the ${n}ᵗʰ node from the end: <b>${nums[target]}</b>. Skip it — trail.next = trail.next.next.`)
        const result = nums.filter((_, i) => i !== target)
        line(10, `Return dummy.next — the list reads ${result.join("→") || "(empty)"}.`)
        return result.join("→") || "(empty)"
      },
      1,
    )
    removeNthFromEnd()
    return JSON.stringify(len === 0 ? [] : nums.filter((_, i) => i !== len - n))
  },
}
