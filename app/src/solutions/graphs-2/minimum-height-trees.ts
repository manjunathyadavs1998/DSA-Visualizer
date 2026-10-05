import type { SolutionDef } from "@/engine/types"

// Tree on 6 nodes: edges 3-0, 3-1, 3-2, 3-4, 4-5
//
//    0   1   2        degree: [1, 1, 1, 4, 2, 1]
//     \  |  /         Peel the outer leaf ring {0,1,2,5} and only
//        3 — 4 — 5    the centroids {3, 4} survive → answer [3,4].
const N = 6
const EDGES: [number, number][] = [
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 4],
  [4, 5],
]
const ADJ: number[][] = Array.from({ length: N }, () => [])
for (const [a, b] of EDGES) {
  ADJ[a].push(b)
  ADJ[b].push(a)
}

export const minimumHeightTrees: SolutionDef = {
  view: "array",
  // the array below is degree[v]; watch leaves drain it to 1
  array: () => {
    const deg = Array(N).fill(0)
    for (const [a, b] of EDGES) {
      deg[a]++
      deg[b]++
    }
    return deg
  },
  code: `// tree edges: 3-0, 3-1, 3-2, 3-4, 4-5
function findMinHeightTrees(n, edges) {
  let remaining = n;
  let leaves = [];
  for (let v = 0; v < n; v++)
    if (degree[v] === 1) leaves.push(v);  // outermost ring
  while (remaining > 2) {
    remaining -= leaves.length;           // peel the whole ring
    const next = [];
    for (const leaf of leaves)
      for (const v of adj[leaf]) {
        degree[v]--;                      // leaf lets go of v
        if (degree[v] === 1) next.push(v);// v became a leaf
      }
    leaves = next;
  }
  return leaves;         // the 1 or 2 centroids of the tree
}`,
  codeJava: `// tree edges: 3-0, 3-1, 3-2, 3-4, 4-5
List<Integer> findMinHeightTrees(int n, int[][] edges) {
  int remaining = n;
  List<Integer> leaves = new ArrayList<>();
  for (int v = 0; v < n; v++)
    if (degree[v] == 1) leaves.add(v);    // outermost ring
  while (remaining > 2) {
    remaining -= leaves.size();           // peel the whole ring
    List<Integer> next = new ArrayList<>();
    for (int leaf : leaves)
      for (int v : adj[leaf]) {
        degree[v]--;                      // leaf lets go of v
        if (degree[v] == 1) next.add(v);  // v became a leaf
      }
    leaves = next;
  }
  return leaves;         // the 1 or 2 centroids of the tree
}`,
  inputs: [],
  entry: () => `findMinHeightTrees(6, edges)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const degree = Array(N).fill(0)
    for (const [a, b] of EDGES) {
      degree[a]++
      degree[b]++
    }
    const go = fn(
      "findMinHeightTrees",
      (): string => {
        let remaining = N
        let leaves: number[] = []
        for (let v = 0; v < N; v++) {
          if (degree[v] === 1) {
            leaves.push(v)
            line(5, `Node ${v} has degree 1 — a <b>leaf</b> on the outermost ring.`)
          } else {
            line(5, `Node ${v} has degree ${degree[v]} — interior, skip for now.`)
          }
        }
        heap("leaves", leaves)
        mark("bad", [...leaves])
        vars({ remaining, leaves: `[${leaves.join(",")}]` })
        line(6, `${remaining} nodes alive, ring to peel: {${leaves.join(", ")}}. A root far from the center = a tall tree, so leaves can't be answers while > 2 nodes remain.`)
        while (remaining > 2) {
          remaining -= leaves.length
          vars({ remaining, peeled: `{${leaves.join(",")}}` })
          line(7, `Peel the entire ring {${leaves.join(", ")}} at once → <b>${remaining}</b> nodes left.`)
          const next: number[] = []
          for (const leaf of leaves) {
            for (const v of ADJ[leaf]) {
              degree[v]--
              aset(v, degree[v])
              if (degree[v] === 1) {
                next.push(v)
                line(12, `Leaf ${leaf} releases ${v}: degree[${v}] → 1 — <b>${v} is exposed as a new leaf</b>.`)
              } else if (degree[v] >= 0) {
                line(11, `Leaf ${leaf} releases ${v}: degree[${v}] → ${degree[v]}.`)
              }
            }
          }
          leaves = next
          heap("leaves", leaves)
          mark("bad", [...leaves])
        }
        mark("bad", [])
        mark("good", [...leaves])
        line(16, `≤ 2 nodes left: <b>[${leaves.join(", ")}]</b> — the tree's centroid(s). Rooting there minimizes the height.`)
        return JSON.stringify(leaves.sort((a, b) => a - b))
      },
      1,
    )
    narrate(`Think of burning the tree from all leaf tips at once — the last 1 or 2 nodes to burn are the centers, and a tree never has more than 2 of them.`)
    return go()
  },
}
