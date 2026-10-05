import type { SolutionDef } from "@/engine/types"

export const linkedListCycleII: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// pos = index the tail's next links back to (-1 = none)
function detectCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;           // 1 step
    fast = fast.next.next;      // 2 steps
    if (slow === fast) {        // met inside the cycle
      slow = head;              // phase 2: reset slow
      while (slow !== fast) {   // both walk 1 step now
        slow = slow.next; fast = fast.next;
      }
      return slow;              // the cycle's entry node
    }
  }
  return null;   // no cycle
}`,
  codeJava: `// pos = index the tail's next links back to (-1 = none)
ListNode detectCycle(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;           // 1 step
    fast = fast.next.next;      // 2 steps
    if (slow == fast) {         // met inside the cycle
      slow = head;              // phase 2: reset slow
      while (slow != fast) {    // both walk 1 step now
        slow = slow.next; fast = fast.next;
      }
      return slow;              // the cycle's entry node
    }
  }
  return null;   // no cycle
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "list nodes", default: [3, 2, 0, 4, 8], maxLen: 8 },
    { kind: "number", name: "pos", label: "pos (cycle entry index, -1 = none)", default: 1, min: -1, max: 7 },
  ],
  entry: (a) => `detectCycle([${(a.nums as number[]).join("→")}], pos=${a.pos})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    const posRaw = args.pos as number
    const pos = posRaw >= 0 ? Math.min(posRaw, n - 1) : -1
    const next = (i: number): number | null => (i + 1 < n ? i + 1 : pos >= 0 ? pos : null)
    const detectCycle = fn(
      "detectCycle",
      (): string => {
        if (n === 0) return "null"
        if (pos >= 0) {
          mark("window", Array.from({ length: n - pos }, (_, i) => pos + i))
          narrate(`The tail links back to index ${pos} — the highlighted cells are the cycle. Call head→entry = <b>a</b> nodes, cycle length = <b>c</b>.`)
        }
        let slow = 0
        let fast: number | null = 0
        ptr("slow", 0); ptr("fast", 0)
        line(2, `Phase 1 (Floyd): slow ×1 and fast ×2 both start at the head.`)
        let guard = 0
        while (fast !== null && next(fast) !== null && guard++ < 2 * n + 4) {
          slow = next(slow) as number
          fast = next(next(fast) as number)
          ptr("slow", slow)
          ptr("fast", fast ?? -1)
          vars({ slow: nums[slow], fast: fast === null ? "null" : nums[fast] })
          line(4, `slow → node ${nums[slow]} (index ${slow}).`)
          line(5, `fast → ${fast === null ? "<b>null</b>" : `node ${nums[fast]} (index ${fast})`}.`)
          if (slow === fast) {
            mark("focus", [slow])
            line(6, `They <b>met</b> at node ${nums[slow]} (index ${slow}) — a cycle exists. Say the meeting point is <b>b</b> nodes past the entry.`)
            narrate(`The distance math: slow walked a + b; fast walked 2(a + b), and their difference (a + b) must be whole laps: a + b = m·c. So <b>a = m·c − b</b> — walking a steps from the meeting point (around the loop) lands exactly on the entry. So walk one pointer from head, one from the meeting point, both ×1: they collide at the entry.`)
            slow = 0
            ptr("slow", 0)
            line(7, `Phase 2: reset slow to the head; fast stays at the meeting point. Both now walk <b>1 step</b> at a time.`)
            let g2 = 0
            while (slow !== fast && g2++ < 2 * n + 4) {
              slow = next(slow) as number
              fast = next(fast as number)
              ptr("slow", slow)
              ptr("fast", fast ?? -1)
              line(9, `slow → node ${nums[slow]}; fast → node ${nums[fast as number]}. Both cover the same remaining distance a.`)
            }
            mark("good", [slow])
            mark("focus", [])
            line(11, `They meet again at index <b>${slow}</b> (node ${nums[slow]}) — the cycle's entry, exactly pos = ${pos}.`)
            return `entry = node ${nums[slow]} (index ${slow})`
          }
        }
        line(14, `fast fell off the end — no cycle, so there is no entry. Return null.`)
        return "null"
      },
      1,
    )
    return detectCycle()
  },
}
