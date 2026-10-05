import type { SolutionDef } from "@/engine/types"

type TNode = { val: number; left: TNode | null; right: TNode | null; toString: () => string }

const mk = (val: number): TNode => ({ val, left: null, right: null, toString: () => String(val) })

/** Level-order snapshot with "·" for holes (trailing holes trimmed). */
function serialize(root: TNode | null): (number | string)[] {
  if (!root) return []
  const out: (number | string)[] = []
  const q: (TNode | null)[] = [root]
  while (q.length) {
    const n = q.shift() ?? null
    if (!n) {
      out.push("·")
      continue
    }
    out.push(n.val)
    q.push(n.left, n.right)
  }
  while (out.length && out[out.length - 1] === "·") out.pop()
  return out
}

const sanitize = (xs: number[]): number[] => [...new Set(xs.map(Math.trunc))].sort((a, b) => a - b)

export const convertSortedArrayToBst: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `function build(lo, hi) {
  if (lo > hi) return null;        // empty slice → no node
  const mid = (lo + hi) >> 1;      // middle element = balanced root
  const node = newNode(nums[mid]);
  node.left  = build(lo, mid - 1); // left half  → left subtree
  node.right = build(mid + 1, hi); // right half → right subtree
  return node;
}
// build(0, nums.length - 1)`,
  codeJava: `TreeNode build(int lo, int hi) {
  if (lo > hi) return null;        // empty slice → no node
  int mid = (lo + hi) >>> 1;       // middle element = balanced root
  TreeNode node = new TreeNode(nums[mid]);
  node.left  = build(lo, mid - 1); // left half  → left subtree
  node.right = build(mid + 1, hi); // right half → right subtree
  return node;
}
// build(0, nums.length - 1)`,
  inputs: [
    { kind: "numbers", name: "nums", label: "sorted array (ascending)", default: [-10, -3, 0, 5, 9, 12, 15], maxLen: 12 },
  ],
  entry: (a) => `build(0, ${sanitize(a.nums as number[]).length - 1})`,
  run({ fn, heap, line, vars, ptr, mark, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    narrate(
      "A sorted array is already a BST read in inorder — we just have to pick the shape. For HEIGHT BALANCE, always root the subtree at the <b>middle</b> element: half the values fall left, half right, so the depth halves every level — exactly binary search, frozen into a tree. (Input is sorted & deduped first.)",
    )
    const build = fn(
      "build",
      (lo: number, hi: number): TNode | null => {
        ptr("lo", lo <= hi ? lo : -1)
        ptr("hi", hi >= lo ? hi : -1)
        if (lo > hi) {
          line(1, `Slice [${lo}..${hi}] is empty → this child slot stays <b>null</b>.`)
          return null
        }
        const mid = (lo + hi) >> 1
        ptr("mid", mid)
        mark("window", Array.from({ length: hi - lo + 1 }, (_, k) => lo + k))
        mark("focus", [mid])
        vars({ lo, hi, mid, root: nums[mid] })
        line(2, `Slice [${lo}..${hi}]: middle index ${mid} → <b>${nums[mid]}</b> becomes this subtree's root. ${mid - lo} values go left, ${hi - mid} go right — as balanced as it gets.`)
        const node = mk(nums[mid])
        line(4, `Build ${nums[mid]}'s LEFT subtree from the left half [${lo}..${mid - 1}].`)
        node.left = build(lo, mid - 1)
        line(5, `Build ${nums[mid]}'s RIGHT subtree from the right half [${mid + 1}..${hi}].`)
        node.right = build(mid + 1, hi)
        mark("done", Array.from({ length: hi - lo + 1 }, (_, k) => lo + k))
        heap("tree", serialize(node))
        line(6, `Subtree over [${lo}..${hi}] complete — rooted at <b>${node.val}</b>.`)
        return node
      },
      0,
    )
    const root = build(0, nums.length - 1)
    ptr("lo", -1)
    ptr("hi", -1)
    ptr("mid", -1)
    mark("good", nums.map((_, i) => i))
    const out = serialize(root)
    narrate(`Height-balanced BST (level-order): <b>[${out.join(", ")}]</b> — height ⌈log₂(n+1)⌉ = ${Math.ceil(Math.log2(nums.length + 1))}.`)
    return JSON.stringify(out)
  },
}
