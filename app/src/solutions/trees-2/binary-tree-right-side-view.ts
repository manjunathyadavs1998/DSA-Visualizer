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

export const binaryTreeRightSideView: SolutionDef = {
  code: `const view = [];
function dfs(node, depth) {
  if (!node) return;
  if (depth === view.length) view.push(node.val);  // 1st arrival at this depth
  dfs(node.right, depth + 1);   // right child FIRST
  dfs(node.left,  depth + 1);   // left only fills levels right never reached
}
// dfs(root, 0); answer = view`,
  codeJava: `List<Integer> view = new ArrayList<>();
void dfs(TreeNode node, int depth) {
  if (node == null) return;
  if (depth == view.size()) view.add(node.val);    // 1st arrival at this depth
  dfs(node.right, depth + 1);   // right child FIRST
  dfs(node.left,  depth + 1);   // left only fills levels right never reached
}
// dfs(root, 0); answer = view`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6, -1, -1, 7], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `dfs(${t.length && t[0] !== -1 ? t[0] : "null"}, 0)`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const view: number[] = []
    narrate(
      "Stand to the RIGHT of the tree: you see exactly one node per level — the rightmost. Trick: DFS <b>right child first</b>, and the first node you ever meet at each depth is the one visible from the right. `view.length` doubles as 'deepest level already claimed'.",
    )
    const dfs = fn(
      "dfs",
      (node: TNode, depth: number): string => {
        vars({ depth, view: `[${view.join(", ")}]` })
        if (depth === view.length) {
          view.push(node.val)
          heap("output", view)
          line(3, `depth ${depth} === view.length — nobody has claimed level ${depth} yet, so <b>${node.val}</b> is the rightmost node there. view = [${view.join(", ")}].`)
        } else {
          line(3, `depth ${depth} < view.length ${view.length} — level ${depth} was already claimed by a node further right (${view[depth]}). ${node.val} stays invisible.`)
        }
        line(4, `dfs(${node.val}): ${node.right ? `go RIGHT first → dfs(${node.right.val}, ${depth + 1}).` : "no right child — nothing to explore on my right."}`)
        if (node.right) dfs(node.right, depth + 1)
        line(5, `dfs(${node.val}): ${node.left ? `now the left side → dfs(${node.left.val}, ${depth + 1}) — it can only claim levels the right side never reached.` : "no left child either — done here."}`)
        if (node.left) dfs(node.left, depth + 1)
        return "✓"
      },
      1,
    )
    if (!root) {
      narrate("Empty tree — the view is [].")
      return "[]"
    }
    heap("output", view)
    dfs(root, 0)
    narrate(`Right side view: <b>[${view.join(", ")}]</b> — one claim per level, right side always got first pick.`)
    return JSON.stringify(view)
  },
}
