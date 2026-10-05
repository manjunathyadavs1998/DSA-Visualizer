import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
  toString(): string
}

function mkNode(val: number): TNode {
  return {
    val,
    left: null,
    right: null,
    toString() {
      return String(this.val)
    },
  }
}

/** Level-order values → tree; -1 means null. */
function buildTree(vals: number[]): TNode | null {
  if (vals.length === 0 || vals[0] === -1) return null
  const root = mkNode(vals[0])
  const queue: TNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < vals.length) {
    const cur = queue.shift() as TNode
    const l = vals[i++]
    if (l !== undefined && l !== -1) {
      cur.left = mkNode(l)
      queue.push(cur.left)
    }
    const r = vals[i++]
    if (r !== undefined && r !== -1) {
      cur.right = mkNode(r)
      queue.push(cur.right)
    }
  }
  return root
}

export const lowestCommonAncestor: SolutionDef = {
  code: `// p and q are values that both exist in the tree
function lca(node) {
  if (node.val === p || node.val === q) return node;
  const left = node.left ? lca(node.left) : null;
  const right = node.right ? lca(node.right) : null;
  if (left !== null && right !== null) return node;
  return left !== null ? left : right;
}`,
  codeJava: `// int p, q are values that both exist in the tree
TreeNode lca(TreeNode node) {
  if (node.val == p || node.val == q) return node;
  TreeNode left = node.left != null ? lca(node.left) : null;
  TreeNode right = node.right != null ? lca(node.right) : null;
  if (left != null && right != null) return node;
  return left != null ? left : right;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [3, 5, 1, 6, 2, 0, 8, -1, -1, 7, 4], maxLen: 15 },
    { kind: "number", name: "p", label: "p", default: 6, min: -20, max: 99 },
    { kind: "number", name: "q", label: "q", default: 4, min: -20, max: 99 },
  ],
  entry: (a) => `lca(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const p = args.p as number
    const q = args.q as number
    if (!root) {
      narrate("Empty tree — no ancestor to find.")
      return "null"
    }
    const go: (n: TNode) => TNode | null = fn(
      "lca",
      (n: TNode): TNode | null => {
        const isTarget = n.val === p || n.val === q
        line(2, `lca(${n.val}): am I p or q? (${isTarget ? "<b>yes — report myself up; no need to search deeper</b>" : "no"})`)
        if (isTarget) return n
        line(3, n.left ? `lca(${n.val}): ask the <b>left</b> subtree rooted at ${n.left.val} — does it contain p or q?` : `lca(${n.val}): no left child → left answer is null.`)
        const left = n.left ? go(n.left) : null
        vars({ left: left ?? "null" })
        line(4, n.right ? `lca(${n.val}): now ask the <b>right</b> subtree rooted at ${n.right.val}.` : `lca(${n.val}): no right child → right answer is null.`)
        const right = n.right ? go(n.right) : null
        vars({ left: left ?? "null", right: right ?? "null" })
        if (left !== null && right !== null) {
          line(5, `lca(${n.val}): <b>both sides answered</b> (left found ${left.val}, right found ${right.val}) → <b>I'm the LCA!</b>`)
          return n
        }
        line(6, `lca(${n.val}): only ${left !== null ? `the left side found ${left.val}` : right !== null ? `the right side found ${right.val}` : "nothing was found"} — pass ${left ?? right ?? "null"} up unchanged.`)
        return left !== null ? left : right
      },
      1,
    )
    narrate(`Post-order search for p=${p} and q=${q}: each node reports "found one of them" or null; the first node where BOTH sides report is the lowest common ancestor.`)
    const ans = go(root)
    return ans ? ans.val : "null"
  },
}
