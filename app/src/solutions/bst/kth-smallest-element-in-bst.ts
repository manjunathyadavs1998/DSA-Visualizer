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

export const kthSmallestElementInBst: SolutionDef = {
  code: `// k is editable below; remaining = k
function inorder(node) {
  if (node === null || answer !== null) return;
  inorder(node.left);           // everything smaller first
  if (answer !== null) return;  // found deeper left — freeze
  remaining--;                  // node.val is the next smallest
  if (remaining === 0) { answer = node.val; return; }
  inorder(node.right);          // then everything bigger
}`,
  codeJava: `// int k; int remaining = k; Integer answer = null;
void inorder(TreeNode node) {
  if (node == null || answer != null) return;
  inorder(node.left);           // everything smaller first
  if (answer != null) return;   // found deeper left — freeze
  remaining--;                  // node.val is the next smallest
  if (remaining == 0) { answer = node.val; return; }
  inorder(node.right);          // then everything bigger
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 15 },
  ],
  entry: (a) => `inorder(${(a.numbers as number[])[0]})`,
  run({ fn, line, vars, narrate }, args) {
    const k = args.k as number
    const root = buildBst(args.numbers as number[])
    let remaining = k
    let answer: number | null = null
    const inorder = fn(
      "inorder",
      (node: BNode): string => {
        line(3, `inorder(${node.val}): drain everything smaller first — ${node.left !== null ? `go left into ${node.left.val}` : "no left child, nothing is smaller here"}.`)
        if (node.left !== null && answer === null) inorder(node.left)
        if (answer !== null) return "…unwinding"
        remaining--
        vars({ remaining })
        line(5, `Visit <b>${node.val}</b> — the next value in sorted order. remaining: ${remaining + 1} → ${remaining}.`)
        line(6, `remaining === 0? (${remaining === 0 ? `<b>yes — the ${k}ᵗʰ smallest is ${node.val}!</b>` : "no — keep walking"})`)
        if (remaining === 0) {
          answer = node.val
          return `answer = ${node.val}`
        }
        if (node.right !== null) {
          line(7, `Now everything bigger than ${node.val}: go right into ${node.right.val}.`)
          inorder(node.right)
        }
        return answer !== null ? `answer = ${answer}` : "✓"
      },
      1,
    )
    narrate(`Inorder traversal of a BST emits values in ascending order — so the k-th value visited IS the k-th smallest. Count down from ${k} and freeze the moment the counter hits 0.`)
    if (root === null) return "empty tree"
    inorder(root)
    narrate(
      answer !== null
        ? `Answer = ${answer}. Notice everything to the right of it in the tree: those calls simply <b>never happened</b> — the countdown stopped the traversal early.`
        : `The tree has fewer than ${k} nodes — no answer.`,
    )
    return answer === null ? "not enough nodes" : answer
  },
}
