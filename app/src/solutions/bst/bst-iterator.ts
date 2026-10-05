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

function countNodes(node: BNode | null): number {
  if (node === null) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

export const bstIterator: SolutionDef = {
  code: `// stack = path of unvisited ancestors, next-smallest on top
function pushLeft(node) {
  while (node !== null) {
    stack.push(node);  // visited only AFTER its left side
    node = node.left;
  }
}
function next() {
  const node = stack.pop(); // smallest not yet returned
  pushLeft(node.right);     // its successors hide right
  return node.val;
}`,
  codeJava: `// Deque<TreeNode> stack = new ArrayDeque<>();
void pushLeft(TreeNode node) {
  while (node != null) {
    stack.push(node);  // visited only AFTER its left side
    node = node.left;
  }
}
int next() {
  TreeNode node = stack.pop(); // smallest not yet returned
  pushLeft(node.right);        // its successors hide right
  return node.val;
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "calls", label: "next() calls", default: 5, min: 1, max: 15 },
  ],
  entry: (a) => `pushLeft(${(a.numbers as number[])[0]})`,
  run({ fn, line, heap, narrate }, args) {
    const root = buildBst(args.numbers as number[])
    const calls = args.calls as number
    const stack: BNode[] = []
    const snap = () => stack.map((n) => n.val)
    let pushes = 0
    const pushLeft = fn(
      "pushLeft",
      (node: BNode): string => {
        let cur: BNode | null = node
        const added: number[] = []
        while (cur !== null) {
          stack.push(cur)
          pushes++
          added.push(cur.val)
          heap("stack", snap())
          line(3, `Push <b>${cur.val}</b> — it will be returned only AFTER all of its left descendants.`)
          line(4, `Dive left: node = ${cur.left !== null ? cur.left.val : "null"}.`)
          cur = cur.left
        }
        line(2, `node is null — stop. The smallest pending value now sits on top: <b>${stack.length > 0 ? stack[stack.length - 1].val : "—"}</b>.`)
        return `pushed [${added.join(",")}]`
      },
      1,
    )
    const next = fn(
      "next",
      (): number => {
        const node = stack.pop() as BNode
        heap("stack", snap())
        line(8, `Pop <b>${node.val}</b> — the smallest value not yet returned.`)
        if (node.right !== null) {
          line(9, `${node.val} has a right child → its in-order successors hide there: pushLeft(${node.right.val}).`)
          pushLeft(node.right)
        } else {
          line(9, `${node.val} has no right subtree — nothing to push. This next() was a pure O(1) pop.`)
        }
        line(10, `return ${node.val}.`)
        return node.val
      },
      7,
    )
    if (root === null) return "[]"
    narrate("Constructor: push the whole left spine. The stack holds the path of \"not yet visited\" ancestors — smallest on top — so we never need the full O(n) inorder list up front.")
    pushLeft(root)
    const out: number[] = []
    heap("returned", out)
    const total = countNodes(root)
    const n = Math.min(calls, total)
    for (let i = 1; i <= n; i++) {
      narrate(`— next() call #${i} —`)
      out.push(next())
      heap("returned", out)
    }
    if (calls > total) narrate(`hasNext() is now false — all ${total} values have been returned.`)
    narrate(`Values came out in sorted order: [${out.join(",")}]. <b>Amortized O(1):</b> across ${n} next() calls there were ${pushes} pushes total — each node is pushed once and popped once, never more.`)
    return JSON.stringify(out)
  },
}
