import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
  toString(): string
}

function mkNode(val: number): TNode {
  return {
    val,
    left: null,
    right: null,
    toString() {
      return String(this.val)
    },
  }
}

/** Level-order values → tree; -1 means null. */
function buildTree(vals: number[]): TNode | null {
  if (vals.length === 0 || vals[0] === -1) return null
  const root = mkNode(vals[0])
  const queue: TNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < vals.length) {
    const cur = queue.shift() as TNode
    const l = vals[i++]
    if (l !== undefined && l !== -1) {
      cur.left = mkNode(l)
      queue.push(cur.left)
    }
    const r = vals[i++]
    if (r !== undefined && r !== -1) {
      cur.right = mkNode(r)
      queue.push(cur.right)
    }
  }
  return root
}

export const binaryTreeToDoublyLinkedList: SolutionDef = {
  code: `// inorder walk; each visited node hooks behind the previous one
let prev = null, head = null;
function thread(node) {
  if (node.left) thread(node.left);
  if (prev === null) head = node;      // leftmost node = list head
  else { prev.right = node; node.left = prev; }
  prev = node;
  if (node.right) thread(node.right);
}`,
  codeJava: `// inorder walk; each visited node hooks behind the previous one
Node prev = null, head = null;
void thread(Node node) {
  if (node.left != null) thread(node.left);
  if (prev == null) head = node;       // leftmost node = list head
  else { prev.right = node; node.left = prev; }
  prev = node;
  if (node.right != null) thread(node.right);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [4, 2, 5, 1, 3], maxLen: 12 },
  ],
  entry: (a) => `thread(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const root = buildTree(args.tree as number[])
    if (!root) {
      narrate("Empty tree — the list is empty too.")
      return "[]"
    }
    let prev: TNode | null = null
    let head: TNode | null = null
    const dll: number[] = []
    heap("dll", dll)
    const thread: (n: TNode) => string = fn(
      "thread",
      (n: TNode): string => {
        line(3, n.left ? `thread(${n.val}): everything smaller sits in my left subtree — thread it first.` : `thread(${n.val}): no left subtree — I'm next in inorder.`)
        if (n.left) thread(n.left)
        if (prev === null) {
          head = n
          line(4, `thread(${n.val}): no previous node yet → <b>${n.val} is the leftmost node, so it becomes the list head</b>.`)
        } else {
          n.left = prev
          prev.right = n
          line(5, `thread(${n.val}): rewire the tree pointers into list pointers — <b>${prev.val}.right (next) = ${n.val}</b> and <b>${n.val}.left (prev) = ${prev.val}</b>: left⇄right just became prev⇄next.`)
        }
        prev = n
        dll.push(n.val)
        heap("dll", dll)
        vars({ prev: prev.val, head: head ? head.val : "null" })
        line(6, `thread(${n.val}): I'm the new tail — the list so far reads [${dll.join(" ⇄ ")}].`)
        const right = n.right
        if (right) {
          line(7, `thread(${n.val}): now thread my right subtree (rooted at ${right.val}) — its nodes come after me in order.`)
          thread(right)
        } else {
          line(7, `thread(${n.val}): no right subtree — pop back up.`)
        }
        return `tail=${prev.val}`
      },
      2,
    )
    narrate("An inorder walk visits nodes in sorted order — so stitch each visited node behind the previous one: left becomes prev, right becomes next.")
    thread(root)
    const back: number[] = []
    for (let n = prev as TNode | null; n !== null; n = n.left) back.push(n.val)
    narrate(`Proof it's doubly linked: forward [${dll.join(" → ")}], and walking .left back from the tail gives [${back.join(" → ")}].`)
    return JSON.stringify(dll)
  },
}
