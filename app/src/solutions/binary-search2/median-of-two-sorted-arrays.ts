import type { Args, SolutionDef } from "@/engine/types"

const NEG = -Infinity, POS = Infinity
const show = (v: number) => (v === NEG ? "-∞" : v === POS ? "+∞" : String(v))

const getAB = (args: Args): [number[], number[]] => {
  let A = args.a as number[]
  let B = args.b as number[]
  if (A.length > B.length) [A, B] = [B, A]
  return [A, B]
}

export const medianTwoSorted: SolutionDef = {
  view: "array",
  array: (args) => {
    const [A, B] = getAB(args)
    return [...A, "·", ...B]
  },
  code: `// binary search the cut of the smaller array A
function findMedian(A, B) {
  let lo = 0, hi = A.length;
  const half = (A.length + B.length + 1) >> 1;
  while (lo <= hi) {
    const cut1 = (lo + hi) >> 1;
    const cut2 = half - cut1;
    const l1 = cut1 > 0 ? A[cut1 - 1] : -Infinity;
    const r1 = cut1 < A.length ? A[cut1] : Infinity;
    const l2 = cut2 > 0 ? B[cut2 - 1] : -Infinity;
    const r2 = cut2 < B.length ? B[cut2] : Infinity;
    if (l1 <= r2 && l2 <= r1) {
      if ((A.length + B.length) % 2 === 1) return Math.max(l1, l2);
      return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
    }
    if (l1 > r2) hi = cut1 - 1;   // A gave too many
    else lo = cut1 + 1;           // A gave too few
  }
  return -1; // unreachable — a valid cut always exists
}`,
  codeJava: `// binary search the cut of the smaller array A
double findMedian(int[] A, int[] B) {
  int lo = 0, hi = A.length;
  int half = (A.length + B.length + 1) / 2;
  while (lo <= hi) {
    int cut1 = (lo + hi) / 2;
    int cut2 = half - cut1;
    int l1 = cut1 > 0 ? A[cut1 - 1] : Integer.MIN_VALUE;
    int r1 = cut1 < A.length ? A[cut1] : Integer.MAX_VALUE;
    int l2 = cut2 > 0 ? B[cut2 - 1] : Integer.MIN_VALUE;
    int r2 = cut2 < B.length ? B[cut2] : Integer.MAX_VALUE;
    if (l1 <= r2 && l2 <= r1) {
      if ((A.length + B.length) % 2 == 1) return Math.max(l1, l2);
      return (Math.max(l1, l2) + Math.min(r1, r2)) / 2.0;
    }
    if (l1 > r2) hi = cut1 - 1;   // A gave too many
    else lo = cut1 + 1;           // A gave too few
  }
  return -1; // unreachable — a valid cut always exists
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "sorted A", default: [1, 3, 8], maxLen: 5 },
    { kind: "numbers", name: "b", label: "sorted B", default: [2, 4, 6, 9], maxLen: 6 },
  ],
  entry: () => `findMedian(A, B)  // cells: A · B`,
  run({ fn, line, ptr, mark, vars }, args) {
    const [A, B] = getAB(args)
    const n1 = A.length, n2 = B.length
    const go = fn(
      "findMedian",
      (): number => {
        let lo = 0, hi = n1
        const half = (n1 + n2 + 1) >> 1
        vars({ lo, hi, half })
        line(3, `A is the smaller array (${n1} vs ${n2}). A merged sort has ${n1 + n2} values, so its left half holds <b>${half}</b>. Take cut1 from A, and cut2 = ${half} − cut1 from B — only cut1 needs searching.`)
        while (lo <= hi) {
          const cut1 = (lo + hi) >> 1
          const cut2 = half - cut1
          ptr("cut1", cut1)
          ptr("cut2", cut2 < n2 ? n1 + 1 + cut2 : -1)
          const left: number[] = []
          for (let i = 0; i < cut1; i++) left.push(i)
          for (let i = 0; i < cut2; i++) left.push(n1 + 1 + i)
          const right: number[] = []
          for (let i = cut1; i < n1; i++) right.push(i)
          for (let i = cut2; i < n2; i++) right.push(n1 + 1 + i)
          mark("good", left); mark("window", right)
          line(5, `Cut A before index <b>${cut1}</b>: its first ${cut1} value(s) go to the left side.`)
          line(6, `Then B must supply the rest: cut2 = ${half} − ${cut1} = <b>${cut2}</b>.`)
          const l1 = cut1 > 0 ? A[cut1 - 1] : NEG
          const r1 = cut1 < n1 ? A[cut1] : POS
          const l2 = cut2 > 0 ? B[cut2 - 1] : NEG
          const r2 = cut2 < n2 ? B[cut2] : POS
          vars({ cut1, cut2, l1: show(l1), r1: show(r1), l2: show(l2), r2: show(r2) })
          line(11, `Border values: l1 = ${show(l1)}, r1 = ${show(r1)}, l2 = ${show(l2)}, r2 = ${show(r2)}. The cut is correct iff <b>everything on the left ≤ everything on the right</b> — i.e. l1 ≤ r2 AND l2 ≤ r1.`)
          if (l1 <= r2 && l2 <= r1) {
            if ((n1 + n2) % 2 === 1) {
              line(12, `Invariant holds! Odd total → the median is the biggest left value: max(${show(l1)}, ${show(l2)}) = <b>${Math.max(l1, l2)}</b>.`)
              return Math.max(l1, l2)
            }
            const med = (Math.max(l1, l2) + Math.min(r1, r2)) / 2
            line(13, `Invariant holds! Even total → average the middle pair: (max(${show(l1)}, ${show(l2)}) + min(${show(r1)}, ${show(r2)})) / 2 = <b>${med}</b>.`)
            return med
          }
          if (l1 > r2) {
            line(15, `l1 = ${show(l1)} > r2 = ${show(r2)} — A's left part reaches <b>too high</b>. Move the cut in A left: hi = ${cut1 - 1}.`)
            hi = cut1 - 1
          } else {
            line(16, `l2 = ${show(l2)} > r1 = ${show(r1)} — A's left part is <b>too small</b>, forcing B to over-contribute. Move the cut in A right: lo = ${cut1 + 1}.`)
            lo = cut1 + 1
          }
          vars({ lo, hi })
        }
        line(18, `Unreachable: some cut of A always satisfies the invariant.`)
        return -1
      },
      1,
    )
    return go()
  },
}
