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

export const sameTree: SolutionDef = {
  code: `// walk both trees in lockstep, comparing pair by pair
function same(p, q) {
  if (p === null && q === null) return true;
  if (p === null || q === null) return false;
  if (p.val !== q.val) return false;
  return same(p.left, q.left) && same(p.right, q.right);
}`,
  codeJava: `// walk both trees in lockstep, comparing pair by pair
boolean same(TreeNode p, TreeNode q) {
  if (p == null && q == null) return true;
  if (p == null || q == null) return false;
  if (p.val != q.val) return false;
  return same(p.left, q.left) && same(p.right, q.right);
}`,
  inputs: [
    { kind: "numbers", name: "treeP", label: "tree p (level-order, -1 = null)", default: [1, 2, 3, 4, -1, -1, 5], maxLen: 9 },
    { kind: "numbers", name: "treeQ", label: "tree q (level-order, -1 = null)", default: [1, 2, 3, 4, -1, -1, 5], maxLen: 9 },
  ],
  entry: (a) => `same(${(a.treeP as number[])[0] === -1 ? "∅" : ((a.treeP as number[])[0] ?? "∅")}|${(a.treeQ as number[])[0] === -1 ? "∅" : ((a.treeQ as number[])[0] ?? "∅")})`,
  run({ fn, line, narrate }, args) {
    const rootP = buildTree(args.treeP as number[])
    const rootQ = buildTree(args.treeQ as number[])
    let argP: TNode | null = null
    let argQ: TNode | null = null
    const sameFn = fn(
      "same",
      (_pair: Lbl): boolean => {
        const p = argP
        const q = argQ
        if (p === null && q === null) {
          line(2, `same(∅|∅): both slots are empty — <b>structure matches here</b> → true.`)
          return true
        }
        line(2, `same(${tag(p)}|${tag(q)}): both null? no — at least one slot has a node.`)
        if (p === null || q === null) {
          line(3, `same(${tag(p)}|${tag(q)}): <b>structure differs</b> — one tree has a node where the other has nothing → false.`)
          return false
        }
        line(4, `same(${p.val}|${q.val}): values ${p.val} vs ${q.val} — ${p.val !== q.val ? "<b>different → false</b>" : "<b>equal</b>, so this pair matches"}.`)
        if (p.val !== q.val) return false
        line(5, `same(${p.val}|${q.val}): pair OK — now the left children must match AND the right children must match.`)
        const leftOk = same(p.left, q.left)
        if (!leftOk) return false
        return same(p.right, q.right)
      },
      1,
    )
    const same = (p: TNode | null, q: TNode | null): boolean => {
      argP = p
      argQ = q
      return sameFn(lbl(`${tag(p)}|${tag(q)}`))
    }
    narrate("Two trees are the same iff every pair of corresponding positions agrees — same shape (nulls in the same places) AND same values.")
    const ans = same(rootP, rootQ)
    return ans
  },
}
