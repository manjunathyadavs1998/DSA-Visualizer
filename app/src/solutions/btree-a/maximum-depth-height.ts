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

export const maximumDepthHeight: SolutionDef = {
  code: `function maxDepth(node) {
  const lh = node.left  ? maxDepth(node.left)  : 0;
  const rh = node.right ? maxDepth(node.right) : 0;
  return 1 + Math.max(lh, rh);   // me + my taller subtree
}`,
  codeJava: `int maxDepth(TreeNode node) {
  int lh = node.left  != null ? maxDepth(node.left)  : 0;
  int rh = node.right != null ? maxDepth(node.right) : 0;
  return 1 + Math.max(lh, rh);   // me + my taller subtree
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `maxDepth(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const maxDepth = fn(
      "maxDepth",
      (node: TNode): number => {
        line(
          1,
          `maxDepth(${node.val}): how tall is my left side? ${node.left ? `Ask <b>maxDepth(${node.left.val})</b>.` : "No left child → lh = 0."}`,
        )
        const lh = node.left ? maxDepth(node.left) : 0
        vars({ lh })
        line(
          2,
          `maxDepth(${node.val}): lh = ${lh}. And my right side? ${node.right ? `Ask <b>maxDepth(${node.right.val})</b>.` : "No right child → rh = 0."}`,
        )
        const rh = node.right ? maxDepth(node.right) : 0
        vars({ lh, rh })
        line(3, `maxDepth(${node.val}): 1 (me) + max(${lh}, ${rh}) = <b>${1 + Math.max(lh, rh)}</b> — my taller subtree plus myself.`)
        return 1 + Math.max(lh, rh)
      },
      0,
    )
    narrate(
      "The recursion tree below <b>IS the binary tree</b> — one maxDepth call per node, in the same shape. The answer is literally the depth of the call tree you're watching: every leaf returns 1, and each parent adds 1 to its taller child.",
    )
    if (!root) {
      narrate("Empty tree — depth 0.")
      return 0
    }
    return maxDepth(root)
  },
}
