import type { SolutionDef } from "@/engine/types"

// undirected weighted graph: adj[u] = [v, w] pairs
const ADJ: [number, number][][] = [
  [[1, 2], [3, 6]], // 0
  [[0, 2], [2, 3], [3, 8], [4, 5]], // 1
  [[1, 3], [4, 7]], // 2
  [[0, 6], [1, 8], [4, 9]], // 3
  [[1, 5], [2, 7], [3, 9]], // 4
]
const V = 5

export const primMST: SolutionDef = {
  code: `// undirected: 0-1:2 0-3:6 1-2:3 1-3:8 1-4:5 2-4:7 3-4:9
function primMST() {
  key[0] = 0;                        // start the tree at node 0
  for (let picks = 0; picks < V; picks++) {
    const u = cheapestNotInMST(key); // min key crossing the cut
    inMST[u] = true;                 // cut property: u is safe
    total += key[u];
    for (const [v, w] of adj[u])
      if (!inMST[v] && w < key[v])
        key[v] = w;                  // cheaper way to reach v
  }
  return total;
}`,
  codeJava: `// int[][] adj[u] = {v, w} pairs — same weighted graph
int primMST() {
  key[0] = 0;                        // start the tree at node 0
  for (int picks = 0; picks < V; picks++) {
    int u = cheapestNotInMST(key);   // min key crossing the cut
    inMST[u] = true;                 // cut property: u is safe
    total += key[u];
    for (int[] e : adj[u])
      if (!inMST[e[0]] && e[1] < key[e[0]])
        key[e[0]] = e[1];            // cheaper way to reach v
  }
  return total;
}`,
  inputs: [],
  entry: () => `primMST()`,
  run({ fn, heap, line, vars, narrate }) {
    const go = fn(
      "primMST",
      (): number => {
        const key = [Infinity, Infinity, Infinity, Infinity, Infinity]
        const inMST = [false, false, false, false, false]
        const keySnap = () => key.map((d) => (d === Infinity ? "∞" : d))
        const mstSnap = () => inMST.map((b, i) => (b ? i : null)).filter((x) => x !== null)
        let total = 0
        key[0] = 0
        heap("key", keySnap())
        heap("inMST", mstSnap())
        line(2, `key[v] = cheapest known edge connecting v to the growing tree. Seed key[0] = 0 so node 0 is picked first.`)
        for (let picks = 0; picks < V; picks++) {
          let u = -1
          for (let v = 0; v < V; v++) if (!inMST[v] && (u === -1 || key[v] < key[u])) u = v
          line(4, `Cheapest node outside the tree: <b>${u}</b> with key ${key[u]}. Cut = {${mstSnap().join(",") || "∅"}} vs the rest.`)
          inMST[u] = true
          total += key[u]
          heap("inMST", mstSnap())
          vars({ u, "key[u]": key[u], total })
          line(5, `<b>Cut property:</b> the cheapest edge crossing a cut is in SOME MST — so pulling ${u} in for ${key[u]} can never be wrong. Tree = {${mstSnap().join(",")}}, cost so far ${total}.`)
          for (const [v, w] of ADJ[u]) {
            if (!inMST[v] && w < key[v]) {
              const old = key[v] === Infinity ? "∞" : key[v]
              key[v] = w
              heap("key", keySnap())
              line(9, `Edge ${u}→${v} (w=${w}) beats key[${v}] = ${old} — ${v} now reachable from the tree for ${w}.`)
            }
          }
        }
        line(11, `All ${V} nodes in — MST total weight = <b>${total}</b>.`)
        return total
      },
      1,
    )
    narrate(`Prim grows ONE tree. Each round: take the cheapest edge that crosses the cut between tree and non-tree — the cut property guarantees it's safe.`)
    return go()
  },
}
