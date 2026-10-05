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

export const subtreeOfAnotherTree: SolutionDef = {
  code: `function isSubtree(node, sub) {
  if (!node) return false;             // ran out of anchor candidates
  if (same(node, sub)) return true;    // try anchoring the match HERE
  return isSubtree(node.left,  sub) ||
         isSubtree(node.right, sub);   // else try anchoring deeper
}
function same(a, b) {
  if (!a && !b) return true;           // both ended together
  if (!a || !b || a.val !== b.val) return false;
  return same(a.left, b.left) && same(a.right, b.right);
}`,
  codeJava: `boolean isSubtree(TreeNode node, TreeNode sub) {
  if (node == null) return false;      // ran out of anchor candidates
  if (same(node, sub)) return true;    // try anchoring the match HERE
  return isSubtree(node.left,  sub) ||
         isSubtree(node.right, sub);   // else try anchoring deeper
}
boolean same(TreeNode a, TreeNode b) {
  if (a == null && b == null) return true;
  if (a == null || b == null || a.val != b.val) return false;
  return same(a.left, b.left) && same(a.right, b.right);
}`,
  inputs: [
    { kind: "numbers", name: "tree1", label: "tree 1 (level-order, -1 = null)", default: [3, 4, 5, 1, 2], maxLen: 15 },
    { kind: "numbers", name: "tree2", label: "tree 2 (level-order, -1 = null)", default: [4, 1, 2], maxLen: 15 },
  ],
  entry: (a) => {
    const t1 = a.tree1 as number[]
    const t2 = a.tree2 as number[]
    const s = (t: number[]) => (t.length && t[0] !== -1 ? t[0] : "null")
    return `isSubtree(${s(t1)}, ${s(t2)})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree1 as number[])
    const sub = buildTree(args.tree2 as number[])
    narrate(
      "Two recursions stacked: the OUTER one (isSubtree) slides an anchor over every node of tree 1; at each anchor the INNER one (same) checks whether tree 2 matches <b>exactly</b> from there down — same shape, same values, same endings. Watch same() fail fast and the anchor move on.",
    )
    const same: (a: TNode | null, b: TNode | null) => boolean = fn(
      "same",
      (a: TNode | null, b: TNode | null): boolean => {
        if (!a && !b) {
          line(7, "Both trees ended here together — this branch matches: <b>true</b>.")
          return true
        }
        if (!a || !b) {
          line(8, `Shape mismatch: one side has a node (${a ?? b}) where the other has nothing → <b>false</b>.`)
          return false
        }
        if (a.val !== b.val) {
          line(8, `Value mismatch: ${a.val} ≠ ${b.val} → <b>false</b> — abandon this anchor immediately.`)
          return false
        }
        line(9, `${a.val} = ${b.val} ✓ — now BOTH children must match too: same(${a.left ?? "null"}, ${b.left ?? "null"}) && same(${a.right ?? "null"}, ${b.right ?? "null"}).`)
        const l = same(a.left, b.left)
        if (!l) return false
        return same(a.right, b.right)
      },
      6,
    )
    const isSubtree: (node: TNode | null, s: TNode | null) => boolean = fn(
      "isSubtree",
      (node: TNode | null, s: TNode | null): boolean => {
        if (!node) {
          line(1, "Ran past a leaf — no anchor on this path: <b>false</b>.")
          return false
        }
        vars({ anchor: node.val })
        line(2, `Anchor at <b>${node.val}</b>: does tree 2 match exactly from here down? → same(${node.val}, ${s ?? "null"}).`)
        if (same(node, s)) {
          line(2, `same() succeeded at anchor ${node.val} — tree 2 lives here. Bubble <b>true</b> all the way up.`)
          return true
        }
        line(3, `Anchor ${node.val} failed — slide the anchor into my left subtree${node.left ? ` (${node.left.val})` : " (empty)"}.`)
        if (node.left ? isSubtree(node.left, s) : false) return true
        line(4, `Left side had no match — try the right subtree${node.right ? ` (${node.right.val})` : " (empty)"}.`)
        return node.right ? isSubtree(node.right, s) : false
      },
      0,
    )
    if (!sub) {
      narrate("tree 2 is empty — the empty tree is a subtree of everything: <b>true</b>.")
      return true
    }
    const ans = isSubtree(root, sub)
    narrate(`Answer: <b>${ans}</b>. Cost: same() can run from every anchor → O(n · m) worst case.`)
    return ans
  },
}
