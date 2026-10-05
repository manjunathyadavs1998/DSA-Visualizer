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

export const zigzagLevelOrderTraversal: SolutionDef = {
  code: `function zigzagLevelOrder(root) {
  const queue = [root], levels = [];
  let leftToRight = true;
  while (queue.length > 0) {
    const ring = [];
    const width = queue.length;    // freeze: this ring only
    for (let i = 0; i < width; i++) {
      const node = queue.shift();
      if (leftToRight) ring.push(node.val);     // append →
      else             ring.unshift(node.val);  // prepend ←
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(ring);
    leftToRight = !leftToRight;    // flip for the next ring
  }
  return levels;
}`,
  codeJava: `List<List<Integer>> zigzagLevelOrder(TreeNode root) {
  Deque<TreeNode> queue = new ArrayDeque<>(List.of(root));
  boolean leftToRight = true;      // List<List<Integer>> levels
  while (!queue.isEmpty()) {
    LinkedList<Integer> ring = new LinkedList<>();
    int width = queue.size();      // freeze: this ring only
    for (int i = 0; i < width; i++) {
      TreeNode node = queue.poll();
      if (leftToRight) ring.addLast(node.val);  // append →
      else             ring.addFirst(node.val); // prepend ←
      if (node.left  != null) queue.add(node.left);
      if (node.right != null) queue.add(node.right);
    }
    levels.add(ring);
    leftToRight = !leftToRight;    // flip for the next ring
  }
  return levels;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, 6, 7, -1, 8], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `zigzagLevelOrder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const levels: number[][] = []
    narrate(
      "Plain BFS, one twist: the QUEUE never changes direction — nodes are always dequeued left→right. Only the way we <b>write into the ring</b> flips: append on even levels, prepend on odd ones. The zigzag is an output trick, not a traversal trick.",
    )
    const zigzag = fn(
      "zigzagLevelOrder",
      (r: TNode): string => {
        const queue: TNode[] = [r]
        let leftToRight = true
        let depth = 0
        line(1, `Seed the queue with the root [${r.val}]; levels starts empty.`)
        heap("queue", queue.map((n) => n.val))
        heap("levels", levels)
        while (queue.length > 0) {
          const ring: number[] = []
          const width = queue.length
          vars({ depth, width, leftToRight, queue: queue.map((n) => n.val) })
          line(5, `Level ${depth}: queue holds [${queue.map((n) => n.val).join(", ")}] — freeze width = ${width}. Writing direction this ring: <b>${leftToRight ? "left → right (append)" : "right → left (prepend)"}</b>.`)
          for (let i = 0; i < width; i++) {
            const node = queue.shift() as TNode
            if (leftToRight) {
              ring.push(node.val)
              line(8, `Dequeue <b>${node.val}</b>, APPEND → ring = [${ring.join(", ")}].`)
            } else {
              ring.unshift(node.val)
              line(9, `Dequeue <b>${node.val}</b>, PREPEND ← ring = [${ring.join(", ")}] — same visit order, reversed on paper.`)
            }
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
            heap("queue", queue.map((n) => n.val))
            if (node.left || node.right) {
              line(10, `Children of ${node.val} (${[node.left, node.right].filter(Boolean).join(", ")}) join the queue — always left before right, zigzag or not.`)
            }
          }
          levels.push(ring)
          heap("levels", levels)
          line(13, `Ring ${depth} done: [${ring.join(", ")}].`)
          leftToRight = !leftToRight
          line(14, `Flip the pen: next ring writes <b>${leftToRight ? "left → right" : "right → left"}</b>.`)
          depth++
        }
        return `${levels.length} levels`
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — no levels.")
      return "[]"
    }
    zigzag(root)
    return JSON.stringify(levels)
  },
}
