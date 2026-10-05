import type { SolutionDef } from "@/engine/types"

export const trappingRainWater: SolutionDef = {
  view: "array",
  array: (a) => a.heights as number[],
  code: `// heights is editable below
function trap(heights) {
  let l = 0, r = heights.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (heights[l] <= heights[r]) {
      leftMax = Math.max(leftMax, heights[l]);
      water += leftMax - heights[l];
      l++;
    } else {
      rightMax = Math.max(rightMax, heights[r]);
      water += rightMax - heights[r];
      r--;
    }
  }
  return water;
}`,
  codeJava: `// int[] heights is editable below
int trap(int[] heights) {
  int l = 0, r = heights.length - 1;
  int leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (heights[l] <= heights[r]) {
      leftMax = Math.max(leftMax, heights[l]);
      water += leftMax - heights[l];
      l++;
    } else {
      rightMax = Math.max(rightMax, heights[r]);
      water += rightMax - heights[r];
      r--;
    }
  }
  return water;
}`,
  inputs: [{ kind: "numbers", name: "heights", label: "heights", default: [4, 2, 0, 3, 2, 5], maxLen: 12 }],
  entry: () => `trap(heights)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const heights = args.heights as number[]
    const settled: number[] = []
    const go = fn(
      "trap",
      (): number => {
        let l = 0, r = heights.length - 1
        let leftMax = 0, rightMax = 0, water = 0
        ptr("l", l); ptr("r", r); vars({ l, r, leftMax, rightMax, water })
        line(3, `Water above any bar = <b>min(leftMax, rightMax) − height</b>. Track both maxes from the two ends.`)
        while (l < r) {
          mark("focus", [l, r])
          line(5, `heights[l]=${heights[l]} vs heights[r]=${heights[r]}: process the <b>${heights[l] <= heights[r] ? "left" : "right"}</b> (shorter) side — its water level is already decided.`)
          if (heights[l] <= heights[r]) {
            leftMax = Math.max(leftMax, heights[l])
            vars({ l, r, leftMax, rightMax, water })
            line(6, `leftMax = ${leftMax}. Since heights[r]=${heights[r]} ≥ heights[l], some right wall ≥ ${heights[l]} exists → <b>min(leftMax, rightMax) = leftMax</b> here.`)
            const add = leftMax - heights[l]
            water += add
            settled.push(l)
            mark("good", [...settled])
            vars({ l, r, leftMax, rightMax, water })
            line(7, `Bar ${l} holds leftMax − height = ${leftMax} − ${heights[l]} = <b>${add}</b> unit${add === 1 ? "" : "s"}. water = ${water}. This cell is settled.`)
            l++
            line(8, `Move l inward to ${l}.`)
          } else {
            rightMax = Math.max(rightMax, heights[r])
            vars({ l, r, leftMax, rightMax, water })
            line(10, `rightMax = ${rightMax}. Since heights[l]=${heights[l]} > heights[r], some left wall > ${heights[r]} exists → <b>min(leftMax, rightMax) = rightMax</b> here.`)
            const add = rightMax - heights[r]
            water += add
            settled.push(r)
            mark("good", [...settled])
            vars({ l, r, leftMax, rightMax, water })
            line(11, `Bar ${r} holds rightMax − height = ${rightMax} − ${heights[r]} = <b>${add}</b> unit${add === 1 ? "" : "s"}. water = ${water}. This cell is settled.`)
            r--
            line(12, `Move r inward to ${r}.`)
          }
          ptr("l", l); ptr("r", r)
        }
        mark("focus", [])
        line(15, `Pointers met — total trapped water = <b>${water}</b>.`)
        return water
      },
      1,
    )
    narrate("Two pointers, no extra arrays: always settle the shorter side, because the taller far wall guarantees which max is the limiting one.")
    return go()
  },
}
