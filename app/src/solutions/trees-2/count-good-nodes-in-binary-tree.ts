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

export const countGoodNodesInBinaryTree: SolutionDef = {
  code: `function goodNodes(node, maxSoFar) {
  if (!node) return 0;
  const good = node.val >= maxSoFar ? 1 : 0;  // ≥ everything above me?
  const newMax = Math.max(maxSoFar, node.val);
  return good + goodNodes(node.left,  newMax)
              + goodNodes(node.right, newMax);
}
// goodNodes(root, -Infinity)`,
  codeJava: `int goodNodes(TreeNode node, int maxSoFar) {
  if (node == null) return 0;
  int good = node.val >= maxSoFar ? 1 : 0;    // ≥ everything above me?
  int newMax = Math.max(maxSoFar, node.val);
  return good + goodNodes(node.left,  newMax)
              + goodNodes(node.right, newMax);
}
// goodNodes(root, Integer.MIN_VALUE)`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [3, 1, 4, 3, -1, 1, 5], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `goodNodes(${t.length && t[0] !== -1 ? t[0] : "null"}, -∞)`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const goodVals: number[] = []
    narrate(
      "A node is GOOD if no node above it on its root path is bigger. The whole history of the path compresses into ONE number carried down: <b>maxSoFar</b>. Compare, update, pass down — counts bubble back up as good + left + right.",
    )
    const goodNodes = fn(
      "goodNodes",
      (node: TNode, maxSoFar: number): number => {
        const good = node.val >= maxSoFar ? 1 : 0
        vars({ maxSoFar: maxSoFar === -Infinity ? "-∞" : maxSoFar, good })
        if (good) {
          goodVals.push(node.val)
          heap("output", goodVals)
          line(2, `${node.val} ≥ max-on-path ${maxSoFar === -Infinity ? "-∞" : maxSoFar} → <b>${node.val} is GOOD</b> (nothing above it beats it). Good so far: {${goodVals.join(", ")}}.`)
        } else {
          line(2, `${node.val} < max-on-path <b>${maxSoFar}</b> → a bigger ancestor blocks it: NOT good.`)
        }
        const newMax = Math.max(maxSoFar, node.val)
        line(3, `Carry down newMax = max(${maxSoFar === -Infinity ? "-∞" : maxSoFar}, ${node.val}) = <b>${newMax}</b> — the only fact my children need about the path above.`)
        line(4, `Count the left subtree of ${node.val}${node.left ? ` → goodNodes(${node.left.val}, ${newMax}).` : ": empty → 0."}`)
        const l = node.left ? goodNodes(node.left, newMax) : 0
        line(5, `Count the right subtree of ${node.val}${node.right ? ` → goodNodes(${node.right.val}, ${newMax}).` : ": empty → 0."}`)
        const r = node.right ? goodNodes(node.right, newMax) : 0
        vars({ good, l, r })
        line(4, `${node.val} reports ${good} (me) + ${l} (left) + ${r} (right) = <b>${good + l + r}</b> good nodes in my subtree.`)
        return good + l + r
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — 0 good nodes.")
      return 0
    }
    const ans = goodNodes(root, -Infinity)
    narrate(`Total good nodes: <b>${ans}</b> — the root is always one (nothing is above it).`)
    return ans
  },
}
