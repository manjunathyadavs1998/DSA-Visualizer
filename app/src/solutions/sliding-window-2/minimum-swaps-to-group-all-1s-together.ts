import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (a: number[]) => a.map((v) => (v === 1 ? 1 : 0))

export const minimumSwapsToGroupAll1sTogether: SolutionDef = {
  view: "array",
  array: (a) => clean(a.data as number[]),
  code: `// all 1s together == some window of size (total ones)
function minSwaps(data) {
  let ones = 0;
  for (const d of data) ones += d;    // the window size
  if (ones === 0) return 0;
  let inWin = 0, best = 0;
  for (let right = 0; right < data.length; right++) {
    inWin += data[right];
    if (right >= ones) inWin -= data[right - ones];
    best = Math.max(best, inWin);     // most 1s already in place
  }
  return ones - best;                 // the rest must be swapped in
}`,
  codeJava: `// all 1s together == some window of size (total ones)
int minSwaps(int[] data) {
  int ones = 0;
  for (int d : data) ones += d;       // the window size
  if (ones == 0) return 0;
  int inWin = 0, best = 0;
  for (int right = 0; right < data.length; right++) {
    inWin += data[right];
    if (right >= ones) inWin -= data[right - ones];
    best = Math.max(best, inWin);     // most 1s already in place
  }
  return ones - best;                 // the rest must be swapped in
}`,
  inputs: [{ kind: "numbers", name: "data", label: "data (0/1)", default: [1, 0, 1, 0, 1, 0, 0, 1, 1], maxLen: 12 }],
  entry: (a) => `minSwaps([${clean(a.data as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const data = clean(args.data as number[])
    const go = fn(
      "minSwaps",
      (): number => {
        let ones = 0
        for (const d of data) ones += d
        line(3, `There are <b>${ones}</b> ones total — grouped together they fill a window of exactly size ${ones}.`)
        if (ones === 0) {
          line(4, `No 1s at all → already "grouped". Return <b>0</b>.`)
          return 0
        }
        let inWin = 0
        let best = 0
        let bestEnd = ones - 1
        line(5, `Slide a size-${ones} window; the one with the <b>most 1s already inside</b> needs the fewest swaps.`)
        for (let right = 0; right < data.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          inWin += data[right]
          line(7, `data[${right}] = ${data[right]} enters → 1s in window = <b>${inWin}</b>.`)
          if (right >= ones) {
            inWin -= data[right - ones]
            line(8, `data[${right - ones}] = ${data[right - ones]} slides out → 1s in window = ${inWin}.`)
          }
          const start = Math.max(0, right - ones + 1)
          ptr("left", start)
          mark("window", win(start, right))
          if (inWin > best && right >= ones - 1) {
            best = inWin
            bestEnd = right
            line(9, `Window [${start}..${right}] already holds <b>${inWin}</b> ones — new best!`)
          } else {
            line(9, `best stays ${best}.`)
          }
          vars({ right, inWin, best, ones })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestEnd - ones + 1, bestEnd))
        line(11, `Best window has ${best} of the ${ones} ones → swap in the missing <b>${ones - best}</b>. Each swap fixes one 0 inside.`)
        return ones - best
      },
      1,
    )
    return go()
  },
}
