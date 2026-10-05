import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
}

/** Level-order values → tree; -1 means null. */
function buildTree(vals: number[]): TNode | null {
  if (vals.length === 0 || vals[0] === -1) return null
  const root: TNode = { val: vals[0], left: null, right: null }
  const queue: TNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < vals.length) {
    const cur = queue.shift() as TNode
    const l = vals[i++]
    if (l !== undefined && l !== -1) {
      cur.left = { val: l, left: null, right: null }
      queue.push(cur.left)
    }
    const r = vals[i++]
    if (r !== undefined && r !== -1) {
      cur.right = { val: r, left: null, right: null }
      queue.push(cur.right)
    }
  }
  return root
}

/** Object whose String() is a custom label — keeps fn() call labels readable. */
interface Lbl {
  toString(): string
}
const lbl = (s: string): Lbl => ({ toString: () => s })

const tag = (n: TNode | null): string => (n ? String(n.val) : "∅")

export const symmetricTree: SolutionDef = {
  code: `// symmetric ⇔ the left subtree is a MIRROR of the right subtree
function mirror(l, r) {
  if (l === null && r === null) return true;
  if (l === null || r === null) return false;
  if (l.val !== r.val) return false;
  return mirror(l.left, r.right) && mirror(l.right, r.left);
}
// answer: root === null || mirror(root.left, root.right)`,
  codeJava: `// symmetric ⇔ the left subtree is a MIRROR of the right subtree
boolean mirror(TreeNode l, TreeNode r) {
  if (l == null && r == null) return true;
  if (l == null || r == null) return false;
  if (l.val != r.val) return false;
  return mirror(l.left, r.right) && mirror(l.right, r.left);
}
// answer: root == null || mirror(root.left, root.right)`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 2, 3, 4, 4, 3], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    const l = t[1] !== undefined && t[1] !== -1 ? t[1] : "∅"
    const r = t[2] !== undefined && t[2] !== -1 ? t[2] : "∅"
    return `mirror(${l}|${r})`
  },
  run({ fn, line, narrate }, args) {
    const root = buildTree(args.tree as number[])
    let argL: TNode | null = null
    let argR: TNode | null = null
    const mirrorFn = fn(
      "mirror",
      (_pair: Lbl): boolean => {
        const l = argL
        const r = argR
        if (l === null && r === null) {
          line(2, `mirror(∅|∅): both positions empty — <b>mirror images trivially</b> → true.`)
          return true
        }
        line(2, `mirror(${tag(l)}|${tag(r)}): both null? no.`)
        if (l === null || r === null) {
          line(3, `mirror(${tag(l)}|${tag(r)}): <b>one side has a node where the other has nothing</b> — not a mirror → false.`)
          return false
        }
        line(4, `mirror(${l.val}|${r.val}): values ${l.val} vs ${r.val} — ${l.val !== r.val ? "<b>different → false</b>" : "<b>equal</b>"}.`)
        if (l.val !== r.val) return false
        line(5, `mirror(${l.val}|${r.val}): check the <b>outside pair</b> (${tag(l.left)}|${tag(r.right)}) then the <b>inside pair</b> (${tag(l.right)}|${tag(r.left)}) — arms crossed!`)
        const outsideOk = mirror(l.left, r.right)
        if (!outsideOk) return false
        return mirror(l.right, r.left)
      },
      1,
    )
    const mirror = (l: TNode | null, r: TNode | null): boolean => {
      argL = l
      argR = r
      return mirrorFn(lbl(`${tag(l)}|${tag(r)}`))
    }
    if (!root) {
      narrate("An empty tree is symmetric by definition.")
      return true
    }
    narrate("Fold the tree down its center line: outside children must match outside (l.left vs r.right), inside must match inside (l.right vs r.left).")
    line(7, `Start at the root's two children: mirror(${tag(root.left)}|${tag(root.right)}).`)
    return mirror(root.left, root.right)
  },
}
