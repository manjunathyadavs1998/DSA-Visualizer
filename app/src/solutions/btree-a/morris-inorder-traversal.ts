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

export const morrisInorderTraversal: SolutionDef = {
  code: `function morrisInorder(root) {
  let cur = root;
  while (cur) {
    if (!cur.left) {
      output.push(cur.val);
      cur = cur.right;
    } else {
      let pred = cur.left;
      while (pred.right && pred.right !== cur) pred = pred.right;
      if (!pred.right) {
        pred.right = cur;    // THREAD: remember the way back
        cur = cur.left;
      } else {
        pred.right = null;   // thread used up — remove it
        output.push(cur.val);
        cur = cur.right;
      }
    }
  }
}`,
  codeJava: `void morrisInorder(TreeNode root) {
  TreeNode cur = root;
  while (cur != null) {
    if (cur.left == null) {
      output.add(cur.val);
      cur = cur.right;
    } else {
      TreeNode pred = cur.left;
      while (pred.right != null && pred.right != cur) pred = pred.right;
      if (pred.right == null) {
        pred.right = cur;    // THREAD: remember the way back
        cur = cur.left;
      } else {
        pred.right = null;   // thread used up — remove it
        output.add(cur.val);
        cur = cur.right;
      }
    }
  }
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `morrisInorder(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const output: number[] = []
    heap("output", output)
    narrate(
      "Morris traversal = inorder with <b>no recursion and no stack — O(1) extra space</b>. The trick: before diving left, wire the left subtree's rightmost node (the inorder predecessor) back to me. That temporary right-link is the breadcrumb that replaces the call stack.",
    )
    const morris = fn(
      "morrisInorder",
      (r: TNode | null): string => {
        let cur = r
        line(1, `Start at the root: cur = ${cur ?? "null"}. One flat loop — watch the vars, not a call stack.`)
        vars({ cur: cur ?? "null", pred: "—" })
        while (cur) {
          if (!cur.left) {
            line(3, `cur = <b>${cur.val}</b> has no left subtree — nothing comes before it, so visit it right now.`)
            line(4, `Output gets ${cur.val}.`)
            output.push(cur.val)
            heap("output", output)
            line(
              5,
              `Move right${cur.right ? ` to <b>${cur.right.val}</b> — this may be a real child, or a thread carrying us back up to an ancestor` : " — null, nothing further"}.`,
            )
            cur = cur.right
            vars({ cur: cur ?? "null", pred: "—" })
          } else {
            line(7, `cur = <b>${cur.val}</b> has a left subtree — find its inorder predecessor: the rightmost node under ${cur.left.val}.`)
            let pred = cur.left as TNode
            while (pred.right && pred.right !== cur) pred = pred.right
            vars({ cur, pred })
            line(9, `Walked right: predecessor of ${cur.val} is <b>${pred.val}</b>. Is its right pointer free, or already threaded back to me?`)
            if (!pred.right) {
              line(
                10,
                `Free → <b>create the thread</b>: ${pred.val}.right = ${cur.val}. When the left subtree finishes, walking right from ${pred.val} will land back on ${cur.val} — no stack needed.`,
              )
              pred.right = cur
              line(11, `Now safely descend left to ${(cur.left as TNode).val}.`)
              cur = cur.left
              vars({ cur: cur ?? "null", pred: "—" })
            } else {
              line(
                13,
                `${pred.val}.right already points at ${cur.val} — that means the left subtree is <b>finished</b> and the thread brought us back. <b>Remove it</b> to restore the tree.`,
              )
              pred.right = null
              line(14, `Second arrival at <b>${cur.val}</b>: its left side is done, so visit it now.`)
              output.push(cur.val)
              heap("output", output)
              cur = cur.right
              vars({ cur: cur ?? "null", pred: "—" })
            }
          }
        }
        line(2, `cur = null — the loop ends. Each node was touched at most twice, every thread was removed: O(n) time, <b>O(1) space</b>, tree unchanged.`)
        return "done"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — nothing to visit.")
      return "[]"
    }
    morris(root)
    return JSON.stringify(output)
  },
}
