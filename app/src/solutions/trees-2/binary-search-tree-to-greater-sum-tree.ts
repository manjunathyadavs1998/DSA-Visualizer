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

export const binarySearchTreeToGreaterSumTree: SolutionDef = {
  code: `function greater(node) {
  if (!node) return;
  greater(node.right);   // REVERSE inorder: biggest values first
  sum += node.val;       // sum = all values ≥ mine (incl. me)
  node.val = sum;
  greater(node.left);    // smaller values see an even bigger sum
}
// greater(root); sum starts at 0`,
  codeJava: `void greater(TreeNode node) {
  if (node == null) return;
  greater(node.right);   // REVERSE inorder: biggest values first
  sum += node.val;       // sum = all values ≥ mine (incl. me)
  node.val = sum;
  greater(node.left);    // smaller values see an even bigger sum
}
// greater(root); sum starts at 0`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [4, 1, 6, 0, 2, 5, 7, -1, -1, -1, 3, -1, -1, -1, 8], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `greater(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let sum = 0
    narrate(
      "Every node must become <b>itself + the sum of all values greater than it</b>. Who already knows that sum? The inorder walk run BACKWARDS: visit right subtree first, so values arrive from biggest to smallest and a single running `sum` always equals 'everything ≥ me'. One pass, no second traversal.",
    )
    const greater = fn(
      "greater",
      (node: TNode): string => {
        line(2, `greater(${node.val}): everything bigger than me lives on my RIGHT — accumulate it first${node.right ? ` → greater(${node.right.val})` : " (no right child: nothing bigger down here)"}.`)
        if (node.right) greater(node.right)
        sum += node.val
        line(3, `Back at ${node.val}: running sum ${sum - node.val} + my ${node.val} = <b>${sum}</b> — the total of every value ≥ ${node.val}.`)
        const old = node.val
        node.val = sum
        heap("tree", serialize(root as TNode))
        vars({ old, newVal: sum, sum })
        line(4, `Overwrite: node ${old} becomes <b>${sum}</b>.`)
        line(5, `Now my LEFT side — those smaller values include my ${old} in THEIR sums${node.left ? ` → greater(${node.left.val})` : " (no left child: unwind)"}.`)
        if (node.left) greater(node.left)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree.")
      return "[]"
    }
    heap("tree", serialize(root))
    greater(root)
    const out = serialize(root)
    narrate(`Greater-sum tree (level-order): <b>[${out.join(", ")}]</b>. The maximum original value kept its value + nothing; the minimum became the grand total ${sum}.`)
    return JSON.stringify(out)
  },
}
