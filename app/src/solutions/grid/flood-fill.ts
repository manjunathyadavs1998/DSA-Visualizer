import type { SolutionDef } from "@/engine/types"

const M = [[1, 1, 1, 0], [1, 1, 0, 2], [1, 0, 2, 2], [0, 2, 2, 2]]

export const floodFill: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// paint the connected region of (sr, sc) with newColor
function fill(r, c) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (img[r][c] !== oldColor) return;  // different region
  img[r][c] = newColor;                // paint this pixel
  fill(r + 1, c);  // down
  fill(r - 1, c);  // up
  fill(r, c + 1);  // right
  fill(r, c - 1);  // left
}`,
  codeJava: `// paint the connected region of (sr, sc) with newColor
void fill(int r, int c) {
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (img[r][c] != oldColor) return;   // different region
  img[r][c] = newColor;                // paint this pixel
  fill(r + 1, c);  // down
  fill(r - 1, c);  // up
  fill(r, c + 1);  // right
  fill(r, c - 1);  // left
}`,
  inputs: [],
  entry: () => `fill(0, 0)  // paint region of 1s with 9`,
  run({ fn, line, gmark, gset, gptr }) {
    const img = M.map((r) => [...r])
    const oldColor = 1, newColor = 9
    const fill = fn(
      "fill",
      (r: number, c: number): string => {
        gptr("rc", Math.max(-1, Math.min(3, r)), Math.max(-1, Math.min(3, c)))
        if (r < 0 || c < 0 || r >= 4 || c >= 4) {
          line(2, `(${r},${c}) is off the image → stop this direction.`)
          return "off"
        }
        if (img[r][c] !== oldColor) {
          line(3, `(${r},${c}) = ${img[r][c]} ≠ old color ${oldColor} → different region (or already painted), stop.`)
          gmark("bad", [[r, c]])
          return "skip"
        }
        line(4, `(${r},${c}) is old color ${oldColor} → <b>paint it ${newColor}</b>, then spread 4 ways.`)
        img[r][c] = newColor
        gset(r, c, newColor)
        gmark("good", [[r, c]])
        fill(r + 1, c)
        fill(r - 1, c)
        fill(r, c + 1)
        fill(r, c - 1)
        return "✓"
      },
      1,
    )
    return fill(0, 0)
  },
}
