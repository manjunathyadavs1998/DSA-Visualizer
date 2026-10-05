import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
}

/** Tree → level-order values with -1 for null (trailing nulls trimmed). */
function toLevelOrder(root: TNode | null): number[] {
  if (!root) return []
  const out: number[] = []
  const queue: (TNode | null)[] = [root]
  while (queue.length > 0) {
    const n = queue.shift() ?? null
    if (n === null) {
      out.push(-1)
      continue
    }
    out.push(n.val)
    queue.push(n.left)
    queue.push(n.right)
  }
  while (out.length > 0 && out[out.length - 1] === -1) out.pop()
  return out
}

export const constructFromPreorderInorder: SolutionDef = {
  code: `// preorder[pl..pr] and inorder[il..ir] describe the same subtree
function build(pl, pr, il, ir) {
  if (pl > pr) return null;
  const rootVal = preorder[pl];
  const root = { val: rootVal, left: null, right: null };
  const splitIdx = inorder.indexOf(rootVal);
  const leftSize = splitIdx - il;
  root.left = build(pl + 1, pl + leftSize, il, splitIdx - 1);
  root.right = build(pl + leftSize + 1, pr, splitIdx + 1, ir);
  return root;
}`,
  codeJava: `// preorder[pl..pr] and inorder[il..ir] describe the same subtree
TreeNode build(int pl, int pr, int il, int ir) {
  if (pl > pr) return null;
  int rootVal = preorder[pl];
  TreeNode root = new TreeNode(rootVal);
  int splitIdx = indexOf(inorder, rootVal);
  int leftSize = splitIdx - il;
  root.left = build(pl + 1, pl + leftSize, il, splitIdx - 1);
  root.right = build(pl + leftSize + 1, pr, splitIdx + 1, ir);
  return root;
}`,
  inputs: [
    { kind: "numbers", name: "preorder", label: "preorder", default: [3, 9, 20, 15, 7], maxLen: 8 },
    { kind: "numbers", name: "inorder", label: "inorder", default: [9, 3, 15, 20, 7], maxLen: 8 },
  ],
  entry: (a) => `build(0, ${(a.preorder as number[]).length - 1}, 0, ${(a.inorder as number[]).length - 1})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const preorder = args.preorder as number[]
    const inorder = args.inorder as number[]
    const built: number[] = []
    heap("preorder", preorder)
    heap("inorder", inorder)
    heap("built", built)
    const build: (pl: number, pr: number, il: number, ir: number) => TNode | null = fn(
      "build",
      (pl: number, pr: number, il: number, ir: number): TNode | null => {
        if (pl > pr) {
          line(2, `build: preorder range ${pl}..${pr} is empty — <b>no subtree here</b> → null.`)
          return null
        }
        const rootVal = preorder[pl]
        line(3, `build: preorder[${pl}..${pr}] starts with <b>${rootVal}</b> — preorder always lists the root first.`)
        const splitIdx = inorder.indexOf(rootVal, il)
        if (splitIdx < il || splitIdx > ir) {
          narrate(`${rootVal} is missing from inorder[${il}..${ir}] — the two traversals are inconsistent; stopping this branch.`)
          return null
        }
        const root: TNode = { val: rootVal, left: null, right: null }
        built.push(rootVal)
        heap("built", built)
        line(4, `build: create node <b>${rootVal}</b> (nodes so far, in construction order: ${built.join(", ")}).`)
        const leftSize = splitIdx - il
        vars({ rootVal, splitIdx, leftSize })
        line(5, `build: in inorder, ${rootVal} sits at index ${splitIdx} → <b>${leftSize} value(s) left of it form the left subtree</b>, ${ir - splitIdx} form the right.`)
        line(7, `build: left subtree ← preorder[${pl + 1}..${pl + leftSize}], inorder[${il}..${splitIdx - 1}].`)
        root.left = build(pl + 1, pl + leftSize, il, splitIdx - 1)
        line(8, `build: right subtree ← preorder[${pl + leftSize + 1}..${pr}], inorder[${splitIdx + 1}..${ir}].`)
        root.right = build(pl + leftSize + 1, pr, splitIdx + 1, ir)
        line(9, `build: subtree rooted at ${rootVal} is complete — hand it up.`)
        return root
      },
      1,
    )
    narrate("Preorder tells you WHO the root is; inorder tells you WHERE it splits left from right. Recurse on the two halves.")
    const root = build(0, preorder.length - 1, 0, inorder.length - 1)
    return JSON.stringify(toLevelOrder(root))
  },
}
