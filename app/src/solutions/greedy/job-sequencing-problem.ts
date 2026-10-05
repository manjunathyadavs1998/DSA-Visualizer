import type { SolutionDef } from "@/engine/types"

/** Pair profit/deadline (deadline clamped to 1..9 to keep the slot array tiny)
 *  and sort by profit desc — shared by array() and run(). */
const jobsOf = (profits: number[], deadlines: number[]): [number, number][] =>
  profits
    .map((p, i) => [p, Math.min(Math.max(deadlines[i] ?? 1, 1), 9)] as [number, number])
    .sort((a, b) => b[0] - a[0])

export const jobSequencingProblem: SolutionDef = {
  view: "array",
  // each cell is one job: "profit@deadline", greedily ordered by profit desc
  array: (a) => jobsOf(a.profits as number[], a.deadlines as number[]).map(([p, d]) => `${p}@${d}`),
  code: `// job i: earn profit[i] if done by deadline[i]; 1 slot each
function jobSequencing(profit, deadline) {
  const jobs = profit.map((p, i) => [p, deadline[i]]);
  jobs.sort((a, b) => b[0] - a[0]);      // profit desc
  const maxD = Math.max(...deadline);
  const slot = new Array(maxD).fill(-1); // free time slots
  let count = 0, total = 0;
  for (const [p, d] of jobs) {
    for (let s = d - 1; s >= 0; s--) {   // latest free slot
      if (slot[s] === -1) {
        slot[s] = p;
        count++; total += p;
        break;
      }
    }
  }
  return [count, total];
}`,
  codeJava: `// job i: earn profit[i] if done by deadline[i]; 1 slot each
int[] jobSequencing(int[] profit, int[] deadline) {
  int[][] jobs = pairUp(profit, deadline);
  Arrays.sort(jobs, (a, b) -> b[0] - a[0]);  // profit desc
  int maxD = Arrays.stream(deadline).max().getAsInt();
  int[] slot = new int[maxD]; Arrays.fill(slot, -1);
  int count = 0, total = 0;
  for (int[] job : jobs) {
    for (int s = job[1] - 1; s >= 0; s--) {  // latest free slot
      if (slot[s] == -1) {
        slot[s] = job[0];
        count++; total += job[0];
        break;
      }
    }
  }
  return new int[]{count, total};
}`,
  inputs: [
    { kind: "numbers", name: "profits", label: "profits", default: [100, 19, 27, 25, 15], maxLen: 8 },
    { kind: "numbers", name: "deadlines", label: "deadlines (1-9)", default: [2, 1, 2, 1, 1], maxLen: 8 },
  ],
  entry: () => `jobSequencing(profits, deadlines)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const jobs = jobsOf(args.profits as number[], args.deadlines as number[])
    const solve = fn(
      "jobSequencing",
      (): string => {
        line(3, `Sort jobs by <b>profit desc</b>: the richest job should get first pick of the time slots.`)
        const maxD = Math.max(1, ...jobs.map(([, d]) => d))
        line(4, `Latest deadline is <b>${maxD}</b> — so at most ${maxD} jobs can ever be scheduled.`)
        const slot: (number | string)[] = new Array(maxD).fill("·")
        heap("slots", slot)
        line(5, `One slot per time unit (1..${maxD}), all free.`)
        let count = 0, total = 0
        vars({ count, total })
        const placed: number[] = []
        const dropped: number[] = []
        for (let k = 0; k < jobs.length; k++) {
          const [p, d] = jobs[k]
          ptr("job", k)
          mark("focus", [k])
          line(7, `Job <b>${p}@${d}</b>: worth ${p}, must finish by time ${d}.`)
          let done = false
          for (let s = d - 1; s >= 0; s--) {
            line(8, `Try slot <b>${s + 1}</b> — as <b>late</b> as possible, keeping earlier slots free for tighter deadlines.`)
            if (slot[s] === "·") {
              slot[s] = p
              heap("slots", slot)
              line(10, `Slot ${s + 1} is free → job <b>${p}</b> runs there.`)
              count++
              total += p
              vars({ count, total })
              line(11, `count = <b>${count}</b>, total profit = <b>${total}</b>.`)
              placed.push(k)
              mark("good", placed)
              done = true
              break
            }
            narrate(`Slot ${s + 1} already holds ${slot[s]} — step one slot earlier.`)
          }
          if (!done) {
            dropped.push(k)
            mark("bad", dropped)
            narrate(`No free slot by deadline ${d} — job <b>${p}</b> is dropped.`)
          }
        }
        mark("focus", [])
        ptr("job", -1)
        line(16, `Scheduled <b>${count}</b> jobs for a total profit of <b>${total}</b>.`)
        return `${count} jobs, profit ${total}`
      },
      1,
    )
    narrate(`Greedy: take the highest-profit job first and park it in the <b>latest</b> free slot before its deadline.`)
    return solve()
  },
}
