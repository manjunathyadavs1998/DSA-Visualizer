import type { SolutionDef } from "@/engine/types"

export const matrixChainMultiplication: SolutionDef = {
  code: `// dims: matrix k is dims[k-1] x dims[k] (editable)
function mcm(i, j) {
  if (i === j) return 0;  // one matrix: no multiply needed
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  let best = Infinity;
  for (let k = i; k < j; k++) {           // split after k
    const cost = mcm(i, k) + mcm(k + 1, j)
      + dims[i - 1] * dims[k] * dims[j];  // glue multiply
    best = Math.min(best, cost);
  }
  memo[key] = best;
  return best;
}`,
  codeJava: `// dims: matrix k is dims[k-1] x dims[k] (editable)
int mcm(int i, int j) {
  if (i == j) return 0;   // one matrix: no multiply needed
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  int best = Integer.MAX_VALUE;
  for (int k = i; k < j; k++) {           // split after k
    int cost = mcm(i, k) + mcm(k + 1, j)
      + dims[i - 1] * dims[k] * dims[j];  // glue multiply
    best = Math.min(best, cost);
  }
  memo.put(key, best);
  return best;
}`,
  inputs: [{ kind: "numbers", name: "dims", label: "dims", default: [1, 2, 3, 4, 3], maxLen: 5 }],
  entry: (a) => `mcm(1, ${Math.max(1, (a.dims as number[]).length - 1)})`,
  run({ fn, memo, line, narrate }, args) {
    const dims = args.dims as number[]
    const mcm = fn(
      "mcm",
      (i: number, j: number): number => {
        line(2, `mcm(${i},${j}): a single matrix? (${i === j ? "<b>yes — 0 multiplications</b>" : "no, a chain of " + (j - i + 1)})`)
        if (i >= j) return 0
        const key = i + "," + j
        line(4, `mcm(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let best = Infinity
        for (let k = i; k < j; k++) {
          line(7, `Split after matrix ${k}: solve (${i}..${k}) and (${k + 1}..${j}), then glue a ${dims[i - 1]}×${dims[k]} by a ${dims[k]}×${dims[j]} — that costs ${dims[i - 1]}·${dims[k]}·${dims[j]} = ${dims[i - 1] * dims[k] * dims[j]}.`)
          const left = mcm(i, k)
          const right = mcm(k + 1, j)
          const glue = dims[i - 1] * dims[k] * dims[j]
          const cost = left + right + glue
          best = Math.min(best, cost)
          line(9, `split@${k}: ${left} + ${right} + ${glue} = <b>${cost}</b>; best so far ${best}.`)
        }
        line(11, `mcm(${i},${j}) = <b>${best}</b> — the cheapest split wins.`)
        memo[key] = best
        return best
      },
      1,
    )
    narrate("Try every place to put the outermost parentheses; cost = left chain + right chain + the glue multiply.")
    if (dims.length < 2) return 0
    return mcm(1, dims.length - 1)
  },
}
