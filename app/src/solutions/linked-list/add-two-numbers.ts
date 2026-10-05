import type { SolutionDef } from "@/engine/types"

const digits = (v: unknown): number[] => (v as number[]).map((x) => Math.abs(Math.trunc(x)) % 10)
const asNumber = (d: number[]): string => (d.length > 0 ? [...d].reverse().join("") : "0")

export const addTwoNumbers: SolutionDef = {
  view: "array",
  array: (a) => [...digits(a.l1), "·", ...digits(a.l2)],
  code: `// digits are stored in REVERSE: 2→4→3 means 342
function addTwoNumbers(l1, l2) {
  const dummy = new Node(0);
  let tail = dummy, p1 = l1, p2 = l2, carry = 0;
  while (p1 !== null || p2 !== null || carry > 0) {
    const a = (p1 !== null) ? p1.val : 0;
    const b = (p2 !== null) ? p2.val : 0;
    const sum = a + b + carry;
    carry = Math.floor(sum / 10);
    tail.next = new Node(sum % 10);  // one result digit
    tail = tail.next;
    if (p1 !== null) p1 = p1.next;
    if (p2 !== null) p2 = p2.next;
  }
  return dummy.next;
}`,
  codeJava: `// digits are stored in REVERSE: 2→4→3 means 342
ListNode addTwoNumbers(ListNode l1, ListNode l2) {
  ListNode dummy = new ListNode(0);
  ListNode tail = dummy, p1 = l1, p2 = l2; int carry = 0;
  while (p1 != null || p2 != null || carry > 0) {
    int a = (p1 != null) ? p1.val : 0;
    int b = (p2 != null) ? p2.val : 0;
    int sum = a + b + carry;
    carry = sum / 10;
    tail.next = new ListNode(sum % 10); // one result digit
    tail = tail.next;
    if (p1 != null) p1 = p1.next;
    if (p2 != null) p2 = p2.next;
  }
  return dummy.next;
}`,
  inputs: [
    { kind: "numbers", name: "l1", label: "l1 digits (ones first)", default: [2, 4, 3], maxLen: 5 },
    { kind: "numbers", name: "l2", label: "l2 digits (ones first)", default: [5, 6, 4], maxLen: 5 },
  ],
  entry: (a) => `addTwoNumbers([${digits(a.l1).join("→")}], [${digits(a.l2).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const d1 = digits(args.l1)
    const d2 = digits(args.l2)
    const off = d1.length + 1 // l2 cells start after the "·" separator
    const result: number[] = []
    const addTwo = fn(
      "addTwoNumbers",
      (): string => {
        narrate(`Why reversed storage? l1 = ${d1.join("→")} is the number <b>${asNumber(d1)}</b>, l2 = ${d2.join("→")} is <b>${asNumber(d2)}</b>. Grade-school addition starts at the <b>ones place</b> — and that's exactly the first node, so we just walk forward and let the carry ride along.`)
        line(3, `tail on a dummy node; p1 and p2 on the ones digits; carry = 0.`)
        let i = 0
        let j = 0
        let carry = 0
        const done: number[] = []
        ptr("p1", d1.length > 0 ? 0 : -1)
        ptr("p2", d2.length > 0 ? off : -1)
        heap("result", result)
        while (i < d1.length || j < d2.length || carry > 0) {
          const a = i < d1.length ? d1[i] : 0
          const b = j < d2.length ? d2[j] : 0
          const focus: number[] = []
          if (i < d1.length) focus.push(i)
          if (j < d2.length) focus.push(off + j)
          mark("focus", focus)
          const sum = a + b + carry
          vars({ a, b, carry, sum })
          line(7, `Column ${result.length + 1}: sum = a + b + carry = ${a} + ${b} + ${carry} = <b>${sum}</b>${i >= d1.length && j >= d2.length ? " (both lists done — this is a pure carry column)" : ""}.`)
          carry = Math.floor(sum / 10)
          line(8, `carry = ⌊${sum} / 10⌋ = <b>${carry}</b>${carry > 0 ? " — it rides into the next column, just like on paper" : ""}.`)
          result.push(sum % 10)
          heap("result", result)
          line(9, `Write the digit <b>${sum % 10}</b> (${sum} mod 10) to the result: ${result.join("→")}.`)
          if (i < d1.length) { done.push(i); i++ }
          if (j < d2.length) { done.push(off + j); j++ }
          mark("done", [...done])
          ptr("p1", i < d1.length ? i : -1)
          ptr("p2", j < d2.length ? off + j : -1)
        }
        mark("focus", [])
        line(14, `Nothing left and carry = 0. Result digits ${result.join("→")} read reversed = <b>${asNumber(result)}</b> (${asNumber(d1)} + ${asNumber(d2)}).`)
        return asNumber(result)
      },
      1,
    )
    addTwo()
    return JSON.stringify(result)
  },
}
