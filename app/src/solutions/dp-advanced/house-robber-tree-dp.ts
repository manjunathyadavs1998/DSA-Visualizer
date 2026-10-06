import type { SolutionDef } from "@/engine/types"

// Tree: 0 is root; children: 0→[1,2], 1→[3,4], 2→[5]
// Values: [1, 2, 3, 4, 5, 6]
// House Robber on Tree: can't rob parent and child both
const VALS = [1, 2, 3, 4, 5, 6]
const CHILDREN: number[][] = [[1, 2], [3, 4], [5], [], [], []]

export const houseRobberTree: SolutionDef = {
  view: "array",
  array: () => [...VALS],
  code: `// tree as adjacency list; vals[i] = house value at node i
function rob(root) {
  function dfs(node) {
    // returns [robNode, skipNode]
    if (!node) return [0, 0];
    const [lRob, lSkip] = dfs(node.left);
    const [rRob, rSkip] = dfs(node.right);
    const robNode  = node.val + lSkip + rSkip;
    const skipNode = Math.max(lRob, lSkip) + Math.max(rRob, rSkip);
    return [robNode, skipNode];
  }
  const [r, s] = dfs(root);
  return Math.max(r, s);
}`,
  codeJava: `int rob(TreeNode root) {
  int[] res = dfs(root);
  return Math.max(res[0], res[1]);
}
int[] dfs(TreeNode node) {
  if (node == null) return new int[]{0, 0};
  int[] left  = dfs(node.left);
  int[] right = dfs(node.right);
  int robNode  = node.val + left[1] + right[1];
  int skipNode = Math.max(left[0],left[1]) + Math.max(right[0],right[1]);
  return new int[]{robNode, skipNode};
}`,
  inputs: [],
  entry: () => `rob(tree with vals [1,2,3,4,5,6])`,
  run({ fn, line, mark, vars, heap, narrate }) {
    const robResult: number[] = new Array(VALS.length).fill(0)
    const skipResult: number[] = new Array(VALS.length).fill(0)
    const dfs = fn("dfs", (node: number): [number, number] => {
      mark("focus", [node])
      vars({ node, val: VALS[node] })
      line(3, `dfs(${node}): val=${VALS[node]}. Compute rob/skip for each child first.`)
      let lRob = 0, lSkip = 0, rRob = 0, rSkip = 0
      const ch = CHILDREN[node]
      if (ch.length > 0) { [lRob, lSkip] = dfs(ch[0]) }
      if (ch.length > 1) { [rRob, rSkip] = dfs(ch[1]) }
      const robNode  = VALS[node] + lSkip + rSkip
      const skipNode = Math.max(lRob, lSkip) + Math.max(rRob, rSkip)
      robResult[node] = robNode
      skipResult[node] = skipNode
      mark("good", [node])
      vars({ node, robNode, skipNode })
      heap("rob[]", [...robResult])
      heap("skip[]", [...skipResult])
      line(7, `Node ${node}: rob=${VALS[node]}+${lSkip}+${rSkip}=<b>${robNode}</b>, skip=max(${lRob},${lSkip})+max(${rRob},${rSkip})=<b>${skipNode}</b>.`)
      return [robNode, skipNode]
    }, 2)
    const go = fn("rob", (): number => {
      line(1, `Each node returns [robNode, skipNode]. If we rob a node, we must skip both children.`)
      const [r, s] = dfs(0)
      mark("focus", [])
      line(11, `Root: rob=${r}, skip=${s}. Answer: max(${r},${s}) = <b>${Math.max(r, s)}</b>.`)
      return Math.max(r, s)
    }, 0)
    narrate("DP on tree: each node returns a pair (rob, skip). Rob = val + skip(left) + skip(right). Skip = best(left) + best(right). No global array needed.")
    return go()
  },
}
