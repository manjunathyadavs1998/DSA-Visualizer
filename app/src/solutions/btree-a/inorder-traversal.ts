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

export const inorderTraversal: SolutionDef = {
  code: `// tree is level-order below; -1 means a missing child
function inorder(node) {
  if (node.left) inorder(node.left);    // L: left side first
  output.push(node.val);                // N: then myself
  if (node.right) inorder(node.right);  // R: right side last
}`,
  codeJava: `// TreeNode root built from level-order; -1 means a missing child
void inorder(TreeNode node) {
  if (node.left != null) inorder(node.left);    // L: left side first
  output.add(node.val);                         // N: then myself
  if (node.right != null) inorder(node.right);  // R: right side last
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `inorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const output: number[] = []
    const inorder = fn(
      "inorder",
      (node: TNode): string => {
        line(
          2,
          `inorder(${node.val}): <b>left first</b> — ${node.left ? `everything under ${node.left.val} comes before me` : "no left child, so nothing comes before me"}.`,
        )
        if (node.left) inorder(node.left)
        line(3, `inorder(${node.val}): left side done — <b>now myself</b>. Output gets ${node.val}.`)
        output.push(node.val)
        heap("output", output)
        line(
          4,
          `inorder(${node.val}): <b>then right</b> — ${node.right ? `descend into ${node.right.val}` : "no right child, this subtree is finished"}.`,
        )
        if (node.right) inorder(node.right)
        return "✓"
      },
      1,
    )
    narrate(
      "Inorder = <b>Left, Node, Right</b>. The recursion tree below IS the binary tree — watch each node emit its value only after its entire left subtree has returned.",
    )
    heap("output", output)
    if (!root) {
      narrate("Empty tree — nothing to visit.")
      return "[]"
    }
    inorder(root)
    return JSON.stringify(output)
  },
}
