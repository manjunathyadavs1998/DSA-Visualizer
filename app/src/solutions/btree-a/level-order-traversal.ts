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

export const levelOrderTraversal: SolutionDef = {
  code: `function levelOrder(root) {
  const queue = [root];
  while (queue.length > 0) {
    const ring = [];
    const width = queue.length;    // nodes on this level only
    for (let i = 0; i < width; i++) {
      const node = queue.shift();
      ring.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(ring);
  }
}`,
  codeJava: `void levelOrder(TreeNode root) {
  Queue<TreeNode> queue = new LinkedList<>(List.of(root));
  while (!queue.isEmpty()) {
    List<Integer> ring = new ArrayList<>();
    int width = queue.size();      // nodes on this level only
    for (int i = 0; i < width; i++) {
      TreeNode node = queue.poll();
      ring.add(node.val);
      if (node.left != null) queue.add(node.left);
      if (node.right != null) queue.add(node.right);
    }
    levels.add(ring);
  }
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `levelOrder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const levels: number[][] = []
    narrate(
      "BFS with a queue: at the top of every while-iteration the queue holds <b>exactly one ring of the tree</b>. Freeze its size as `width`, drain that many nodes into a ring, and their children queue up as the NEXT ring.",
    )
    const levelOrder = fn(
      "levelOrder",
      (r: TNode): string => {
        const queue: TNode[] = [r]
        let depth = 0
        line(1, `Seed the queue with the root: [${r.val}]. Recursion goes deep; this queue goes <b>wide</b>.`)
        heap("queue", queue.map((n) => n.val))
        heap("levels", levels)
        while (queue.length > 0) {
          const ring: number[] = []
          const width = queue.length
          vars({ depth, width, queue: queue.map((n) => n.val) })
          line(
            4,
            `Level ${depth}: the queue holds exactly this ring — [${queue.map((n) => n.val).join(", ")}]. Freeze width = ${width} so the children we're about to add don't leak into it.`,
          )
          for (let i = 0; i < width; i++) {
            const node = queue.shift() as TNode
            ring.push(node.val)
            heap("queue", queue.map((n) => n.val))
            line(
              7,
              `Dequeue <b>${node.val}</b> into ring ${depth}${node.left || node.right ? `; its children (${[node.left, node.right].filter(Boolean).join(", ")}) join the back of the queue — that's the NEXT ring forming` : "; it's a leaf — nothing to enqueue"}.`,
            )
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
            heap("queue", queue.map((n) => n.val))
          }
          line(11, `Ring ${depth} complete: [${ring.join(", ")}]. ${queue.length ? `The queue now holds the whole next ring: [${queue.map((n) => n.val).join(", ")}].` : "The queue is empty — no deeper ring exists."}`)
          levels.push(ring)
          heap("levels", levels)
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
    levelOrder(root)
    return JSON.stringify(levels)
  },
}
