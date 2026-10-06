import type { SolutionDef } from "@/engine/types"

// Grid: 0=empty, 1=fresh orange, 2=rotten orange
// Multi-source BFS from all rotten oranges simultaneously
const GRID_DEFAULT = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
]

export const multiSourceBFS: SolutionDef = {
  view: "grid",
  grid: () => GRID_DEFAULT.map(r => [...r]),
  code: `// grid: 0=empty, 1=fresh, 2=rotten
function orangesRotting(grid) {
  const queue = [];
  let fresh = 0;
  // seed BFS with ALL rotten oranges at time 0
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      if (grid[r][c] === 1) fresh++;
    }
  let minutes = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (queue.length > 0) {
    const [r, c, t] = queue.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length
          && grid[nr][nc] === 1) {
        grid[nr][nc] = 2; fresh--;
        minutes = Math.max(minutes, t + 1);
        queue.push([nr, nc, t + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
  codeJava: `int orangesRotting(int[][] grid) {
  int R = grid.length, C = grid[0].length;
  Queue<int[]> q = new LinkedList<>();
  int fresh = 0;
  for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++) {
      if (grid[r][c] == 2) q.add(new int[]{r,c,0});
      if (grid[r][c] == 1) fresh++;
    }
  int minutes = 0;
  int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
  while (!q.isEmpty()) {
    int[] cur = q.poll();
    for (int[] d : dirs) {
      int nr=cur[0]+d[0], nc=cur[1]+d[1];
      if (nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]==1) {
        grid[nr][nc]=2; fresh--;
        minutes=Math.max(minutes,cur[2]+1);
        q.add(new int[]{nr,nc,cur[2]+1});
      }
    }
  }
  return fresh==0 ? minutes : -1;
}`,
  inputs: [],
  entry: () => `orangesRotting(grid)`,
  run({ fn, line, gset, gmark, vars, heap, narrate }) {
    const go = fn("orangesRotting", (): number => {
      const grid = GRID_DEFAULT.map(r => [...r])
      const R = grid.length, C = grid[0].length
      const queue: [number, number, number][] = []
      let fresh = 0
      for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) {
          if (grid[r][c] === 2) queue.push([r, c, 0])
          if (grid[r][c] === 1) fresh++
        }
      const rottenSeeds = queue.map(([r, c]) => [r, c] as [number, number])
      gmark("good", rottenSeeds)
      vars({ fresh, queueSize: queue.length })
      heap("queue", queue.map(([r, c, t]) => `(${r},${c},t=${t})`))
      line(5, `Seed BFS with all <b>${queue.length}</b> rotten orange${queue.length > 1 ? "s" : ""} at time 0. Fresh: ${fresh}.`)
      let minutes = 0
      const dirs: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]
      while (queue.length > 0) {
        const [r, c, t] = queue.shift()!
        gmark("focus", [[r, c]])
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
            grid[nr][nc] = 2
            gset(nr, nc, 2)
            fresh--
            minutes = Math.max(minutes, t + 1)
            queue.push([nr, nc, t + 1])
            gmark("window", [[nr, nc]])
            vars({ fresh, minutes, t: t + 1 })
            heap("queue", queue.map(([qr, qc, qt]) => `(${qr},${qc},t=${qt})`))
            line(18, `(${r},${c}) rots neighbor (${nr},${nc}) at minute <b>${t + 1}</b>. Fresh left: ${fresh}.`)
          }
        }
      }
      gmark("focus", [])
      const result = fresh === 0 ? minutes : -1
      line(22, fresh === 0
        ? `All oranges rotted. Minimum minutes: <b>${minutes}</b>.`
        : `<b>${fresh}</b> fresh orange${fresh > 1 ? "s" : ""} unreachable — result: <b>-1</b>.`)
      return result
    }, 1)
    narrate("Multi-source BFS: seed the queue with ALL rotten oranges at time 0. BFS naturally spreads in waves — minute k = ring k from any source.")
    return go()
  },
}
