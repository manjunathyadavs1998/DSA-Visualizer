import type { SolutionDef } from "@/engine/types"

export const deleteNodeInALinkedList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// you are given ONLY this node — no head, no prev
function deleteNode(node) {
  node.val = node.next.val;     // become your successor
  node.next = node.next.next;   // skip the successor
}`,
  codeJava: `// you are given ONLY this node — no head, no prev
void deleteNode(ListNode node) {
  node.val = node.next.val;     // become your successor
  node.next = node.next.next;   // skip the successor
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [4, 5, 1, 9], maxLen: 10 },
    { kind: "number", name: "node", label: "index of node to delete (not the tail)", default: 1, min: 0, max: 8 },
  ],
  entry: (a) => {
    const nums = a.nums as number[]
    const idx = Math.min(Math.max(a.node as number, 0), Math.max(nums.length - 2, 0))
    return `deleteNode(node ${nums[idx] ?? "?"})`
  },
  run({ fn, line, ptr, mark, aset, narrate }, args) {
    const nums = args.nums as number[]
    const len = nums.length
    const idxRaw = args.node as number
    const idx = Math.min(Math.max(idxRaw, 0), Math.max(len - 2, 0))
    const deleteNode = fn(
      "deleteNode",
      (): string => {
        if (len < 2) return "list too short — nothing to demo"
        if (idx !== idxRaw) narrate(`Index ${idxRaw} is out of range (the tail can never be deleted this way) — clamped to ${idx}.`)
        ptr("node", idx)
        narrate(`Delete node <b>${nums[idx]}</b> — but we hold ONLY this node. In a singly linked list there is <b>no way back</b>: unlinking normally needs prev.next = node.next, and prev is unreachable from here. You can't go back.`)
        narrate(`The insight: a node's identity is just its <b>value</b>. If you can't remove yourself, <b>become your successor</b> — then remove <i>it</i>, which you CAN reach.`)
        mark("focus", [idx, idx + 1])
        line(2, `Copy the successor's value: node.val = ${nums[idx + 1]}. The cell at index ${idx} now reads <b>${nums[idx + 1]}</b> — the value ${nums[idx]} is gone from the list.`)
        aset(idx, nums[idx + 1])
        line(3, `Skip the successor: node.next = node.next.next. The old <b>${nums[idx + 1]}</b> node (index ${idx + 1}) is unlinked — nothing points to it anymore.`)
        aset(idx + 1, "×")
        mark("bad", [idx + 1])
        mark("focus", [])
        const result = nums.filter((_, i) => i !== idx + 1)
        result[idx] = nums[idx + 1]
        narrate(`The list now reads <b>${result.join("→")}</b> — exactly as if ${nums[idx]} had been deleted, in O(1), without ever seeing the head.`)
        return result.join("→")
      },
      1,
    )
    deleteNode()
    if (len < 2) return JSON.stringify(nums)
    const result = nums.filter((_, i) => i !== idx + 1)
    result[idx] = nums[idx + 1]
    return JSON.stringify(result)
  },
}
