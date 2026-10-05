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

export const findModeInBinarySearchTree: SolutionDef = {
  code: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  count = node.val === prev ? count + 1 : 1;  // duplicates arrive
  if (count > best) {                         //   back-to-back!
    best = count; modes = [node.val];         // new champion
  } else if (count === best) {
    modes.push(node.val);                     // joins the champions
  }
  prev = node.val;
  inorder(node.right);
}`,
  codeJava: `void inorder(TreeNode node) {
  if (node == null) return;
  inorder(node.left);
  count = node.val == prev ? count + 1 : 1;   // duplicates arrive
  if (count > best) {                         //   back-to-back!
    best = count; modes = new ArrayList<>(List.of(node.val));
  } else if (count == best) {
    modes.add(node.val);                      // joins the champions
  }
  prev = node.val;
  inorder(node.right);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [4, 2, 6, 2, 3, 5, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `inorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let prev: number | null = null
    let count = 0
    let best = 0
    let modes: number[] = []
    const order: number[] = []
    narrate(
      "The mode = most frequent value. In a BST, duplicates aren't scattered — the inorder stream is sorted, so <b>equal values arrive back-to-back</b>. That means no hash map: just count the current RUN (`count`) and compare it to the best run so far. O(1) extra state instead of O(n).",
    )
    const inorder = fn(
      "inorder",
      (node: TNode): string => {
        line(2, `inorder(${node.val}): drain the left side${node.left ? ` → inorder(${node.left.val})` : " (empty)"}.`)
        if (node.left) inorder(node.left)
        order.push(node.val)
        heap("order", order)
        count = node.val === prev ? count + 1 : 1
        line(3, `Visit ${node.val}: ${node.val === prev ? `same as prev — the run grows to <b>${count}</b>.` : `new value — run resets to 1. (Stream so far: [${order.join(", ")}])`}`)
        if (count > best) {
          const oldBest = best
          best = count
          modes = [node.val]
          heap("modes", modes)
          line(5, `Run of ${count} beats the best so far (${oldBest}) → <b>${node.val}</b> is the new sole mode.`)
        } else if (count === best) {
          modes.push(node.val)
          heap("modes", modes)
          line(7, `Run of ${count} TIES the best → <b>${node.val}</b> joins the modes: {${modes.join(", ")}}.`)
        }
        prev = node.val
        vars({ prev, count, best, modes: `[${modes.join(", ")}]` })
        line(9, `inorder(${node.val}): now the right side${node.right ? ` → inorder(${node.right.val})` : " (empty)"}.`)
        if (node.right) inorder(node.right)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — no modes.")
      return "[]"
    }
    inorder(root)
    narrate(`Sorted stream [${order.join(", ")}] → longest run${modes.length > 1 ? "s" : ""} of length ${best}: mode${modes.length > 1 ? "s" : ""} = <b>[${modes.join(", ")}]</b>.`)
    return JSON.stringify(modes)
  },
}
