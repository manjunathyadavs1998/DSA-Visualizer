import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
  next: TNode | null
  toString(): string
}

function mkNode(val: number): TNode {
  return {
    val,
    left: null,
    right: null,
    next: null,
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

export const populatingNextRightPointers: SolutionDef = {
  code: `// BFS level by level; each node points to the one dequeued after it
function connect(root) {
  const queue = [root];
  while (queue.length > 0) {
    const size = queue.length;      // nodes on this level
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (i < size - 1) node.next = queue[0];
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return root;
}`,
  codeJava: `// BFS level by level; each node points to the one dequeued after it
Node connect(Node root) {
  Queue<Node> queue = new LinkedList<>(List.of(root));
  while (!queue.isEmpty()) {
    int size = queue.size();        // nodes on this level
    for (int i = 0; i < size; i++) {
      Node node = queue.poll();
      if (i < size - 1) node.next = queue.peek();
      if (node.left != null) queue.add(node.left);
      if (node.right != null) queue.add(node.right);
    }
  }
  return root;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, 6, 7], maxLen: 15 },
  ],
  entry: (a) => `connect(${(a.tree as number[])[0] ?? "∅"})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const root = buildTree(args.tree as number[])
    if (!root) {
      narrate("Empty tree — nothing to connect.")
      return "[]"
    }
    const links: string[][] = []
    const connect = fn(
      "connect",
      (r: TNode): string => {
        const queue: TNode[] = [r]
        heap("queue", queue.map((n) => n.val))
        line(2, `Seed the queue with the root ${r.val}.`)
        let level = 0
        while (queue.length > 0) {
          const size = queue.length
          links.push([])
          heap("links", links)
          vars({ level, size })
          line(4, `Level ${level}: the queue holds exactly this level — <b>${size} node(s)</b>: [${queue.map((n) => n.val).join(", ")}].`)
          for (let i = 0; i < size; i++) {
            const node = queue.shift() as TNode
            heap("queue", queue.map((n) => n.val))
            vars({ level, size, i, node: node.val })
            if (i < size - 1) {
              node.next = queue[0]
              links[links.length - 1].push(`${node.val}→${queue[0].val}`)
              heap("links", links)
              line(7, `${node.val} is not last on its level — its right neighbour is the next in the queue: <b>${node.val}.next = ${queue[0].val}</b>.`)
            } else {
              line(7, `${node.val} is the <b>last node of level ${level}</b> — its next stays null.`)
            }
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
            heap("queue", queue.map((n) => n.val))
            line(9, `Enqueue ${node.val}'s children${node.left || node.right ? ` (${[node.left, node.right].filter(Boolean).join(", ")})` : " — none"} for the next level.`)
          }
          level++
        }
        return `${level} level(s) linked`
      },
      1,
    )
    narrate("The queue always contains exactly one level. Whoever is dequeued right after me on my level IS my next pointer.")
    connect(root)
    return JSON.stringify(links)
  },
}
