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

export const twoSumIvBst: SolutionDef = {
  code: `// k is editable below; seen = values already visited
function dfs(node) {
  if (node === null || found) return;
  if (seen[k - node.val]) {   // partner already visited?
    found = true;             // node.val + (k − node.val) = k
    return;
  }
  seen[node.val] = true;
  dfs(node.left);
  dfs(node.right);
}`,
  codeJava: `// int k; Set<Integer> seen = new HashSet<>();
void dfs(TreeNode node) {
  if (node == null || found) return;
  if (seen.contains(k - node.val)) { // partner already visited?
    found = true;             // node.val + (k − node.val) = k
    return;
  }
  seen.add(node.val);
  dfs(node.left);
  dfs(node.right);
}`,
  inputs: [
    { kind: "numbers", name: "numbers", label: "tree (level-order, -1 = null)", default: [8, 4, 12, 2, 6, 10, 14], maxLen: 15 },
    { kind: "number", name: "k", label: "k (target sum)", default: 14, min: -99, max: 99 },
  ],
  entry: (a) => `dfs(${(a.numbers as number[])[0]})`,
  run({ fn, memo, line, narrate }, args) {
    const k = args.k as number
    const root = buildBst(args.numbers as number[])
    let found: string | null = null
    const dfs = fn(
      "dfs",
      (node: BNode): string => {
        const want = k - node.val
        line(3, `dfs(${node.val}): the partner would be ${k} − ${node.val} = <b>${want}</b>. Already in the seen-set?`)
        if (memo[want] !== undefined) {
          found = `${want} + ${node.val} = ${k}`
          line(4, `<b>Cache hit!</b> ${want} was visited earlier in the walk → pair (${want}, ${node.val}) sums to ${k}. found = true.`)
          return "true"
        }
        line(7, `No ${want} seen yet — record <b>${node.val}</b> in the seen-set and keep walking.`)
        memo[node.val] = true
        if (found === null && node.left !== null) {
          line(8, `Left of ${node.val}.`)
          dfs(node.left)
        }
        if (found === null && node.right !== null) {
          line(9, `Right of ${node.val}.`)
          dfs(node.right)
        }
        return found !== null ? "true" : "no pair below"
      },
      1,
    )
    narrate("Classic two-sum, but the \"array\" is a tree walk: before visiting a value, ask the seen-set whether its partner (k − value) already appeared. The memo table below IS the seen-set — watch for its one cache hit.")
    if (root === null) return false
    dfs(root)
    narrate(found !== null ? `Pair found: ${found}. The rest of the tree is <b>never visited</b> — found short-circuits every remaining call.` : `Walked the whole tree — no two values sum to ${k}.`)
    return found !== null
  },
}
