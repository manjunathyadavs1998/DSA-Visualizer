import type { SolutionDef } from "@/engine/types"

// Star graph on 6 nodes with hub 2: edges 2-0, 2-1, 2-3, 2-4, 2-5.
// The hub appears in EVERY edge → its degree is n−1 = 5.
const N = 6
const EDGES: [number, number][] = [
  [2, 0],
  [2, 1],
  [2, 3],
  [2, 4],
  [2, 5],
]

export const findCenterOfStarGraph: SolutionDef = {
  view: "array",
  // the array below is degree[v] — edge endpoints counted so far
  array: () => Array(N).fill(0),
  code: `// star edges: 2-0, 2-1, 2-3, 2-4, 2-5
function findCenter(edges) {
  for (const [a, b] of edges) {
    degree[a]++;                  // count both endpoints
    degree[b]++;
  }
  for (let v = 0; v < n; v++)
    if (degree[v] === edges.length) return v; // on EVERY edge
  return -1;
}
// O(1) party trick: the center is on edges[0] AND edges[1] —
// return the endpoint that edges[0] and edges[1] share.`,
  codeJava: `// star edges: 2-0, 2-1, 2-3, 2-4, 2-5
int findCenter(int[][] edges) {
  for (int[] e : edges) {
    degree[e[0]]++;               // count both endpoints
    degree[e[1]]++;
  }
  for (int v = 0; v < n; v++)
    if (degree[v] == edges.length) return v; // on EVERY edge
  return -1;
}
// O(1) party trick: the center is on edges[0] AND edges[1] —
// return the endpoint that edges[0] and edges[1] share.`,
  inputs: [],
  entry: () => `findCenter([2-0, 2-1, 2-3, 2-4, 2-5])`,
  run({ fn, line, aset, mark, vars, narrate }) {
    const go = fn(
      "findCenter",
      (): number => {
        const degree = Array(N).fill(0)
        for (const [a, b] of EDGES) {
          mark("focus", [a, b])
          degree[a]++
          aset(a, degree[a])
          line(3, `Edge ${a}-${b}: degree[${a}] → <b>${degree[a]}</b>.`)
          degree[b]++
          aset(b, degree[b])
          line(4, `Edge ${a}-${b}: degree[${b}] → <b>${degree[b]}</b>.`)
        }
        mark("focus", [])
        for (let v = 0; v < N; v++) {
          vars({ v, degree: degree[v] })
          if (degree[v] === EDGES.length) {
            mark("good", [v])
            line(7, `degree[${v}] = ${degree[v]} = number of edges — node <b>${v}</b> touches every edge: it's the <b>hub</b>.`)
            return v
          }
          mark("bad", [v])
          line(7, `degree[${v}] = ${degree[v]} ≠ ${EDGES.length} — just a spoke tip.`)
        }
        line(8, `No hub found (impossible for a real star).`)
        return -1
      },
      1,
    )
    narrate(`Counting degrees is O(E) and makes the structure visible — but since the center sits on every edge, comparing just edges[0] and edges[1] already reveals it in O(1).`)
    return go()
  },
}
