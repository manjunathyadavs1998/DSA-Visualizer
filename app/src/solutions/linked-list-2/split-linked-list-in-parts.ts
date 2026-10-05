import type { SolutionDef } from "@/engine/types"

export const splitLinkedListInParts: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// split into k parts; sizes differ by at most 1
function splitListToParts(head, k) {
  let n = 0;
  for (let p = head; p !== null; p = p.next) n++;
  const base = Math.floor(n / k), extra = n % k;
  const parts = new Array(k).fill(null);
  let cur = head;
  for (let i = 0; i < k; i++) {
    parts[i] = cur;
    const size = base + (i < extra ? 1 : 0);
    for (let j = 1; j < size; j++) cur = cur.next;
    if (cur !== null) {
      const next = cur.next;
      cur.next = null;        // cut this part free
      cur = next;
    }
  }
  return parts;
}`,
  codeJava: `// split into k parts; sizes differ by at most 1
ListNode[] splitListToParts(ListNode head, int k) {
  int n = 0;
  for (ListNode p = head; p != null; p = p.next) n++;
  int base = n / k, extra = n % k;
  ListNode[] parts = new ListNode[k];
  ListNode cur = head;
  for (int i = 0; i < k; i++) {
    parts[i] = cur;
    int size = base + (i < extra ? 1 : 0);
    for (int j = 1; j < size; j++) cur = cur.next;
    if (cur != null) {
      ListNode next = cur.next;
      cur.next = null;        // cut this part free
      cur = next;
    }
  }
  return parts;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], maxLen: 12 },
    { kind: "number", name: "k", label: "k (parts)", default: 3, min: 1, max: 8 },
  ],
  entry: (a) => `splitListToParts([${(a.nums as number[]).join("→")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), 8)
    const parts: string[] = []
    const splitListToParts = fn(
      "splitListToParts",
      (): string => {
        line(3, `<b>Pass 1 — count.</b> Walk the list once: n = <b>${n}</b>.`)
        const base = Math.floor(n / k)
        const extra = n % k
        vars({ n, k, base, extra })
        line(4, `base = ⌊${n}/${k}⌋ = <b>${base}</b>, extra = ${n} % ${k} = <b>${extra}</b> → the first ${extra} part${extra === 1 ? "" : "s"} get${extra === 1 ? "s" : ""} one bonus node (earlier parts must be the bigger ones).`)
        line(5, `Prepare ${k} empty slots${k > n ? ` — more parts than nodes, so ${k - n} slot${k - n === 1 ? "" : "s"} will stay <b>null</b>` : ""}.`)
        heap("parts", [...parts])
        let cur = 0 // index of the next unassigned node; n = null
        ptr("cur", cur < n ? cur : -1)
        const kinds = ["good", "window", "done"] as const
        const kindIdx: Record<string, number[]> = { good: [], window: [], done: [] }
        for (let i = 0; i < k; i++) {
          const size = base + (i < extra ? 1 : 0)
          line(8, `parts[${i}] starts at ${cur < n ? `node <b>${nums[cur]}</b>` : "<b>null</b> — no nodes left"}.`)
          line(9, `size = ${base}${i < extra ? ` + 1 (bonus)` : ""} = <b>${size}</b>.`)
          const startIdx = cur
          if (size > 0) {
            for (let j = 1; j < size; j++) {
              cur++
              ptr("cur", cur)
              line(10, `cur walks to node <b>${nums[cur]}</b> (${j + 1}/${size} of this part).`)
            }
            const kind = kinds[i % 3]
            kindIdx[kind].push(...Array.from({ length: size }, (_, x) => startIdx + x))
            mark(kind, [...kindIdx[kind]])
            parts.push(nums.slice(startIdx, startIdx + size).join("→"))
            heap("parts", [...parts])
            const next = startIdx + size
            line(12, `Remember next = ${next < n ? `node ${nums[next]}` : "null"}, then…`)
            line(13, `<b>Cut:</b> ${nums[startIdx + size - 1]}.next = null → parts[${i}] = [${parts[i]}].`)
            cur = next
            ptr("cur", cur < n ? cur : -1)
            line(14, `cur jumps to ${cur < n ? `node <b>${nums[cur]}</b>` : "<b>null</b>"} — the start of the next part.`)
          } else {
            parts.push("null")
            heap("parts", [...parts])
            line(11, `cur is already <b>null</b> → parts[${i}] stays <b>null</b> (an empty part).`)
          }
        }
        line(17, `All ${k} parts cut: ${parts.map((p) => `[${p}]`).join(", ")} — sizes differ by at most 1, bigger parts first.`)
        return parts.map((p) => `[${p}]`).join(", ")
      },
      1,
    )
    splitListToParts()
    return JSON.stringify(parts)
  },
}
