import type { SolutionDef } from "@/engine/types"

export const linkedListCycle: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// pos = index the tail's next links back to (-1 = none)
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow === fast) return true;  // they met — cycle!
  }
  return false;  // fast fell off the end — no cycle
}`,
  codeJava: `// pos = index the tail's next links back to (-1 = none)
boolean hasCycle(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow == fast) return true;   // they met — cycle!
  }
  return false;  // fast fell off the end — no cycle
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [3, 2, 0, 4, 8, 9], maxLen: 8 },
    { kind: "number", name: "pos", label: "pos (cycle entry index, -1 = none)", default: 2, min: -1, max: 7 },
  ],
  entry: (a) => `hasCycle([${(a.nums as number[]).join("→")}], pos=${a.pos})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const posRaw = args.pos as number
    const pos = posRaw >= 0 ? Math.min(posRaw, n - 1) : -1
    // next(i): the tail's next wraps back to pos (or null if pos = -1)
    const next = (i: number): number | null => (i + 1 < n ? i + 1 : pos >= 0 ? pos : null)
    const hasCycle = fn(
      "hasCycle",
      (): boolean => {
        if (n === 0) return false
        if (pos >= 0) {
          mark("window", Array.from({ length: n - pos }, (_, i) => pos + i))
          narrate(`The tail (${nums[n - 1]}) secretly links back to index ${pos} — the highlighted cells form the cycle. Walking past the last cell wraps back there.`)
        } else {
          narrate(`pos = -1: the tail's next is null — this list has a real end.`)
        }
        let slow = 0
        let fast: number | null = 0
        ptr("slow", 0); ptr("fast", 0)
        line(2, `slow and fast both start at the head (node ${nums[0]}).`)
        let guard = 0
        while (fast !== null && next(fast) !== null && guard++ < 2 * n + 4) {
          slow = next(slow) as number
          const f1 = next(fast) as number
          const wrapped = fast === n - 1 || f1 === n - 1
          fast = next(f1)
          ptr("slow", slow)
          ptr("fast", fast ?? -1)
          vars({ slow: nums[slow], fast: fast === null ? "null" : nums[fast] })
          line(4, `slow takes 1 step → node ${nums[slow]} (index ${slow}).`)
          line(5, `fast jumps 2 → ${fast === null ? "<b>null</b> — off the end" : `node ${nums[fast]} (index ${fast})${wrapped && pos >= 0 ? " — it <b>wrapped</b> through the tail's back-link to index " + pos + "!" : ""}`}.`)
          if (slow === fast) {
            mark("good", [slow])
            line(6, `slow and fast stand on the <b>same node</b> (${nums[slow]}). In a cycle fast gains one position on slow every step, so it must lap slow — meeting proves a cycle. Return <b>true</b>.`)
            return true
          }
        }
        line(8, `fast reached the end (${fast === null ? "fast is null" : `node ${nums[fast]} has no 2 steps left`}). A cyclic list has no end, so this list has <b>no cycle</b>. Return false.`)
        return false
      },
      1,
    )
    return hasCycle()
  },
}
