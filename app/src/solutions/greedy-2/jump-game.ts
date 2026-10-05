import type { SolutionDef } from "@/engine/types"

const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(0, Math.trunc(Math.abs(v))))
  return out.length ? out : [2, 3, 1, 1, 4]
}

export const jumpGame: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// track the farthest index reachable so far
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;  // gap: i is unreachable
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}`,
  codeJava: `// track the farthest index reachable so far
boolean canJump(int[] nums) {
  int farthest = 0;
  for (int i = 0; i < nums.length; i++) {
    if (i > farthest) return false;  // gap: i is unreachable
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (nums[i] = max jump length from i)", default: [2, 3, 1, 1, 0, 2, 1], maxLen: 12 },
  ],
  entry: (a) => `canJump([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const n = nums.length
    const solve = fn(
      "canJump",
      (): boolean => {
        let farthest = 0
        vars({ farthest })
        line(2, `One number is enough: <b>farthest</b>, the rightmost index any combination of jumps can reach so far.`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          ptr("farthest", Math.min(farthest, n - 1))
          mark("focus", [i])
          mark("window", Array.from({ length: Math.min(farthest, n - 1) + 1 }, (_, k) => k))
          line(4, `i = ${i}: are we standing past everything reachable? ${i} > ${farthest} → ${i > farthest ? "<b>yes — stranded!</b>" : `no, index ${i} is reachable`}.`)
          if (i > farthest) {
            mark("bad", [i])
            line(4, `Index <b>${i}</b> can never be reached — a 0 wall blocked us → return <b>false</b>.`)
            return false
          }
          const reach = i + nums[i]
          if (reach > farthest) {
            farthest = reach
            vars({ farthest })
            line(5, `From i=${i} we can jump nums[${i}]=${nums[i]} → new farthest = <b>${farthest}</b>.`)
          } else {
            line(5, `i + nums[${i}] = ${reach} doesn't beat farthest = ${farthest} — no progress from here.`)
          }
          if (farthest >= n - 1) {
            mark("good", [n - 1])
            line(6, `farthest ${farthest} ≥ last index ${n - 1} → the end is reachable, return <b>true</b>.`)
            return true
          }
        }
        line(8, `Scanned everything without stranding → <b>true</b>.`)
        return true
      },
      1,
    )
    narrate(`Greedy insight: you never need to decide WHERE to jump — only whether the reachable frontier ever falls behind you.`)
    return solve()
  },
}
