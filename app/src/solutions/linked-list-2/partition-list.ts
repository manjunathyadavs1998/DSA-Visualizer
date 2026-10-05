import type { SolutionDef } from "@/engine/types"

export const partitionList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nodes < x first, nodes >= x after (stable)
function partition(head, x) {
  const beforeD = { next: null }, afterD = { next: null };
  let before = beforeD, after = afterD;
  for (let cur = head; cur !== null; cur = cur.next) {
    if (cur.val < x) {
      before.next = cur; before = cur;  // < x chain
    } else {
      after.next = cur; after = cur;    // >= x chain
    }
  }
  after.next = null;             // seal the tail
  before.next = afterD.next;     // stitch chains
  return beforeD.next;
}`,
  codeJava: `// nodes < x first, nodes >= x after (stable)
ListNode partition(ListNode head, int x) {
  ListNode beforeD = new ListNode(0), afterD = new ListNode(0);
  ListNode before = beforeD, after = afterD;
  for (ListNode cur = head; cur != null; cur = cur.next) {
    if (cur.val < x) {
      before.next = cur; before = cur;  // < x chain
    } else {
      after.next = cur; after = cur;    // >= x chain
    }
  }
  after.next = null;             // seal the tail
  before.next = afterD.next;     // stitch chains
  return beforeD.next;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 4, 3, 2, 5, 2], maxLen: 10 },
    { kind: "number", name: "x", label: "x (pivot)", default: 3, min: -9, max: 20 },
  ],
  entry: (a) => `partition([${(a.nums as number[]).join("→")}], ${a.x})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const x = args.x as number
    const before: number[] = []
    const after: number[] = []
    const beforeIdx: number[] = []
    const afterIdx: number[] = []
    let result: number[] = []
    const partition = fn(
      "partition",
      (): string => {
        line(2, `Two dummy heads: a <b>before</b> chain for values < ${x} and an <b>after</b> chain for values ≥ ${x}. We never swap nodes — we just deal each one onto a pile.`)
        heap("before", [...before])
        heap("after", [...after])
        for (let cur = 0; cur < nums.length; cur++) {
          ptr("cur", cur)
          mark("focus", [cur])
          vars({ "cur.val": nums[cur], x })
          if (nums[cur] < x) {
            before.push(nums[cur])
            beforeIdx.push(cur)
            heap("before", [...before])
            mark("good", [...beforeIdx])
            line(6, `${nums[cur]} < ${x} → append to the <b>before</b> chain: ${before.join("→")}. Order inside the chain is preserved (stable).`)
          } else {
            after.push(nums[cur])
            afterIdx.push(cur)
            heap("after", [...after])
            mark("window", [...afterIdx])
            line(8, `${nums[cur]} ≥ ${x} → append to the <b>after</b> chain: ${after.join("→")}.`)
          }
        }
        ptr("cur", -1)
        mark("focus", [])
        line(11, `Seal the after chain: ${after.length > 0 ? `${after[after.length - 1]}.next = <b>null</b>` : "it is empty"} — otherwise its old next could create a <b>cycle</b>.`)
        result = [...before, ...after]
        heap("result", result)
        line(12, `Stitch: ${before.length > 0 ? before[before.length - 1] : "beforeD"}.next = ${after.length > 0 ? after[0] : "null"} — the two chains become <b>${result.join("→")}</b>.`)
        line(13, `Return beforeD.next: everything < ${x} (green) precedes everything ≥ ${x}, both in original order.`)
        return result.join("→")
      },
      1,
    )
    partition()
    return JSON.stringify(result)
  },
}
