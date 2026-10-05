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

export const constructFromInorderPostorder: SolutionDef = {
  code: `// postorder lists the root LAST — so consume it from the back
let idx = postorder.length - 1;
function build(il, ir) {
  if (il > ir) return null;
  const rootVal = postorder[idx]; idx--;
  const root = { val: rootVal, left: null, right: null };
  const splitIdx = inorder.indexOf(rootVal);
  root.right = build(splitIdx + 1, ir);   // right FIRST!
  root.left = build(il, splitIdx - 1);
  return root;
}`,
  codeJava: `// postorder lists the root LAST — so consume it from the back
int idx = postorder.length - 1;
TreeNode build(int il, int ir) {
  if (il > ir) return null;
  int rootVal = postorder[idx]; idx--;
  TreeNode root = new TreeNode(rootVal);
  int splitIdx = indexOf(inorder, rootVal);
  root.right = build(splitIdx + 1, ir);   // right FIRST!
  root.left = build(il, splitIdx - 1);
  return root;
}`,
  inputs: [
    { kind: "numbers", name: "inorder", label: "inorder", default: [9, 3, 15, 20, 7], maxLen: 8 },
    { kind: "numbers", name: "postorder", label: "postorder", default: [9, 15, 7, 20, 3], maxLen: 8 },
  ],
  entry: (a) => `build(0, ${(a.inorder as number[]).length - 1})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const inorder = args.inorder as number[]
    const postorder = args.postorder as number[]
    const built: number[] = []
    let idx = postorder.length - 1
    heap("inorder", inorder)
    heap("postorder", postorder)
    heap("built", built)
    const build: (il: number, ir: number) => TNode | null = fn(
      "build",
      (il: number, ir: number): TNode | null => {
        if (il > ir) {
          line(3, `build: inorder range ${il}..${ir} is empty — <b>no subtree here</b> → null.`)
          return null
        }
        const rootVal = postorder[idx]
        idx--
        vars({ idx, rootVal })
        line(4, `build: take postorder[${idx + 1}] = <b>${rootVal}</b> from the back — postorder always lists the root last.`)
        const splitIdx = inorder.indexOf(rootVal, il)
        if (splitIdx < il || splitIdx > ir) {
          narrate(`${rootVal} is missing from inorder[${il}..${ir}] — the two traversals are inconsistent; stopping this branch.`)
          idx++
          return null
        }
        const root: TNode = { val: rootVal, left: null, right: null }
        built.push(rootVal)
        heap("built", built)
        line(5, `build: create node <b>${rootVal}</b> (nodes so far, in construction order: ${built.join(", ")}).`)
        vars({ idx, rootVal, splitIdx })
        line(6, `build: in inorder, ${rootVal} sits at index ${splitIdx} → inorder[${il}..${splitIdx - 1}] is its left subtree, inorder[${splitIdx + 1}..${ir}] its right.`)
        line(7, `build: consume the <b>right</b> subtree first — walking postorder backwards, right-subtree roots come out before left ones.`)
        root.right = build(splitIdx + 1, ir)
        line(8, `build: now the left subtree ← inorder[${il}..${splitIdx - 1}].`)
        root.left = build(il, splitIdx - 1)
        line(9, `build: subtree rooted at ${rootVal} is complete — hand it up.`)
        return root
      },
      2,
    )
    narrate("Mirror of preorder+inorder: postorder read from the BACK yields root, then right subtree, then left — so recurse right before left.")
    const root = build(0, inorder.length - 1)
    return JSON.stringify(toLevelOrder(root))
  },
}
