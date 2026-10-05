import type { SolutionDef } from "@/engine/types"

type T = { val: number; left: T | null; right: T | null; toString: () => string }

export const constructBstFromPreorder: SolutionDef = {
  code: `// preorder is editable below; idx = 0; null bound = ±∞
function build(lo, hi) {
  if (idx === preorder.length) return null;
  const v = preorder[idx];
  if (lo !== null && v < lo) return null; // v belongs elsewhere
  if (hi !== null && v > hi) return null; // v belongs elsewhere
  idx++;                        // consume v as this subtree's root
  const node = new Node(v);
  node.left = build(lo, v);     // next values < v go left
  node.right = build(v, hi);    // then values > v go right
  return node;
}`,
  codeJava: `// int[] preorder; int idx = 0; null bound = ±∞
TreeNode build(Integer lo, Integer hi) {
  if (idx == preorder.length) return null;
  int v = preorder[idx];
  if (lo != null && v < lo) return null;  // v belongs elsewhere
  if (hi != null && v > hi) return null;  // v belongs elsewhere
  idx++;                        // consume v as this subtree's root
  TreeNode node = new TreeNode(v);
  node.left = build(lo, v);     // next values < v go left
  node.right = build(v, hi);    // then values > v go right
  return node;
}`,
  inputs: [{ kind: "numbers", name: "preorder", label: "preorder", default: [8, 4, 2, 6, 12, 10, 14], maxLen: 10 }],
  entry: () => "build(null, null)",
  run({ fn, line, vars, heap, narrate }, args) {
    const preorder = args.preorder as number[]
    let idx = 0
    const built: number[] = []
    const b = (x: number | null, inf: string) => (x === null ? inf : String(x))
    const build = fn(
      "build",
      (lo: number | null, hi: number | null): T | null => {
        const win = `(${b(lo, "-∞")}, ${b(hi, "∞")})`
        if (idx === preorder.length) {
          line(2, `build${win}: all ${preorder.length} values consumed — this child is null.`)
          return null
        }
        const v = preorder[idx]
        vars({ idx, v, lo: b(lo, "-∞"), hi: b(hi, "∞") })
        line(3, `Peek preorder[${idx}] = <b>${v}</b>. Does it fit inside ${win}?`)
        if (lo !== null && v < lo) {
          line(4, `${v} < lo=${lo} — ${v} belongs to an ancestor's OTHER side. Null child; the value is NOT consumed.`)
          return null
        }
        if (hi !== null && v > hi) {
          line(5, `${v} > hi=${hi} — ${v} belongs to an ancestor's OTHER side. Null child; the value is NOT consumed.`)
          return null
        }
        idx++
        built.push(v)
        heap("built", built)
        vars({ idx, v })
        line(6, `${v} fits ${win} → consume it (idx → ${idx}). <b>${v} is this subtree's root.</b>`)
        line(8, `Left child of ${v}: upcoming values must lie in (${b(lo, "-∞")}, ${v}).`)
        const left = build(lo, v)
        line(9, `Right child of ${v}: upcoming values must lie in (${v}, ${b(hi, "∞")}).`)
        const right = build(v, hi)
        return { val: v, left, right, toString: () => `node ${v}` }
      },
      1,
    )
    narrate("Preorder = root first. Each value becomes a root the moment it fits the (lo, hi) window inherited from its ancestors — no sorting, no searching, O(n).")
    const root = build(null, null)
    // level-order of the constructed tree (-1 = null), trailing nulls trimmed
    const out: number[] = []
    if (root !== null) {
      const bq: (T | null)[] = [root]
      while (bq.length > 0) {
        const n = bq.shift() ?? null
        if (n === null) {
          out.push(-1)
          continue
        }
        out.push(n.val)
        bq.push(n.left, n.right)
      }
      while (out.length > 0 && out[out.length - 1] === -1) out.pop()
    }
    narrate(`Constructed BST (level-order): [${out.join(",")}].`)
    return JSON.stringify(out)
  },
}
