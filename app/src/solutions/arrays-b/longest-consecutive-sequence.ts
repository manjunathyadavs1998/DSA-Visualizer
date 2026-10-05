import type { SolutionDef } from "@/engine/types"

export const longestConsecutive: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums is editable below
function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue;   // not a sequence start
    let len = 1;
    while (set.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`,
  codeJava: `// int[] nums is editable below
int longestConsecutive(int[] nums) {
  Set<Integer> set = new HashSet<>(); for (int x : nums) set.add(x);
  int best = 0;
  for (int n : set) {
    if (set.contains(n - 1)) continue;  // not a sequence start
    int len = 1;
    while (set.contains(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [100, 4, 200, 1, 3, 2], maxLen: 10 }],
  entry: () => `longestConsecutive(nums)`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const idxOf = (v: number) => nums.indexOf(v)
    const go = fn(
      "longestConsecutive",
      (): number => {
        const set = new Set(nums)
        heap("set", [...set])
        line(2, `Dump every value into a set — membership checks become O(1).`)
        let best = 0
        let bestIdx: number[] = []
        vars({ best })
        for (const n of set) {
          ptr("n", idxOf(n))
          if (set.has(n - 1)) {
            line(5, `${n}: ${n - 1} is in the set, so ${n} sits <b>inside</b> a run someone else will start — skip it.`)
            continue
          }
          line(5, `${n}: ${n - 1} is NOT in the set → ${n} is a <b>sequence start</b>. Only starts expand.`)
          let len = 1
          const runIdx = [idxOf(n)]
          mark("window", [...runIdx])
          line(6, `Start a fresh run at ${n}, length 1.`)
          while (set.has(n + len)) {
            runIdx.push(idxOf(n + len))
            len++
            mark("window", [...runIdx])
            vars({ n, len, best })
            line(7, `${n + len - 1} is in the set → run extends to ${n}…${n + len - 1}, length <b>${len}</b>.`)
          }
          if (len > best) {
            best = len
            bestIdx = [...runIdx]
            mark("good", bestIdx)
          }
          vars({ n, len, best })
          line(8, `Run from ${n} has length ${len}; best so far = <b>${best}</b>.`)
        }
        mark("window", [])
        line(10, `Every element visited at most twice → O(n). Longest streak = <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate("The trick: only numbers whose n−1 is missing start a run, so each chain is walked exactly once despite the nested-looking loops.")
    return go()
  },
}
