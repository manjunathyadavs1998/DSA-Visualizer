import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const minimumBitFlips: SolutionDef = {
  view: "array",
  array: (a) => [...bits(clamp(a.start as number)), "≠", ...bits(clamp(a.goal as number))],
  code: `// flips needed = set bits in start XOR goal
function minBitFlips(start, goal) {
  let diff = start ^ goal;    // 1 = columns that disagree
  let count = 0;
  while (diff !== 0) {
    diff = diff & (diff - 1); // Kernighan: clear one 1
    count++;
  }
  return count;
}`,
  codeJava: `// flips needed = set bits in start XOR goal
int minBitFlips(int start, int goal) {
  int diff = start ^ goal;    // 1 = columns that disagree
  int count = 0;
  while (diff != 0) {
    diff = diff & (diff - 1); // Kernighan: clear one 1
    count++;
  }
  return count;
}`,
  inputs: [
    { kind: "number", name: "start", label: "start (0–255)", default: 10, min: 0, max: 255 },
    { kind: "number", name: "goal", label: "goal (0–255)", default: 7, min: 0, max: 255 },
  ],
  entry: (a) => `minBitFlips(${clamp(a.start as number)}, ${clamp(a.goal as number)})`,
  run({ fn, line, mark, vars, heap }, args) {
    const start = clamp(args.start as number)
    const goal = clamp(args.goal as number)
    const go = fn(
      "minBitFlips",
      (): number => {
        const diff0 = start ^ goal
        line(2, `start = ${bin(start)} (${start}), goal = ${bin(goal)} (${goal}). XOR puts a <b>1 exactly where the two disagree</b> — each such column needs exactly one flip, no more, no less.`)
        const badCols: number[] = []
        for (let j = 0; j < W; j++) {
          const a = (start >> (W - 1 - j)) & 1
          const g = (goal >> (W - 1 - j)) & 1
          mark("focus", [j, W + 1 + j])
          if (a !== g) {
            badCols.push(j, W + 1 + j)
            line(2, `Bit ${W - 1 - j}: ${a} vs ${g} — <b>disagree</b> → XOR bit = 1 (needs a flip).`)
          } else {
            line(2, `Bit ${W - 1 - j}: ${a} vs ${g} — agree → XOR bit = 0.`)
          }
          mark("bad", [...badCols])
        }
        mark("focus", [])
        let diff = diff0
        heap("diff", `${diff} = ${bin(diff)}`)
        line(3, `diff = start ^ goal = <b>${bin(diff)}</b>. Now just count its 1s (popcount).`)
        let count = 0
        while (diff !== 0) {
          const next = diff & (diff - 1)
          line(5, `${bin(diff)} & ${bin(diff - 1)} = <b>${bin(next)}</b> — the lowest disagreement is accounted for.`)
          diff = next
          heap("diff", `${diff} = ${bin(diff)}`)
          count++
          line(6, `count = <b>${count}</b>.`)
          vars({ diff, count })
        }
        line(8, `<b>${count}</b> flip(s) convert ${start} into ${goal} — one per red column. O(k) with Kernighan's loop.`)
        return count
      },
      1,
    )
    return go()
  },
}
