import type { SolutionDef } from "@/engine/types"

export const largestRectangleInHistogram: SolutionDef = {
  view: "array",
  array: (a) => a.heights as number[],
  code: `// heights is editable below
function largestRectangle(heights) {
  const stack = [];   // indices with increasing heights
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack.at(-1)] > h) {
      const top = stack.pop();
      const width = stack.length ? i - stack.at(-1) - 1 : i;
      best = Math.max(best, heights[top] * width);
    }
    stack.push(i);
  }
  return best;
}`,
  codeJava: `// int[] heights is editable below
int largestRectangle(int[] heights) {
  Deque<Integer> stack = new ArrayDeque<>(); // increasing heights
  int best = 0;
  for (int i = 0; i <= heights.length; i++) {
    int h = i == heights.length ? 0 : heights[i];
    while (!stack.isEmpty() && heights[stack.peek()] > h) {
      int top = stack.pop();
      int width = stack.isEmpty() ? i : i - stack.peek() - 1;
      best = Math.max(best, heights[top] * width);
    }
    stack.push(i);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "heights", label: "heights", default: [2, 1, 5, 6, 2, 3], maxLen: 10 }],
  entry: (a) => `largestRectangle([${(a.heights as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const heights = args.heights as number[]
    const n = heights.length
    const span = (l: number, r: number) => Array.from({ length: r - l + 1 }, (_, x) => l + x)
    const go = fn(
      "largestRectangle",
      (): number => {
        const stack: number[] = []
        let best = 0
        let bestSpan: number[] = []
        heap("stack", [])
        line(3, `best = 0. The stack keeps bar indices with <b>increasing</b> heights — a bar stays as long as it might still grow wider.`)
        vars({ best })
        for (let i = 0; i <= n; i++) {
          const h = i === n ? 0 : heights[i]
          if (i < n) {
            ptr("i", i)
            mark("focus", [i])
          } else {
            ptr("i", -1)
            mark("focus", [])
          }
          line(5, i === n
            ? `i = ${i}: past the end — a phantom bar of height <b>0</b> forces every survivor to settle up.`
            : `i = ${i}: bar of height <b>${h}</b>.`)
          vars({ i, h, best })
          while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
            const top = stack.pop() as number
            heap("stack", stack)
            line(7, `Top bar ${top} (height ${heights[top]}) is <b>taller than ${h}</b> — it can never stretch past i = ${i}. Pop it: this is the exact moment its widest rectangle is known.`)
            const left = stack.length > 0 ? stack[stack.length - 1] + 1 : 0
            const width = i - left
            mark("window", span(left, i - 1))
            line(8, `Width: from index ${left} (just right of the next-shorter bar) to ${i - 1} → <b>${width}</b> columns, all at least ${heights[top]} tall.`)
            const area = heights[top] * width
            if (area > best) {
              best = area
              bestSpan = span(left, i - 1)
              line(9, `Area = ${heights[top]} × ${width} = <b>${area}</b> — new best!`)
            } else {
              line(9, `Area = ${heights[top]} × ${width} = ${area} — best stays ${best}.`)
            }
            mark("good", bestSpan)
            vars({ i, h, best })
          }
          stack.push(i)
          heap("stack", stack)
          if (i < n) line(11, `Push index ${i}. Stack heights bottom-up: [${stack.filter((k) => k < n).map((k) => heights[k]).join(", ")}] — increasing, so each bar's <b>left boundary</b> is the index beneath it.`)
        }
        mark("window", [])
        mark("good", bestSpan)
        line(13, `Every bar was pushed once and popped once (O(n)). Largest rectangle: <b>${best}</b>.`)
        return best
      },
      1,
    )
    return go()
  },
}
