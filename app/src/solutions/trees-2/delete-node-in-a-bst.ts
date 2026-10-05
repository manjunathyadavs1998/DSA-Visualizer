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

export const deleteNodeInABst: SolutionDef = {
  code: `function del(node, key) {
  if (!node) return null;              // key wasn't in the tree
  if (key < node.val) { node.left  = del(node.left,  key); return node; }
  if (key > node.val) { node.right = del(node.right, key); return node; }
  // === found the key ===
  if (!node.left)  return node.right;  // 0–1 children: splice me out
  if (!node.right) return node.left;
  let succ = node.right;               // 2 children: inorder successor =
  while (succ.left) succ = succ.left;  //   leftmost node of right subtree
  node.val = succ.val;                 // copy successor's value up…
  node.right = del(node.right, succ.val);  // …then delete IT (easy case)
  return node;
}`,
  codeJava: `TreeNode del(TreeNode node, int key) {
  if (node == null) return null;       // key wasn't in the tree
  if (key < node.val) { node.left  = del(node.left,  key); return node; }
  if (key > node.val) { node.right = del(node.right, key); return node; }
  // === found the key ===
  if (node.left  == null) return node.right; // 0–1 children: splice out
  if (node.right == null) return node.left;
  TreeNode succ = node.right;          // 2 children: inorder successor =
  while (succ.left != null) succ = succ.left; // leftmost of right subtree
  node.val = succ.val;                 // copy successor's value up…
  node.right = del(node.right, succ.val);  // …then delete IT (easy case)
  return node;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 3, 10, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
    { kind: "number", name: "key", label: "key to delete", default: 3, min: 0, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `del(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.key})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const key = args.key as number
    narrate(
      "Three cases, in rising difficulty: a node with <b>0 or 1 children</b> is simply spliced out (hand your only child to your parent). A node with <b>2 children</b> is never unlinked at all — its value is overwritten with its <b>inorder successor</b> (the leftmost node of the right subtree, the smallest value bigger than it), then THAT node is deleted instead, which is guaranteed to be an easy case (it has no left child).",
    )
    const del = fn(
      "del",
      (node: TNode | null, k: number): TNode | null => {
        if (!node) {
          line(1, `Fell off the tree — <b>${k}</b> isn't here. Nothing to delete.`)
          return null
        }
        vars({ at: node.val, key: k })
        if (k < node.val) {
          line(2, `${k} < ${node.val} → the key can only live in the LEFT subtree; everything else is untouched.`)
          node.left = del(node.left, k)
          return node
        }
        if (k > node.val) {
          line(3, `${k} > ${node.val} → the key can only live in the RIGHT subtree.`)
          node.right = del(node.right, k)
          return node
        }
        line(4, `Found <b>${node.val}</b> — now, how many children does it have?`)
        if (!node.left) {
          line(5, `No left child → splice: hand my right ${node.right ? `subtree (${node.right.val})` : "side (nothing)"} directly to my parent. I vanish.`)
          return node.right
        }
        if (!node.right) {
          line(6, `No right child → splice: my left subtree (${node.left.val}) takes my place.`)
          return node.left
        }
        let succ = node.right
        line(7, `TWO children — can't just splice (both ${node.left.val} and ${node.right.val} need a home). Find my inorder successor: start at my right child ${succ.val}…`)
        while (succ.left) {
          succ = succ.left
          line(8, `…step left to <b>${succ.val}</b>${succ.left ? "" : " — no more lefts: this is the smallest value bigger than mine"}.`)
        }
        vars({ at: node.val, succ: succ.val })
        line(9, `Overwrite my value: ${node.val} ← <b>${succ.val}</b>. BST order still holds — ${succ.val} is bigger than my whole left subtree, smaller than the rest of my right.`)
        node.val = succ.val
        heap("tree", serialize(node))
        line(10, `Now the duplicate ${succ.val} in my right subtree must go — recurse del(right, ${succ.val}). It has no left child, so it will hit the easy splice case.`)
        node.right = del(node.right, succ.val)
        heap("tree", serialize(node))
        return node
      },
      0,
    )
    const result = del(root, key)
    heap("tree", serialize(result))
    const out = serialize(result)
    narrate(`Tree after deleting ${key} (level-order): <b>[${out.join(", ")}]</b>.`)
    return JSON.stringify(out)
  },
}
