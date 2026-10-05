import type { SolutionDef } from "@/engine/types"

const span = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const containerWithMostWater: SolutionDef = {
  view: "array",
  array: (a) => a.height as number[],
  code: `// widest container first; always move the shorter wall inward
function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    best = Math.max(best, area);
    if (height[left] < height[right]) {
      left++;             // the shorter wall caps the area — replace it
    } else {
      right--;
    }
  }
  return best;
}`,
  codeJava: `// widest container first; always move the shorter wall inward
int maxArea(int[] height) {
  int left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    int area = (right - left) * Math.min(height[left], height[right]);
    best = Math.max(best, area);
    if (height[left] < height[right]) {
      left++;             // the shorter wall caps the area — replace it
    } else {
      right--;
    }
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "height", label: "height", default: [1, 8, 6, 2, 5, 4, 8, 3, 7], maxLen: 12 },
  ],
  entry: (a) => `maxArea([${(a.height as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const height = (args.height as number[]).map((x) => Math.max(0, Math.trunc(x)))
    while (height.length < 2) height.push(1)
    const go = fn(
      "maxArea",
      (): number => {
        let left = 0
        let right = height.length - 1
        let best = 0
        let bestPair: [number, number] = [0, height.length - 1]
        ptr("left", left)
        ptr("right", right)
        line(2, `Start with the <b>widest</b> container: walls ${height[left]} and ${height[right]}, width ${right - left}.`)
        while (left < right) {
          mark("window", span(left, right))
          mark("focus", [left, right])
          const area = (right - left) * Math.min(height[left], height[right])
          line(4, `area = width ${right - left} × min(${height[left]}, ${height[right]}) = <b>${area}</b>.`)
          if (area > best) {
            best = area
            bestPair = [left, right]
            line(5, `That beats the old best → best = <b>${best}</b>.`)
          } else {
            line(5, `Not better — best stays <b>${best}</b>.`)
          }
          vars({ left, right, area, best })
          if (height[left] < height[right]) {
            line(6, `Left wall ${height[left]} < right wall ${height[right]} — the short wall is the bottleneck.`)
            left++
            ptr("left", left)
            line(7, `Keeping the short wall can never win (width only shrinks) → left moves to <b>${left}</b>.`)
          } else {
            line(6, `Right wall ${height[right]} ≤ left wall ${height[left]} — the right wall is the bottleneck.`)
            right--
            ptr("right", right)
            line(9, `Move the shorter (right) wall inward → right moves to <b>${right}</b>.`)
          }
        }
        mark("window", [])
        mark("focus", [])
        mark("good", bestPair)
        line(12, `Pointers met. Best container uses walls at ${bestPair[0]} and ${bestPair[1]} holding <b>${best}</b> units — one O(n) sweep.`)
        return best
      },
      1,
    )
    return go()
  },
}
