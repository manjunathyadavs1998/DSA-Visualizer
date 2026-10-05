import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)
const clean = (s: string) => s.toUpperCase().split("").map((c) => (c === "B" ? "B" : "W")).join("")

export const minimumRecolorsToGetKConsecutiveBlackBlocks: SolutionDef = {
  view: "array",
  array: (a) => clean(a.blocks as string).split(""),
  code: `// fewest W->B recolors to get k consecutive black blocks
function minimumRecolors(blocks, k) {
  let whites = 0;
  for (let i = 0; i < k; i++)
    if (blocks[i] === 'W') whites++;  // cost of the first window
  let best = whites;
  for (let right = k; right < blocks.length; right++) {
    if (blocks[right] === 'W') whites++;
    if (blocks[right - k] === 'W') whites--;
    best = Math.min(best, whites);
  }
  return best;
}`,
  codeJava: `// fewest W->B recolors to get k consecutive black blocks
int minimumRecolors(String blocks, int k) {
  int whites = 0;
  for (int i = 0; i < k; i++)
    if (blocks.charAt(i) == 'W') whites++;
  int best = whites;
  for (int right = k; right < blocks.length(); right++) {
    if (blocks.charAt(right) == 'W') whites++;
    if (blocks.charAt(right - k) == 'W') whites--;
    best = Math.min(best, whites);
  }
  return best;
}`,
  inputs: [
    { kind: "string", name: "blocks", label: "blocks (W/B)", default: "WBBWWBBWBW", maxLen: 14 },
    { kind: "number", name: "k", label: "k", default: 7, min: 1, max: 14 },
  ],
  entry: (a) => `minimumRecolors("${clean(a.blocks as string)}", ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const blocks = clean(args.blocks as string)
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), blocks.length)
    const go = fn(
      "minimumRecolors",
      (): number => {
        let whites = 0
        line(2, `Each window of size ${k} costs exactly its number of <b>W</b> blocks — slide and take the cheapest.`)
        for (let i = 0; i < k; i++) {
          mark("focus", [i])
          mark("window", win(0, i))
          if (blocks[i] === "W") {
            whites++
            line(4, `blocks[${i}] = 'W' needs a recolor → whites = <b>${whites}</b>.`)
          } else {
            line(4, `blocks[${i}] = 'B' is free.`)
          }
        }
        let best = whites
        let bestEnd = k - 1
        line(5, `First window [0..${k - 1}] costs <b>${whites}</b> recolors.`)
        for (let right = k; right < blocks.length; right++) {
          ptr("right", right)
          ptr("left", right - k + 1)
          mark("focus", [right])
          if (blocks[right] === "W") {
            whites++
            line(7, `'W' enters at ${right} → whites = ${whites}.`)
          } else {
            line(7, `'B' enters at ${right} — no new cost.`)
          }
          if (blocks[right - k] === "W") {
            whites--
            line(8, `'W' leaves at ${right - k} → whites = ${whites}.`)
          } else {
            line(8, `'B' leaves at ${right - k} — cost unchanged.`)
          }
          mark("window", win(right - k + 1, right))
          if (whites < best) {
            best = whites
            bestEnd = right
            line(9, `Window [${right - k + 1}..${right}] costs <b>${whites}</b> — new cheapest!`)
          } else {
            line(9, `Window costs ${whites} — best stays ${best}.`)
          }
          vars({ right, whites, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestEnd - k + 1, bestEnd))
        line(11, `Cheapest ${k}-block window (green) needs <b>${best}</b> recolors.`)
        return best
      },
      1,
    )
    return go()
  },
}
