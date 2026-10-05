import type { SolutionDef } from "@/engine/types"

export const reverseNodesInKGroup: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums = the list; k = editable below
function reverseKGroup(head, k) {
  let node = head, count = 0;
  while (node !== null && count < k) {  // probe k ahead
    node = node.next; count++;
  }
  if (count < k) return head;  // < k left: leave as is
  let prev = reverseKGroup(node, k);  // solve the rest first
  let cur = head;
  while (count-- > 0) {        // reverse this block of k
    const next = cur.next;
    cur.next = prev;           // rewire into the answer
    prev = cur;
    cur = next;
  }
  return prev;   // the new head of this block
}`,
  codeJava: `// ListNode head from int[] nums; int k editable below
ListNode reverseKGroup(ListNode head, int k) {
  ListNode node = head; int count = 0;
  while (node != null && count < k) {   // probe k ahead
    node = node.next; count++;
  }
  if (count < k) return head;  // < k left: leave as is
  ListNode prev = reverseKGroup(node, k); // rest first
  ListNode cur = head;
  while (count-- > 0) {        // reverse this block of k
    ListNode next = cur.next;
    cur.next = prev;           // rewire into the answer
    prev = cur;
    cur = next;
  }
  return prev;   // the new head of this block
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6, 7], maxLen: 10 },
    { kind: "number", name: "k", label: "k (group size)", default: 3, min: 1, max: 4 },
  ],
  entry: (a) => `reverseKGroup([${(a.nums as number[]).join("→")}], ${a.k})`,
  run({ fn, line, ptr, mark, aset, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const k = Math.min(Math.max(args.k as number, 1), 4)
    const cells = [...nums] // current display values
    const good: number[] = []
    const go = fn(
      "reverseKGroup",
      (s: number): string => {
        let node = s
        let count = 0
        ptr("node", s < n ? s : -1)
        while (node < n && count < k) {
          count++
          line(3, `Probe ahead: node ${cells[node]} — that's ${count} of the k=${k} we need.`)
          node++
          ptr("node", node < n ? node : -1)
        }
        line(6, count < k
          ? `Only ${count} node(s) left — <b>fewer than k</b>, so this tail keeps its original order${s < n ? ` (${cells.slice(s).join("→")})` : ""}.`
          : `A full block of ${k} exists at indexes ${s}…${s + k - 1} — it WILL be reversed.`)
        if (count < k) return s < n ? cells.slice(s).join("→") : "null"
        line(7, `Recurse first: reverseKGroup on the rest (from index ${node < n ? node : "null"}). This block will be stitched onto the <b>already-reversed</b> remainder.`)
        go(s + k)
        mark("window", Array.from({ length: k }, (_, i) => s + i))
        const orig = cells.slice(s, s + k)
        line(8, `Back in block [${orig.join("→")}]: cur = ${orig[0]}, prev = ${s + k < n ? `the finished rest's head (${cells[s + k]})` : "null"}.`)
        for (let j = 0; j < k; j++) {
          ptr("cur", s + j)
          line(11, `Rewire: ${orig[j]}.next → <b>${j === 0 ? (s + k < n ? `${cells[s + k]} (head of the finished rest)` : "null") : orig[j - 1]}</b>; prev = ${orig[j]}, cur moves on.`)
        }
        for (let j = 0; j < k; j++) {
          cells[s + j] = orig[k - 1 - j]
          aset(s + j, orig[k - 1 - j])
        }
        for (let j = 0; j < k; j++) good.push(s + j)
        mark("good", [...good])
        mark("window", [])
        ptr("cur", -1)
        line(15, `Block done: it now reads <b>${cells.slice(s, s + k).join("→")}</b>; its new head ${cells[s]} is returned to the caller.`)
        return cells.slice(s, s + k).join("→")
      },
      1,
    )
    narrate(`Reverse every full block of k=${k} nodes; a final group smaller than k stays untouched. The recursion probes block by block, then reverses on the way back — last block first.`)
    go(0)
    ptr("node", -1)
    return JSON.stringify(cells)
  },
}
