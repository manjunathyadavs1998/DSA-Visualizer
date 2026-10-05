import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,...] → disjoint sorted pairs (s ≤ e, sorted by start). */
const toList = (flat: number[], fallback: [number, number][]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) return fallback
  return out.sort((p, q) => p[0] - q[0])
}

const FALL_A: [number, number][] = [[0, 2], [5, 10], [13, 23], [24, 25]]
const FALL_B: [number, number][] = [[1, 5], [8, 12], [15, 24], [25, 26]]

export const intervalListIntersections: SolutionDef = {
  view: "array",
  array: (a) => {
    const A = toList(a.firstList as number[], FALL_A)
    const B = toList(a.secondList as number[], FALL_B)
    return [...A.map(([s, e]) => `A ${s}–${e}`), "‖", ...B.map(([s, e]) => `B ${s}–${e}`)]
  },
  code: `// two pointers; always retire the interval that ends first
function intervalIntersection(A, B) {
  const res = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    const lo = Math.max(A[i][0], B[j][0]);  // latest start
    const hi = Math.min(A[i][1], B[j][1]);  // earliest end
    if (lo <= hi) res.push([lo, hi]);       // real overlap
    if (A[i][1] < B[j][1]) i++;   // A[i] can't overlap more of B
    else j++;                     // B[j] can't overlap more of A
  }
  return res;
}`,
  codeJava: `// two pointers; always retire the interval that ends first
List<int[]> intervalIntersection(int[][] A, int[][] B) {
  List<int[]> res = new ArrayList<>();
  int i = 0, j = 0;
  while (i < A.length && j < B.length) {
    int lo = Math.max(A[i][0], B[j][0]);    // latest start
    int hi = Math.min(A[i][1], B[j][1]);    // earliest end
    if (lo <= hi) res.add(new int[]{lo, hi});  // real overlap
    if (A[i][1] < B[j][1]) i++;   // A[i] can't overlap more of B
    else j++;                     // B[j] can't overlap more of A
  }
  return res;
}`,
  inputs: [
    {
      kind: "numbers", name: "firstList", label: "firstList (flat [s,e] pairs: 0,2,5,10 = [0,2],[5,10])",
      default: [0, 2, 5, 10, 13, 23, 24, 25], maxLen: 12,
    },
    {
      kind: "numbers", name: "secondList", label: "secondList (flat [s,e] pairs)",
      default: [1, 5, 8, 12, 15, 24, 25, 26], maxLen: 12,
    },
  ],
  entry: (a) => {
    const A = toList(a.firstList as number[], FALL_A)
    const B = toList(a.secondList as number[], FALL_B)
    return `intervalIntersection([${A.map((p) => `[${p.join(",")}]`).join(",")}], [${B.map((p) => `[${p.join(",")}]`).join(",")}])`
  },
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const A = toList(args.firstList as number[], FALL_A)
    const B = toList(args.secondList as number[], FALL_B)
    const off = A.length + 1 // B cells start after the "‖" separator
    const solve = fn(
      "intervalIntersection",
      (): string => {
        const res: [number, number][] = []
        let i = 0
        let j = 0
        heap("output", [])
        line(3, `Both lists are sorted and internally disjoint — one pointer per list is enough.`)
        while (i < A.length && j < B.length) {
          ptr("i", i)
          ptr("j", off + j)
          mark("focus", [i, off + j])
          const lo = Math.max(A[i][0], B[j][0])
          line(5, `A[${i}]=[${A[i].join(",")}], B[${j}]=[${B[j].join(",")}]: latest start lo = max(${A[i][0]}, ${B[j][0]}) = <b>${lo}</b>.`)
          const hi = Math.min(A[i][1], B[j][1])
          line(6, `Earliest end hi = min(${A[i][1]}, ${B[j][1]}) = <b>${hi}</b>.`)
          if (lo <= hi) {
            res.push([lo, hi])
            heap("output", res.map((p) => `[${p.join(",")}]`))
            line(7, `lo ≤ hi → they overlap on <b>[${lo},${hi}]</b> — record it (intersection #${res.length}).`)
          } else {
            line(7, `lo > hi → an empty gap, no intersection here.`)
          }
          vars({ i, j, found: res.length })
          if (A[i][1] < B[j][1]) {
            mark("done", Array.from({ length: i + 1 }, (_, k) => k))
            i++
            line(8, `A's interval ends first (${A[i - 1][1]} < ${B[j][1]}) — it can never touch a later B → advance <b>i</b>.`)
          } else {
            mark("done", Array.from({ length: j + 1 }, (_, k) => off + k))
            j++
            line(9, `B's interval ends first (or ties) — advance <b>j</b>.`)
          }
        }
        ptr("i", -1)
        ptr("j", -1)
        mark("focus", [])
        line(11, `One list is exhausted. Intersections: <b>${res.length ? res.map((p) => `[${p.join(",")}]`).join(" ") : "none"}</b>.`)
        return `[${res.map((p) => `[${p.join(",")}]`).join(",")}]`
      },
      1,
    )
    narrate(`The cell row shows list A, a divider ‖, then list B. Overlap test in one line: max(starts) ≤ min(ends).`)
    return solve()
  },
}
