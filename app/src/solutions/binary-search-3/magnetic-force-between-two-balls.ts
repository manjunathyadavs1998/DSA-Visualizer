import type { SolutionDef } from "@/engine/types"

const cleanPos = (xs: number[]) => {
  const p = [...new Set(xs.map((v) => Math.max(0, Math.round(v))))].sort((a, b) => a - b)
  return p.length >= 2 ? p : [1, 2, 3, 4, 7]
}

export const magneticForceBetweenTwoBalls: SolutionDef = {
  view: "array",
  array: (a) => cleanPos(a.position as number[]),
  code: `// place m balls in baskets MAXIMIZING the minimum distance
function maxDistance(position, m) {          // position sorted
  let lo = 1, hi = position[position.length - 1] - position[0];
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;          // bias UP when maximizing
    if (canPlace(position, m, mid)) lo = mid;    // works → stretch
    else hi = mid - 1;                           // too far apart
  }
  return lo;
}
function canPlace(position, m, d) {
  let placed = 1, last = position[0];        // first ball leftmost
  for (const p of position) {
    if (p - last >= d) { placed++; last = p; }
  }
  return placed >= m;
}`,
  codeJava: `// place m balls in baskets MAXIMIZING the minimum distance
int maxDistance(int[] position, int m) {     // position sorted
  int lo = 1, hi = position[position.length - 1] - position[0];
  while (lo < hi) {
    int mid = (lo + hi + 1) / 2;             // bias UP when maximizing
    if (canPlace(position, m, mid)) lo = mid;    // works → stretch
    else hi = mid - 1;                           // too far apart
  }
  return lo;
}
boolean canPlace(int[] position, int m, int d) {
  int placed = 1, last = position[0];        // first ball leftmost
  for (int p : position) {
    if (p - last >= d) { placed++; last = p; }
  }
  return placed >= m;
}`,
  inputs: [
    { kind: "numbers", name: "position", label: "basket positions", default: [1, 2, 3, 4, 7], maxLen: 10 },
    { kind: "number", name: "m", label: "m balls", default: 3, min: 2, max: 8 },
  ],
  entry: (a) => `maxDistance(position, ${a.m})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const position = cleanPos(args.position as number[])
    const n = position.length
    const m = Math.min(n, Math.max(2, args.m as number))
    const canPlace = fn(
      "canPlace",
      (d: number): boolean => {
        let placed = 1, last = position[0]
        const chosen = [0]
        mark("good", [...chosen])
        vars({ d, placed, last })
        line(11, `Greedy: ball 1 goes in the leftmost basket (position ${last}); then take the first basket ≥ ${d} away, repeat.`)
        for (let i = 1; i < n; i++) {
          const p = position[i]
          ptr("i", i)
          if (p - last >= d) {
            placed++
            line(13, `Basket at ${p} is ${p - last} ≥ ${d} from the last ball → <b>place ball ${placed}</b>.`)
            last = p
            chosen.push(i)
            mark("good", [...chosen])
            vars({ d, placed, last })
          } else {
            line(13, `Basket at ${p} is only ${p - last} < ${d} from the ball at ${last} — <b>skip</b>.`)
          }
        }
        ptr("i", -1)
        line(15, `Minimum gap ${d} fits <b>${placed}</b> ball(s); need ${m} → ${placed >= m ? "<b>feasible</b>" : "<b>infeasible</b>"}.`)
        return placed >= m
      },
      10,
    )
    const go = fn(
      "maxDistance",
      (): number => {
        let lo = 1, hi = position[n - 1] - position[0]
        narrate(`Baskets (sorted): [${position.join(", ")}]. We binary search the <b>answer</b> — the minimum distance d ∈ [${lo}..${hi}] — and greedily test each guess on the baskets below.`)
        vars({ lo, hi, m })
        line(2, `"Magnetic force" = the smallest gap between any two balls. Maximize it: d ranges from 1 to the full span ${position[n - 1]} − ${position[0]} = ${hi}.`)
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          mark("good", [])
          vars({ lo, hi, mid, m })
          line(4, `Guess minimum distance d = <b>${mid}</b> (bias mid up — when feasible we keep lo = mid, so round up to make progress).`)
          if (canPlace(mid)) {
            line(5, `Feasible → ${mid} works, smaller d is now uninteresting. <b>lo = ${mid}</b>; try to stretch further.`)
            lo = mid
          } else {
            line(6, `Infeasible → ${mid} spreads the balls too thin. <b>hi = ${mid - 1}</b>.`)
            hi = mid - 1
          }
          vars({ lo, hi, m })
        }
        line(8, `Largest feasible minimum distance: <b>${lo}</b>. (Same template as Aggressive Cows.)`)
        return lo
      },
      1,
    )
    return go()
  },
}
