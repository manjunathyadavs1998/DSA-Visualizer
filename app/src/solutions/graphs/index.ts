import type { Problem } from "@/engine/types"
import { cloneGraph } from "./clone-graph"
import { dfsTraversal } from "./dfs-traversal"
import { bfsTraversal } from "./bfs-traversal"
import { detectCycleUndirected } from "./detect-cycle-in-undirected-graph"
import { detectCycleDirected } from "./detect-cycle-in-directed-graph"
import { topologicalSort } from "./topological-sort"
import { isGraphBipartite } from "./is-graph-bipartite"
import { kosarajuSCC } from "./strongly-connected-components-kosaraju"
import { dijkstra } from "./dijkstra-s-algorithm"
import { bellmanFord } from "./bellman-ford"
import { floydWarshall } from "./floyd-warshall"
import { primMST } from "./mst-prim-s"
import { kruskalMST } from "./mst-kruskal-s"

const G = "Graphs"
const g = (
  slug: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  lc: string,
  summary: string,
  solution: Problem["solution"],
  pattern: Problem["pattern"] = "recursion",
): Problem => ({
  slug,
  title,
  neetcodeCategory: G,
  pattern,
  difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
})

export const GRAPHS_PROBLEMS: Problem[] = [
  g("clone-graph", "Clone Graph", "Medium", "clone-graph",
    "Register the copy in the old→new map BEFORE recursing — that's what stops the cycle.", cloneGraph, "dp"),
  g("dfs-traversal", "DFS Traversal", "Easy", "https://www.google.com/search?q=dfs+traversal+of+graph+striver",
    "Go deep before wide — the recursion tree below IS the DFS tree of the graph.", dfsTraversal),
  g("bfs-traversal", "BFS Traversal", "Easy", "https://www.google.com/search?q=bfs+traversal+of+graph+striver",
    "A queue explores ring by ring: everything at distance d before anything at d+1.", bfsTraversal),
  g("detect-cycle-in-undirected-graph", "Detect Cycle in Undirected Graph", "Medium",
    "https://www.google.com/search?q=detect+cycle+in+undirected+graph+striver",
    "A visited neighbor that isn't your parent means a second path — a cycle.", detectCycleUndirected),
  g("detect-cycle-in-directed-graph", "Detect Cycle in Directed Graph", "Medium",
    "https://www.google.com/search?q=detect+cycle+in+directed+graph+striver",
    "Gray = on the current path; an edge into gray is a back edge — black nodes are harmless.", detectCycleDirected),
  g("topological-sort", "Topological Sort", "Medium",
    "https://www.google.com/search?q=topological+sort+kahn+algorithm+striver",
    "Kahn's: peel off zero-indegree nodes; each removal frees its dependents.", topologicalSort),
  g("is-graph-bipartite", "Is Graph Bipartite", "Medium", "is-graph-bipartite",
    "2-color by BFS — neighbors must alternate; one same-color edge kills it.", isGraphBipartite),
  g("strongly-connected-components-kosaraju", "Strongly Connected Components (Kosaraju)", "Hard",
    "https://www.google.com/search?q=strongly+connected+components+kosaraju+striver",
    "Finish order + transposed graph: each pass-2 DFS is trapped inside exactly one SCC.", kosarajuSCC),
  g("dijkstra-s-algorithm", "Dijkstra's Algorithm", "Medium", "network-delay-time",
    "Always settle the closest node — greedy is safe because weights are non-negative.", dijkstra),
  g("bellman-ford", "Bellman-Ford", "Hard",
    "https://www.google.com/search?q=bellman+ford+algorithm+striver",
    "Relax every edge V−1 times; round k locks in paths of k edges — negatives welcome.", bellmanFord),
  g("floyd-warshall", "Floyd-Warshall", "Medium",
    "https://www.google.com/search?q=floyd+warshall+algorithm+striver",
    "Try every node k as a stopover: dist[i][k] + dist[k][j] vs dist[i][j], live on the matrix.", floydWarshall),
  g("mst-prim-s", "MST — Prim's", "Medium",
    "https://www.google.com/search?q=prims+algorithm+mst+striver",
    "Grow one tree; the cheapest edge crossing the cut is always safe to take.", primMST),
  g("mst-kruskal-s", "MST — Kruskal's", "Medium",
    "https://www.google.com/search?q=kruskals+algorithm+mst+striver",
    "Cheapest edges first; union-find rejects any edge whose endpoints already share a root.", kruskalMST, "dp"),
]
