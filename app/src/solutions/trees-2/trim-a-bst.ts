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

/** Level-order snapshot with "·" for holes (trailing holes trimmed). */
function serialize(root: TNode | null): (number | string)[] {
  if (!root) return []
  const out: (number | string)[] = []
  const q: (TNode | null)[] = [root]
  while (q.length) {
    const n = q.shift() ?? null
    if (!n) {
      out.push("·")
      continue
    }
    out.push(n.val)
    q.push(n.left, n.right)
  }
  while (out.length && out[out.length - 1] === "·") out.pop()
  return out
}

export const trimABst: SolutionDef = {
  code: `function trim(node, lo, hi) {
  if (!node) return null;
  if (node.val < lo)             // me AND my whole left are too small
    return trim(node.right, lo, hi);   // only my right can survive
  if (node.val > hi)             // me AND my whole right are too big
    return trim(node.left, lo, hi);    // only my left can survive
  node.left  = trim(node.left,  lo, hi);  // in range: keep me,
  node.right = trim(node.right, lo, hi);  // recursively fix children
  return node;
}`,
  codeJava: `TreeNode trim(TreeNode node, int lo, int hi) {
  if (node == null) return null;
  if (node.val < lo)             // me AND my whole left are too small
    return trim(node.right, lo, hi);   // only my right can survive
  if (node.val > hi)             // me AND my whole right are too big
    return trim(node.left, lo, hi);    // only my left can survive
  node.left  = trim(node.left,  lo, hi);  // in range: keep me,
  node.right = trim(node.right, lo, hi);  // recursively fix children
  return node;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 3, 10, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
    { kind: "number", name: "lo", label: "low bound", default: 4, min: 0, max: 99 },
    { kind: "number", name: "hi", label: "high bound", default: 10, min: 0, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `trim(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.lo}, ${a.hi})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let lo = args.lo as number
    let hi = args.hi as number
    if (lo > hi) [lo, hi] = [hi, lo] // sanitize: ensure a valid range
    narrate(
      `Keep only values in [${lo}, ${hi}] — WITHOUT visiting every node. The BST property deletes whole subtrees in one comparison: if a node is below ${lo}, its entire left subtree is below ${lo} too, so both are discarded and only its right child is auditioned. Symmetrically for values above ${hi}.`,
    )
    const trim = fn(
      "trim",
      (node: TNode | null): TNode | null => {
        if (!node) {
          line(1, "Empty spot — nothing to trim.")
          return null
        }
        vars({ at: node.val, lo, hi })
        if (node.val < lo) {
          line(3, `${node.val} < lo ${lo} → <b>${node.val} and its ENTIRE left subtree are too small</b> — gone in one comparison. Audition only its right child${node.right ? ` (${node.right.val})` : " (none)"} to take its place.`)
          return trim(node.right)
        }
        if (node.val > hi) {
          line(5, `${node.val} > hi ${hi} → ${node.val} and its ENTIRE right subtree are too big. Only its left child${node.left ? ` (${node.left.val})` : " (none)"} can survive.`)
          return trim(node.left)
        }
        line(6, `<b>${node.val} ∈ [${lo}, ${hi}]</b> — it stays. Trim its left side${node.left ? ` (${node.left.val})` : " (empty)"}…`)
        node.left = trim(node.left)
        line(7, `…and its right side${node.right ? ` (${node.right.val})` : " (empty)"}.`)
        node.right = trim(node.right)
        heap("tree", serialize(node))
        line(8, `Subtree at ${node.val} is fully in range now — return it to my parent.`)
        return node
      },
      0,
    )
    const result = trim(root)
    heap("tree", serialize(result))
    const out = serialize(result)
    narrate(`Trimmed tree (level-order): <b>[${out.join(", ")}]</b> — still a valid BST, order never shuffled.`)
    return JSON.stringify(out)
  },
}
