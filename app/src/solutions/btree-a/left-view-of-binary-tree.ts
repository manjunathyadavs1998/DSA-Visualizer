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

export const leftViewOfBinaryTree: SolutionDef = {
  code: `// maxLevelSeen starts at -1; view collects the answer
function leftView(node, level) {
  if (level > maxLevelSeen) {
    view.push(node.val);      // FIRST arrival on this level
    maxLevelSeen = level;
  }
  if (node.left) leftView(node.left, level + 1);
  if (node.right) leftView(node.right, level + 1);
}`,
  codeJava: `// int maxLevelSeen = -1; List<Integer> view
void leftView(TreeNode node, int level) {
  if (level > maxLevelSeen) {
    view.add(node.val);       // FIRST arrival on this level
    maxLevelSeen = level;
  }
  if (node.left != null) leftView(node.left, level + 1);
  if (node.right != null) leftView(node.right, level + 1);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `leftView(${t.length && t[0] !== -1 ? t[0] : "null"}, 0)`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const view: number[] = []
    let maxLevelSeen = -1
    const go = fn(
      "leftView",
      (node: TNode, level: number): string => {
        vars({ level, maxLevelSeen })
        line(
          2,
          `leftView(${node.val}) at level ${level}: is this a level nobody reached yet? maxLevelSeen = ${maxLevelSeen} → ${level > maxLevelSeen ? "<b>yes — new level!</b>" : "no — level " + level + " already has its leftmost node"}.`,
        )
        if (level > maxLevelSeen) {
          line(3, `<b>${node.val} joins the view</b> — first node ever to reach level ${level}, and root-left-right order makes it the leftmost one.`)
          view.push(node.val)
          heap("view", view)
          maxLevelSeen = level
          vars({ level, maxLevelSeen })
        }
        line(
          6,
          node.left
            ? `Go <b>left first</b> to ${node.left.val} — the left branch gets first claim on every deeper level.`
            : `No left child at ${node.val}.`,
        )
        if (node.left) go(node.left, level + 1)
        line(
          7,
          node.right
            ? `Now right to ${node.right.val} — any level it reaches first must be deeper than the left side ever got.`
            : `No right child — done at ${node.val}.`,
        )
        if (node.right) go(node.right, level + 1)
        return "✓"
      },
      1,
    )
    narrate(
      "Traverse <b>root, then LEFT, then right</b>. Because the left branch is always explored before the right, the FIRST node to arrive at any level is the leftmost node of that level — record exactly those first arrivals and you have the left view.",
    )
    heap("view", view)
    if (!root) {
      narrate("Empty tree — nothing to see.")
      return "[]"
    }
    go(root, 0)
    return JSON.stringify(view)
  },
}
