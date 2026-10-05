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

/** Walk the right-spine from a node and collect the values. */
function spine(from: TNode | null): number[] {
  const out: number[] = []
  let cur = from
  while (cur !== null) {
    out.push(cur.val)
    cur = cur.right
  }
  return out
}

export const flattenBinaryTree: SolutionDef = {
  code: `// visit in REVERSE preorder (right, left, root) — prepend each node
let prev = null;
function flatten(node) {
  if (node.right) flatten(node.right);
  if (node.left) flatten(node.left);
  node.right = prev;   // hook the already-flattened list behind me
  node.left = null;
  prev = node;
}`,
  codeJava: `// visit in REVERSE preorder (right, left, root) — prepend each node
TreeNode prev = null;
void flatten(TreeNode node) {
  if (node.right != null) flatten(node.right);
  if (node.left != null) flatten(node.left);
  node.right = prev;   // hook the already-flattened list behind me
  node.left = null;
  prev = node;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 5, 3, 4, -1, 6], maxLen: 12 },
  ],
  entry: (a) => `flatten(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const root = buildTree(args.tree as number[])
    if (!root) {
      narrate("Empty tree — nothing to flatten.")
      return "[]"
    }
    let prev: TNode | null = null
    const flatten: (n: TNode) => string = fn(
      "flatten",
      (n: TNode): string => {
        line(3, n.right ? `flatten(${n.val}): flatten my <b>right</b> subtree (rooted at ${n.right.val}) first.` : `flatten(${n.val}): no right subtree.`)
        if (n.right) flatten(n.right)
        line(4, n.left ? `flatten(${n.val}): then my <b>left</b> subtree (rooted at ${n.left.val}).` : `flatten(${n.val}): no left subtree.`)
        if (n.left) flatten(n.left)
        line(5, `flatten(${n.val}): everything after me in preorder is already a list starting at ${prev ? prev.val : "null"} — <b>hook it behind me</b>: ${n.val}.right = ${prev ? prev.val : "null"}.`)
        n.right = prev
        n.left = null
        prev = n
        heap("flattened", spine(prev))
        vars({ prev: prev.val })
        line(7, `flatten(${n.val}): I'm the new head — the right-spine so far reads [${spine(prev).join(" → ")}].`)
        return `head=${n.val}`
      },
      2,
    )
    narrate("Reverse preorder (right, left, root): by the time we visit a node, everything that follows it in preorder is already flattened — just prepend.")
    flatten(root)
    return JSON.stringify(spine(root))
  },
}
