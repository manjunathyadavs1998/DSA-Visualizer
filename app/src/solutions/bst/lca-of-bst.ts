import type { SolutionDef } from "@/engine/types"

type BNode = { val: number; left: BNode | null; right: BNode | null; toString: () => string }

/** Parse a level-order array (-1 = null) into a binary tree, using a queue. */
function buildBst(level: number[]): BNode | null {
  if (level.length === 0 || level[0] === -1) return null
  const mk = (val: number): BNode => ({ val, left: null, right: null, toString: () => String(val) })
  const root = mk(level[0])
  const queue: BNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < level.length) {
    const cur = queue.shift() as BNode
    if (i < level.length && level[i] !== -1) {
      cur.left = mk(level[i])
      queue.push(cur.left)
    }
    i++
    if (i < level.length && level[i] !== -1) {
      cur.right = mk(level[i])
      queue.push(cur.right)
    }
    i++
  }
  return root
}

export const lcaOfBst: SolutionDef = {
  code: `// p and q are editable below
function lca(node) {
  if (p < node.val && q < node.val)
    return lca(node.left);  // both smaller — right half irrelevant
  if (p > node.val && q > node.val)
    return lca(node.right); // both bigger — left half irrelevant
  return node;              // paths split here → this is the LCA
}`,
  codeJava: `// int p, q;
TreeNode lca(TreeNode node) {
  if (p < node.val && q < node.val)
    return lca(node.left);  // both smaller — right half irrelevant
  if (p > node.val && q > node.val)
    return lca(node.right); // both bigger — left half irrelevant
  return node;              // paths split here → this is the LCA
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "p", label: "p", default: 2, min: -99, max: 99 },
    { kind: "number", name: "q", label: "q", default: 6, min: -99, max: 99 },
  ],
  entry: (a) => `lca(${(a.numbers as number[])[0]})`,
  run({ fn, line, narrate }, args) {
    const p = args.p as number
    const q = args.q as number
    const root = buildBst(args.numbers as number[])
    const lca = fn(
      "lca",
      (node: BNode): string => {
        line(2, `lca(${node.val}): are BOTH ${p} and ${q} smaller than ${node.val}? (${p < node.val && q < node.val ? "<b>yes</b>" : "no"})`)
        if (p < node.val && q < node.val) {
          narrate(`Both targets live in the LEFT subtree of ${node.val} — its right subtree${node.right ? ` (rooted at ${node.right.val})` : ""} cannot contain the LCA and is <b>never called</b>.`)
          if (node.left === null) return `${node.val} (p/q not in tree)`
          line(3, `Descend left into ${node.left.val}.`)
          return lca(node.left)
        }
        line(4, `Are BOTH ${p} and ${q} greater than ${node.val}? (${p > node.val && q > node.val ? "<b>yes</b>" : "no"})`)
        if (p > node.val && q > node.val) {
          narrate(`Both targets live in the RIGHT subtree of ${node.val} — its left subtree${node.left ? ` (rooted at ${node.left.val})` : ""} cannot contain the LCA and is <b>never called</b>.`)
          if (node.right === null) return `${node.val} (p/q not in tree)`
          line(5, `Descend right into ${node.right.val}.`)
          return lca(node.right)
        }
        line(6, `<b>Split point!</b> ${p} and ${q} are on different sides of ${node.val} (or one IS ${node.val}) — any deeper node would lose one of them. <b>LCA = ${node.val}</b>.`)
        return `LCA = ${node.val}`
      },
      1,
    )
    narrate("In a BST you never search both sides: while p and q sit on the same side of the current node, descend that way. The FIRST node where their paths separate is the lowest common ancestor.")
    if (root === null) return "null (empty tree)"
    return lca(root)
  },
}
