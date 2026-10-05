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

export const diameterOfBinaryTree: SolutionDef = {
  code: `// best = longest path in EDGES seen anywhere so far
function height(node) {
  const lh = node.left  ? height(node.left)  : 0;
  const rh = node.right ? height(node.right) : 0;
  best = Math.max(best, lh + rh);  // longest path THROUGH me
  return 1 + Math.max(lh, rh);     // but I report only height
}`,
  codeJava: `// int best = 0;  longest path in EDGES seen anywhere so far
int height(TreeNode node) {
  int lh = node.left  != null ? height(node.left)  : 0;
  int rh = node.right != null ? height(node.right) : 0;
  best = Math.max(best, lh + rh);  // longest path THROUGH me
  return 1 + Math.max(lh, rh);     // but I report only height
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `height(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let best = 0
    const height = fn(
      "height",
      (node: TNode): number => {
        line(2, `height(${node.val}): left height? ${node.left ? `Ask <b>height(${node.left.val})</b>.` : "No left child → lh = 0."}`)
        const lh = node.left ? height(node.left) : 0
        vars({ lh, best })
        line(3, `height(${node.val}): lh = ${lh}. Right height? ${node.right ? `Ask <b>height(${node.right.val})</b>.` : "No right child → rh = 0."}`)
        const rh = node.right ? height(node.right) : 0
        vars({ lh, rh, best })
        const through = lh + rh
        line(
          4,
          `height(${node.val}): the <b>longest path through me</b> goes ${lh} edges down my left arm + ${rh} down my right = ${through}. ${through > best ? `New record — best: ${best} → <b>${through}</b>.` : `Doesn't beat best = ${best}.`}`,
        )
        best = Math.max(best, through)
        vars({ lh, rh, best })
        line(5, `height(${node.val}): to my parent I report only my height, 1 + max(${lh}, ${rh}) = ${1 + Math.max(lh, rh)} — a path can't bend twice.`)
        return 1 + Math.max(lh, rh)
      },
      1,
    )
    narrate(
      "The diameter's highest point is SOME node — so at every node ask: <b>how long is the longest path bending through me?</b> That's left height + right height. One height recursion answers it for all nodes at once; `best` keeps the record.",
    )
    if (!root) {
      narrate("Empty tree — diameter 0.")
      return 0
    }
    height(root)
    narrate(`Every node has been asked — the diameter is <b>${best}</b> edges.`)
    return best
  },
}
