import type { SolutionDef } from "@/engine/types"

export const sortList: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// merge sort: split at the middle, sort, merge
function sortList(head) {
  if (head === null || head.next === null) return head;
  let slow = head, fast = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next; fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;              // cut into halves
  const left = sortList(head);   // sort front half
  const right = sortList(mid);   // sort back half
  return merge(left, right);     // sorted two-list merge
}`,
  codeJava: `// merge sort: split at the middle, sort, merge
ListNode sortList(ListNode head) {
  if (head == null || head.next == null) return head;
  ListNode slow = head, fast = head.next;
  while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
  }
  ListNode mid = slow.next;
  slow.next = null;              // cut into halves
  ListNode left = sortList(head);  // sort front half
  ListNode right = sortList(mid);  // sort back half
  return merge(left, right);     // sorted two-list merge
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "list nodes", default: [4, 2, 1, 3, 7, 5, 6], maxLen: 10 }],
  entry: (a) => `sortList([${(a.nums as number[]).join("→")}])`,
  run({ fn, line, ptr, mark, vars, heap, aset }, args) {
    const nums = args.nums as number[]
    let result: number[] = []
    // sortList works on the segment of ORIGINAL positions [lo..hi]; the sorted
    // values are written back into those cells so the view shows the recursion.
    const sortSeg: (lo: number, hi: number, vals: number[]) => number[] = fn(
      "sortList",
      (lo: number, hi: number, vals: number[]): number[] => {
        mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => lo + x))
        vars({ list: vals.join("→") })
        if (vals.length <= 1) {
          line(2, `[${vals.join("→")}] has ${vals.length} node${vals.length === 1 ? "" : "s"} — already sorted, <b>return it as-is</b> (base case).`)
          return vals
        }
        line(2, `[${vals.join("→")}] has ${vals.length} nodes — must split.`)
        // slow/fast on this segment: slow=0, fast=1, step until fast falls off
        let slow = lo
        let fast = lo + 1
        ptr("slow", slow)
        ptr("fast", fast)
        line(3, `slow = ${vals[0]}, fast = ${vals[1]} (one ahead, so slow stops at the <b>end of the front half</b>).`)
        while (fast <= hi && fast + 1 <= hi) {
          slow += 1
          fast += 2
          ptr("slow", slow)
          ptr("fast", fast <= hi ? fast : -1)
          line(5, `slow → <b>${vals[slow - lo]}</b>, fast → ${fast <= hi ? `<b>${vals[fast - lo]}</b>` : "<b>null</b>"}.`)
        }
        const cut = slow - lo
        line(7, `mid = slow.next = node <b>${vals[cut + 1]}</b>.`)
        line(8, `Cut: ${vals[cut]}.next = null → halves [${vals.slice(0, cut + 1).join("→")}] and [${vals.slice(cut + 1).join("→")}].`)
        ptr("slow", -1)
        ptr("fast", -1)
        line(9, `Recurse on the front half [${vals.slice(0, cut + 1).join("→")}]…`)
        const left = sortSeg(lo, lo + cut, vals.slice(0, cut + 1))
        line(10, `Recurse on the back half [${vals.slice(cut + 1).join("→")}]…`)
        const right = sortSeg(lo + cut + 1, hi, vals.slice(cut + 1))
        // merge the two sorted halves, narrating each comparison
        mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => lo + x))
        const merged: number[] = []
        let i = 0
        let j = 0
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            merged.push(left[i])
            line(11, `merge: ${left[i]} ≤ ${right[j]} → take <b>${left[i]}</b> from the left half → ${merged.join("→")}.`)
            i++
          } else {
            merged.push(right[j])
            line(11, `merge: ${right[j]} < ${left[i]} → take <b>${right[j]}</b> from the right half → ${merged.join("→")}.`)
            j++
          }
        }
        while (i < left.length) merged.push(left[i++])
        while (j < right.length) merged.push(right[j++])
        for (let k = 0; k < merged.length; k++) aset(lo + k, merged[k])
        heap("merged segment", [...merged])
        line(11, `Leftovers appended — segment [${lo}..${hi}] is now sorted: <b>${merged.join("→")}</b>.`)
        return merged
      },
      1,
    )
    result = nums.length > 0 ? sortSeg(0, nums.length - 1, [...nums]) : []
    mark("good", Array.from({ length: nums.length }, (_, x) => x))
    return JSON.stringify(result)
  },
}
