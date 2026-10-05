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

export const balancedBinaryTree: SolutionDef = {
  code: `// returns height, or -1 the moment ANY subtree is unbalanced
function check(node) {
  const lh = node.left  ? check(node.left)  : 0;
  if (lh === -1) return -1;              // bail out early
  const rh = node.right ? check(node.right) : 0;
  if (rh === -1) return -1;              // bail out early
  if (Math.abs(lh - rh) > 1) return -1;  // I am the problem
  return 1 + Math.max(lh, rh);
}`,
  codeJava: `// returns height, or -1 the moment ANY subtree is unbalanced
int check(TreeNode node) {
  int lh = node.left  != null ? check(node.left)  : 0;
  if (lh == -1) return -1;               // bail out early
  int rh = node.right != null ? check(node.right) : 0;
  if (rh == -1) return -1;               // bail out early
  if (Math.abs(lh - rh) > 1) return -1;  // I am the problem
  return 1 + Math.max(lh, rh);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, -1, -1, -1, 5, -1], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `check(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const check = fn(
      "check",
      (node: TNode): number => {
        line(2, `check(${node.val}): left height? ${node.left ? `Ask <b>check(${node.left.val})</b>.` : "No left child → lh = 0."}`)
        const lh = node.left ? check(node.left) : 0
        vars({ lh })
        if (lh === -1) {
          line(3, `check(${node.val}): lh = <b>-1</b> — the alarm from below. Don't even look right; pass it straight up.`)
          return -1
        }
        line(4, `check(${node.val}): lh = ${lh}. Right height? ${node.right ? `Ask <b>check(${node.right.val})</b>.` : "No right child → rh = 0."}`)
        const rh = node.right ? check(node.right) : 0
        vars({ lh, rh })
        if (rh === -1) {
          line(5, `check(${node.val}): rh = <b>-1</b> — alarm from the right side. Pass it straight up.`)
          return -1
        }
        line(
          6,
          `check(${node.val}): |lh − rh| = |${lh} − ${rh}| = ${Math.abs(lh - rh)} — ${Math.abs(lh - rh) > 1 ? "<b>more than 1: I am the unbalanced node!</b> Return the -1 sentinel instead of a height." : "≤ 1, balanced here."}`,
        )
        if (Math.abs(lh - rh) > 1) return -1
        line(7, `check(${node.val}): balanced, so report a real height: 1 + max(${lh}, ${rh}) = ${1 + Math.max(lh, rh)}.`)
        return 1 + Math.max(lh, rh)
      },
      1,
    )
    narrate(
      "One recursion does both jobs: it returns a <b>height</b> when the subtree is balanced, and the sentinel <b>-1</b> the moment anything is off. Every ancestor sees -1 and bails immediately — no wasted work above a known failure. Try [1,2,3,4,5,-1,6] for a balanced tree.",
    )
    if (!root) {
      narrate("Empty tree — trivially balanced.")
      return true
    }
    const h = check(root)
    narrate(h === -1 ? "The sentinel reached the top — the tree is <b>not balanced</b>." : `check(root) = ${h}, a real height — the tree is <b>balanced</b>.`)
    return h !== -1
  },
}
