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

export const insertIntoABst: SolutionDef = {
  code: `function insert(node, val) {
  if (!node) return newNode(val);   // fell off the tree → plant it HERE
  if (val < node.val)
    node.left  = insert(node.left,  val);   // too small → go left
  else
    node.right = insert(node.right, val);   // too big → go right
  return node;    // everything above the new leaf is untouched
}`,
  codeJava: `TreeNode insert(TreeNode node, int val) {
  if (node == null) return new TreeNode(val); // fell off → plant HERE
  if (val < node.val)
    node.left  = insert(node.left,  val);     // too small → go left
  else
    node.right = insert(node.right, val);     // too big → go right
  return node;    // everything above the new leaf is untouched
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 3, 10, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
    { kind: "number", name: "val", label: "value to insert", default: 5, min: 0, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `insert(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.val})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const val = args.val as number
    narrate(
      `Inserting into a BST is just a FAILED SEARCH for ${val}: compare, go left or right, repeat — and the exact spot where you fall off the tree is where the new node belongs. A new leaf, zero rebalancing, nothing above it changes. The <code>node.left = insert(...)</code> re-assignment is how the new leaf gets stitched back in.`,
    )
    const insert = fn(
      "insert",
      (node: TNode | null, v: number): TNode => {
        if (!node) {
          line(1, `Fell off the tree — this empty spot is EXACTLY where a search for ${v} would end. Plant the new node <b>${v}</b> here.`)
          return mk(v)
        }
        vars({ at: node.val, val: v })
        if (v < node.val) {
          line(3, `${v} < ${node.val} → ${v} belongs in the LEFT subtree. Recurse: insert(${node.left ?? "null"}, ${v}); the result re-attaches as ${node.val}.left.`)
          node.left = insert(node.left, v)
        } else {
          line(5, `${v} ≥ ${node.val} → ${v} belongs in the RIGHT subtree. Recurse: insert(${node.right ?? "null"}, ${v}); the result re-attaches as ${node.val}.right.`)
          node.right = insert(node.right, v)
        }
        heap("tree", serialize(node))
        line(6, `Return <b>${node.val}</b> unchanged — only the pointer on the path to the new leaf was rewritten.`)
        return node
      },
      0,
    )
    const result = insert(root, val)
    heap("tree", serialize(result))
    const out = serialize(result)
    narrate(`Tree after inserting ${val} (level-order): <b>[${out.join(", ")}]</b>. Cost = one root-to-leaf walk: O(h).`)
    return JSON.stringify(out)
  },
}
