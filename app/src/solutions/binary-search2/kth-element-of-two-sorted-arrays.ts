import type { Args, SolutionDef } from "@/engine/types"

const NEG = -Infinity, POS = Infinity
const show = (v: number) => (v === NEG ? "-∞" : v === POS ? "+∞" : String(v))

const getAB = (args: Args): [number[], number[]] => {
  let A = args.a as number[]
  let B = args.b as number[]
  if (A.length > B.length) [A, B] = [B, A]
  return [A, B]
}

export const kthTwoSorted: SolutionDef = {
  view: "array",
  array: (args) => {
    const [A, B] = getAB(args)
    return [...A, "·", ...B]
  },
  code: `// partition so the two LEFT parts hold exactly k values
function kthElement(A, B, k) {
  let lo = Math.max(0, k - B.length), hi = Math.min(k, A.length);
  while (lo <= hi) {
    const cut1 = (lo + hi) >> 1;
    const cut2 = k - cut1;
    const l1 = cut1 > 0 ? A[cut1 - 1] : -Infinity;
    const r1 = cut1 < A.length ? A[cut1] : Infinity;
    const l2 = cut2 > 0 ? B[cut2 - 1] : -Infinity;
    const r2 = cut2 < B.length ? B[cut2] : Infinity;
    if (l1 <= r2 && l2 <= r1) return Math.max(l1, l2);
    if (l1 > r2) hi = cut1 - 1;   // A gave too many
    else lo = cut1 + 1;           // A gave too few
  }
  return -1;
}`,
  codeJava: `// partition so the two LEFT parts hold exactly k values
int kthElement(int[] A, int[] B, int k) {
  int lo = Math.max(0, k - B.length), hi = Math.min(k, A.length);
  while (lo <= hi) {
    int cut1 = (lo + hi) / 2;
    int cut2 = k - cut1;
    int l1 = cut1 > 0 ? A[cut1 - 1] : Integer.MIN_VALUE;
    int r1 = cut1 < A.length ? A[cut1] : Integer.MAX_VALUE;
    int l2 = cut2 > 0 ? B[cut2 - 1] : Integer.MIN_VALUE;
    int r2 = cut2 < B.length ? B[cut2] : Integer.MAX_VALUE;
    if (l1 <= r2 && l2 <= r1) return Math.max(l1, l2);
    if (l1 > r2) hi = cut1 - 1;   // A gave too many
    else lo = cut1 + 1;           // A gave too few
  }
  return -1;
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "sorted A", default: [10, 20, 30, 40], maxLen: 5 },
    { kind: "numbers", name: "b", label: "sorted B", default: [5, 6, 7, 8, 9], maxLen: 6 },
    { kind: "number", name: "k", label: "k (1-based)", default: 4, min: 1, max: 11 },
  ],
  entry: (a) => `kthElement(A, B, ${a.k})  // cells: A · B`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const [A, B] = getAB(args)
    const n1 = A.length, n2 = B.length
    const kRaw = args.k as number
    const k = Math.min(Math.max(kRaw, 1), Math.max(n1 + n2, 1))
    if (k !== kRaw) narrate(`k = ${kRaw} is out of range for ${n1 + n2} total values — clamped to ${k}.`)
    const go = fn(
      "kthElement",
      (): number => {
        let lo = Math.max(0, k - n2), hi = Math.min(k, n1)
        vars({ k, lo, hi })
        line(2, `Same partition trick as median-of-two, but the left side must hold exactly <b>k = ${k}</b> values. A can give at least ${lo} (B tops out at ${n2}) and at most ${hi}.`)
        while (lo <= hi) {
          const cut1 = (lo + hi) >> 1
          const cut2 = k - cut1
          ptr("cut1", cut1)
          ptr("cut2", cut2 < n2 ? n1 + 1 + cut2 : -1)
          const left: number[] = []
          for (let i = 0; i < cut1; i++) left.push(i)
          for (let i = 0; i < cut2; i++) left.push(n1 + 1 + i)
          const right: number[] = []
          for (let i = cut1; i < n1; i++) right.push(i)
          for (let i = cut2; i < n2; i++) right.push(n1 + 1 + i)
          mark("good", left); mark("window", right)
          line(4, `Try taking <b>${cut1}</b> value(s) from A's front…`)
          line(5, `…so B supplies cut2 = ${k} − ${cut1} = <b>${cut2}</b>. Left side now holds exactly k = ${k} values.`)
          const l1 = cut1 > 0 ? A[cut1 - 1] : NEG
          const r1 = cut1 < n1 ? A[cut1] : POS
          const l2 = cut2 > 0 ? B[cut2 - 1] : NEG
          const r2 = cut2 < n2 ? B[cut2] : POS
          vars({ k, cut1, cut2, l1: show(l1), r1: show(r1), l2: show(l2), r2: show(r2) })
          line(10, `Check the invariant — all-left ≤ all-right: l1 = ${show(l1)} ≤ r2 = ${show(r2)}? l2 = ${show(l2)} ≤ r1 = ${show(r1)}?`)
          if (l1 <= r2 && l2 <= r1) {
            line(10, `Both hold! These k left values ARE the k smallest overall — the kth is the biggest of them: max(${show(l1)}, ${show(l2)}) = <b>${Math.max(l1, l2)}</b>.`)
            return Math.max(l1, l2)
          }
          if (l1 > r2) {
            line(11, `l1 = ${show(l1)} > r2 = ${show(r2)} — A gave <b>too many</b>. Shrink A's share: hi = ${cut1 - 1}.`)
            hi = cut1 - 1
          } else {
            line(12, `l2 = ${show(l2)} > r1 = ${show(r1)} — A gave <b>too few</b>. Grow A's share: lo = ${cut1 + 1}.`)
            lo = cut1 + 1
          }
          vars({ k, lo, hi })
        }
        line(14, `Unreachable for a valid k: some split always satisfies the invariant.`)
        return -1
      },
      1,
    )
    return go()
  },
}
