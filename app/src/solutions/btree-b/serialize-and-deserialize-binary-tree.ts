import type { SolutionDef } from "@/engine/types"

interface TNode {
  val: number
  left: TNode | null
  right: TNode | null
  toString(): string
}

function mkNode(val: number): TNode {
  return {
    val,
    left: null,
    right: null,
    toString() {
      return String(this.val)
    },
  }
}

/** Level-order values → tree; -1 means null. */
function buildTree(vals: number[]): TNode | null {
  if (vals.length === 0 || vals[0] === -1) return null
  const root = mkNode(vals[0])
  const queue: TNode[] = [root]
  let i = 1
  while (queue.length > 0 && i < vals.length) {
    const cur = queue.shift() as TNode
    const l = vals[i++]
    if (l !== undefined && l !== -1) {
      cur.left = mkNode(l)
      queue.push(cur.left)
    }
    const r = vals[i++]
    if (r !== undefined && r !== -1) {
      cur.right = mkNode(r)
      queue.push(cur.right)
    }
  }
  return root
}

/** Plain (untraced) preorder serialization — used to prove the round trip. */
function plainSerialize(node: TNode | null, out: string[] = []): string[] {
  if (node === null) {
    out.push("#")
    return out
  }
  out.push(String(node.val))
  plainSerialize(node.left, out)
  plainSerialize(node.right, out)
  return out
}

/** Object whose String() is a custom label — keeps fn() call labels readable. */
interface Lbl {
  toString(): string
}
const lbl = (s: string): Lbl => ({ toString: () => s })

export const serializeAndDeserializeBinaryTree: SolutionDef = {
  code: `// preorder with "#" for null makes the string uniquely decodable
function serialize(node) {
  if (node === null) { tokens.push("#"); return; }
  tokens.push(String(node.val));
  serialize(node.left);
  serialize(node.right);
}
function deserialize() {
  const tok = tokens[idx]; idx++;
  if (tok === "#") return null;
  const node = { val: Number(tok), left: null, right: null };
  node.left = deserialize();
  node.right = deserialize();
  return node;
}`,
  codeJava: `// preorder with "#" for null makes the string uniquely decodable
void serialize(TreeNode node) {
  if (node == null) { tokens.add("#"); return; }
  tokens.add(String.valueOf(node.val));
  serialize(node.left);
  serialize(node.right);
}
TreeNode deserialize() {
  String tok = tokens.get(idx); idx++;
  if (tok.equals("#")) return null;
  TreeNode node = new TreeNode(Integer.parseInt(tok));
  node.left = deserialize();
  node.right = deserialize();
  return node;
}`,
  inputs: [
    { kind: "numbers", name: "tree", label: "tree (level-order, -1 = null)", default: [1, 2, 3, -1, -1, 4], maxLen: 9 },
  ],
  entry: (a) => {
    const t = a.tree as number[]
    return `roundTrip(${t[0] !== undefined && t[0] !== -1 ? t[0] : "∅"})`
  },
  run({ fn, line, vars, heap, narrate }, args) {
    const vals = args.tree as number[]
    const root = buildTree(vals)
    const tokens: string[] = []
    let idx = 0

    let curSer: TNode | null = null
    const serFn = fn(
      "serialize",
      (_l: Lbl): string => {
        const n = curSer
        if (n === null) {
          tokens.push("#")
          heap("tokens", tokens)
          line(2, `Null child — <b>emit "#"</b> so the decoder knows this branch stops. Tokens: [${tokens.join(",")}].`)
          return "#"
        }
        tokens.push(String(n.val))
        heap("tokens", tokens)
        line(3, `Visit <b>${n.val}</b> (preorder: root first) — emit "${n.val}", then serialize left, then right.`)
        ser(n.left)
        ser(n.right)
        return String(n.val)
      },
      1,
    )
    const ser = (n: TNode | null): void => {
      curSer = n
      serFn(lbl(n === null ? "#" : String(n.val)))
    }

    const deFn = fn(
      "deserialize",
      (_l: Lbl): TNode | null => {
        const tok = tokens[idx]
        idx++
        vars({ idx, tok: tok ?? "∅" })
        if (tok === undefined || tok === "#") {
          line(9, `Consume token #${idx - 1} = "#" — <b>this position is null</b>; back up.`)
          return null
        }
        line(10, `Consume token #${idx - 1} = "${tok}" — <b>create node ${tok}</b>; the next tokens spell out its left subtree, then its right.`)
        const node = mkNode(Number(tok))
        node.left = de()
        node.right = de()
        return node
      },
      7,
    )
    const de = (): TNode | null => deFn(lbl(tokens[idx] ?? "#"))

    const roundTrip = fn(
      "roundTrip",
      (_l: Lbl): string => {
        line(1, `<b>Phase 1 — serialize:</b> preorder walk, writing "#" at every null.`)
        ser(root)
        narrate(`Serialized to "<b>${tokens.join(",")}</b>" (${tokens.length} tokens). <b>Phase 2 — deserialize:</b> rebuild the tree from the tokens alone, consuming them left to right.`)
        const rebuilt = de()
        const again = plainSerialize(rebuilt).join(",")
        narrate(`Round trip: re-serializing the rebuilt tree gives "<b>${again}</b>" — ${again === tokens.join(",") ? "<b>identical, so nothing was lost</b>." : "different — something went wrong!"}`)
        return again
      },
      0,
    )
    heap("tokens", tokens)
    narrate('Preorder + explicit "#" null markers is enough to pin down the exact tree — serialize writes the story, deserialize replays it.')
    return roundTrip(lbl(vals[0] !== undefined && vals[0] !== -1 ? String(vals[0]) : "∅"))
  },
}
