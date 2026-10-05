import type { SolutionDef } from "@/engine/types"

// 4×4 grid: 0 = open, 1 = wall. Start (0,0), goal (3,3), 8 directions.
// One shortest path: (0,0) → (0,1) → (1,2) → (2,3) → (3,3), length 5.
const M: number[][] = [
  [0, 0, 0, 1],
  [1, 1, 0, 1],
  [0, 0, 0, 0],
  [0, 1, 1, 0],
]
const n = 4
const DIRS8: [number, number][] = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]

export const shortestPathInBinaryMatrix: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// 0 = open, 1 = wall; move in 8 directions (0,0) → (3,3)
function shortestPathBinaryMatrix(grid) {
  if (grid[0][0] === 1) return -1;   // start blocked
  const queue = [[0, 0, 1]];         // [row, col, path length]
  grid[0][0] = 1;                    // mark visited in place
  while (queue.length > 0) {
    const [r, c, d] = queue.shift();
    if (r === n - 1 && c === n - 1) return d; // reached corner
    for (const [dr, dc] of DIRS8) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] !== 0) continue; // wall or already seen
      grid[nr][nc] = 1;              // visited at enqueue time
      queue.push([nr, nc, d + 1]);
    }
  }
  return -1;                         // goal fenced off
}`,
  codeJava: `// 0 = open, 1 = wall; move in 8 directions (0,0) → (3,3)
int shortestPathBinaryMatrix(int[][] grid) {
  if (grid[0][0] == 1) return -1;    // start blocked
  Deque<int[]> queue = new ArrayDeque<>(List.of(new int[]{0, 0, 1}));
  grid[0][0] = 1;                    // mark visited in place
  while (!queue.isEmpty()) {
    int[] cur = queue.poll(); int r = cur[0], c = cur[1], d = cur[2];
    if (r == n - 1 && c == n - 1) return d; // reached corner
    for (int[] dir : DIRS8) {
      int nr = r + dir[0], nc = c + dir[1];
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      if (grid[nr][nc] != 0) continue;  // wall or already seen
      grid[nr][nc] = 1;              // visited at enqueue time
      queue.push(new int[]{nr, nc, d + 1});
    }
  }
  return -1;                         // goal fenced off
}`,
  inputs: [],
  entry: () => `shortestPathBinaryMatrix(grid)  // 4×4, 8-directional`,
  run({ fn, line, vars, gptr, gmark, gset, heap, narrate }) {
    const g = M.map((r) => [...r])
    const go = fn(
      "shortestPathBinaryMatrix",
      (): number => {
        line(2, `Start (0,0) is open (0) — go. BFS on unweighted cells = shortest path by cell count.`)
        const queue: [number, number, number][] = [[0, 0, 1]]
        g[0][0] = 1
        gset(0, 0, 1)
        heap("queue", queue.map(([r, c, d]) => `(${r},${c}):${d}`))
        line(4, `Enqueue (0,0) with length <b>1</b> and burn it (set to 1) — visited-at-enqueue prevents duplicates.`)
        while (queue.length > 0) {
          const [r, c, d] = queue.shift() as [number, number, number]
          heap("queue", queue.map(([rr, cc, dd]) => `(${rr},${cc}):${dd}`))
          gptr("cur", r, c)
          vars({ r, c, d })
          line(6, `Dequeue (${r},${c}) at path length <b>${d}</b>.`)
          if (r === n - 1 && c === n - 1) {
            gmark("good", [[r, c]])
            line(7, `(${r},${c}) is the bottom-right corner — shortest clear path = <b>${d}</b> cells.`)
            return d
          }
          const added: [number, number][] = []
          for (const [dr, dc] of DIRS8) {
            const nr = r + dr
            const nc = c + dc
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue
            if (g[nr][nc] !== 0) {
              line(11, `(${nr},${nc}) is ${M[nr][nc] === 1 ? "a wall" : "already seen"} — skip.`)
              continue
            }
            g[nr][nc] = 1
            gset(nr, nc, d + 1)
            queue.push([nr, nc, d + 1])
            added.push([nr, nc])
            heap("queue", queue.map(([rr, cc, dd]) => `(${rr},${cc}):${dd}`))
            line(13, `(${nr},${nc}) is open — label it <b>${d + 1}</b> and enqueue. (8 directions: diagonals count!)`)
          }
          gmark("focus", added)
        }
        line(16, `Queue drained without touching (${n - 1},${n - 1}) — walled off: <b>-1</b>.`)
        return -1
      },
      1,
    )
    narrate(`The grid is the visited set: cells get overwritten with their BFS distance the moment they're enqueued, so each cell is processed exactly once.`)
    return go()
  },
}
