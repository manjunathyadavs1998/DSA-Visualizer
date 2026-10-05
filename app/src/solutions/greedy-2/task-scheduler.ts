import type { SolutionDef } from "@/engine/types"

const sanitize = (s: string): string => {
  const t = s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 14)
  return t.length ? t : "AAABBBCCD"
}

export const taskScheduler: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.tasks as string).split(""),
  code: `// only the MOST frequent task can force idle gaps
function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  let maxF = 0;
  for (const f of freq) maxF = Math.max(maxF, f);
  let maxCount = 0;
  for (const f of freq) if (f === maxF) maxCount++;
  const frame = (maxF - 1) * (n + 1) + maxCount;
  return Math.max(frame, tasks.length);
}`,
  codeJava: `// only the MOST frequent task can force idle gaps
int leastInterval(char[] tasks, int n) {
  int[] freq = new int[26];
  for (char t : tasks) freq[t - 'A']++;
  int maxF = 0;
  for (int f : freq) maxF = Math.max(maxF, f);
  int maxCount = 0;
  for (int f : freq) if (f == maxF) maxCount++;
  int frame = (maxF - 1) * (n + 1) + maxCount;
  return Math.max(frame, tasks.length);
}`,
  inputs: [
    { kind: "string", name: "tasks", label: "tasks (letters A–Z)", default: "AAABBBCCD", maxLen: 14 },
    { kind: "number", name: "n", label: "n (cooldown slots between equal tasks)", default: 2, min: 0, max: 6 },
  ],
  entry: (a) => `leastInterval("${sanitize(a.tasks as string)}".toCharArray(), ${Math.max(0, Math.trunc(a.n as number))})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const tasks = sanitize(args.tasks as string)
    const n = Math.max(0, Math.trunc(args.n as number))
    const solve = fn(
      "leastInterval",
      (): number => {
        const freq: Record<string, number> = {}
        line(2, `Count each task type — scheduling order doesn't matter, only the <b>multiset of counts</b>.`)
        for (let i = 0; i < tasks.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          freq[tasks[i]] = (freq[tasks[i]] || 0) + 1
          heap("freq", { ...freq })
          line(3, `'${tasks[i]}' → count ${freq[tasks[i]]}.`)
        }
        ptr("i", -1)
        mark("focus", [])
        let maxF = 0
        for (const f of Object.values(freq)) maxF = Math.max(maxF, f)
        vars({ maxF })
        mark("good", tasks.split("").map((c, k) => (freq[c] === maxF ? k : -1)).filter((k) => k >= 0))
        line(5, `Most frequent count maxF = <b>${maxF}</b> — that task dictates the skeleton of the schedule.`)
        let maxCount = 0
        for (const f of Object.values(freq)) if (f === maxF) maxCount++
        vars({ maxF, maxCount })
        line(7, `<b>${maxCount}</b> task type${maxCount > 1 ? "s" : ""} share${maxCount > 1 ? "" : "s"} that top count — they all ride in the final block.`)
        const frame = (maxF - 1) * (n + 1) + maxCount
        vars({ maxF, maxCount, frame })
        line(8, `Skeleton: ${maxF - 1} full chunks of size n+1 = ${n + 1}, plus the last block of ${maxCount} → frame = (${maxF}−1)·${n + 1} + ${maxCount} = <b>${frame}</b>.`)
        narrate(`Picture it: A _ _ A _ _ A — the gaps absorb every other task. If tasks overflow the gaps, there are simply no idles at all.`)
        line(9, `Answer = max(frame ${frame}, total tasks ${tasks.length}) = <b>${Math.max(frame, tasks.length)}</b>.`)
        return Math.max(frame, tasks.length)
      },
      1,
    )
    narrate(`Greedy counting beats simulation: either the cooldown skeleton dominates (idles exist) or the task count does (no idles).`)
    return solve()
  },
}
