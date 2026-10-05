import type { SolutionDef } from "@/engine/types"

const M = [
  [0, 0, 1, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 0],
  [1, 1, 0, 0],
]

export const shortestPathBinaryMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => (r.map((v) => (v === 1 ? "■" : "·")))),
  code: `// BFS layer by layer — first arrival IS the shortest path
function shortestPath() {
  if (g[0][0] === 1) return -1;
  let queue = [[0, 0]], dist = 1;
  g[0][0] = 1;                        // mark visited
  while (queue.length > 0) {
    const next = [];
    for (const [r, c] of queue) {
      if (r === rows-1 && c === cols-1) return dist;
      for (const [nr, nc] of neighbors8(r, c))  // 8 directions
        if (inBounds(nr, nc) && g[nr][nc] === 0) {
          g[nr][nc] = 1;              // visited
          next.push([nr, nc]);
        }
    }
    dist++; queue = next;             // next BFS ring
  }
  return -1;
}`,
  codeJava: `// BFS layer by layer — first arrival IS the shortest path
int shortestPath() {
  if (g[0][0] == 1) return -1;
  Queue<int[]> queue = start(0, 0); int dist = 1;
  g[0][0] = 1;                        // mark visited
  while (!queue.isEmpty()) {
    Queue<int[]> next = new LinkedList<>();
    for (int[] rc : queue) {
      if (rc[0] == rows-1 && rc[1] == cols-1) return dist;
      for (int[] n : neighbors8(rc[0], rc[1]))  // 8 dirs
        if (inBounds(n) && g[n[0]][n[1]] == 0) {
          g[n[0]][n[1]] = 1;          // visited
          next.add(n);
        }
    }
    dist++; queue = next;             // next BFS ring
  }
  return -1;
}`,
  inputs: [],
  entry: () => `shortestPath()  // (0,0) → (3,3), 8 directions`,
  run({ fn, line, gmark, gset, vars }) {
    const g = M.map((r) => [...r])
    const go = fn(
      "shortestPath",
      (): number => {
        let queue: [number, number][] = [[0, 0]]
        let dist = 1
        g[0][0] = 1
        gset(0, 0, 1)
        line(3, `Start at (0,0) with distance 1. BFS explores in rings — ring k = all cells reachable in k steps.`)
        while (queue.length > 0) {
          const next: [number, number][] = []
          for (const [r, c] of queue) {
            if (r === 3 && c === 3) {
              gmark("good", [[3, 3]])
              line(9, `<b>Reached (3,3) — shortest path length is ${dist}.</b> BFS guarantees no shorter one exists.`)
              return dist
            }
            for (let dr = -1; dr <= 1; dr++)
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc
                if ((dr || dc) && nr >= 0 && nc >= 0 && nr < 4 && nc < 4 && g[nr][nc] === 0) {
                  g[nr][nc] = 1
                  gset(nr, nc, dist + 1)
                  next.push([nr, nc])
                }
              }
          }
          dist++
          gmark("focus", [...next])
          vars({ ring: dist, "cells in ring": next.length })
          line(16, `Ring ${dist}: ${next.length} new cell(s), each labeled with its distance. All 8 directions allowed.`)
          queue = next
        }
        line(18, `Queue empty and the corner never reached → -1.`)
        return -1
      },
      1,
    )
    return go()
  },
}
