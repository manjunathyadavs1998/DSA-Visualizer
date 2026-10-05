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

export const closestBinarySearchTreeValue: SolutionDef = {
  code: `function closest(node, target) {
  if (!node) return best;
  if (Math.abs(node.val - target) < Math.abs(best - target))
    best = node.val;                 // new closest candidate
  if (target < node.val)             // all improvement lies LEFT
    return closest(node.left, target);
  return closest(node.right, target);     // …or RIGHT
}
// one root-to-leaf walk: O(h), not O(n)`,
  codeJava: `int closest(TreeNode node, double target) {
  if (node == null) return best;
  if (Math.abs(node.val - target) < Math.abs(best - target))
    best = node.val;                 // new closest candidate
  if (target < node.val)             // all improvement lies LEFT
    return closest(node.left, target);
  return closest(node.right, target);     // …or RIGHT
}
// one root-to-leaf walk: O(h), not O(n)`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 3, 10, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
    { kind: "number", name: "target", label: "target", default: 5, min: 0, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `closest(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.target})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const target = args.target as number
    if (!root) {
      narrate("Empty tree — no value to return.")
      return "none"
    }
    let best = root.val
    narrate(
      `Find the stored value nearest to <b>${target}</b>. This is binary search wearing a tree costume: at each node, record it as a candidate, then descend the ONE side where a closer value could possibly live — if target < node, every right-side value is farther than the node itself. One root-to-leaf path, candidates can only improve.`,
    )
    const closest = fn(
      "closest",
      (node: TNode): number => {
        const d = Math.abs(node.val - target)
        const bd = Math.abs(best - target)
        if (d < bd) {
          line(3, `|${node.val} − ${target}| = ${d} beats |${best} − ${target}| = ${bd} → <b>best = ${node.val}</b>.`)
          best = node.val
        } else {
          line(2, `|${node.val} − ${target}| = ${d} doesn't beat the current best ${best} (distance ${bd}) — keep ${best}.`)
        }
        vars({ best, dist: Math.abs(best - target) })
        if (target < node.val) {
          line(5, `${target} < ${node.val} → anything on ${node.val}'s right is even farther. ${node.left ? `Descend LEFT → closest(${node.left.val}).` : "No left child — the path ends; best stands."}`)
          return node.left ? closest(node.left) : best
        }
        line(6, `${target} ≥ ${node.val} → the left side can't improve. ${node.right ? `Descend RIGHT → closest(${node.right.val}).` : "No right child — the path ends; best stands."}`)
        return node.right ? closest(node.right) : best
      },
      0,
    )
    const ans = closest(root)
    narrate(`Closest value to ${target}: <b>${ans}</b> (distance ${Math.abs(ans - target)}).`)
    return ans
  },
}
