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

export const sumRootToLeafNumbers: SolutionDef = {
  code: `function sumNumbers(node, prefix) {
  if (!node) return 0;
  const num = prefix * 10 + node.val;  // append my digit on the right
  if (!node.left && !node.right)
    return num;                        // leaf: one complete number
  return sumNumbers(node.left,  num) +
         sumNumbers(node.right, num);
}`,
  codeJava: `int sumNumbers(TreeNode node, int prefix) {
  if (node == null) return 0;
  int num = prefix * 10 + node.val;    // append my digit on the right
  if (node.left == null && node.right == null)
    return num;                        // leaf: one complete number
  return sumNumbers(node.left,  num) +
         sumNumbers(node.right, num);
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [4, 9, 0, 5, 1], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `sumNumbers(${t.length && t[0] !== -1 ? t[0] : "null"}, 0)`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const raw = (args.tree as number[]).map((v) => (v === -1 ? -1 : Math.abs(Math.trunc(v)) % 10))
    const root = buildTree(raw)
    const numbers: number[] = []
    narrate(
      "Each root→leaf path spells a number, one digit per node. The classic trick: build it going DOWN with <b>prefix × 10 + digit</b> — no strings, no path array. Leaves return their finished number; internal nodes just add their two sides. (Inputs are clamped to single digits 0–9, as in the real problem.)",
    )
    const sumNumbers = fn(
      "sumNumbers",
      (node: TNode, prefix: number): number => {
        const num = prefix * 10 + node.val
        vars({ prefix, num })
        line(2, `At digit ${node.val}: shift the prefix left and append — ${prefix} × 10 + ${node.val} = <b>${num}</b>.`)
        if (!node.left && !node.right) {
          numbers.push(num)
          heap("output", numbers)
          line(4, `LEAF — the path spells the complete number <b>${num}</b>. Numbers finished so far: {${numbers.join(", ")}}.`)
          return num
        }
        line(5, `Keep spelling to the left${node.left ? ` → sumNumbers(${node.left.val}, ${num}).` : ": no left child → contributes 0."}`)
        const l = node.left ? sumNumbers(node.left, num) : 0
        line(6, `…and to the right${node.right ? ` → sumNumbers(${node.right.val}, ${num}).` : ": no right child → contributes 0."}`)
        const r = node.right ? sumNumbers(node.right, num) : 0
        vars({ num, l, r })
        line(5, `Node ${node.val} returns left ${l} + right ${r} = <b>${l + r}</b> — the sum of every finished number below me.`)
        return l + r
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — sum 0.")
      return 0
    }
    const ans = sumNumbers(root, 0)
    narrate(`All numbers: ${numbers.join(" + ")} = <b>${ans}</b>.`)
    return ans
  },
}
