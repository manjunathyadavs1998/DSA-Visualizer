import type { SolutionDef } from "@/engine/types"

export const maximumProfitInJobScheduling: SolutionDef = {
  code: `// jobs are sorted by start time (editable below)
function dp(i) {
  if (i === n) return 0;  // no jobs left
  if (memo[i] !== undefined) return memo[i];
  const skip = dp(i + 1);        // SKIP job i
  let next = i + 1;              // TAKE job i: find the
  while (next < n && start[next] < end[i]) next++; // next fit
  const take = profit[i] + dp(next);
  memo[i] = Math.max(skip, take);
  return memo[i];
}`,
  codeJava: `// int[] start, end, profit sorted by start; Integer[] memo
int dp(int i) {
  if (i == n) return 0;   // no jobs left
  if (memo[i] != null) return memo[i];
  int skip = dp(i + 1);          // SKIP job i
  int next = i + 1;              // TAKE job i: find the
  while (next < n && start[next] < end[i]) next++; // next fit
  int take = profit[i] + dp(next);
  memo[i] = Math.max(skip, take);
  return memo[i];
}`,
  inputs: [
    { kind: "numbers", name: "startTime", label: "start times", default: [1, 2, 3, 3], maxLen: 4 },
    { kind: "numbers", name: "endTime", label: "end times", default: [3, 4, 5, 6], maxLen: 4 },
    { kind: "numbers", name: "profit", label: "profits", default: [50, 10, 40, 70], maxLen: 4 },
  ],
  entry: () => `dp(0)`,
  run({ fn, memo, line, heap, narrate }, args) {
    const startIn = args.startTime as number[]
    const endIn = args.endTime as number[]
    const profitIn = args.profit as number[]
    const n = Math.min(startIn.length, endIn.length, profitIn.length)
    const order = Array.from({ length: n }, (_, k) => k).sort((p, q) => startIn[p] - startIn[q])
    const start = order.map((k) => startIn[k])
    const end = order.map((k) => endIn[k])
    const profit = order.map((k) => profitIn[k])
    heap("jobs (sorted by start)", start.map((s, k) => `#${k}: [${s}→${end[k]}] $${profit[k]}`))
    const dp = fn(
      "dp",
      (i: number): number => {
        line(2, `dp(${i}): any jobs left? (${i === n ? "<b>no — schedule over, $0 more</b>" : `yes — job ${i} runs [${start[i]}→${end[i]}] for $${profit[i]}`})`)
        if (i === n) return 0
        line(3, `dp(${i}): checking memo[${i}]…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(4, `<b>SKIP</b> job ${i}: keep our options open and consider job ${i + 1}.`)
        const skip = dp(i + 1)
        let next = i + 1
        while (next < n && start[next] < end[i]) next++
        line(6, `<b>TAKE</b> job ${i}: we're busy until ${end[i]}, so skip past every job starting before that → next compatible is ${next === n ? "none" : `job ${next} (starts at ${start[next]})`}.`)
        const take = profit[i] + dp(next)
        memo[i] = Math.max(skip, take)
        line(8, `dp(${i}) = max(skip ${skip}, take $${profit[i]}+${take - profit[i]}=${take}) = <b>${memo[i]}</b>.`)
        return memo[i] as number
      },
      1,
    )
    narrate("Jobs sorted by start. At each job: skip it, or take its profit and jump to the first job that starts after it ends.")
    return dp(0)
  },
}
