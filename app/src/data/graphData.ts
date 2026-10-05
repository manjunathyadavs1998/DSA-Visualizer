/** Input-graph diagrams for the graph problems. The adjacency lives as a fixed
 *  constant inside each solution file; this registry mirrors it for display.
 *  Edge triple: [u, v, weight?]. Undirected edges listed once (u < v). */
export interface GraphSpec {
  nodes: number[];
  edges: [number, number, number?][];
  directed: boolean;
}

export const GRAPH_DATA: Record<string, GraphSpec> = {
  'bfs-traversal': {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 5]],
    directed: false,
  },
  'dfs-traversal': {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 5]],
    directed: false,
  },
  'detect-cycle-in-directed-graph': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1], [1, 2], [2, 4], [2, 3], [3, 1]],
    directed: true,
  },
  'detect-cycle-in-undirected-graph': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1], [0, 4], [1, 2], [1, 3], [2, 3]],
    directed: false,
  },
  'clone-graph': {
    nodes: [1, 2, 3, 4],
    edges: [[1, 2], [2, 3], [3, 4], [1, 4]],
    directed: false,
  },
  'bellman-ford': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1, 4], [0, 2, 5], [1, 3, 3], [2, 1, -3], [3, 4, 2], [1, 2, 6]],
    directed: true,
  },
  'dijkstra-s-algorithm': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1, 4], [0, 2, 1], [1, 3, 1], [2, 1, 2], [2, 3, 5], [3, 4, 3]],
    directed: true,
  },
  'is-graph-bipartite': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1], [0, 3], [1, 2], [1, 4], [2, 3]],
    directed: false,
  },
  'mst-prim-s': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], [1, 4, 5], [2, 4, 7], [3, 4, 9]],
    directed: false,
  },
  'mst-kruskal-s': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1, 1], [2, 3, 2], [1, 2, 3], [0, 2, 4], [3, 4, 5], [1, 4, 6]],
    directed: false,
  },
  'topological-sort': {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[2, 3], [3, 1], [4, 0], [4, 1], [5, 0], [5, 2]],
    directed: true,
  },
  'strongly-connected-components-kosaraju': {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 3]],
    directed: true,
  },
  'floyd-warshall': {
    nodes: [0, 1, 2, 3],
    edges: [[0, 1, 3], [1, 2, 1], [2, 3, 2], [3, 0, 4], [0, 3, 10]],
    directed: true,
  },
};
