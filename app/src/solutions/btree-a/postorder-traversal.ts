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

export const postorderTraversal: SolutionDef = {
  code: `// tree is level-order below; -1 means a missing child
function postorder(node) {
  if (node.left) postorder(node.left);    // L: left subtree first
  if (node.right) postorder(node.right);  // R: then right subtree
  output.push(node.val);                  // N: myself LAST
}`,
  codeJava: `// TreeNode root built from level-order; -1 means a missing child
void postorder(TreeNode node) {
  if (node.left != null) postorder(node.left);    // L: left subtree first
  if (node.right != null) postorder(node.right);  // R: then right subtree
  output.add(node.val);                           // N: myself LAST
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `postorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const output: number[] = []
    const postorder = fn(
      "postorder",
      (node: TNode): string => {
        line(
          2,
          `postorder(${node.val}): left subtree first — ${node.left ? `descend into <b>${node.left.val}</b>` : "no left child, skip"}.`,
        )
        if (node.left) postorder(node.left)
        line(
          3,
          `postorder(${node.val}): then right subtree — ${node.right ? `descend into <b>${node.right.val}</b>` : "no right child, skip"}.`,
        )
        if (node.right) postorder(node.right)
        line(
          4,
          `postorder(${node.val}): <b>both children fully done — only now do I emit ${node.val}</b>. A parent can never appear before its subtrees.`,
        )
        output.push(node.val)
        heap("output", output)
        return "✓"
      },
      1,
    )
    narrate(
      "Postorder = <b>Left, Right, Node</b>: parents finish LAST — every node waits until both subtrees have returned. That's why postorder is the order for deleting a tree or computing subtree sizes: children's answers must exist before the parent uses them. The root is always the final value.",
    )
    heap("output", output)
    if (!root) {
      narrate("Empty tree — nothing to visit.")
      return "[]"
    }
    postorder(root)
    return JSON.stringify(output)
  },
}
