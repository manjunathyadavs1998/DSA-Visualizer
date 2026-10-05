import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,s,e,...] → sorted-by-start pairs with s ≤ e. */
const toPairs = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) out.push([1, 2])
  return out.sort((p, q) => p[0] - q[0])
}

const toNew = (flat: number[]): [number, number] => {
  const a = Math.trunc(flat[0] ?? 4)
  const b = Math.trunc(flat[1] ?? 8)
  return [Math.min(a, b), Math.max(a, b)]
}

export const insertInterval: SolutionDef = {
  view: "array",
  array: (a) => toPairs(a.intervals as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// intervals: sorted, disjoint; weave newInterval in
function insert(intervals, newInterval) {
  const res = [];
  let i = 0, n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0])
    res.push(intervals[i++]);     // ends before new starts
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval = [Math.min(newInterval[0], intervals[i][0]),
                   Math.max(newInterval[1], intervals[i][1])];
    i++;                          // swallow the overlapper
  }
  res.push(newInterval);          // the merged block
  while (i < n) res.push(intervals[i++]);   // the rest
  return res;
}`,
  codeJava: `// intervals: sorted, disjoint; weave newInterval in
int[][] insert(int[][] intervals, int[] newInterval) {
  List<int[]> res = new ArrayList<>();
  int i = 0, n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0])
    res.add(intervals[i++]);      // ends before new starts
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;                          // swallow the overlapper
  }
  res.add(newInterval);           // the merged block
  while (i < n) res.add(intervals[i++]);    // the rest
  return res.toArray(new int[0][]);
}`,
  inputs: [
    {
      kind: "numbers", name: "intervals", label: "intervals (flat [s,e] pairs: 1,2,3,5 = [1,2],[3,5])",
      default: [1, 2, 3, 5, 6, 7, 8, 10, 12, 16], maxLen: 12,
    },
    { kind: "numbers", name: "newInterval", label: "new interval (two numbers: start, end)", default: [4, 8], maxLen: 2 },
  ],
  entry: (a) => `insert([${toPairs(a.intervals as number[]).map(([s, e]) => `[${s},${e}]`).join(",")}], [${toNew(a.newInterval as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const intervals = toPairs(args.intervals as number[])
    let cur = toNew(args.newInterval as number[])
    const n = intervals.length
    const solve = fn(
      "insert",
      (): string => {
        const res: [number, number][] = []
        let i = 0
        heap("output", [])
        vars({ newInterval: `[${cur.join(",")}]`, i })
        line(2, `Three zones: intervals fully <b>left</b> of [${cur.join(",")}], intervals that <b>overlap</b> it, and intervals fully <b>right</b> of it.`)
        while (i < n && intervals[i][1] < cur[0]) {
          ptr("i", i)
          mark("done", res.map((_, k) => k))
          line(4, `[${intervals[i].join(",")}] ends at ${intervals[i][1]} < new start ${cur[0]} → fully left, copy untouched.`)
          res.push(intervals[i])
          heap("output", res.map((p) => `[${p.join(",")}]`))
          line(5, `output ← [${intervals[i].join(",")}] (count = <b>${res.length}</b>).`)
          i++
        }
        while (i < n && intervals[i][0] <= cur[1]) {
          ptr("i", i)
          mark("focus", [i])
          line(6, `[${intervals[i].join(",")}] starts at ${intervals[i][0]} ≤ new end ${cur[1]} → it <b>overlaps</b> the growing block.`)
          cur = [Math.min(cur[0], intervals[i][0]), Math.max(cur[1], intervals[i][1])]
          vars({ newInterval: `[${cur.join(",")}]`, i })
          line(7, `Merge it in: block becomes <b>[${cur.join(",")}]</b> (min of starts, max of ends).`)
          mark("window", Array.from({ length: i + 1 }, (_, k) => k).filter((k) => intervals[k][1] >= cur[0] || k === i))
          i++
          line(9, `Advance i → ${i}; the block may swallow the next interval too.`)
        }
        res.push(cur)
        heap("output", res.map((p) => `[${p.join(",")}]`))
        line(11, `No more overlaps — emit the merged block <b>[${cur.join(",")}]</b>.`)
        while (i < n) {
          ptr("i", i)
          mark("good", [i])
          res.push(intervals[i])
          heap("output", res.map((p) => `[${p.join(",")}]`))
          line(12, `[${intervals[i].join(",")}] starts after ${cur[1]} → fully right, copy untouched.`)
          i++
        }
        ptr("i", -1)
        mark("focus", [])
        line(13, `Done in one pass: <b>${res.map((p) => `[${p.join(",")}]`).join(" ")}</b>.`)
        return `[${res.map((p) => `[${p.join(",")}]`).join(",")}]`
      },
      1,
    )
    narrate(`The list is sorted and disjoint, so the new interval touches one contiguous run of intervals — copy, merge, copy.`)
    return solve()
  },
}
