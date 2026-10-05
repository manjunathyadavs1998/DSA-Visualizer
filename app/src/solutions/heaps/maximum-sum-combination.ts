import type { SolutionDef } from "@/engine/types"

type Cand = { sum: number; i: number; j: number }

export const maximumSumCombination: SolutionDef = {
  view: "array",
  array: (a) => [...(a.a as number[]), "|", ...(a.b as number[])],
  code: `// sort both desc — a[0]+b[0] is the max; its successors come next
function maxCombinations(a, b, C) {
  a.sort(desc); b.sort(desc);
  const heap = new MaxHeap(), seen = new Set();
  heap.push([a[0] + b[0], 0, 0]); seen.add("0,0");
  const result = [];
  while (result.length < C) {
    const [sum, i, j] = heap.pop();    // best remaining
    result.push(sum);
    tryPush(i + 1, j);                 // next-smaller from a
    tryPush(i, j + 1);                 // next-smaller from b
  }
  return result;
}`,
  codeJava: `// sort both desc — a[0]+b[0] is the max; its successors come next
List<Integer> maxCombinations(int[] a, int[] b, int C) {
  sortDesc(a); sortDesc(b);
  PriorityQueue<int[]> heap = maxBySum(); Set<String> seen = new HashSet<>();
  heap.offer(new int[]{a[0] + b[0], 0, 0}); seen.add("0,0");
  List<Integer> result = new ArrayList<>();
  while (result.size() < C) {
    int[] t = heap.poll();             // best remaining
    result.add(t[0]);
    tryPush(t[1] + 1, t[2]);           // next-smaller from a
    tryPush(t[1], t[2] + 1);           // next-smaller from b
  }
  return result;
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "array a", default: [3, 2, 5, 1], maxLen: 5 },
    { kind: "numbers", name: "b", label: "array b", default: [4, 1, 8], maxLen: 5 },
    { kind: "number", name: "c", label: "C (sums to take)", default: 4, min: 1, max: 6 },
  ],
  entry: (a) => `maxCombinations(a, b, ${a.c})`,
  run({ fn, line, ptr, mark, vars, heap, aset, narrate }, args) {
    const a = [...(args.a as number[])]
    const b = [...(args.b as number[])]
    const C = Math.min(args.c as number, a.length * b.length)
    const offB = a.length + 1 // b's cells sit after the "|" separator
    const go = fn(
      "maxCombinations",
      (): string => {
        a.sort((x, y) => y - x)
        b.sort((x, y) => y - x)
        a.forEach((v, i) => aset(i, v))
        b.forEach((v, j) => aset(offB + j, v))
        line(2, `Sort both arrays <b>descending</b> (cells updated): a = [${a.join(", ")}], b = [${b.join(", ")}]. Now a[0]+b[0] is guaranteed to be the biggest possible sum.`)
        const h: Cand[] = []
        const seen = new Set<string>()
        const result: number[] = []
        const snap = () => heap("maxHeap", h.map((e) => `${e.sum} = a[${e.i}]+b[${e.j}] (${a[e.i]}+${b[e.j]})`))
        const tryPush = (i: number, j: number, ln: number) => {
          if (i >= a.length || j >= b.length) {
            line(ln, `Successor (i=${i}, j=${j}) is out of bounds — nothing to push.`)
            return
          }
          if (seen.has(`${i},${j}`)) {
            line(ln, `Successor (i=${i}, j=${j}) was already pushed — skip it so the heap has no duplicates.`)
            return
          }
          seen.add(`${i},${j}`)
          heap("seen", [...seen])
          const sum = a[i] + b[j]
          let p = 0
          while (p < h.length && h[p].sum >= sum) p++
          h.splice(p, 0, { sum, i, j })
          snap()
          line(ln, `Push candidate a[${i}]+b[${j}] = ${a[i]}+${b[j]} = <b>${sum}</b> — it sifts to slot ${p} of the max-heap (we keep it as an array sorted <b>largest first</b>, like a real heap's ordering).`)
        }
        heap("result", result)
        tryPush(0, 0, 4)
        while (result.length < C) {
          const top = h.shift() as Cand
          snap()
          ptr("i", top.i)
          ptr("j", offB + top.j)
          mark("focus", [top.i, offB + top.j])
          line(7, `Pop the root: <b>${top.sum}</b> = a[${top.i}]+b[${top.j}] — no candidate left in the heap can beat it.`)
          result.push(top.sum)
          heap("result", [...result])
          vars({ taken: result.length, C })
          line(8, `Record ${top.sum} (${result.length} of ${C}).`)
          tryPush(top.i + 1, top.j, 9)
          tryPush(top.i, top.j + 1, 10)
        }
        mark("focus", [])
        line(12, `Collected the top ${C} sums: [${result.join(", ")}]. Only ~2 candidates enter the heap per pop — never all ${a.length * b.length} pairs.`)
        return JSON.stringify(result)
      },
      1,
    )
    narrate(`Best-first search over index pairs: start at (0,0), and each popped pair only unlocks its two "next-smaller" neighbors.`)
    return go()
  },
}
