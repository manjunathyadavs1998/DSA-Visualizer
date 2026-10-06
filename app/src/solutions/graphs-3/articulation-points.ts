import type { SolutionDef } from "@/engine/types"

// Graph: 0-1-2-3, 1-4, 2-5 — node 1 and 2 are articulation points
const N = 6
const ADJ: number[][] = [[1], [0, 2, 4], [1, 3, 5], [2], [1], [2]]

export const articulationPoints: SolutionDef = {
  view: "array",
  array: () => Array(N).fill(-1),  // disc[] — discovery times
  code: `// Tarjan's algorithm for articulation points
function findArticulationPoints(n, adj) {
  const disc = new Array(n).fill(-1);
  const low  = new Array(n).fill(-1);
  const ap   = new Array(n).fill(false);
  let timer = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = timer++;
    let children = 0;
    for (const v of adj[u]) {
      if (disc[v] === -1) {
        children++;
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        // root AP: ≥2 children; non-root AP: low[v] ≥ disc[u]
        if (parent === -1 && children > 1) ap[u] = true;
        if (parent !== -1 && low[v] >= disc[u]) ap[u] = true;
      } else if (v !== parent) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  }
  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
  return ap.map((v,i) => v ? i : -1).filter(i => i >= 0);
}`,
  codeJava: `void dfs(int u, int parent, int[] disc, int[] low, boolean[] ap, int[] timer, List<List<Integer>> adj) {
  disc[u] = low[u] = timer[0]++;
  int children = 0;
  for (int v : adj.get(u)) {
    if (disc[v] == -1) {
      children++;
      dfs(v, u, disc, low, ap, timer, adj);
      low[u] = Math.min(low[u], low[v]);
      if (parent == -1 && children > 1) ap[u] = true;
      if (parent != -1 && low[v] >= disc[u]) ap[u] = true;
    } else if (v != parent) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}`,
  inputs: [],
  entry: () => `findArticulationPoints(6 nodes)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const disc = new Array(N).fill(-1)
    const low  = new Array(N).fill(-1)
    const ap   = new Array(N).fill(false)
    let timer = 0
    const apNodes: number[] = []
    const dfs = fn("dfs", (u: number, parent: number): void => {
      disc[u] = low[u] = timer++
      aset(u, disc[u])
      mark("focus", [u])
      vars({ u, parent, disc_u: disc[u], low_u: low[u] })
      line(7, `dfs(${u}): disc[${u}]=low[${u}]=${disc[u]}.`)
      let children = 0
      for (const v of ADJ[u]) {
        if (disc[v] === -1) {
          children++
          dfs(v, u)
          low[u] = Math.min(low[u], low[v])
          aset(u, disc[u])
          heap("low", [...low])
          vars({ u, parent, disc_u: disc[u], low_u: low[u], v, low_v: low[v] })
          if (parent === -1 && children > 1) {
            ap[u] = true; apNodes.push(u)
            mark("good", [...apNodes])
            line(13, `Root ${u} has ${children} DFS children — <b>articulation point</b>.`)
          }
          if (parent !== -1 && low[v] >= disc[u]) {
            ap[u] = true
            if (!apNodes.includes(u)) apNodes.push(u)
            mark("good", [...apNodes])
            line(14, `low[${v}]=${low[v]} ≥ disc[${u}]=${disc[u]} — removing ${u} disconnects ${v}'s subtree: <b>AP</b>.`)
          }
        } else if (v !== parent) {
          low[u] = Math.min(low[u], disc[v])
          aset(u, disc[u])
          heap("low", [...low])
          line(16, `Back edge ${u}→${v}: low[${u}] = min(${low[u]}, disc[${v}]=${disc[v]}) = ${low[u]}.`)
        }
      }
    }, 6)
    const go = fn("findArticulationPoints", (): string => {
      heap("disc", [...disc])
      heap("low", [...low])
      line(1, `disc[u] = discovery time; low[u] = earliest disc reachable via back edges. Array below shows disc[].`)
      for (let i = 0; i < N; i++) if (disc[i] === -1) dfs(i, -1)
      mark("focus", [])
      line(20, `Articulation points: <b>[${apNodes.sort((a,b)=>a-b).join(", ")}]</b>.`)
      return JSON.stringify(apNodes.sort((a,b)=>a-b))
    }, 1)
    narrate("Tarjan's AP: low[u] = min discovery reachable without the parent edge. If low[child] ≥ disc[u], removing u disconnects the child's subtree.")
    return go()
  },
}
