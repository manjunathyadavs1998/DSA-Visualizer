import type { Args, SolutionDef } from "@/engine/types"

/** Pair up the flat numbers, normalize each pair to [min,max], sort by start. */
const toIntervals = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let k = 0; k + 1 < flat.length; k += 2) {
    out.push([Math.min(flat[k], flat[k + 1]), Math.max(flat[k], flat[k + 1])])
  }
  out.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  return out
}

const fmt = (p: [number, number]): string => `${p[0]}–${p[1]}`

export const mergeIntervals: SolutionDef = {
  view: "array",
  array: (a: Args) => toIntervals(a.pairs as number[]).map(fmt),
  code: `// intervals arrive pre-sorted by start time
function merge(intervals) {
  const merged = [intervals[0]];
  for (let cur = 1; cur < intervals.length; cur++) {
    const last = merged[merged.length - 1];
    if (intervals[cur][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[cur][1]);  // overlap: absorb
    } else {
      merged.push(intervals[cur]);                     // gap: new block
    }
  }
  return merged;
}`,
  codeJava: `// intervals arrive pre-sorted by start time
List<int[]> merge(int[][] intervals) {
  List<int[]> merged = new ArrayList<>(List.of(intervals[0]));
  for (int cur = 1; cur < intervals.length; cur++) {
    int[] last = merged.get(merged.size() - 1);
    if (intervals[cur][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[cur][1]);  // overlap: absorb
    } else {
      merged.add(intervals[cur]);                      // gap: new block
    }
  }
  return merged;
}`,
  inputs: [
    { kind: "numbers", name: "pairs", label: "intervals as start,end pairs", default: [1, 3, 2, 6, 8, 10, 15, 18], maxLen: 12 },
  ],
  entry: () => `merge(intervals)`,
  run({ fn, line, ptr, mark, heap, vars, narrate }, args) {
    const intervals = toIntervals(args.pairs as number[])
    let answer: string[] = []
    const go = fn(
      "merge",
      (): string => {
        if (intervals.length === 0) {
          line(11, `No intervals to merge.`)
          return "[]"
        }
        const merged: [number, number][] = [[...intervals[0]] as [number, number]]
        heap("merged", merged.map(fmt))
        line(2, `The intervals were <b>sorted by start</b> first — so any overlap can only touch the LAST merged block. Seed merged with ${fmt(intervals[0])}.`)
        const absorbed: number[] = []
        for (let cur = 1; cur < intervals.length; cur++) {
          ptr("cur", cur)
          const last = merged[merged.length - 1]
          mark("focus", [cur])
          vars({ cur, last: fmt(last) })
          line(5, `Does ${fmt(intervals[cur])} start before the last block ${fmt(last)} ends? (${intervals[cur][0]} ≤ ${last[1]}? ${intervals[cur][0] <= last[1] ? "<b>yes</b>" : "no"})`)
          if (intervals[cur][0] <= last[1]) {
            const oldEnd = last[1]
            last[1] = Math.max(last[1], intervals[cur][1])
            absorbed.push(cur)
            mark("done", [...absorbed])
            heap("merged", merged.map(fmt))
            line(6, `Overlap → <b>absorb</b> it: the block's end goes from ${oldEnd} to max(${oldEnd}, ${intervals[cur][1]}) = ${last[1]}.`)
          } else {
            merged.push([...intervals[cur]] as [number, number])
            heap("merged", merged.map(fmt))
            line(8, `Gap → start a <b>new block</b> ${fmt(intervals[cur])}.`)
          }
        }
        ptr("cur", -1)
        mark("focus", [])
        answer = merged.map(fmt)
        line(11, `Merged: ${answer.join(", ")} — ${merged.length} block(s) from ${intervals.length} interval(s).`)
        return answer.join(", ")
      },
      1,
    )
    narrate("Sort by start, then one pass: each interval either stretches the last block or opens a new one.")
    go()
    return JSON.stringify(answer)
  },
}
