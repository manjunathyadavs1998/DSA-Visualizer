import type { SolutionDef } from "@/engine/types"

export const trappingRainWaterMonotonic: SolutionDef = {
  view: "array",
  array: (a) => a.height as number[],
  code: `// height is editable below
function trap(height) {
  const stack = []; // indices, heights decreasing
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (stack.length && height[stack.at(-1)] < height[i]) {
      const bottom = height[stack.pop()];
      if (!stack.length) break;
      const boundedH = Math.min(height[stack.at(-1)], height[i]) - bottom;
      water += boundedH * (i - stack.at(-1) - 1);
    }
    stack.push(i);
  }
  return water;
}`,
  codeJava: `int trap(int[] height) {
  Deque<Integer> stack = new ArrayDeque<>();
  int water = 0;
  for (int i = 0; i < height.length; i++) {
    while (!stack.isEmpty() && height[stack.peek()] < height[i]) {
      int bottom = height[stack.pop()];
      if (stack.isEmpty()) break;
      int boundedH = Math.min(height[stack.peek()], height[i]) - bottom;
      water += boundedH * (i - stack.peek() - 1);
    }
    stack.push(i);
  }
  return water;
}`,
  inputs: [{ kind: "numbers", name: "height", label: "height", default: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], maxLen: 14 }],
  entry: (a) => `trap([${(a.height as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const height = args.height as number[]
    const go = fn("trap", (): number => {
      const stack: number[] = []
      let water = 0
      heap("stack", [])
      line(1, `Stack holds indices in <b>decreasing height</b> order. A taller bar to the right creates a basin — compute trapped water layer by layer.`)
      for (let i = 0; i < height.length; i++) {
        ptr("i", i)
        mark("focus", [i])
        vars({ i, h: height[i], water })
        while (stack.length > 0 && height[stack[stack.length - 1]] < height[i]) {
          const j = stack.pop()!
          const bottom = height[j]
          if (stack.length === 0) break
          const left = stack[stack.length - 1]
          const boundedH = Math.min(height[left], height[i]) - bottom
          const width = i - left - 1
          const trapped = boundedH * width
          water += trapped
          vars({ i, h: height[i], water, bottom, boundedH, width, trapped })
          mark("window", [left, j, i])
          heap("stack", stack.map(k => `${k}:${height[k]}`))
          line(8, `Basin: bottom=${bottom}, left wall=${height[left]}, right wall=${height[i]}, width=${width}. Trapped=<b>${trapped}</b>. Total=<b>${water}</b>.`)
        }
        stack.push(i)
        heap("stack", stack.map(k => `${k}:${height[k]}`))
        line(10, `Push ${i} (h=${height[i]}). Stack: [${[...stack].reverse().map(k => height[k]).join(",")}].`)
      }
      ptr("i", -1)
      mark("focus", [])
      line(12, `Total trapped water: <b>${water}</b>.`)
      return water
    }, 1)
    return go()
  },
}
