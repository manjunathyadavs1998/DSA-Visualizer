import type { SolutionDef } from "@/engine/types"

// even cycle 0-1-2-3-0 plus a pendant 4 on 1 — bipartite
const ADJ: number[][] = [
  [1, 3], // 0
  [0, 2, 4], // 1
  [1, 3], // 2
  [0, 2], // 3
  [1], // 4
]

export const isGraphBipartite: SolutionDef = {
  code: `// adj: 0:[1,3] 1:[0,2,4] 2:[1,3] 3:[0,2] 4:[1]
function isBipartite() {
  color[0] = 0;                    // paint start RED (0)
  const queue = [0];
  while (queue.length > 0) {
    const u = queue.shift();
    for (const v of adj[u]) {
      if (color[v] === undefined) {
        color[v] = 1 - color[u];   // opposite color across u→v
        queue.push(v);
      } else if (color[v] === color[u]) {
        return false;              // same color across an edge!
      }
    }
  }
  return true;
}`,
  codeJava: `// List<List<Integer>> adj — same 5-node graph
boolean isBipartite() {
  color[0] = 0;                    // paint start RED (0)
  Deque<Integer> queue = new ArrayDeque<>(List.of(0));
  while (!queue.isEmpty()) {
    int u = queue.poll();
    for (int v : adj.get(u)) {
      if (color[v] == -1) {
        color[v] = 1 - color[u];   // opposite color across u→v
        queue.add(v);
      } else if (color[v] == color[u]) {
        return false;              // same color across an edge!
      }
    }
  }
  return true;
}`,
  inputs: [],
  entry: () => `isBipartite()`,
  run({ fn, heap, line, vars, narrate }) {
    const NAME = ["RED", "BLUE"]
    const isBipartite = fn(
      "isBipartite",
      (): boolean => {
        const color: (number | undefined)[] = [undefined, undefined, undefined, undefined, undefined]
        const snap = () => {
          const o: Record<string, string> = {}
          for (let i = 0; i < 5; i++) o[i] = color[i] === undefined ? "—" : NAME[color[i] as number]
          return o
        }
        color[0] = 0
        heap("color", snap())
        line(2, `Paint node 0 <b>RED</b> — the first color choice is free (swapping all colors gives an equally valid answer).`)
        const queue = [0]
        while (queue.length > 0) {
          const u = queue.shift() as number
          vars({ u, color: NAME[color[u] as number] })
          heap("queue", [...queue])
          for (const v of ADJ[u]) {
            if (color[v] === undefined) {
              color[v] = 1 - (color[u] as number)
              queue.push(v)
              heap("color", snap())
              heap("queue", [...queue])
              const colored = color.map((c, i) => c !== undefined ? i : -1).filter(i => i >= 0)
              heap("visited", colored)
              line(8, `Edge ${u}→${v}: ${v} is unpainted — it must take the <b>opposite</b> of ${u}'s ${NAME[color[u] as number]}, so ${v} becomes ${NAME[color[v]]}.`)
            } else if (color[v] === color[u]) {
              line(11, `Edge ${u}→${v}: both ${NAME[color[u] as number]} — an edge inside one group. <b>Not bipartite.</b>`)
              return false
            } else {
              line(10, `Edge ${u}→${v}: ${v} already ${NAME[color[v]]}, opposite of ${u}'s ${NAME[color[u] as number]} — consistent. (Same color here would mean an odd cycle → not bipartite.)`)
            }
          }
        }
        line(15, `Every edge crosses RED↔BLUE — the graph splits cleanly into two groups. Bipartite!`)
        return true
      },
      1,
    )
    narrate(`Bipartite = 2-colorable: BFS paints each ring the opposite color of the last. Even cycles alternate perfectly; an odd cycle would force two neighbors into the same color.`)
    return isBipartite()
  },
}
