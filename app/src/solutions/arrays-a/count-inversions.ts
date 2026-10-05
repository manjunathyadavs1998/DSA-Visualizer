import type { SolutionDef } from "@/engine/types"

export const countInversions: SolutionDef = {
  code: `// merge sort; count pairs where a left value > a right value
function sortCount(lo, hi) {
  if (lo === hi) return [arr[lo]];
  const mid = (lo + hi) >> 1;
  const L = sortCount(lo, mid), R = sortCount(mid + 1, hi);
  const merged = []; let i = 0, j = 0;
  while (i < L.length || j < R.length) {
    if (j === R.length || (i < L.length && L[i] <= R[j])) {
      merged.push(L[i++]);               // left wins: no inversion
    } else {
      count += L.length - i;             // right wins: jumps ALL remaining lefts
      merged.push(R[j++]);
    }
  }
  return merged;
}`,
  codeJava: `// merge sort; count pairs where a left value > a right value
List<Integer> sortCount(int lo, int hi) {
  if (lo == hi) return List.of(arr[lo]);
  int mid = (lo + hi) >> 1;
  List<Integer> L = sortCount(lo, mid), R = sortCount(mid + 1, hi);
  List<Integer> merged = new ArrayList<>(); int i = 0, j = 0;
  while (i < L.size() || j < R.size()) {
    if (j == R.size() || (i < L.size() && L.get(i) <= R.get(j))) {
      merged.add(L.get(i++));            // left wins: no inversion
    } else {
      count += L.size() - i;             // right wins: jumps ALL remaining lefts
      merged.add(R.get(j++));
    }
  }
  return merged;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [5, 3, 8, 2, 7, 1], maxLen: 8 }],
  entry: (a) => `sortCount(0, ${Math.max((a.nums as number[]).length - 1, 0)})`,
  run({ fn, heap, line, vars, narrate }, args) {
    const arr = args.nums as number[]
    let count = 0
    const go = fn(
      "sortCount",
      (lo: number, hi: number): number[] => {
        line(2, `sortCount(${lo},${hi}): ${lo === hi ? `single element [${arr[lo]}] — <b>already sorted</b>, no inversions inside.` : "more than one element — split in half."}`)
        if (lo === hi) return [arr[lo]]
        const mid = (lo + hi) >> 1
        line(4, `Split at mid = ${mid}: sort-and-count the left half [${lo}..${mid}] and the right half [${mid + 1}..${hi}] recursively.`)
        const L = go(lo, mid)
        const R = go(mid + 1, hi)
        const merged: number[] = []
        let i = 0, j = 0
        line(5, `Merge the sorted halves L = [${L.join(",")}] and R = [${R.join(",")}] — cross-inversions are counted here.`)
        while (i < L.length || j < R.length) {
          if (j === R.length || (i < L.length && L[i] <= R[j])) {
            line(8, j === R.length
              ? `R is exhausted — L[${i}] = ${L[i]} just follows: no inversion.`
              : `L[${i}] = ${L[i]} ≤ R[${j}] = ${R[j]} — the left value goes first: <b>no inversion</b>.`)
            merged.push(L[i++])
          } else {
            count += L.length - i
            vars({ count })
            line(10, `R[${j}] = ${R[j]} goes first, jumping ALL ${L.length - i} remaining left value(s) [${L.slice(i).join(",")}] → count += ${L.length - i} → <b>${count}</b>.`)
            merged.push(R[j++])
          }
          heap("merged", merged)
        }
        return merged
      },
      1,
    )
    if (arr.length === 0) return 0
    narrate("Merge sort counts inversions in bulk: when a right element is placed, every not-yet-taken left element is bigger — one addition covers them all.")
    vars({ count })
    heap("merged", [])
    go(0, arr.length - 1)
    return count
  },
}
