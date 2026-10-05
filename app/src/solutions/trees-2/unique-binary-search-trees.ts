import type { SolutionDef } from "@/engine/types"

export const uniqueBinarySearchTrees: SolutionDef = {
  code: `function numTrees(n) {
  if (n <= 1) return 1;            // empty / single node: one shape
  if (memo[n] !== undefined) return memo[n];
  let total = 0;
  for (let root = 1; root <= n; root++) {
    total += numTrees(root - 1)    // shapes of the left part
           * numTrees(n - root);   // × shapes of the right part
  }
  memo[n] = total;
  return total;                    // the Catalan numbers!
}`,
  codeJava: `int numTrees(int n) {
  if (n <= 1) return 1;            // empty / single node: one shape
  if (memo[n] != null) return memo[n];
  int total = 0;
  for (int root = 1; root <= n; root++) {
    total += numTrees(root - 1)    // shapes of the left part
           * numTrees(n - root);   // × shapes of the right part
  }
  memo[n] = total;
  return total;                    // the Catalan numbers!
}`,
  inputs: [{ kind: "number", name: "n", label: "n (nodes 1…n)", default: 4, min: 0, max: 8 }],
  entry: (a) => `numTrees(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const n = args.n as number
    narrate(
      `How many BST shapes hold the values 1…${n}? Pick each value as the ROOT: everything smaller must form its left subtree, everything bigger its right — and the two sides are independent, so their counts <b>multiply</b>. Only the SIZE of a side matters (3 values make the same shapes whether they're {1,2,3} or {5,6,7}), which is why memo[size] works — and why the answers are the Catalan numbers.`,
    )
    const numTrees = fn(
      "numTrees",
      (m: number): number => {
        line(1, `numTrees(${m}): ${m <= 1 ? `<b>base case</b> — ${m === 0 ? "an empty slot" : "a single node"} has exactly ONE shape.` : `${m} values to arrange — not a base case.`}`)
        if (m <= 1) return 1
        line(2, `numTrees(${m}): memo check…`)
        if (memo[m] !== undefined) return memo[m] as number
        let total = 0
        for (let root = 1; root <= m; root++) {
          line(5, `numTrees(${m}): put value <b>${root}</b> at the root → ${root - 1} smaller values form the left, ${m - root} bigger form the right: numTrees(${root - 1}) × numTrees(${m - root}).`)
          const l = numTrees(root - 1)
          const r = numTrees(m - root)
          total += l * r
          vars({ root, l, r, total })
          line(6, `numTrees(${m}): root=${root} contributes ${l} × ${r} = <b>${l * r}</b> shapes → running total ${total}.`)
        }
        memo[m] = total
        line(8, `numTrees(${m}) = <b>${total}</b> — cached. (Catalan C${m}.)`)
        return total
      },
      0,
    )
    const ans = numTrees(n)
    narrate(`There are <b>${ans}</b> structurally unique BSTs on ${n} node${n === 1 ? "" : "s"}.`)
    return ans
  },
}
