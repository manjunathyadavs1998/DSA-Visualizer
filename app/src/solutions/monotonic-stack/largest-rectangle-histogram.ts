import type { SolutionDef } from "@/engine/types"

export const largestRectangleHistogram: SolutionDef = {
  view: "array",
  array: (a) => a.heights as number[],
  code: `// heights is editable below
function largestRectangleArea(heights) {
  const stack = []; // indices, heights are increasing
  let maxArea = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i < heights.length ? heights[i] : 0;
    while (stack.length && heights[stack.at(-1)] > h) {
      const height = heights[stack.pop()];
      const width = stack.length ? i - stack.at(-1) - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
  codeJava: `int largestRectangleArea(int[] heights) {
  Deque<Integer> stack = new ArrayDeque<>();
  int maxArea = 0;
  for (int i = 0; i <= heights.length; i++) {
    int h = i < heights.length ? heights[i] : 0;
    while (!stack.isEmpty() && heights[stack.peek()] > h) {
      int height = heights[stack.pop()];
      int width = stack.isEmpty() ? i : i - stack.peek() - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
  inputs: [{ kind: "numbers", name: "heights", label: "heights", default: [2, 1, 5, 6, 2, 3], maxLen: 8 }],
  entry: (a) => `largestRectangleArea([${(a.heights as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const heights = args.heights as number[]
    const go = fn("largestRectangleArea", (): number => {
      const stack: number[] = []
      let maxArea = 0
      heap("stack", [])
      line(1, `Stack holds bar indices in <b>increasing height order</b>. When a shorter bar arrives, pop and compute rectangles.`)
      for (let i = 0; i <= heights.length; i++) {
        const h = i < heights.length ? heights[i] : 0
        ptr("i", Math.min(i, heights.length - 1))
        mark("focus", i < heights.length ? [i] : [])
        vars({ i, h, maxArea })
        if (i < heights.length)
          line(4, `i=${i}, h=${h}. Pop all taller bars — they can't extend past here.`)
        else
          line(4, `Sentinel h=0 — flush all remaining bars from the stack.`)
        while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
          const top = stack.pop()!
          const height = heights[top]
          const width = stack.length > 0 ? i - stack[stack.length - 1] - 1 : i
          const area = height * width
          maxArea = Math.max(maxArea, area)
          vars({ i, h, maxArea, height, width, area })
          mark("good", [top])
          heap("stack", stack.map(k => `${k}:${heights[k]}`))
          line(7, `Pop index ${top} (h=${height}): width=${width} (extends left to after index ${stack.length > 0 ? stack[stack.length-1] : -1}). Area=${area}. maxArea=<b>${maxArea}</b>.`)
        }
        stack.push(i)
        heap("stack", stack.filter(k => k < heights.length).map(k => `${k}:${heights[k]}`))
        if (i < heights.length)
          line(9, `Push ${i}. Stack is increasing: [${stack.filter(k => k < heights.length).map(k => heights[k]).join(",")}].`)
      }
      ptr("i", -1)
      mark("focus", [])
      line(11, `Largest rectangle area: <b>${maxArea}</b>.`)
      return maxArea
    }, 1)
    return go()
  },
}
