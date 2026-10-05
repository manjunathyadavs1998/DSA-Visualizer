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

export const houseRobberIII: SolutionDef = {
  code: `function rob(node) {
  if (!node) return [0, 0];           // [withMe, withoutMe]
  const L = rob(node.left);
  const R = rob(node.right);
  const withMe    = node.val + L[1] + R[1];          // rob me ⇒ skip kids
  const withoutMe = Math.max(L[0], L[1]) +
                    Math.max(R[0], R[1]);            // kids choose freely
  return [withMe, withoutMe];
}
// answer = max(rob(root))`,
  codeJava: `int[] rob(TreeNode node) {
  if (node == null) return new int[]{0, 0};
  int[] L = rob(node.left);
  int[] R = rob(node.right);
  int withMe    = node.val + L[1] + R[1];            // rob me ⇒ skip kids
  int withoutMe = Math.max(L[0], L[1]) +
                  Math.max(R[0], R[1]);              // kids choose freely
  return new int[]{withMe, withoutMe};
}
// answer = max of the pair at the root`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [3, 4, 5, 1, 3, -1, 1], maxLen: 15 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `rob(${t.length && t[0] !== -1 ? t[0] : "null"})`
  },
  run({ fn, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    narrate(
      "Houses sit on a TREE and the alarm fires if a parent and child are both robbed. Each node answers one question in two flavors: best loot <b>if I'm robbed</b> (children must be skipped) vs <b>if I'm skipped</b> (children pick their own best). Returning the PAIR is the trick — one post-order pass, no re-computation.",
    )
    const rob = fn(
      "rob",
      (node: TNode): [number, number] => {
        line(2, `rob(${node.val}): ${node.left ? `first ask my left child ${node.left.val} for its [withMe, withoutMe] pair.` : "no left child → its pair is [0, 0]."}`)
        const L: [number, number] = node.left ? rob(node.left) : [0, 0]
        vars({ L: `[${L.join(", ")}]` })
        line(3, `rob(${node.val}): left reports [${L.join(", ")}]. ${node.right ? `Now ask the right child ${node.right.val}.` : "No right child → [0, 0]."}`)
        const R: [number, number] = node.right ? rob(node.right) : [0, 0]
        const withMe = node.val + L[1] + R[1]
        vars({ L: `[${L.join(", ")}]`, R: `[${R.join(", ")}]`, withMe })
        line(4, `ROB <b>${node.val}</b>: my loot ${node.val} + children-skipped L[1]=${L[1]} + R[1]=${R[1]} = <b>${withMe}</b>. (Robbed kids would trip the alarm.)`)
        const withoutMe = Math.max(L[0], L[1]) + Math.max(R[0], R[1])
        vars({ withMe, withoutMe })
        line(5, `SKIP ${node.val}: each child is free — max(${L[0]}, ${L[1]}) + max(${R[0]}, ${R[1]}) = <b>${withoutMe}</b>.`)
        line(7, `rob(${node.val}) hands up the pair [withMe=${withMe}, withoutMe=${withoutMe}] — the parent decides which one it may use.`)
        return [withMe, withoutMe]
      },
      0,
    )
    if (!root) {
      narrate("No houses — loot 0.")
      return 0
    }
    const [a, b] = rob(root)
    narrate(`At the root nobody constrains us: answer = max(${a}, ${b}) = <b>${Math.max(a, b)}</b>.`)
    return Math.max(a, b)
  },
}
