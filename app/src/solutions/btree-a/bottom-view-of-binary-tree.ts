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

export const bottomViewOfBinaryTree: SolutionDef = {
  code: `// memo: hd → value; depthAt: hd → level of the stored value
function bottomView(node, hd, level) {
  if (memo[hd] === undefined || level >= depthAt[hd]) {
    memo[hd] = node.val;    // later & lower WINS — overwrite!
    depthAt[hd] = level;
  }
  if (node.left) bottomView(node.left, hd - 1, level + 1);
  if (node.right) bottomView(node.right, hd + 1, level + 1);
}`,
  codeJava: `// Map<Integer,Integer> memo, depthAt (hd → value / its level)
void bottomView(TreeNode node, int hd, int level) {
  if (!memo.containsKey(hd) || level >= depthAt.get(hd)) {
    memo.put(hd, node.val);   // later & lower WINS — overwrite!
    depthAt.put(hd, level);
  }
  if (node.left != null) bottomView(node.left, hd - 1, level + 1);
  if (node.right != null) bottomView(node.right, hd + 1, level + 1);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `bottomView(${t.length && t[0] !== -1 ? t[0] : "null"}, 0, 0)`
  },
  run({ fn, memo, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const depthAt: Record<string, number> = {}
    const go = fn(
      "bottomView",
      (node: TNode, hd: number, level: number): string => {
        vars({ hd, level })
        const key = String(hd)
        const existing = memo[key] as number | undefined
        if (existing === undefined) {
          line(2, `bottomView(${node.val}): column hd = ${hd} is <b>brand new</b> — ${node.val} is its first (and so far lowest) occupant.`)
        } else if (level >= depthAt[key]) {
          line(
            2,
            `bottomView(${node.val}): column hd = ${hd} already holds ${existing} from level ${depthAt[key]}, but I'm at level ${level} — <b>at least as low, so I overwrite</b>. Looking up from below, ${node.val} hides ${existing}.`,
          )
        } else {
          line(
            2,
            `bottomView(${node.val}): column hd = ${hd} holds ${existing} from level ${depthAt[key]}, which is <b>below</b> my level ${level} — I stay hidden, no write.`,
          )
        }
        if (existing === undefined || level >= depthAt[key]) {
          line(3, `memo[${hd}] ← <b>${node.val}</b> (level ${level}). Later, deeper writes are the whole point — the LAST value standing per column is what you see from the bottom.`)
          memo[key] = node.val
          depthAt[key] = level
          heap("depthAt", depthAt)
        }
        line(6, node.left ? `Left child ${node.left.val}: one column further left → hd ${hd - 1}.` : `No left child at ${node.val}.`)
        if (node.left) go(node.left, hd - 1, level + 1)
        line(7, node.right ? `Right child ${node.right.val}: one column further right → hd ${hd + 1}.` : `No right child at ${node.val}.`)
        if (node.right) go(node.right, hd + 1, level + 1)
        return "✓"
      },
      1,
    )
    narrate(
      "Give every node a <b>horizontal distance</b>: root 0, left child −1, right child +1. One map per column, and <b>later (deeper) writes overwrite earlier ones</b> — so after the traversal, each column holds the node you'd see looking UP from below the tree.",
    )
    if (!root) {
      narrate("Empty tree — nothing to see.")
      return "[]"
    }
    go(root, 0, 0)
    const hds = Object.keys(memo).map(Number).sort((a, b) => a - b)
    const view = hds.map((h) => memo[String(h)] as number)
    narrate(`Read the map in hd order ${hds.join(", ")} → bottom view = [${view.join(", ")}].`)
    return JSON.stringify(view)
  },
}
