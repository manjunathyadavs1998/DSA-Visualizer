import type { SolutionDef } from "@/engine/types"

export const copyListWithRandomPointer: SolutionDef = {
  view: "array",
  array: (a) => a.vals as number[],
  code: `// vals + random target indices are editable below
function copyRandomList(head) {
  const map = new Map();             // old node → its clone
  for (let p = head; p !== null; p = p.next) {
    map.set(p, new Node(p.val));     // pass 1: bare clones
  }
  for (let p = head; p !== null; p = p.next) {
    const c = map.get(p);            // clone of p (cache hit)
    c.next = map.get(p.next);        // wire next via the map
    c.random = map.get(p.random);    // wire random via map
  }
  return map.get(head);
}`,
  codeJava: `// vals + random target indices are editable below
Node copyRandomList(Node head) {
  Map<Node, Node> map = new HashMap<>(); // old → clone
  for (Node p = head; p != null; p = p.next) {
    map.put(p, new Node(p.val));     // pass 1: bare clones
  }
  for (Node p = head; p != null; p = p.next) {
    Node c = map.get(p);             // clone of p (cache hit)
    c.next = map.get(p.next);        // wire next via the map
    c.random = map.get(p.random);    // wire random via map
  }
  return map.get(head);
}`,
  inputs: [
    { kind: "numbers", name: "vals", label: "node values", default: [7, 13, 11, 10, 1], maxLen: 6 },
    { kind: "numbers", name: "randoms", label: "random targets (index per node, -1 = null)", default: [-1, 0, 4, 2, 0], maxLen: 6 },
  ],
  entry: (a) => `copyRandomList([${(a.vals as number[]).join("→")}])`,
  run({ fn, memo, line, ptr, mark, heap, narrate }, args) {
    const vals = args.vals as number[]
    const n = vals.length
    const randomsRaw = args.randoms as number[]
    // clamp: a random target must be a valid node index, else null (-1)
    const rand = vals.map((_, i) => {
      const r = i < randomsRaw.length ? randomsRaw[i] : -1
      return r >= 0 && r < n ? r : -1
    })
    const clones: { val: number; next: number | null; random: number | null }[] = []
    const copyRandomList = fn(
      "copyRandomList",
      (): string => {
        if (n === 0) return "null"
        narrate(`Each node also has a <b>random</b> pointer: ${vals.map((v, i) => `${v}⤳${rand[i] === -1 ? "null" : vals[rand[i]]}`).join(", ")}. A naive copy fails because a random may target a node that isn't cloned yet — the map (memo, keyed by node index) breaks that dependency.`)
        line(2, `Start with an empty map: it will remember which clone belongs to each original node.`)
        for (let i = 0; i < n; i++) {
          ptr("p", i)
          line(4, `Pass 1 — clone node ${i} (value ${vals[i]}): map[${i}] = new Node(${vals[i]}). No next, no random yet — just reserve the clone.`)
          memo[String(i)] = vals[i]
          clones.push({ val: vals[i], next: null, random: null })
          heap("clone", clones)
        }
        narrate(`Pass 1 done: every original now has a bare clone in the map — so in pass 2 <b>every</b> lookup is a cache hit, no matter where a random points.`)
        for (let i = 0; i < n; i++) {
          ptr("p", i)
          const c = memo[String(i)] // guaranteed cache hit
          line(7, `Pass 2 — node ${i}: map[${i}] → its clone (value ${String(c)}). Cache hit.`)
          const ni = i + 1 < n ? i + 1 : -1
          const nextClone = ni === -1 ? "null" : String(memo[String(ni)])
          clones[i].next = ni === -1 ? null : ni
          line(8, `clone.next = map[${ni === -1 ? "null" : ni}] = ${ni === -1 ? "<b>null</b> (tail)" : `clone(${nextClone})`}.`)
          const ri = rand[i]
          mark("focus", ri >= 0 ? [i, ri] : [i])
          const randClone = ri === -1 ? "null" : String(memo[String(ri)])
          clones[i].random = ri === -1 ? null : ri
          line(9, `clone.random = map[${ri === -1 ? "null" : ri}] = ${ri === -1 ? "<b>null</b>" : `clone(${randClone})`} — the map converts an OLD pointer into the NEW node in O(1), even if it points ${ri > i ? "forward" : "backward"}.`)
          heap("clone", clones)
        }
        mark("focus", [])
        ptr("p", -1)
        line(11, `Return map[head] — a completely independent copy: same values, same next chain, same random shape.`)
        return `clone of ${vals.join("→")}`
      },
      1,
    )
    copyRandomList()
    return JSON.stringify(clones)
  },
}
