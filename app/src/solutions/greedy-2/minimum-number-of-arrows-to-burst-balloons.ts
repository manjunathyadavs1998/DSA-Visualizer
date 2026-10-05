import type { SolutionDef } from "@/engine/types"

/** Flat [s,e,...] → pairs with s ≤ e, sorted by RIGHT edge. */
const byRight = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const a = Math.trunc(flat[i])
    const b = Math.trunc(flat[i + 1])
    out.push([Math.min(a, b), Math.max(a, b)])
  }
  if (!out.length) out.push([1, 6])
  return out.sort((p, q) => p[1] - q[1])
}

export const minimumNumberOfArrowsToBurstBalloons: SolutionDef = {
  view: "array",
  array: (a) => byRight(a.points as number[]).map(([s, e]) => `${s}–${e}`),
  code: `// one vertical arrow pops every balloon it crosses
function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);   // by RIGHT edge
  let arrows = 1, arrowX = points[0][1];
  for (const [s, e] of points) {
    if (s > arrowX) {    // this balloon is past the arrow
      arrows++;          // shoot a new arrow…
      arrowX = e;        // …at ITS right edge
    }
  }
  return arrows;
}`,
  codeJava: `// one vertical arrow pops every balloon it crosses
int findMinArrowShots(int[][] points) {
  Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
  int arrows = 1; long arrowX = points[0][1];
  for (int[] p : points) {
    if (p[0] > arrowX) { // this balloon is past the arrow
      arrows++;          // shoot a new arrow…
      arrowX = p[1];     // …at ITS right edge
    }
  }
  return arrows;
}`,
  inputs: [
    {
      kind: "numbers", name: "points", label: "balloons (flat [xstart,xend] pairs: 10,16,2,8 = [10,16],[2,8])",
      default: [10, 16, 2, 8, 1, 6, 7, 12], maxLen: 12,
    },
  ],
  entry: (a) => `findMinArrowShots([${byRight(a.points as number[]).map(([s, e]) => `[${s},${e}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const pts = byRight(args.points as number[])
    const solve = fn(
      "findMinArrowShots",
      (): number => {
        line(2, `Sort by <b>right edge</b>: to pop the balloon that ends first, the latest useful shot is exactly at its right edge.`)
        let arrows = 1
        let arrowX = pts[0][1]
        const shots: number[] = [arrowX]
        heap("arrows", shots)
        mark("good", [0])
        vars({ arrows, arrowX })
        line(3, `First arrow at x = <b>${arrowX}</b> — the right edge of the earliest-ending balloon [${pts[0].join(",")}].`)
        const popped: number[] = []
        for (let k = 0; k < pts.length; k++) {
          const [s, e] = pts[k]
          ptr("k", k)
          mark("focus", [k])
          line(5, `Balloon [${s},${e}]: does the arrow at x=${arrowX} miss it? ${s} > ${arrowX} → <b>${s > arrowX ? "yes, it starts past the arrow" : "no, the arrow pops it too"}</b>.`)
          if (s > arrowX) {
            arrows++
            line(6, `Need a new arrow → arrows = <b>${arrows}</b>.`)
            arrowX = e
            shots.push(arrowX)
            heap("arrows", shots)
            vars({ arrows, arrowX })
            line(7, `Shoot it at x = <b>${e}</b>, this balloon's right edge — the greediest spot for everything after.`)
          } else {
            popped.push(k)
            mark("done", popped)
          }
        }
        ptr("k", -1)
        mark("focus", [])
        line(10, `<b>${arrows}</b> arrow${arrows > 1 ? "s" : ""} pop${arrows > 1 ? "" : "s"} all ${pts.length} balloons.`)
        return arrows
      },
      1,
    )
    narrate(`Same skeleton as non-overlapping intervals: each "group" of balloons sharing an x gets one arrow at the smallest right edge.`)
    return solve()
  },
}
