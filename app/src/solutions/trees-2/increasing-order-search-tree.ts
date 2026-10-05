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

export const increasingOrderSearchTree: SolutionDef = {
  code: `function rewire(node) {
  if (!node) return;
  rewire(node.left);        // smaller values hook on first
  node.left  = null;        // vine nodes may not keep left children
  tail.right = node;        // append me to the growing vine
  tail       = node;
  rewire(node.right);       // bigger values hook on after me
}
// rewire(root); answer = dummy.right`,
  codeJava: `void rewire(TreeNode node) {
  if (node == null) return;
  rewire(node.left);        // smaller values hook on first
  node.left  = null;        // vine nodes may not keep left children
  tail.right = node;        // append me to the growing vine
  tail       = node;
  rewire(node.right);       // bigger values hook on after me
}
// rewire(root); answer = dummy.right`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [5, 3, 6, 2, 4, -1, 8, 1, -1, -1, -1, 7, 9], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `rewire(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const dummy = mk(0)
    let tail = dummy
    const vine: number[] = []
    narrate(
      "Flatten the BST into a right-leaning VINE in sorted order — same nodes, rewired in place. Inorder visits nodes in exactly the order the vine needs, so during the walk we keep a <b>tail</b> pointer and do three moves per node: cut my left link, hang me on tail.right, become the new tail. A dummy head avoids a special case for the first node.",
    )
    const rewire = fn(
      "rewire",
      (node: TNode): string => {
        line(2, `rewire(${node.val}): everything smaller than me must enter the vine first${node.left ? ` → rewire(${node.left.val})` : " — no left child, I'm next"}.`)
        if (node.left) rewire(node.left)
        node.left = null
        line(3, `Cut ${node.val}'s left pointer — in the vine nobody keeps a left child.`)
        tail.right = node
        line(4, `Hang <b>${node.val}</b> on the vine: ${tail === dummy ? "dummy" : tail.val}.right → ${node.val}.`)
        tail = node
        vine.push(node.val)
        heap("order", vine)
        vars({ tail: node.val, vine: `[${vine.join("→")}]` })
        line(5, `${node.val} is the new tail. Vine so far: ${vine.join(" → ")}.`)
        line(6, `rewire(${node.val}): now everything bigger${node.right ? ` → rewire(${node.right.val})` : " — no right child, back up"}.`)
        if (node.right) rewire(node.right)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — empty vine.")
      return "[]"
    }
    rewire(root)
    narrate(`Done: the vine ${vine.join(" → ")} starts at dummy.right = <b>${vine[0]}</b>. Every node has exactly one right child and no left child — an inorder list made of the original nodes.`)
    return vine.join("→")
  },
}
