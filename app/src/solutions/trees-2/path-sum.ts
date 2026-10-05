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

export const pathSum: SolutionDef = {
  code: `function hasPathSum(node, target) {
  if (!node) return false;
  const rest = target - node.val;   // budget left after paying me
  if (!node.left && !node.right)    // leaf: budget spent exactly?
    return rest === 0;
  return hasPathSum(node.left,  rest) ||
         hasPathSum(node.right, rest);
}`,
  codeJava: `boolean hasPathSum(TreeNode node, int target) {
  if (node == null) return false;
  int rest = target - node.val;     // budget left after paying me
  if (node.left == null && node.right == null)
    return rest == 0;
  return hasPathSum(node.left,  rest) ||
         hasPathSum(node.right, rest);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [5, 4, 8, 11, -1, 13, 4, 7, 2, -1, -1, -1, 1], maxLen: 15 },
    { kind: "number", name: "target", label: "target sum", default: 22, min: -40, max: 60 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `hasPathSum(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.target})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const target = args.target as number
    narrate(
      `Instead of carrying the growing sum DOWN, carry the shrinking <b>budget</b>: each node pays its own value and passes the rest to its children. A root→leaf path with sum ${target} exists iff some leaf receives a budget it spends <b>exactly to 0</b>.`,
    )
    const hasPathSum = fn(
      "hasPathSum",
      (node: TNode, t: number): boolean => {
        const rest = t - node.val
        vars({ target: t, rest })
        line(2, `hasPathSum(${node.val}): budget ${t} − my value ${node.val} = rest <b>${rest}</b> to spend below me.`)
        if (!node.left && !node.right) {
          line(4, `${node.val} is a LEAF — the path ends here. rest ${rest === 0 ? "=== 0 → the budget is spent exactly: <b>path found!</b>" : `= ${rest} ≠ 0 → this path ${rest > 0 ? "falls short" : "overshoots"}: false.`}`)
          return rest === 0
        }
        line(5, `${node.val} is internal — try the left side first${node.left ? `: hasPathSum(${node.left.val}, ${rest}).` : " … but there is no left child → false on that side."}`)
        const l = node.left ? hasPathSum(node.left, rest) : false
        if (l) {
          line(5, `Left side of ${node.val} found a path — OR short-circuits, <b>skip the right subtree entirely</b> and bubble true up.`)
          return true
        }
        line(6, `Left side of ${node.val} failed — try the right${node.right ? `: hasPathSum(${node.right.val}, ${rest}).` : " … but there is no right child → false. Both sides dead."}`)
        return node.right ? hasPathSum(node.right, rest) : false
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — there is no root-to-leaf path at all, so the answer is false.")
      return false
    }
    const ans = hasPathSum(root, target)
    narrate(`Answer: <b>${ans}</b>.`)
    return ans
  },
}
