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

export const recoverBinarySearchTree: SolutionDef = {
  code: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  if (prev && prev.val > node.val) {  // inversion in the sorted stream!
    if (!first) first = prev;         // 1st inversion: big one = prev
    second = node;                    // keep latest small one
  }
  prev = node;
  inorder(node.right);
}
// afterwards: swap first.val ↔ second.val`,
  codeJava: `void inorder(TreeNode node) {
  if (node == null) return;
  inorder(node.left);
  if (prev != null && prev.val > node.val) { // inversion in the stream!
    if (first == null) first = prev;  // 1st inversion: big one = prev
    second = node;                    // keep latest small one
  }
  prev = node;
  inorder(node.right);
}
// afterwards: swap first.val ↔ second.val`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [8, 10, 3, 1, 6, -1, 14, -1, -1, 4, 7], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `inorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let prev: TNode | null = null
    let first: TNode | null = null
    let second: TNode | null = null
    const order: number[] = []
    narrate(
      "Exactly two nodes of a BST had their values swapped. Key insight: the inorder stream of a healthy BST is sorted, so the damage shows up as <b>descents</b> (prev > current). Two descents → the culprits are the FIRST big one and the LAST small one; one descent → they were adjacent neighbors. Find them in one pass, swap the values back.",
    )
    const inorder = fn(
      "inorder",
      (node: TNode): string => {
        line(2, `inorder(${node.val}): drain my left side first${node.left ? ` → inorder(${node.left.val})` : " (empty)"}.`)
        if (node.left) inorder(node.left)
        order.push(node.val)
        heap("order", order)
        if (prev && prev.val > node.val) {
          if (!first) {
            first = prev
            line(4, `Stream so far: [${order.join(", ")}] — <b>DESCENT!</b> prev ${prev.val} > ${node.val}. First inversion → the misplaced BIG value is <b>first = ${prev.val}</b>…`)
          } else {
            line(4, `Stream: [${order.join(", ")}] — <b>second descent</b>: ${prev.val} > ${node.val}. The misplaced SMALL value updates to this one.`)
          }
          second = node
          line(5, `…and the misplaced SMALL candidate is <b>second = ${node.val}</b>.`)
        } else {
          line(3, `Visit ${node.val}: stream [${order.join(", ")}] still ascending here (prev = ${prev ? prev.val : "none"}) — no inversion.`)
        }
        prev = node
        vars({ prev: node.val, first: first ? first.val : "—", second: second ? second.val : "—" })
        line(8, `inorder(${node.val}): now my right side${node.right ? ` → inorder(${node.right.val})` : " (empty)"}.`)
        if (node.right) inorder(node.right)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — nothing to recover.")
      return "[]"
    }
    heap("tree", serialize(root))
    inorder(root)
    if (first && second) {
      const f = first as TNode
      const s = second as TNode
      narrate(`Culprits found: <b>${f.val}</b> and <b>${s.val}</b>. Swap their values — the structure never moves, only the two numbers travel.`)
      const tmp = f.val
      f.val = s.val
      s.val = tmp
      heap("tree", serialize(root))
    } else {
      narrate("No inversion found — this BST was already healthy.")
    }
    const out = serialize(root)
    narrate(`Recovered tree (level-order): <b>[${out.join(", ")}]</b>.`)
    return JSON.stringify(out)
  },
}
