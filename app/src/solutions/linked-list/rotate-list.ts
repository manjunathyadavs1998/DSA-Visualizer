import type { SolutionDef } from "@/engine/types"

export const rotateList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums = the list; k = editable below
function rotateRight(head, k) {
  if (head === null) return head;
  let n = 1, tail = head;
  while (tail.next !== null) { tail = tail.next; n++; }
  k = k % n;
  if (k === 0) return head;  // full spins change nothing
  let cur = head;            // find the new tail:
  for (let i = 0; i < n - k - 1; i++) cur = cur.next;
  const newHead = cur.next;  // last k nodes move to front
  cur.next = null;           // cut here
  tail.next = head;          // old tail wraps to old head
  return newHead;
}`,
  codeJava: `// int[] nums = the list; int k = editable below
ListNode rotateRight(ListNode head, int k) {
  if (head == null) return head;
  int n = 1; ListNode tail = head;
  while (tail.next != null) { tail = tail.next; n++; }
  k = k % n;
  if (k == 0) return head;   // full spins change nothing
  ListNode cur = head;       // find the new tail:
  for (int i = 0; i < n - k - 1; i++) cur = cur.next;
  ListNode newHead = cur.next; // last k nodes → front
  cur.next = null;           // cut here
  tail.next = head;          // old tail wraps to old head
  return newHead;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6], maxLen: 10 },
    { kind: "number", name: "k", label: "k (rotate right by)", default: 2, min: 0, max: 20 },
  ],
  entry: (a) => `rotateRight([${(a.nums as number[]).join("→")}], ${a.k})`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const kIn = args.k as number
    const kEff = n === 0 ? 0 : kIn % n
    const rotated = [...nums.slice(n - kEff), ...nums.slice(0, n - kEff)]
    const rotateRight = fn(
      "rotateRight",
      (): string => {
        if (n === 0) {
          line(2, `head is null — nothing to rotate.`)
          return "null"
        }
        let tail = 0
        let count = 1
        ptr("tail", 0)
        line(3, `Pass 1 — measure: tail starts at the head, n = 1.`)
        while (tail + 1 < n) {
          tail++
          count++
          ptr("tail", tail)
          line(4, `tail → node ${nums[tail]}; n = ${count}.`)
        }
        const k = kIn % n
        vars({ n, k })
        line(5, `k = ${kIn} % ${n} = <b>${k}</b>${kIn >= n ? " — every n rotations is a full spin that changes nothing, so only the remainder matters" : ""}.`)
        if (k === 0) {
          line(6, `k is 0 — the list is unchanged: ${nums.join("→")}.`)
          return nums.join("→")
        }
        let cur = 0
        ptr("cur", 0)
        line(7, `Pass 2 — the new tail is the node before the last ${k}: walk cur to index n−k−1 = ${n - k - 1}.`)
        for (let i = 0; i < n - k - 1; i++) {
          cur++
          ptr("cur", cur)
          line(8, `cur → node ${nums[cur]} (step ${i + 1} of ${n - k - 1}).`)
        }
        mark("window", Array.from({ length: k }, (_, i) => n - k + i))
        line(9, `newHead = cur.next = <b>${nums[n - k]}</b> — the highlighted suffix of ${k} node(s) moves to the front.`)
        line(10, `Cut: ${nums[n - k - 1]}.next = null — the list splits after the new tail.`)
        line(11, `Wrap: old tail ${nums[n - 1]}.next = old head ${nums[0]} — the suffix now leads straight into the old prefix.`)
        for (let i = 0; i < n; i++) aset(i, rotated[i])
        mark("good", Array.from({ length: k }, (_, i) => i))
        mark("window", [])
        ptr("cur", -1)
        ptr("tail", -1)
        line(12, `Return newHead — the list reads <b>${rotated.join("→")}</b>.`)
        return rotated.join("→")
      },
      1,
    )
    rotateRight()
    return JSON.stringify(rotated)
  },
}
