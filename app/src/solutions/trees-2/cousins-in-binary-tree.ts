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

export const cousinsInBinaryTree: SolutionDef = {
  code: `function find(node, target, depth, parent) {
  if (!node) return null;
  if (node.val === target)
    return [depth, parent];      // found: how deep + whose child
  const l = find(node.left,  target, depth + 1, node.val);
  return l !== null ? l :
         find(node.right, target, depth + 1, node.val);
}
// x,y cousins ⇔ same depth AND different parents`,
  codeJava: `int[] find(TreeNode node, int target, int depth, int parent) {
  if (node == null) return null;
  if (node.val == target)
    return new int[]{depth, parent}; // how deep + whose child
  int[] l = find(node.left,  target, depth + 1, node.val);
  return l != null ? l :
         find(node.right, target, depth + 1, node.val);
}
// x,y cousins ⇔ same depth AND different parents`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, 4, -1, -1, 5], maxLen: 15 },
    { kind: "number", name: "x", label: "x", default: 4, min: -99, max: 99 },
    { kind: "number", name: "y", label: "y", default: 5, min: -99, max: 99 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `isCousins(${t.length && t[0] !== -1 ? t[0] : "null"}, x=${a.x}, y=${a.y})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const x = args.x as number
    const y = args.y as number
    narrate(
      `Cousins = <b>same generation, different parents</b>. So each of ${x} and ${y} is fully described by two facts: its depth and its parent. Run one DFS per value to collect those facts, then compare — depths must be equal, parents must differ.`,
    )
    const find = fn(
      "find",
      (node: TNode, target: number, depth: number, parent: number): [number, number] | null => {
        vars({ target, depth, parent: parent === -1 ? "none" : parent })
        if (node.val === target) {
          line(3, `Found <b>${target}</b> at depth <b>${depth}</b>, child of <b>${parent === -1 ? "nobody (it's the root)" : parent}</b> — report [${depth}, ${parent}].`)
          return [depth, parent]
        }
        line(4, `${node.val} ≠ ${target} — search my left subtree${node.left ? ` (${node.left.val}), passing depth ${depth + 1} and parent=${node.val}.` : ": empty → null."}`)
        const l = node.left ? find(node.left, target, depth + 1, node.val) : null
        if (l !== null) {
          line(5, `Left subtree of ${node.val} already found ${target} — pass the answer straight up.`)
          return l
        }
        line(6, `Not on the left — search the right subtree${node.right ? ` (${node.right.val}).` : `: empty → null. ${target} is not under ${node.val}.`}`)
        return node.right ? find(node.right, target, depth + 1, node.val) : null
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — nothing to compare: false.")
      return false
    }
    const fx = find(root, x, 0, -1)
    narrate(fx ? `<b>${x}</b> → depth ${fx[0]}, parent ${fx[1] === -1 ? "none" : fx[1]}. Now locate ${y}.` : `${x} is not in the tree → false.`)
    if (!fx) return false
    const fy = find(root, y, 0, -1)
    if (!fy) {
      narrate(`${y} is not in the tree → false.`)
      return false
    }
    const ans = fx[0] === fy[0] && fx[1] !== fy[1]
    narrate(
      `Compare: depth ${fx[0]} vs ${fy[0]} (${fx[0] === fy[0] ? "same ✓" : "different ✗"}), parent ${fx[1]} vs ${fy[1]} (${fx[1] !== fy[1] ? "different ✓" : "same ✗ — they're siblings, not cousins"}). Cousins: <b>${ans}</b>.`,
    )
    return ans
  },
}
