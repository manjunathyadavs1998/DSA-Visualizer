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

export const searchInABst: SolutionDef = {
  code: `// tree = level-order numbers below (-1 = null)
function search(node) {
  if (node === null) return null;       // ran off the tree
  if (node.val === target) return node; // found it
  if (target < node.val)
    return search(node.left);  // whole RIGHT subtree impossible
  return search(node.right);   // whole LEFT subtree impossible
}`,
  codeJava: `// TreeNode root; int target;
TreeNode search(TreeNode node) {
  if (node == null) return null;        // ran off the tree
  if (node.val == target) return node;  // found it
  if (target < node.val)
    return search(node.left);  // whole RIGHT subtree impossible
  return search(node.right);   // whole LEFT subtree impossible
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "target", label: "target", default: 6, min: -99, max: 99 },
  ],
  entry: (a) => `search(${(a.numbers as number[])[0]})`,
  run({ fn, line, narrate }, args) {
    const target = args.target as number
    const root = buildBst(args.numbers as number[])
    const search = fn(
      "search",
      (node: BNode): string => {
        line(3, `search(${node.val}): is ${node.val} the target ${target}? (${node.val === target ? "<b>yes — found it!</b>" : "no"})`)
        if (node.val === target) return `found ${node.val}`
        line(4, `Is target ${target} < ${node.val}? (${target < node.val ? "yes → go left" : "no → go right"})`)
        if (target < node.val) {
          narrate(
            `<b>BST pruning:</b> target ${target} < ${node.val}, so the entire RIGHT subtree${node.right ? ` rooted at ${node.right.val}` : ""} holds only values > ${node.val} — it is <b>never even called</b>.`,
          )
          if (node.left === null) {
            line(2, `…but ${node.val} has no left child — we ran off the tree. ${target} is not in this BST.`)
            return "null (not found)"
          }
          line(5, `Descend left into ${node.left.val}.`)
          return search(node.left)
        }
        narrate(
          `<b>BST pruning:</b> target ${target} > ${node.val}, so the entire LEFT subtree${node.left ? ` rooted at ${node.left.val}` : ""} holds only values < ${node.val} — it is <b>never even called</b>.`,
        )
        if (node.right === null) {
          line(2, `…but ${node.val} has no right child — we ran off the tree. ${target} is not in this BST.`)
          return "null (not found)"
        }
        line(6, `Descend right into ${node.right.val}.`)
        return search(node.right)
      },
      1,
    )
    narrate("The recursion tree below IS the path taken through the BST: one comparison per level discards half of what remains — O(h), not O(n).")
    if (root === null) return "null (empty tree)"
    return search(root)
  },
}
