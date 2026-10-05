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

export const minimumAbsoluteDifferenceInBst: SolutionDef = {
  code: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  if (prev !== null)                       // sorted stream ⇒ the closest
    minDiff = Math.min(minDiff, node.val - prev);  // pair is ADJACENT
  prev = node.val;
  inorder(node.right);
}
// inorder(root) → minDiff`,
  codeJava: `void inorder(TreeNode node) {
  if (node == null) return;
  inorder(node.left);
  if (prev != null)                        // sorted stream ⇒ the closest
    minDiff = Math.min(minDiff, node.val - prev); // pair is ADJACENT
  prev = node.val;
  inorder(node.right);
}
// inorder(root) → minDiff`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 3, 10, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `inorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let prev: number | null = null
    let minDiff = Infinity
    const order: number[] = []
    narrate(
      "The two closest values in a set are always NEIGHBORS once the set is sorted — and a BST hands you the sorted order for free via inorder. So: walk inorder, compare each value only to the one just before it (`prev`), and never look at any other pair. n−1 comparisons instead of n².",
    )
    const inorder = fn(
      "inorder",
      (node: TNode): string => {
        line(2, `inorder(${node.val}): smaller values first${node.left ? ` → inorder(${node.left.val})` : " (no left child)"}.`)
        if (node.left) inorder(node.left)
        order.push(node.val)
        heap("order", order)
        if (prev !== null) {
          const d = node.val - prev
          if (d < minDiff) {
            minDiff = d
            line(4, `Visit ${node.val}: adjacent pair (${prev}, ${node.val}) differs by <b>${d}</b> — new minimum!`)
          } else {
            line(4, `Visit ${node.val}: pair (${prev}, ${node.val}) differs by ${d} — not better than ${minDiff}.`)
          }
        } else {
          line(5, `Visit ${node.val}: first value of the sorted stream — nothing to compare yet.`)
        }
        prev = node.val
        vars({ prev, minDiff: minDiff === Infinity ? "∞" : minDiff })
        line(6, `inorder(${node.val}): now the bigger side${node.right ? ` → inorder(${node.right.val})` : " (no right child)"}.`)
        if (node.right) inorder(node.right)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — no pairs.")
      return 0
    }
    inorder(root)
    narrate(`Sorted stream: [${order.join(", ")}] → minimum absolute difference = <b>${minDiff === Infinity ? 0 : minDiff}</b>.`)
    return minDiff === Infinity ? 0 : minDiff
  },
}
