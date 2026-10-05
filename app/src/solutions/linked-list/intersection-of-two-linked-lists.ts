import type { SolutionDef } from "@/engine/types"

export const intersectionOfTwoLinkedLists: SolutionDef = {
  view: "array",
  // listA = a + shared, "·", listB = b + shared. The repeated shared values are the SAME physical nodes.
  array: (args) => {
    const a = args.a as number[]
    const b = args.b as number[]
    const s = args.shared as number[]
    return [...a, ...s, "·", ...b, ...s]
  },
  code: `// listA = a + shared, listB = b + shared (same tail nodes)
function getIntersectionNode(headA, headB) {
  let pA = headA, pB = headB;
  while (pA !== pB) {
    pA = (pA === null) ? headB : pA.next;  // switch heads
    pB = (pB === null) ? headA : pB.next;  // switch heads
  }
  return pA;   // the intersection node (or null)
}`,
  codeJava: `// listA = a + shared, listB = b + shared (same tail nodes)
ListNode getIntersectionNode(ListNode headA, ListNode headB) {
  ListNode pA = headA, pB = headB;
  while (pA != pB) {
    pA = (pA == null) ? headB : pA.next;   // switch heads
    pB = (pB == null) ? headA : pB.next;   // switch heads
  }
  return pA;   // the intersection node (or null)
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "listA's own nodes", default: [4, 1], maxLen: 4 },
    { kind: "numbers", name: "b", label: "listB's own nodes", default: [5, 6, 1], maxLen: 4 },
    { kind: "numbers", name: "shared", label: "shared tail", default: [8, 4, 5], maxLen: 4 },
  ],
  entry: (args) => {
    const a = args.a as number[]
    const b = args.b as number[]
    const s = args.shared as number[]
    return `getIntersectionNode([${[...a, ...s].join("→")}], [${[...b, ...s].join("→")}])`
  },
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const a = args.a as number[]
    const b = args.b as number[]
    const s = args.shared as number[]
    const lenA = a.length + s.length
    const lenB = b.length + s.length
    const offB = lenA + 1 // listB cells start after the "·" separator
    const valA = [...a, ...s]
    const valB = [...b, ...s]
    // logical node ids: the shared suffix is the SAME nodes in both lists
    const keysA = [...a.map((_, i) => `a${i}`), ...s.map((_, i) => `s${i}`)]
    const keysB = [...b.map((_, i) => `b${i}`), ...s.map((_, i) => `s${i}`)]

    interface P { onA: boolean; pos: number; isNull: boolean }
    const key = (p: P): string => (p.isNull ? "null" : (p.onA ? keysA[p.pos] : keysB[p.pos]))
    const cell = (p: P): number => (p.isNull ? -1 : (p.onA ? p.pos : offB + p.pos))
    const label = (p: P): string => (p.isNull ? "null" : `node ${p.onA ? valA[p.pos] : valB[p.pos]}`)

    const getIntersection = fn(
      "getIntersectionNode",
      (): string => {
        if (s.length > 0) {
          mark("window", [...s.map((_, i) => a.length + i), ...s.map((_, i) => offB + b.length + i)])
          narrate(`The highlighted cells with equal values are the <b>same physical nodes</b> — both lists share that tail. The array just has to draw them twice.`)
        }
        narrate(`The trick: pA walks listA then listB (a + c + b nodes); pB walks listB then listA (b + c + a nodes). <b>a+c+b = b+c+a</b>, so after the switch both are the same distance from the end — they meet exactly at the join (or at null together).`)
        const pA: P = { onA: true, pos: 0, isNull: lenA === 0 }
        const pB: P = { onA: false, pos: 0, isNull: lenB === 0 }
        ptr("pA", cell(pA))
        ptr("pB", cell(pB))
        line(2, `pA starts at headA (${label(pA)}), pB at headB (${label(pB)}).`)
        const step = (p: P, startOnA: boolean): string => {
          if (p.isNull) {
            p.onA = !startOnA
            p.pos = 0
            p.isNull = (p.onA ? lenA : lenB) === 0
            return `was null → <b>restarts at head${p.onA ? "A" : "B"}</b> (${label(p)}) — the lengths are now equalized`
          }
          const len = p.onA ? lenA : lenB
          if (p.pos + 1 < len) {
            p.pos++
            return `→ ${label(p)}`
          }
          p.isNull = true
          return `steps off list${p.onA ? "A" : "B"}'s tail → <b>null</b>`
        }
        let guard = 0
        while (key(pA) !== key(pB) && guard++ <= lenA + lenB + 2) {
          const mA = step(pA, true)
          ptr("pA", cell(pA))
          line(4, `pA ${mA}.`)
          const mB = step(pB, false)
          ptr("pB", cell(pB))
          line(5, `pB ${mB}.`)
          vars({ pA: label(pA), pB: label(pB) })
        }
        if (pA.isNull) {
          line(7, `pA and pB are both <b>null</b> at the same moment — after a+b nodes each, so the lists never intersect. Return null.`)
          return "null"
        }
        const sIdx = pA.pos - (pA.onA ? a.length : b.length)
        mark("good", [a.length + sIdx, offB + b.length + sIdx])
        line(7, `pA and pB stand on the <b>same node</b> (${s[sIdx]}) — shown twice in the array, but one physical node. That is the intersection.`)
        return `node ${s[sIdx]}`
      },
      1,
    )
    return getIntersection()
  },
}
