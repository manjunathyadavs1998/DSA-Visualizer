import type { SolutionDef } from "@/engine/types"

export const aggressiveCows: SolutionDef = {
  view: "array",
  array: (a) => [...(a.stalls as number[])].sort((x, y) => x - y),
  code: `// place c cows in stalls MAXIMIZING the minimum gap
function aggressiveCows(stalls, c) {          // stalls sorted
  let lo = 1, hi = stalls[stalls.length - 1] - stalls[0];
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;           // bias up when maximizing
    if (canPlace(stalls, c, mid)) lo = mid;   // feasible → try bigger gap
    else hi = mid - 1;                        // too greedy → shrink gap
  }
  return lo;
}
function canPlace(stalls, c, d) {
  let placed = 1, lastPos = stalls[0];        // first cow in first stall
  for (const s of stalls) {
    if (s - lastPos >= d) { placed++; lastPos = s; }
  }
  return placed >= c;
}`,
  codeJava: `// place c cows in stalls MAXIMIZING the minimum gap
int aggressiveCows(int[] stalls, int c) {     // stalls sorted
  int lo = 1, hi = stalls[stalls.length - 1] - stalls[0];
  while (lo < hi) {
    int mid = (lo + hi + 1) / 2;              // bias up when maximizing
    if (canPlace(stalls, c, mid)) lo = mid;   // feasible → try bigger gap
    else hi = mid - 1;                        // too greedy → shrink gap
  }
  return lo;
}
boolean canPlace(int[] stalls, int c, int d) {
  int placed = 1, lastPos = stalls[0];        // first cow in first stall
  for (int s : stalls) {
    if (s - lastPos >= d) { placed++; lastPos = s; }
  }
  return placed >= c;
}`,
  inputs: [
    { kind: "numbers", name: "stalls", label: "stall positions", default: [1, 2, 4, 8, 9], maxLen: 10 },
    { kind: "number", name: "c", label: "cows", default: 3, min: 2, max: 6 },
  ],
  entry: (a) => `aggressiveCows(stalls, c = ${a.c})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const stalls = [...(args.stalls as number[])].sort((x, y) => x - y)
    const c = args.c as number
    const n = stalls.length
    const canPlace = fn(
      "canPlace",
      (d: number): boolean => {
        let placed = 1, lastPos = stalls[0]
        const chosen = [0]
        mark("good", [...chosen])
        vars({ d, placed, lastPos })
        line(11, `Greedy: put the 1st cow in the leftmost stall (position ${lastPos}), then walk right taking the first stall ≥ ${d} away.`)
        for (let i = 1; i < n; i++) {
          const s = stalls[i]
          ptr("s", i)
          if (s - lastPos >= d) {
            const gap = s - lastPos
            placed++
            lastPos = s
            chosen.push(i)
            mark("good", [...chosen])
            vars({ d, placed, lastPos })
            line(13, `Stall ${s} is ${gap} ≥ ${d} from the last cow → <b>place cow ${placed}</b> here.`)
          } else {
            line(13, `Stall ${s} is only ${s - lastPos} < ${d} from the last cow at ${lastPos} — <b>skip it</b>.`)
          }
        }
        ptr("s", -1)
        line(15, `Gap ${d} fits <b>${placed}</b> cow(s) — need ${c} → ${placed >= c ? "<b>feasible</b>" : "<b>infeasible</b>"}.`)
        return placed >= c
      },
      10,
    )
    const go = fn(
      "aggressiveCows",
      (): number => {
        if (n < 2) {
          narrate(`Need at least 2 stalls — returning 0.`)
          return 0
        }
        let lo = 1, hi = stalls[n - 1] - stalls[0]
        vars({ lo, hi, c })
        line(2, `The answer (the minimum gap, maximized) is between 1 and the full span ${stalls[n - 1]} − ${stalls[0]} = ${hi}. Binary search <b>that gap</b>.`)
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          mark("good", [])
          vars({ lo, hi, mid, c })
          line(4, `Guess a minimum gap of <b>${mid}</b> — can we still place all ${c} cows? (Bias mid up: when feasible we keep lo = mid.)`)
          if (canPlace(mid)) {
            line(5, `Feasible → a gap of ${mid} works. Get greedier: lo = ${mid}.`)
            lo = mid
          } else {
            line(6, `Infeasible → ${mid} is too ambitious. Back off: hi = ${mid - 1}.`)
            hi = mid - 1
          }
          vars({ lo, hi, c })
        }
        line(8, `lo met hi at <b>${lo}</b> — the largest gap that still fits all ${c} cows.`)
        return lo
      },
      1,
    )
    return go()
  },
}
