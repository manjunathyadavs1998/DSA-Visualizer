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

export const preorderTraversal: SolutionDef = {
  code: `// tree is level-order below; -1 means a missing child
function preorder(node) {
  output.push(node.val);                  // N: myself FIRST
  if (node.left) preorder(node.left);     // L: then my left subtree
  if (node.right) preorder(node.right);   // R: then my right subtree
}`,
  codeJava: `// TreeNode root built from level-order; -1 means a missing child
void preorder(TreeNode node) {
  output.add(node.val);                         // N: myself FIRST
  if (node.left != null) preorder(node.left);   // L: then my left subtree
  if (node.right != null) preorder(node.right); // R: then my right subtree
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `preorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const output: number[] = []
    const preorder = fn(
      "preorder",
      (node: TNode): string => {
        line(2, `preorder(${node.val}): <b>myself first</b> — output gets ${node.val} the moment I'm entered, before any child.`)
        output.push(node.val)
        heap("output", output)
        line(
          3,
          `preorder(${node.val}): now the left subtree — ${node.left ? `descend into <b>${node.left.val}</b>` : "no left child, skip"}.`,
        )
        if (node.left) preorder(node.left)
        line(
          4,
          `preorder(${node.val}): left done, now the right subtree — ${node.right ? `descend into <b>${node.right.val}</b>` : "no right child, this subtree is finished"}.`,
        )
        if (node.right) preorder(node.right)
        return "✓"
      },
      1,
    )
    narrate(
      "Preorder = <b>Node, Left, Right</b>: every parent is emitted before its children, so the output reads the tree top-down — exactly the order you'd use to copy or serialize it.",
    )
    heap("output", output)
    if (!root) {
      narrate("Empty tree — nothing to visit.")
      return "[]"
    }
    preorder(root)
    return JSON.stringify(output)
  },
}
