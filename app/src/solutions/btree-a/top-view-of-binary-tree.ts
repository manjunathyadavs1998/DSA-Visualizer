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

export const topViewOfBinaryTree: SolutionDef = {
  code: `// memo: hd → value; levelAt: hd → level of the claim
function topView(node, hd, level) {
  if (memo[hd] === undefined || level < levelAt[hd]) {
    memo[hd] = node.val;    // FIRST (topmost) claim per column
    levelAt[hd] = level;
  }
  if (node.left) topView(node.left, hd - 1, level + 1);
  if (node.right) topView(node.right, hd + 1, level + 1);
}`,
  codeJava: `// Map<Integer,Integer> memo, levelAt (hd → value / its level)
void topView(TreeNode node, int hd, int level) {
  if (!memo.containsKey(hd) || level < levelAt.get(hd)) {
    memo.put(hd, node.val);   // FIRST (topmost) claim per column
    levelAt.put(hd, level);
  }
  if (node.left != null) topView(node.left, hd - 1, level + 1);
  if (node.right != null) topView(node.right, hd + 1, level + 1);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, 5, -1, 6], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `topView(${t.length && t[0] !== -1 ? t[0] : "null"}, 0, 0)`
  },
  run({ fn, memo, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const levelAt: Record<string, number> = {}
    const go = fn(
      "topView",
      (node: TNode, hd: number, level: number): string => {
        vars({ hd, level })
        const key = String(hd)
        const existing = memo[key] as number | undefined
        if (existing === undefined) {
          line(2, `topView(${node.val}): column hd = ${hd} is <b>unclaimed</b> — as the first node here, I'm visible from above.`)
        } else if (level < levelAt[key]) {
          line(
            2,
            `topView(${node.val}): column hd = ${hd} was claimed by ${existing} at level ${levelAt[key]}, but I'm <b>higher</b> (level ${level}) — the topmost node wins.`,
          )
        } else {
          line(
            2,
            `topView(${node.val}): memo hit — column hd = ${hd} is <b>already covered from above</b> by ${existing} (level ${levelAt[key]} ≤ my level ${level}). No write; I stay in its shadow.`,
          )
        }
        if (existing === undefined || level < levelAt[key]) {
          line(3, `memo[${hd}] ← <b>${node.val}</b> (level ${level}) — this column's first/topmost claim. Unlike the bottom view, later deeper nodes will NOT replace it.`)
          memo[key] = node.val
          levelAt[key] = level
          heap("levelAt", levelAt)
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
      "Same horizontal-distance columns as the bottom view, opposite rule: <b>only the FIRST (topmost) write per column counts</b> — a memo hit means that column is already covered from above. The level check guards the rare case where a deep node from one branch reaches a column before a shallower node from another.",
    )
    if (!root) {
      narrate("Empty tree — nothing to see.")
      return "[]"
    }
    go(root, 0, 0)
    const hds = Object.keys(memo).map(Number).sort((a, b) => a - b)
    const view = hds.map((h) => memo[String(h)] as number)
    narrate(`Read the map in hd order ${hds.join(", ")} → top view = [${view.join(", ")}].`)
    return JSON.stringify(view)
  },
}
