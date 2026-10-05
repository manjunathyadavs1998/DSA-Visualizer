import type { SolutionDef } from "@/engine/types"

const M = [
  [2, 1, 1, 0],
  [1, 1, 0, 0],
  [0, 1, 1, 1],
  [0, 0, 1, 1],
]

export const rottingOranges: SolutionDef = {
  view: "grid",
  grid: () => M.map((r) => [...r]),
  code: `// BFS in waves: each minute, rot every fresh neighbor
function orangesRotting() {
  let queue = allCellsWhere(g, 2), minutes = 0;
  while (queue.length > 0) {
    const next = [];
    for (const [r, c] of queue)
      for (const [nr, nc] of neighbors(r, c))
        if (g[nr][nc] === 1) {     // fresh neighbor
          g[nr][nc] = 2;           // rots now
          next.push([nr, nc]);
        }
    if (next.length > 0) minutes++;
    queue = next;                  // next minute's wave
  }
  return anyFreshLeft(g) ? -1 : minutes;
}`,
  codeJava: `// BFS in waves: each minute, rot every fresh neighbor
int orangesRotting() {
  Queue<int[]> queue = allCellsWhere(g, 2); int minutes = 0;
  while (!queue.isEmpty()) {
    Queue<int[]> next = new LinkedList<>();
    for (int[] rc : queue)
      for (int[] n : neighbors(rc[0], rc[1]))
        if (g[n[0]][n[1]] == 1) {  // fresh neighbor
          g[n[0]][n[1]] = 2;       // rots now
          next.add(n);
        }
    if (!next.isEmpty()) minutes++;
    queue = next;                  // next minute's wave
  }
  return anyFreshLeft(g) ? -1 : minutes;
}`,
  inputs: [],
  entry: () => `orangesRotting()  // 2 = rotten, 1 = fresh`,
  run({ fn, line, gmark, gset, vars }) {
    const g = M.map((r) => [...r])
    const go = fn(
      "orangesRotting",
      (): number => {
        let queue: [number, number][] = []
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (g[i][j] === 2) queue.push([i, j])
        let minutes = 0
        gmark("bad", [...queue])
        line(2, `Start: ${queue.length} rotten orange(s) — they all spread <b>simultaneously</b>. That's why BFS, not DFS.`)
        while (queue.length > 0) {
          const next: [number, number][] = []
          for (const [r, c] of queue)
            for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as [number, number][]) {
              if (nr < 0 || nc < 0 || nr >= 4 || nc >= 4) continue
              if (g[nr][nc] === 1) {
                g[nr][nc] = 2
                gset(nr, nc, 2)
                next.push([nr, nc])
              }
            }
          if (next.length > 0) {
            minutes++
            gmark("focus", [...next])
            vars({ minute: minutes, "newly rotten": next.length })
            line(9, `<b>Minute ${minutes}</b>: the wave rots ${next.length} fresh orange(s) — all at the same time.`)
          }
          queue = next
        }
        const fresh = g.flat().filter((v) => v === 1).length
        gmark("focus", [])
        line(14, fresh ? `${fresh} orange(s) unreachable → return -1.` : `All oranges rotten after <b>${minutes} minutes</b>.`)
        return fresh ? -1 : minutes
      },
      1,
    )
    return go()
  },
}
