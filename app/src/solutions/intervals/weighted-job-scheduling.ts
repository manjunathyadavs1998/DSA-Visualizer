import type { SolutionDef } from "@/engine/types"

// jobs: [start, end, profit]
const JOBS: [number, number, number][] = [
  [1, 3, 50], [2, 5, 10], [4, 6, 70], [6, 9, 60],
  [5, 8, 30], [3, 7, 20],
]

export const weightedJobScheduling: SolutionDef = {
  view: "array",
  array: () => JOBS.map(j => j[2]),  // show profits
  code: `// jobs = [[start,end,profit], ...] sorted by end time
function jobScheduling(jobs) {
  jobs.sort((a, b) => a[1] - b[1]);
  const dp = [0]; // dp[i] = max profit using first i jobs
  for (let i = 0; i < jobs.length; i++) {
    const [s, e, p] = jobs[i];
    // binary search: latest job that ends <= s
    let lo = 0, hi = i;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (jobs[mid - 1][1] <= s) lo = mid; else hi = mid - 1;
    }
    dp[i + 1] = Math.max(dp[i], dp[lo] + p);
  }
  return dp[jobs.length];
}`,
  codeJava: `int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
  int n = startTime.length;
  int[][] jobs = new int[n][3];
  for (int i = 0; i < n; i++) jobs[i] = new int[]{startTime[i],endTime[i],profit[i]};
  Arrays.sort(jobs, (a,b) -> a[1]-b[1]);
  int[] dp = new int[n+1];
  for (int i = 0; i < n; i++) {
    int lo = 0, hi = i;
    while (lo < hi) {
      int mid = (lo+hi+1)>>1;
      if (jobs[mid-1][1] <= jobs[i][0]) lo=mid; else hi=mid-1;
    }
    dp[i+1] = Math.max(dp[i], dp[lo]+jobs[i][2]);
  }
  return dp[n];
}`,
  inputs: [],
  entry: () => `jobScheduling(6 jobs)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, _args) {
    const jobs = [...JOBS].sort((a, b) => a[1] - b[1])
    const go = fn("jobScheduling", (): number => {
      const dp = [0]
      heap("dp", [...dp])
      line(1, `Sort by end time. dp[i] = max profit using the first i jobs (0-indexed).`)
      for (let i = 0; i < jobs.length; i++) {
        const [s, , p] = jobs[i]
        ptr("i", i)
        mark("focus", [i])
        vars({ i, start: s, profit: p })
        // binary search for latest job ending <= s
        let lo = 0, hi = i
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (jobs[mid - 1][1] <= s) lo = mid; else hi = mid - 1
        }
        dp[i + 1] = Math.max(dp[i], dp[lo] + p)
        vars({ i, start: s, profit: p, compatible: lo, "dp[i+1]": dp[i + 1] })
        heap("dp", [...dp])
        line(10, `Job ${i}: profit=${p}. Latest compatible job ends at index ${lo - 1}. dp[${i + 1}] = max(skip=${dp[i]}, take=${dp[lo]}+${p}) = <b>${dp[i + 1]}</b>.`)
        mark("good", [i])
      }
      ptr("i", -1)
      mark("focus", [])
      line(13, `Maximum profit: <b>${dp[jobs.length]}</b>.`)
      return dp[jobs.length]
    }, 1)
    narrate("Sort by end time. For each job, binary search for the latest non-overlapping job. dp[i+1] = max(skip job i, take job i + best before it).")
    return go()
  },
}
