import type { SolutionDef } from "@/engine/types"

/** Values ≥ 1 so the end is always reachable (Jump II's own guarantee). */
const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(1, Math.trunc(Math.abs(v)) || 1))
  return out.length ? out : [2, 3, 1, 2, 4, 2, 3]
}

export const jumpGameII: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// BFS over indices: each jump expands one frontier layer
function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {    // current layer exhausted
      jumps++;             // we must jump once more
      curEnd = farthest;   // next layer's right edge
    }
  }
  return jumps;
}`,
  codeJava: `// BFS over indices: each jump expands one frontier layer
int jump(int[] nums) {
  int jumps = 0, curEnd = 0, farthest = 0;
  for (int i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i == curEnd) {     // current layer exhausted
      jumps++;             // we must jump once more
      curEnd = farthest;   // next layer's right edge
    }
  }
  return jumps;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (nums[i] = max jump length; values clamped to ≥ 1)", default: [2, 3, 1, 2, 4, 2, 3], maxLen: 12 },
  ],
  entry: (a) => `jump([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const n = nums.length
    const solve = fn(
      "jump",
      (): number => {
        let jumps = 0
        let curEnd = 0
        let farthest = 0
        vars({ jumps, curEnd, farthest })
        line(2, `Think BFS: layer k = all indices reachable in k jumps. <b>curEnd</b> is the right edge of the current layer.`)
        for (let i = 0; i < n - 1; i++) {
          ptr("i", i)
          ptr("curEnd", Math.min(curEnd, n - 1))
          mark("focus", [i])
          const reach = i + nums[i]
          if (reach > farthest) {
            farthest = reach
            vars({ jumps, curEnd, farthest })
            line(4, `From i=${i}, i + nums[${i}] = ${reach} → farthest = <b>${farthest}</b> (best candidate for the next layer).`)
          } else {
            line(4, `From i=${i}, i + nums[${i}] = ${reach} — farthest stays ${farthest}.`)
          }
          line(5, `Is the current layer used up? i = ${i}${i === curEnd ? " = " : " ≠ "}curEnd = ${curEnd}.`)
          if (i === curEnd) {
            jumps++
            line(6, `Layer exhausted — commit jump #<b>${jumps}</b>.`)
            curEnd = farthest
            vars({ jumps, curEnd, farthest })
            mark("window", Array.from({ length: Math.min(curEnd, n - 1) + 1 }, (_, k) => k))
            line(7, `New layer reaches up to index <b>${curEnd}</b>${curEnd >= n - 1 ? " — that covers the end!" : "."}`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        mark("good", [n - 1])
        line(10, `Minimum jumps to reach index ${n - 1}: <b>${jumps}</b>.`)
        return jumps
      },
      1,
    )
    narrate(`We never pick an exact landing spot — counting how many times the BFS frontier must advance IS the minimum number of jumps.`)
    return solve()
  },
}
