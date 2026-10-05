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

export const maximumPathSum: SolutionDef = {
  code: `// best = max path sum seen anywhere; a path may bend at one node
function gain(node) {
  const left = node.left ? Math.max(0, gain(node.left)) : 0;
  const right = node.right ? Math.max(0, gain(node.right)) : 0;
  best = Math.max(best, node.val + left + right);
  return node.val + Math.max(left, right);
}`,
  codeJava: `// int best = max path sum seen anywhere; a path may bend at one node
int gain(TreeNode node) {
  int left = node.left != null ? Math.max(0, gain(node.left)) : 0;
  int right = node.right != null ? Math.max(0, gain(node.right)) : 0;
  best = Math.max(best, node.val + left + right);
  return node.val + Math.max(left, right);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [-10, 9, 20, -1, -1, 15, -3], maxLen: 13 },
  ],
  entry: (a) => `gain(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    if (!root) {
      narrate("Empty tree — no path exists.")
      return "null"
    }
    let best = -Infinity
    const gain: (n: TNode) => number = fn(
      "gain",
      (n: TNode): number => {
        let left = 0
        if (n.left) {
          const g = gain(n.left)
          left = Math.max(0, g)
          line(2, `gain(${n.val}): left child offers ${g} → take max(0, ${g}) = <b>${left}</b>${g < 0 ? " — <b>a negative branch only hurts, so drop it</b>" : ""}.`)
        } else {
          line(2, `gain(${n.val}): no left child → left contributes 0.`)
        }
        let right = 0
        if (n.right) {
          const g = gain(n.right)
          right = Math.max(0, g)
          line(3, `gain(${n.val}): right child offers ${g} → take max(0, ${g}) = <b>${right}</b>${g < 0 ? " — <b>a negative branch only hurts, so drop it</b>" : ""}.`)
        } else {
          line(3, `gain(${n.val}): no right child → right contributes 0.`)
        }
        const through = n.val + left + right
        best = Math.max(best, through)
        vars({ left, right, best })
        line(4, `gain(${n.val}): a path may <b>bend here</b>: ${left} + (${n.val}) + ${right} = ${through}. best is now <b>${best}</b>.`)
        const up = n.val + Math.max(left, right)
        line(5, `gain(${n.val}): but my parent can extend only ONE arm — report ${n.val} + max(${left}, ${right}) = <b>${up}</b> upward.`)
        return up
      },
      1,
    )
    narrate("Each node computes its best downward gain; the bent path through a node (left + node + right) can only be counted at that node, so we record it into best there.")
    gain(root)
    return best
  },
}
