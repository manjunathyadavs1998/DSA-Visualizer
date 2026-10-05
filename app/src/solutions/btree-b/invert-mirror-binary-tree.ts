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

/** Tree → level-order values with -1 for null (trailing nulls trimmed). */
function toLevelOrder(root: TNode | null): number[] {
  if (!root) return []
  const out: number[] = []
  const queue: (TNode | null)[] = [root]
  while (queue.length > 0) {
    const n = queue.shift() ?? null
    if (n === null) {
      out.push(-1)
      continue
    }
    out.push(n.val)
    queue.push(n.left)
    queue.push(n.right)
  }
  while (out.length > 0 && out[out.length - 1] === -1) out.pop()
  return out
}

export const invertMirrorBinaryTree: SolutionDef = {
  code: `// swap the two children at EVERY node — the whole tree mirrors
function invert(node) {
  const tmp = node.left;
  node.left = node.right;
  node.right = tmp;
  if (node.left) invert(node.left);
  if (node.right) invert(node.right);
}`,
  codeJava: `// swap the two children at EVERY node — the whole tree mirrors
void invert(TreeNode node) {
  TreeNode tmp = node.left;
  node.left = node.right;
  node.right = tmp;
  if (node.left != null) invert(node.left);
  if (node.right != null) invert(node.right);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [4, 2, 7, 1, 3, 6, 9], maxLen: 15 },
  ],
  entry: (a) => `invert(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, heap, narrate }, args) {
    const vals = args.tree as number[]
    const root = buildTree(vals)
    if (!root) {
      narrate("Empty tree — nothing to invert.")
      return "[]"
    }
    heap("levelOrder", toLevelOrder(root))
    const invert: (n: TNode) => string = fn(
      "invert",
      (n: TNode): string => {
        const lv = n.left ? String(n.left.val) : "∅"
        const rv = n.right ? String(n.right.val) : "∅"
        line(2, `invert(${n.val}): children are (left=${lv}, right=${rv}) — <b>swap them</b>.`)
        const tmp = n.left
        n.left = n.right
        n.right = tmp
        heap("levelOrder", toLevelOrder(root))
        line(4, `invert(${n.val}): now (left=${rv}, right=${lv}) — watch the level order shuffle: [${toLevelOrder(root).join(", ")}].`)
        if (n.left) {
          line(5, `invert(${n.val}): recurse into the (new) left child ${n.left.val} to mirror its subtree too.`)
          invert(n.left)
        }
        if (n.right) {
          line(6, `invert(${n.val}): and into the (new) right child ${n.right.val}.`)
          invert(n.right)
        }
        return `${lv}↔${rv}`
      },
      1,
    )
    narrate("Mirroring a tree is local: swap left↔right at every node and the whole tree flips. Order of visits doesn't even matter.")
    invert(root)
    return JSON.stringify(toLevelOrder(root))
  },
}
