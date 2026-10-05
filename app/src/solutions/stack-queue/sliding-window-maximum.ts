import type { SolutionDef } from "@/engine/types"

export const slidingWindowMaximum: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums and k are editable below
function maxSlidingWindow(nums, k) {
  const deque = [];   // indices, values decreasing
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (deque[0] === i - k) deque.shift();     // stale: left the window
    while (deque.length && nums[deque.at(-1)] < nums[i])
      deque.pop();                             // smaller tails can never win
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
  codeJava: `// int[] nums and int k are editable below
int[] maxSlidingWindow(int[] nums, int k) {
  Deque<Integer> deque = new ArrayDeque<>(); // indices, values decreasing
  List<Integer> result = new ArrayList<>();
  for (int i = 0; i < nums.length; i++) {
    if (!deque.isEmpty() && deque.peekFirst() == i - k) deque.pollFirst(); // stale
    while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i])
      deque.pollLast();                        // smaller tails can never win
    deque.addLast(i);
    if (i >= k - 1) result.add(nums[deque.peekFirst()]);
  }
  return result;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [1, 3, -1, -3, 5, 3, 6, 7], maxLen: 10 },
    { kind: "number", name: "k", label: "k (window size)", default: 3, min: 1, max: 5 },
  ],
  entry: (a) => `maxSlidingWindow([${(a.nums as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const nums = args.nums as number[]
    const k = args.k as number
    const go = fn(
      "maxSlidingWindow",
      (): string => {
        const deque: number[] = []
        const result: number[] = []
        const snap = () => heap("deque", deque.map((j) => `${j}:${nums[j]}`))
        heap("deque", [])
        heap("result", result)
        line(2, `The deque holds indices whose values are <b>decreasing</b> — only candidates that could still become a window maximum. The front is always the current max.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          const lo = Math.max(0, i - k + 1)
          mark("focus", [i])
          vars({ i, "nums[i]": nums[i] })
          if (deque.length > 0 && deque[0] === i - k) {
            const stale = deque.shift() as number
            snap()
            line(5, `Front index ${stale} (value ${nums[stale]}) just slid <b>out of the window</b> — it's stale, drop it from the front.`)
          }
          while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            const j = deque.pop() as number
            snap()
            line(7, `Back index ${j} (value ${nums[j]}) is <b>smaller than ${nums[i]}</b> and dies sooner — it can never be a maximum again. Pop it.`)
          }
          deque.push(i)
          snap()
          line(8, `Push index ${i}. Deque values front→back: [${deque.map((j) => nums[j]).join(", ")}] — decreasing, front = biggest.`)
          mark("window", Array.from({ length: i - lo + 1 }, (_, x) => lo + x))
          if (i >= k - 1) {
            result.push(nums[deque[0]])
            heap("result", result)
            mark("good", [deque[0]])
            line(9, `Window [${lo}..${i}] is complete → its max is the deque's <b>front</b>: nums[${deque[0]}] = <b>${nums[deque[0]]}</b>. No rescanning.`)
          } else {
            line(9, `Only ${i + 1} of ${k} elements so far — no full window yet.`)
          }
        }
        mark("focus", [])
        ptr("i", -1)
        line(11, `Each index enters and leaves the deque at most once → <b>O(n)</b> total, versus O(n·k) for rescanning every window.`)
        return JSON.stringify(result)
      },
      1,
    )
    return go()
  },
}
