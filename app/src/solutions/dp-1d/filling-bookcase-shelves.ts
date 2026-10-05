import type { SolutionDef } from "@/engine/types"

export const fillingBookcaseShelves: SolutionDef = {
  code: `// start a new shelf at book i; extend it while the width fits
function minHeight(i) {
  if (i === n) return 0;
  if (memo[i] !== undefined) return memo[i];
  let width = 0, tallest = 0, best = Infinity;
  for (let j = i; j < n && width + w[j] <= shelfW; j++) {
    width += w[j];
    tallest = Math.max(tallest, h[j]);
    best = Math.min(best, tallest + minHeight(j + 1));
  }
  memo[i] = best;
  return best;
}`,
  codeJava: `// int[] w, h; int shelfW; Integer[] memo; int INF = 1_000_000
int minHeight(int i) {
  if (i == n) return 0;
  if (memo[i] != null) return memo[i];
  int width = 0, tallest = 0, best = INF;
  for (int j = i; j < n && width + w[j] <= shelfW; j++) {
    width += w[j];
    tallest = Math.max(tallest, h[j]);
    best = Math.min(best, tallest + minHeight(j + 1));
  }
  memo[i] = best;
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "widths", label: "book widths", default: [1, 2, 2, 1, 1], maxLen: 8 },
    { kind: "numbers", name: "heights", label: "book heights", default: [1, 3, 3, 1, 1], maxLen: 8 },
    { kind: "number", name: "shelfWidth", label: "shelf width", default: 4, min: 1, max: 10 },
  ],
  entry: () => `minHeight(0)`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    let w = (args.widths as number[]).map((x) => Math.max(1, Math.trunc(x)))
    let h = (args.heights as number[]).map((x) => Math.max(1, Math.trunc(x)))
    const n0 = Math.min(w.length, h.length)
    w = w.slice(0, n0)
    h = h.slice(0, n0)
    if (!w.length) {
      w = [1, 2, 2, 1, 1]
      h = [1, 3, 3, 1, 1]
    }
    const n = w.length
    // every book must fit on SOME shelf, or the recursion has no valid move
    const shelfW = Math.max(Math.max(...w), Math.min(10, Math.trunc(args.shelfWidth as number) || 1))
    heap("widths", w)
    heap("heights", h)
    const minHeight = fn(
      "minHeight",
      (i: number): number => {
        line(2, `minHeight(${i}): all books shelved? (${i === n ? "<b>yes — height 0</b>" : "no"})`)
        if (i === n) return 0
        line(3, `minHeight(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        let width = 0
        let tallest = 0
        let best = Infinity
        line(4, `minHeight(${i}): open a NEW shelf (capacity ${shelfW}) starting with book ${i}.`)
        for (let j = i; j < n && width + w[j] <= shelfW; j++) {
          width += w[j]
          tallest = Math.max(tallest, h[j])
          line(8, `shelf holds books ${i}..${j} (width ${width}/${shelfW}, tallest <b>${tallest}</b>) → ${tallest} + minHeight(${j + 1}).`)
          best = Math.min(best, tallest + minHeight(j + 1))
          vars({ i, j, width, tallest, best })
        }
        line(10, `minHeight(${i}) = <b>${best}</b> → memo[${i}]. The shelf's cost is its TALLEST book.`)
        memo[i] = best
        return best
      },
      1,
    )
    narrate("Books stay in order; only choice is where each shelf ends. A shelf costs its tallest book — pack more only if it pays.")
    return minHeight(0)
  },
}
