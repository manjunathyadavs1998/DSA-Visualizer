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

export const floorAndCeilInBst: SolutionDef = {
  code: `// x is editable below; floor ≤ x ≤ ceil
function walk(node) {
  if (node === null) return;
  if (node.val === x) {
    floor = x; ceil = x;  // exact hit answers both
    return;
  }
  if (node.val < x) {
    floor = node.val;     // candidate floor; try bigger
    walk(node.right);
  } else {
    ceil = node.val;      // candidate ceil; try smaller
    walk(node.left);
  }
}`,
  codeJava: `// int x; Integer floor = null, ceil = null;
void walk(TreeNode node) {
  if (node == null) return;
  if (node.val == x) {
    floor = x; ceil = x;  // exact hit answers both
    return;
  }
  if (node.val < x) {
    floor = node.val;     // candidate floor; try bigger
    walk(node.right);
  } else {
    ceil = node.val;      // candidate ceil; try smaller
    walk(node.left);
  }
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "x", label: "x", default: 5, min: -99, max: 99 },
  ],
  entry: (a) => `walk(${(a.numbers as number[])[0]})`,
  run({ fn, line, vars, narrate }, args) {
    const x = args.x as number
    const root = buildBst(args.numbers as number[])
    let floor: number | null = null
    let ceil: number | null = null
    const walk = fn(
      "walk",
      (node: BNode): string => {
        line(3, `walk(${node.val}): is ${node.val} exactly x=${x}? (${node.val === x ? "<b>yes!</b>" : "no"})`)
        if (node.val === x) {
          floor = x
          ceil = x
          vars({ floor, ceil })
          line(4, `Exact hit: ${x} is its own floor AND ceil. Done — no children needed.`)
          return `floor=ceil=${x}`
        }
        line(7, `Is ${node.val} < x=${x}? (${node.val < x ? "yes" : "no"})`)
        if (node.val < x) {
          floor = node.val
          vars({ floor, ceil: ceil ?? "—" })
          line(8, `${node.val} < ${x} → <b>floor candidate = ${node.val}</b> (largest ≤ ${x} so far).`)
          narrate(`Everything LEFT of ${node.val} is even smaller — it can't improve the floor, so that subtree is <b>never called</b>.`)
          if (node.right === null) {
            line(2, `${node.val} has no right child — the walk ends.`)
            return `floor=${floor}`
          }
          line(9, `Go right into ${node.right.val}: maybe a bigger value still ≤ ${x}.`)
          return walk(node.right)
        }
        ceil = node.val
        vars({ floor: floor ?? "—", ceil })
        line(11, `${node.val} > ${x} → <b>ceil candidate = ${node.val}</b> (smallest ≥ ${x} so far).`)
        narrate(`Everything RIGHT of ${node.val} is even bigger — it can't improve the ceil, so that subtree is <b>never called</b>.`)
        if (node.left === null) {
          line(2, `${node.val} has no left child — the walk ends.`)
          return `ceil=${ceil}`
        }
        line(12, `Go left into ${node.left.val}: maybe a smaller value still ≥ ${x}.`)
        return walk(node.left)
      },
      1,
    )
    narrate(`One root-to-leaf walk answers BOTH queries: nodes < ${x} update the floor and send us right; nodes > ${x} update the ceil and send us left. The path pinches in on ${x} from both sides.`)
    if (root === null) return "empty tree"
    walk(root)
    return `floor=${floor ?? "null"}, ceil=${ceil ?? "null"}`
  },
}
