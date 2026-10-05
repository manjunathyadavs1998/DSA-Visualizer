import type { SolutionDef } from "@/engine/types"

type TNode = { val: number; left: TNode | null; right: TNode | null; toString: () => string }

const mk = (val: number): TNode => ({ val, left: null, right: null, toString: () => String(val) })

/** Standard LeetCode level-order build; -1 means a missing child. */
function buildTree(vals: number[]): TNode | null {
  if (!vals.length || vals[0] === -1) return null
  const root = mk(vals[0])
  const q: TNode[] = [root]
  let i = 1
  while (q.length && i < vals.length) {
    const node = q.shift() as TNode
    if (i < vals.length && vals[i] !== -1) q.push((node.left = mk(vals[i])))
    i++
    if (i < vals.length && vals[i] !== -1) q.push((node.right = mk(vals[i])))
    i++
  }
  return root
}

export const rangeSumOfBst: SolutionDef = {
  code: `function rangeSum(node, lo, hi) {
  if (!node) return 0;
  if (node.val < lo)                    // my left side is even smaller
    return rangeSum(node.right, lo, hi);     // → prune it entirely
  if (node.val > hi)                    // my right side is even bigger
    return rangeSum(node.left, lo, hi);      // → prune it entirely
  return node.val                       // in range: count me,
       + rangeSum(node.left,  lo, hi)   //   and BOTH sides may hold more
       + rangeSum(node.right, lo, hi);
}`,
  codeJava: `int rangeSum(TreeNode node, int lo, int hi) {
  if (node == null) return 0;
  if (node.val < lo)                    // my left side is even smaller
    return rangeSum(node.right, lo, hi);     // → prune it entirely
  if (node.val > hi)                    // my right side is even bigger
    return rangeSum(node.left, lo, hi);      // → prune it entirely
  return node.val                       // in range: count me,
       + rangeSum(node.left,  lo, hi)   //   and BOTH sides may hold more
       + rangeSum(node.right, lo, hi);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [10, 5, 15, 3, 7, 13, 18, 1, -1, 6], maxLen: 15 },
    { kind: "number", name: "lo", label: "low", default: 7, min: 0, max: 99 },
    { kind: "number", name: "hi", label: "high", default: 15, min: 0, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `rangeSum(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.lo}, ${a.hi})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let lo = args.lo as number
    let hi = args.hi as number
    if (lo > hi) [lo, hi] = [hi, lo] // sanitize: ensure a valid range
    const counted: number[] = []
    narrate(
      `Sum every value in [${lo}, ${hi}]. A plain traversal would touch all n nodes; the BST lets us PRUNE: a node below ${lo} proves its whole left subtree is below ${lo} — skip it without looking. The green nodes are the ones that actually got counted.`,
    )
    const rangeSum = fn(
      "rangeSum",
      (node: TNode): number => {
        vars({ at: node.val, lo, hi })
        if (node.val < lo) {
          line(3, `${node.val} < ${lo} → everything on ${node.val}'s LEFT is even smaller: <b>prune that whole side unvisited</b>. Only the right${node.right ? ` (${node.right.val})` : " (empty → 0)"} might reach the range.`)
          return node.right ? rangeSum(node.right) : 0
        }
        if (node.val > hi) {
          line(5, `${node.val} > ${hi} → everything on ${node.val}'s RIGHT is even bigger: prune it. Only the left${node.left ? ` (${node.left.val})` : " (empty → 0)"} matters.`)
          return node.left ? rangeSum(node.left) : 0
        }
        counted.push(node.val)
        heap("output", counted)
        line(6, `<b>${node.val} ∈ [${lo}, ${hi}]</b> — count it. In-range values so far: {${counted.join(", ")}}.`)
        line(7, `Both sides may still hold range values — left${node.left ? ` → rangeSum(${node.left.val})` : ": empty → 0"}.`)
        const l = node.left ? rangeSum(node.left) : 0
        line(8, `…and right${node.right ? ` → rangeSum(${node.right.val})` : ": empty → 0"}.`)
        const r = node.right ? rangeSum(node.right) : 0
        vars({ at: node.val, l, r, subtotal: node.val + l + r })
        line(6, `${node.val} + ${l} + ${r} = <b>${node.val + l + r}</b> from my subtree.`)
        return node.val + l + r
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — sum 0.")
      return 0
    }
    const ans = rangeSum(root)
    narrate(`Range sum of [${lo}, ${hi}]: ${counted.join(" + ")} = <b>${ans}</b>.`)
    return ans
  },
}
