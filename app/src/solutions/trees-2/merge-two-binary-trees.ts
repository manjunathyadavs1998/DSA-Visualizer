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

/** Level-order snapshot with "·" for holes (trailing holes trimmed). */
function serialize(root: TNode | null): (number | string)[] {
  if (!root) return []
  const out: (number | string)[] = []
  const q: (TNode | null)[] = [root]
  while (q.length) {
    const n = q.shift() ?? null
    if (!n) {
      out.push("·")
      continue
    }
    out.push(n.val)
    q.push(n.left, n.right)
  }
  while (out.length && out[out.length - 1] === "·") out.pop()
  return out
}

export const mergeTwoBinaryTrees: SolutionDef = {
  code: `function mergeTrees(a, b) {
  if (!a) return b;      // my side ran out → graft b's whole subtree
  if (!b) return a;      // b ran out → keep mine as-is
  a.val += b.val;        // both exist: overlap, add into tree 1
  a.left  = mergeTrees(a.left,  b.left);
  a.right = mergeTrees(a.right, b.right);
  return a;
}`,
  codeJava: `TreeNode mergeTrees(TreeNode a, TreeNode b) {
  if (a == null) return b; // my side ran out → graft b's whole subtree
  if (b == null) return a; // b ran out → keep mine as-is
  a.val += b.val;          // both exist: overlap, add into tree 1
  a.left  = mergeTrees(a.left,  b.left);
  a.right = mergeTrees(a.right, b.right);
  return a;
}`,
  inputs: [
    { kind: "numbers", name: "tree1", label: "tree 1 (level-order, -1 = null)", default: [1, 3, 2, 5], maxLen: 15 },
    { kind: "numbers", name: "tree2", label: "tree 2 (level-order, -1 = null)", default: [2, 1, 3, -1, 4, -1, 7], maxLen: 15 },
  ],
  entry: (a) => {
    const t1 = a.tree1 as number[]
    const t2 = a.tree2 as number[]
    const s = (t: number[]) => (t.length && t[0] !== -1 ? t[0] : "null")
    return `mergeTrees(${s(t1)}, ${s(t2)})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root1 = buildTree(args.tree1 as number[])
    const root2 = buildTree(args.tree2 as number[])
    narrate(
      "Walk both trees in lock-step. Where the two overlap, the values ADD; where one tree runs out, the other tree's whole subtree is <b>grafted in one move</b> — no copying node by node. Watch the `merged` heap snapshot grow after every overlap.",
    )
    const mergeTrees = fn(
      "mergeTrees",
      (a: TNode | null, b: TNode | null): TNode | null => {
        if (!a) {
          line(1, `Tree 1 has nothing here → ${b ? `graft tree 2's subtree rooted at <b>${b.val}</b> wholesale — recursion below it is unnecessary.` : "neither tree has a node here → null."}`)
          return b
        }
        if (!b) {
          line(2, `Tree 2 has nothing at ${a.val}'s spot → keep tree 1's subtree <b>${a.val}</b> untouched.`)
          return a
        }
        const sum = a.val + b.val
        line(3, `Overlap: ${a.val} (tree 1) + ${b.val} (tree 2) = <b>${sum}</b> — stored in tree 1's node.`)
        a.val = sum
        vars({ merged: sum })
        line(4, `Merge the two LEFT children in lock-step: mergeTrees(${a.left ?? "null"}, ${b.left ?? "null"}).`)
        a.left = mergeTrees(a.left, b.left)
        line(5, `Merge the two RIGHT children in lock-step: mergeTrees(${a.right ?? "null"}, ${b.right ?? "null"}).`)
        a.right = mergeTrees(a.right, b.right)
        heap("merged", serialize(a))
        line(6, `Subtree at <b>${a.val}</b> fully merged — hand it back to my parent.`)
        return a
      },
      0,
    )
    const merged = mergeTrees(root1, root2)
    heap("merged", serialize(merged))
    const out = serialize(merged)
    narrate(`Merged tree (level-order): <b>[${out.join(", ")}]</b>.`)
    return JSON.stringify(out)
  },
}
