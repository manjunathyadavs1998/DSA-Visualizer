import type { SolutionDef } from "@/engine/types"

export const solvingQuestionsWithBrainpower: SolutionDef = {
  code: `// solve question i → earn points[i], skip the next brain[i]
function most(i) {
  if (i >= n) return 0;
  if (memo[i] !== undefined) return memo[i];
  const solve = points[i] + most(i + brain[i] + 1);
  const skip = most(i + 1);
  memo[i] = Math.max(solve, skip);
  return memo[i];
}`,
  codeJava: `// int[] points, brain; Long[] memo
long most(int i) {
  if (i >= n) return 0;
  if (memo[i] != null) return memo[i];
  long solve = points[i] + most(i + brain[i] + 1);
  long skip = most(i + 1);
  memo[i] = Math.max(solve, skip);
  return memo[i];
}`,
  inputs: [
    { kind: "numbers", name: "points", label: "points", default: [3, 4, 4, 2, 5], maxLen: 8 },
    { kind: "numbers", name: "brainpower", label: "brainpower", default: [2, 1, 3, 1, 2], maxLen: 8 },
  ],
  entry: () => `most(0)`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    let points = (args.points as number[]).map((x) => Math.max(0, Math.trunc(x)))
    let brain = (args.brainpower as number[]).map((x) => Math.max(0, Math.trunc(x)))
    const n0 = Math.min(points.length, brain.length)
    points = points.slice(0, n0)
    brain = brain.slice(0, n0)
    if (!points.length) {
      points = [3, 4, 4, 2, 5]
      brain = [2, 1, 3, 1, 2]
    }
    const n = points.length
    heap("points", points)
    heap("brainpower", brain)
    const most = fn(
      "most",
      (i: number): number => {
        line(2, `most(${i}): past the exam's last question? (${i >= n ? "<b>yes — 0 points left</b>" : "no"})`)
        if (i >= n) return 0
        line(3, `most(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(4, `most(${i}): SOLVE for <b>${points[i]}</b> pts — brainpower ${brain[i]} locks questions ${i + 1}..${Math.min(n - 1, i + brain[i])}, resume at most(${i + brain[i] + 1}).`)
        const solve = points[i] + most(i + brain[i] + 1)
        line(5, `most(${i}): or SKIP question ${i} → most(${i + 1}).`)
        const skip = most(i + 1)
        vars({ i, solve, skip })
        line(6, `most(${i}) = max(solve ${solve}, skip ${skip}) = <b>${Math.max(solve, skip)}</b> → memo[${i}].`)
        memo[i] = Math.max(solve, skip)
        return Math.max(solve, skip)
      },
      1,
    )
    narrate("House Robber with a variable gap: solving question i freezes you for brainpower[i] questions, not just one.")
    return most(0)
  },
}
