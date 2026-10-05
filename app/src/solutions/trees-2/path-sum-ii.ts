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

export const pathSumII: SolutionDef = {
  code: `function dfs(node, rest, path) {
  if (!node) return;
  path.push(node.val);                 // choose: step onto this node
  rest -= node.val;
  if (!node.left && !node.right && rest === 0)
    output.push([...path]);            // leaf + exact budget → snapshot!
  dfs(node.left,  rest, path);
  dfs(node.right, rest, path);
  path.pop();                          // un-choose: backtrack
}`,
  codeJava: `void dfs(TreeNode node, int rest, List<Integer> path) {
  if (node == null) return;
  path.add(node.val);                  // choose: step onto this node
  rest -= node.val;
  if (node.left == null && node.right == null && rest == 0)
    output.add(new ArrayList<>(path)); // leaf + exact budget → snapshot!
  dfs(node.left,  rest, path);
  dfs(node.right, rest, path);
  path.remove(path.size() - 1);        // un-choose: backtrack
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [5, 4, 8, 11, -1, 13, 4, 7, 2, -1, -1, 5, 1], maxLen: 15 },
    { kind: "number", name: "target", label: "target sum", default: 22, min: -40, max: 60 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `dfs(${t.length && t[0] !== -1 ? t[0] : "null"}, ${a.target}, [])`
  },
  run({ fn, heap, line, vars, narrate }, args) {
    const root = buildTree(args.tree as number[])
    const target = args.target as number
    const path: number[] = []
    const output: number[][] = []
    narrate(
      "Path Sum asked IF a path exists; here we must collect <b>every</b> one — so this is backtracking on a tree. One shared `path` is pushed on the way down and popped on the way back up; whenever a leaf lands on budget 0 we photograph (`[...path]`) the current path. The pop is what lets one array describe every root-to-leaf route.",
    )
    const dfs = fn(
      "dfs",
      (node: TNode, restIn: number): string => {
        path.push(node.val)
        const rest = restIn - node.val
        heap("path", path)
        vars({ rest, path: `[${path.join("→")}]` })
        line(2, `Step onto <b>${node.val}</b>: path = [${path.join(" → ")}], budget ${restIn} − ${node.val} = <b>${rest}</b>.`)
        if (!node.left && !node.right && rest === 0) {
          output.push([...path])
          heap("output", output.map((p) => p.join("→")))
          line(5, `LEAF with rest = 0 — snapshot the path <b>[${path.join(", ")}]</b> into the answers. (Copy it! The live path is about to be unwound.)`)
        } else if (!node.left && !node.right) {
          line(4, `LEAF but rest = ${rest} ≠ 0 — this route ${rest > 0 ? "falls short" : "overshoots"}; nothing recorded.`)
        }
        if (node.left) {
          line(6, `Explore left of ${node.val} → dfs(${node.left.val}, ${rest}).`)
          dfs(node.left, rest)
        }
        if (node.right) {
          line(7, `Explore right of ${node.val} → dfs(${node.right.val}, ${rest}).`)
          dfs(node.right, rest)
        }
        path.pop()
        heap("path", path)
        line(8, `Done with ${node.val}'s subtree — <b>pop it</b>: path = [${path.join(" → ")}]. The path is clean for the next branch.`)
        return "✓"
      },
      0,
    )
    if (!root) {
      narrate("Empty tree — no paths.")
      return "[]"
    }
    heap("output", [])
    dfs(root, target)
    narrate(`All root-to-leaf paths summing to ${target}: <b>${JSON.stringify(output)}</b>.`)
    return JSON.stringify(output)
  },
}
