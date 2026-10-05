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

export const inorderPredecessorSuccessor: SolutionDef = {
  code: `// key is editable below; pred < key < succ
function walk(node) {
  if (node === null) return;
  if (node.val < key) {
    pred = node.val;    // best "just below" so far
    walk(node.right);   // maybe something closer on the right
  } else if (node.val > key) {
    succ = node.val;    // best "just above" so far
    walk(node.left);    // maybe something closer on the left
  } else {
    walk(node.left);    // pred = rightmost of left subtree
    walk(node.right);   // succ = leftmost of right subtree
  }
}`,
  codeJava: `// int key; Integer pred = null, succ = null;
void walk(TreeNode node) {
  if (node == null) return;
  if (node.val < key) {
    pred = node.val;    // best "just below" so far
    walk(node.right);   // maybe something closer on the right
  } else if (node.val > key) {
    succ = node.val;    // best "just above" so far
    walk(node.left);    // maybe something closer on the left
  } else {
    walk(node.left);    // pred = rightmost of left subtree
    walk(node.right);   // succ = leftmost of right subtree
  }
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "key", label: "key", default: 6, min: -99, max: 99 },
  ],
  entry: (a) => `walk(${(a.numbers as number[])[0]})`,
  run({ fn, line, vars, narrate }, args) {
    const key = args.key as number
    const root = buildBst(args.numbers as number[])
    let pred: number | null = null
    let succ: number | null = null
    const walk = fn(
      "walk",
      (node: BNode): string => {
        line(3, `walk(${node.val}): is ${node.val} < key=${key}? (${node.val < key ? "yes" : "no"})`)
        if (node.val < key) {
          pred = node.val
          vars({ pred, succ: succ ?? "—" })
          line(4, `${node.val} < ${key} → <b>pred candidate = ${node.val}</b> (best "just below" so far).`)
          narrate(`Everything LEFT of ${node.val} is even smaller — it can't beat pred=${node.val}, so that subtree is <b>never called</b>.`)
          if (node.right === null) {
            line(2, `${node.val} has no right child — nothing between ${node.val} and ${key}.`)
            return `pred=${pred}`
          }
          line(5, `Turn right into ${node.right.val}: hunting something bigger but still < ${key}.`)
          return walk(node.right)
        }
        line(6, `Is ${node.val} > key=${key}? (${node.val > key ? "yes" : "no — it EQUALS the key"})`)
        if (node.val > key) {
          succ = node.val
          vars({ pred: pred ?? "—", succ })
          line(7, `${node.val} > ${key} → <b>succ candidate = ${node.val}</b> (best "just above" so far).`)
          narrate(`Everything RIGHT of ${node.val} is even bigger — it can't beat succ=${node.val}, so that subtree is <b>never called</b>.`)
          if (node.left === null) {
            line(2, `${node.val} has no left child — nothing between ${key} and ${node.val}.`)
            return `succ=${succ}`
          }
          line(8, `Turn left into ${node.left.val}: hunting something smaller but still > ${key}.`)
          return walk(node.left)
        }
        line(10, `Found key ${key} itself. Its predecessor is the RIGHTMOST value of its left subtree.`)
        if (node.left !== null) walk(node.left)
        else narrate(`${key} has no left subtree — pred stays ${pred ?? "null"}, recorded at the last right-turn above.`)
        line(11, `Its successor is the LEFTMOST value of its right subtree.`)
        if (node.right !== null) walk(node.right)
        else narrate(`${key} has no right subtree — succ stays ${succ ?? "null"}, recorded at the last left-turn above.`)
        return `pred=${pred ?? "null"}, succ=${succ ?? "null"}`
      },
      1,
    )
    narrate(`One walk, two candidates: every LEFT turn records a succ, every RIGHT turn records a pred. The last recorded values are the sorted-order neighbors of ${key}.`)
    if (root === null) return "empty tree"
    walk(root)
    return `pred=${pred ?? "null"}, succ=${succ ?? "null"}`
  },
}
