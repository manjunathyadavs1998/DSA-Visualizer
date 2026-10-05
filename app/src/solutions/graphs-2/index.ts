import type { Problem } from "@/engine/types"
import { numberOfProvinces } from "./number-of-provinces"
import { redundantConnection } from "./redundant-connection"
import { graphValidTree } from "./graph-valid-tree"
import { makeNetworkConnected } from "./number-of-operations-to-make-network-connected"
import { courseSchedule } from "./course-schedule"
import { courseScheduleII } from "./course-schedule-ii"
import { keysAndRooms } from "./keys-and-rooms"
import { findEventualSafeStates } from "./find-eventual-safe-states"
import { cheapestFlightsWithinKStops } from "./cheapest-flights-within-k-stops"
import { networkDelayTime } from "./network-delay-time"
import { minCostConnectPoints } from "./min-cost-to-connect-all-points"
import { findCenterOfStarGraph } from "./find-center-of-star-graph"
import { findIfPathExists } from "./find-if-path-exists-in-graph"
import { allPathsFromSourceToTarget } from "./all-paths-from-source-to-target"
import { minimumHeightTrees } from "./minimum-height-trees"
import { wordLadder } from "./word-ladder"
import { shortestPathInBinaryMatrix } from "./shortest-path-in-binary-matrix"
import { surroundedRegions } from "./surrounded-regions"
import { maxAreaOfIsland } from "./max-area-of-island"

const G = "Graphs"
const g = (
  slug: string,
  title: string,
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug,
  title,
  neetcodeCategory: G,
  pattern: "recursion",
  difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
  time,
  space,
})

export const GRAPHS_2_PROBLEMS: Problem[] = [
  g("number-of-provinces", "Number of Provinces", "Medium", "number-of-provinces",
    "Union-find 101: each union fuses two groups — provinces = n minus successful unions.",
    numberOfProvinces, "O(E · α(V))", "O(V)"),
  g("redundant-connection", "Redundant Connection", "Medium", "redundant-connection",
    "Union edges one by one; the first edge whose endpoints already share a root closes the cycle.",
    redundantConnection, "O(E · α(V))", "O(V)"),
  g("graph-valid-tree", "Graph Valid Tree", "Medium", "graph-valid-tree",
    "Tree = no rejected union (acyclic) + exactly one component left (connected).",
    graphValidTree, "O(E · α(V))", "O(V)"),
  g("number-of-operations-to-make-network-connected", "Number of Operations to Make Network Connected", "Medium",
    "number-of-operations-to-make-network-connected",
    "Count components and spare cables with union-find — k components always need k−1 moves.",
    makeNetworkConnected, "O(E · α(V))", "O(V)"),
  g("course-schedule", "Course Schedule", "Medium", "course-schedule",
    "Kahn's peeling as a cycle detector: a cycle has no indegree-0 node, so it never gets taken.",
    courseSchedule, "O(V + E)", "O(V)"),
  g("course-schedule-ii", "Course Schedule II", "Medium", "course-schedule-ii",
    "Same peeling, but record the order — every prerequisite lands before its dependent.",
    courseScheduleII, "O(V + E)", "O(V)"),
  g("keys-and-rooms", "Keys and Rooms", "Medium", "keys-and-rooms",
    "Rooms are nodes, keys are edges — 'can you open everything?' is just reachability from node 0.",
    keysAndRooms, "O(V + E)", "O(V)"),
  g("find-eventual-safe-states", "Find Eventual Safe States", "Medium", "find-eventual-safe-states",
    "Gray = on the current DFS path; an edge into gray dooms the whole path — black memoizes verdicts.",
    findEventualSafeStates, "O(V + E)", "O(V)"),
  g("cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops", "Medium",
    "cheapest-flights-within-k-stops",
    "Bellman-Ford on a leash: k+1 relaxation rounds cap every route at k+1 flight legs.",
    cheapestFlightsWithinKStops, "O(k · E)", "O(V)"),
  g("network-delay-time", "Network Delay Time", "Medium", "network-delay-time",
    "Dijkstra: settle the closest node, relax its edges — the answer is the max shortest path.",
    networkDelayTime, "O(V²)", "O(V)"),
  g("min-cost-to-connect-all-points", "Min Cost to Connect All Points", "Medium",
    "min-cost-to-connect-all-points",
    "Kruskal on the complete Manhattan graph — union-find rejects cycle-closers until n−1 edges stand.",
    minCostConnectPoints, "O(n² log n)", "O(n²)"),
  g("find-center-of-star-graph", "Find Center of Star Graph", "Easy", "find-center-of-star-graph",
    "The hub is on EVERY edge — count degrees, or just intersect the first two edges in O(1).",
    findCenterOfStarGraph, "O(E)", "O(V)"),
  g("find-if-path-exists-in-graph", "Find if Path Exists in Graph", "Easy", "find-if-path-exists-in-graph",
    "Union all edges once; then any connectivity query is 'do they share a root?' in near-O(1).",
    findIfPathExists, "O(E · α(V))", "O(V)"),
  g("all-paths-from-source-to-target", "All Paths From Source to Target", "Medium",
    "all-paths-from-source-to-target",
    "Backtracking on a DAG: push, recurse, pop — snapshot the shared path at every target hit.",
    allPathsFromSourceToTarget, "O(2ⁿ · n)", "O(n)"),
  g("minimum-height-trees", "Minimum Height Trees", "Medium", "minimum-height-trees",
    "Burn the tree from all leaf tips at once — the last 1–2 standing nodes are the centroids.",
    minimumHeightTrees, "O(V + E)", "O(V)"),
  g("word-ladder", "Word Ladder", "Hard", "word-ladder",
    "Words are nodes, one-letter edits are edges — BFS makes the first arrival the shortest ladder.",
    wordLadder, "O(N² · L)", "O(N)"),
  g("shortest-path-in-binary-matrix", "Shortest Path in Binary Matrix", "Medium",
    "shortest-path-in-binary-matrix",
    "8-directional BFS where the grid itself is the visited set — cells become their own distance labels.",
    shortestPathInBinaryMatrix, "O(n²)", "O(n²)"),
  g("surrounded-regions", "Surrounded Regions", "Medium", "surrounded-regions",
    "Invert it: rescue the border-connected O's by flood-fill, then capture everything still an O.",
    surroundedRegions, "O(R · C)", "O(R · C)"),
  g("max-area-of-island", "Max Area of Island", "Medium", "max-area-of-island",
    "Flood-fill that counts while it sinks — each landing on fresh land measures one whole island.",
    maxAreaOfIsland, "O(R · C)", "O(R · C)"),
]
