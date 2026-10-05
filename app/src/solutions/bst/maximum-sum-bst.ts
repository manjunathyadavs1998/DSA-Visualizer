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

type Info = [number, number, number] // [min, max, sum]

const fmtI = (x: number): string => (x === Infinity ? "∞" : x === -Infinity ? "-∞" : String(x))

export const maximumSumBst: SolutionDef = {
  code: `// returns [min, max, sum], or null if not a BST
function post(node) {
  if (node === null) return [Infinity, -Infinity, 0];
  const L = post(node.left);
  const R = post(node.right);
  if (L === null || R === null) return null; // poison bubbles up
  if (node.val <= L[1] || node.val >= R[0]) return null;
  const sum = L[2] + node.val + R[2];
  best = Math.max(best, sum);                // a valid BST here!
  return [Math.min(L[0], node.val), Math.max(node.val, R[1]), sum];
}`,
  codeJava: `// int INF = 1_000_000; int best = 0;
int[] post(TreeNode node) {
  if (node == null) return new int[]{INF, -INF, 0};
  int[] L = post(node.left);
  int[] R = post(node.right);
  if (L == null || R == null) return null;   // poison bubbles up
  if (node.val <= L[1] || node.val >= R[0]) return null;
  int sum = L[2] + node.val + R[2];
  best = Math.max(best, sum);                // a valid BST here!
  return new int[]{Math.min(L[0], node.val), Math.max(node.val, R[1]), sum};
}`,
  inputs: [
    // The ROOT is not a BST (1 < its left child 4), but the subtree rooted at 3 is — sum 20.
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [1, 4, 3, 2, 4, 2, 5, -1, -1, -1, -1, -1, -1, 4, 6], maxLen: 15 },
  ],
  entry: (a) => `post(${(a.numbers as number[])[0]})`,
  run({ fn, line, vars, narrate }, args) {
    const root = buildBst(args.numbers as number[])
    let best = 0
    const SENTINEL: Info = [Infinity, -Infinity, 0]
    const post = fn(
      "post",
      (node: BNode): Info | null => {
        let L: Info | null
        if (node.left !== null) {
          line(3, `post(${node.val}): resolve the LEFT subtree first (postorder).`)
          L = post(node.left)
        } else {
          line(2, `post(${node.val}): left child is null → sentinel [∞, -∞, 0], no call needed.`)
          L = SENTINEL
        }
        let R: Info | null
        if (node.right !== null) {
          line(4, `post(${node.val}): now the RIGHT subtree.`)
          R = post(node.right)
        } else {
          line(2, `post(${node.val}): right child is null → sentinel [∞, -∞, 0], no call needed.`)
          R = SENTINEL
        }
        if (L === null || R === null) {
          line(5, `A child of ${node.val} already failed — the poison bubbles up: no tree CONTAINING ${node.val} can be a BST. But best=${best} is safe.`)
          return null
        }
        line(6, `BST check at ${node.val}: ${node.val} ≤ max(left)=${fmtI(L[1])}? (${node.val <= L[1] ? "<b>yes — violation</b>" : "no"}); ${node.val} ≥ min(right)=${fmtI(R[0])}? (${node.val >= R[0] ? "<b>yes — violation</b>" : "no"})`)
        if (node.val <= L[1] || node.val >= R[0]) {
          narrate(`The subtree rooted at ${node.val} is NOT a BST — but its valid descendants already scored. Return null upward.`)
          return null
        }
        const sum = L[2] + node.val + R[2]
        line(7, `Valid BST rooted at ${node.val}! sum = ${L[2]} + ${node.val} + ${R[2]} = <b>${sum}</b>.`)
        if (sum > best) best = sum
        vars({ best })
        line(8, `best = max(best, ${sum}) = <b>${best}</b>.`)
        return [Math.min(L[0], node.val), Math.max(node.val, R[1]), sum]
      },
      1,
    )
    narrate("Postorder: every subtree reports [min, max, sum] to its parent — or null (\"not a BST\"), which poisons every ancestor. Watch a deep subtree score while the root itself fails.")
    if (root === null) return 0
    post(root)
    narrate(`Maximum sum among valid-BST subtrees = <b>${best}</b>.`)
    return best
  },
}
