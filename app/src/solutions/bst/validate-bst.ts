import type { SolutionDef } from "@/engine/types"

type BNode = { val: number; left: BNode | null; right: BNode | null; toString: () => string }

/** Parse a level-order array (-1 = null) into a binary tree, using a queue. */
function buildBst(level: number[]): BNode | null {
  if (level.length === 0 || level[0] === -1) return null
  const mk = (val: number): BNode => ({ val, left: null, right: null, toString: () => String(val) })
  const root = mk(level[0])
  const queue: BNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < level.length) {
    const cur = queue.shift() as BNode
    if (i < level.length && level[i] !== -1) {
      cur.left = mk(level[i])
      queue.push(cur.left)
    }
    i++
    if (i < level.length && level[i] !== -1) {
      cur.right = mk(level[i])
      queue.push(cur.right)
    }
    i++
  }
  return root
}

export const validateBst: SolutionDef = {
  code: `// null bound = unbounded (±∞)
function valid(node, lo, hi) {
  if (node === null) return true;
  if (lo !== null && node.val <= lo) return false;
  if (hi !== null && node.val >= hi) return false;
  return valid(node.left, lo, node.val)   // hi tightens to node.val
      && valid(node.right, node.val, hi); // lo tightens to node.val
}`,
  codeJava: `// null bound = unbounded (±∞)
boolean valid(TreeNode node, Integer lo, Integer hi) {
  if (node == null) return true;
  if (lo != null && node.val <= lo) return false;
  if (hi != null && node.val >= hi) return false;
  return valid(node.left, lo, node.val)   // hi tightens to node.val
      && valid(node.right, node.val, hi); // lo tightens to node.val
}`,
  inputs: [
    // 9 sits under 4 (locally fine: 9 > 4) but violates the ROOT's hi = 8.
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 9, 10, 14], maxLen: 15 },
  ],
  entry: (a) => `valid(${(a.numbers as number[])[0]}, null, null)`,
  run({ fn, line, vars, narrate }, args) {
    const root = buildBst(args.numbers as number[])
    const b = (x: number | null, inf: string) => (x === null ? inf : String(x))
    const valid = fn(
      "valid",
      (node: BNode, lo: number | null, hi: number | null): boolean => {
        const win = `(${b(lo, "-∞")}, ${b(hi, "∞")})`
        vars({ lo: b(lo, "-∞"), hi: b(hi, "∞") })
        line(3, `valid(${node.val}): must lie strictly inside ${win}. Is ${node.val} ≤ lo=${b(lo, "-∞")}? (${lo !== null && node.val <= lo ? "<b>yes — violation!</b>" : "no"})`)
        if (lo !== null && node.val <= lo) {
          narrate(`${node.val} may look fine next to its parent, but lo=${lo} was promised by an ANCESTOR — every node must satisfy ALL inherited bounds.`)
          return false
        }
        line(4, `Is ${node.val} ≥ hi=${b(hi, "∞")}? (${hi !== null && node.val >= hi ? "<b>yes — violation!</b>" : "no"})`)
        if (hi !== null && node.val >= hi) {
          narrate(`${node.val} may look fine next to its parent, but hi=${hi} was promised by an ANCESTOR — every node must satisfy ALL inherited bounds.`)
          return false
        }
        line(5, `${node.val} fits ${win}. Left subtree: hi tightens ${b(hi, "∞")} → ${node.val}.`)
        let okL = true
        if (node.left !== null) okL = valid(node.left, lo, node.val)
        else narrate(`Left child of ${node.val} is null — vacuously valid, no call needed.`)
        if (!okL) {
          narrate(`Left subtree of ${node.val} failed → <b>short-circuit:</b> the right subtree of ${node.val} is never even checked.`)
          return false
        }
        line(6, `Right subtree of ${node.val}: lo tightens ${b(lo, "-∞")} → ${node.val}.`)
        let okR = true
        if (node.right !== null) okR = valid(node.right, node.val, hi)
        else narrate(`Right child of ${node.val} is null — vacuously valid, no call needed.`)
        return okR
      },
      1,
    )
    narrate("Each call carries (lo, hi) — the promises made by every ancestor. Watch the window shrink on the way down; comparing only with the parent is the classic bug this catches.")
    if (root === null) return true
    return valid(root, null, null)
  },
}
