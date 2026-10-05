import type { SolutionDef } from "@/engine/types"

export const countDistinctElementsInWindow: SolutionDef = {
  code: `// count = live map of values inside the window
function countDistinct(nums, k) {
  const answers = [];
  let distinct = 0;
  for (let r = 0; r < nums.length; r++) {
    if (!count[nums[r]]) distinct++;      // value enters
    count[nums[r]] = (count[nums[r]] || 0) + 1;
    if (r >= k) {                         // window full → slide
      count[nums[r - k]]--;               // value leaves
      if (count[nums[r - k]] === 0) distinct--;
    }
    if (r >= k - 1) answers.push(distinct);
  }
  return answers;
}`,
  codeJava: `// Map<Integer, Integer> count = new HashMap<>();
List<Integer> countDistinct(int[] nums, int k) {
  List<Integer> answers = new ArrayList<>();
  int distinct = 0;
  for (int r = 0; r < nums.length; r++) {
    if (count.getOrDefault(nums[r], 0) == 0) distinct++; // enters
    count.merge(nums[r], 1, Integer::sum);
    if (r >= k) {                         // window full → slide
      count.merge(nums[r - k], -1, Integer::sum);        // leaves
      if (count.get(nums[r - k]) == 0) distinct--;
    }
    if (r >= k - 1) answers.add(distinct);
  }
  return answers;
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "nums", default: [1, 2, 1, 3, 4, 2, 3], maxLen: 12 },
    { kind: "number", name: "k", label: "k (window size)", default: 4, min: 1, max: 12 },
  ],
  view: "array",
  array: (a) => a.numbers as number[],
  entry: (a) => `countDistinct(${a.k})`,
  run({ fn, memo, line, vars, ptr, mark, heap, narrate }, args) {
    const nums = args.numbers as number[]
    const k = Math.min(args.k as number, nums.length)
    const go = fn(
      "countDistinct",
      (kk: number): string => {
        const answers: number[] = []
        let distinct = 0
        heap("answers", answers)
        for (let r = 0; r < nums.length; r++) {
          const v = nums[r]
          const l = Math.max(0, r - kk + 1)
          ptr("r", r)
          ptr("l", l)
          const range: number[] = []
          for (let i = l; i <= r; i++) range.push(i)
          mark("window", range)
          line(4, `r=${r}: value <b>${v}</b> enters the window.`)
          const before = (memo[v] as number | undefined) ?? 0
          if (before === 0) {
            distinct++
            line(5, `${v} was not in the window (count 0) → a NEW distinct value: distinct ${distinct - 1} → <b>${distinct}</b>.`)
          } else {
            line(5, `${v} is already in the window (count ${before}) — a duplicate, distinct stays ${distinct}.`)
          }
          memo[v] = before + 1
          line(6, `count[${v}]: ${before} → ${before + 1}.`)
          if (r >= kk) {
            const u = nums[r - kk]
            const c = (memo[u] as number) - 1
            memo[u] = c
            line(8, `Slide: ${u} (index ${r - kk}) falls out of the window. count[${u}] → ${c}.`)
            if (c === 0) {
              distinct--
              line(9, `count[${u}] hit 0 — ${u} has left the window entirely: distinct → <b>${distinct}</b>.`)
            }
          }
          vars({ r, distinct })
          if (r >= kk - 1) {
            answers.push(distinct)
            heap("answers", answers)
            line(11, `Window [${l}..${r}] is complete → record <b>${distinct}</b> distinct values.`)
          }
        }
        line(13, `All windows done → ${JSON.stringify(answers)}.`)
        return JSON.stringify(answers)
      },
      1,
    )
    narrate(`Never recount a window from scratch: the value entering gets +1, the value leaving gets −1, and distinct only changes when a count crosses zero. The memo table below is the live count map.`)
    return go(k)
  },
}
