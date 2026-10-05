import type { SolutionDef } from "@/engine/types"

// undirected: 0-1, 0-4, 1-2, 2-3, 3-1 → cycle 1-2-3
const ADJ: number[][] = [
  [1, 4], // 0
  [0, 2, 3], // 1
  [1, 3], // 2
  [2, 1], // 3
  [0], // 4
]

export const detectCycleUndirected: SolutionDef = {
  code: `// undirected: 0-1  0-4  1-2  2-3  3-1   (cycle 1-2-3)
function hasCycle(u, parent) {
  visited.add(u);
  for (const v of adj[u]) {
    if (!visited.has(v)) {
      if (hasCycle(v, u)) return true;   // cycle found deeper
    } else if (v !== parent) {
      return true;  // visited & not my parent → second path to v!
    }
  }
  return false;
}`,
  codeJava: `// undirected: 0-1  0-4  1-2  2-3  3-1   (cycle 1-2-3)
boolean hasCycle(int u, int parent) {
  visited.add(u);
  for (int v : adj.get(u)) {
    if (!visited.contains(v)) {
      if (hasCycle(v, u)) return true;   // cycle found deeper
    } else if (v != parent) {
      return true; // visited & not my parent → second path to v!
    }
  }
  return false;
}`,
  inputs: [],
  entry: () => `hasCycle(0, -1)`,
  run({ fn, heap, line, narrate }) {
    const visited = new Set<number>()
    const hasCycle = fn(
      "hasCycle",
      (u: number, parent: number): boolean => {
        line(2, `Visit ${u} (came from ${parent === -1 ? "nowhere — the start" : `parent ${parent}`}).`)
        visited.add(u)
        heap("visited", [...visited])
        for (const v of ADJ[u]) {
          if (!visited.has(v)) {
            line(5, `Edge ${u}→${v}: ${v} unseen — recurse with parent = ${u}.`)
            if (hasCycle(v, u)) return true
          } else if (v !== parent) {
            line(7, `Edge ${u}→${v}: ${v} is <b>visited and NOT my parent</b> — there are two different paths to ${v}. That is a cycle!`)
            return true
          } else {
            line(6, `Edge ${u}→${v}: ${v} is visited but it's just my parent — that's the edge I arrived on, not a cycle.`)
          }
        }
        line(10, `All of ${u}'s edges checked — no cycle through ${u}.`)
        return false
      },
      1,
    )
    narrate(`In an undirected graph every tree edge points back at your parent — only a visited neighbor that ISN'T your parent proves a second route, i.e. a cycle.`)
    heap("visited", [])
    const ans = hasCycle(0, -1)
    return ans
  },
}
