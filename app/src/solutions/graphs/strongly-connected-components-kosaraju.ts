import type { SolutionDef } from "@/engine/types"

// directed: 0→1, 1→2, 2→0, 2→3, 3→4, 4→3 → SCCs {0,1,2} and {3,4}
const ADJ: number[][] = [[1], [2], [0, 3], [4], [3]]
// reversed graph (every edge flipped)
const RADJ: number[][] = [[2], [0], [1], [2, 4], [3]]

export const kosarajuSCC: SolutionDef = {
  code: `// edges: 0→1 1→2 2→0 2→3 3→4 4→3  → SCCs {0,1,2} {3,4}
function kosaraju() {
  for (const u of nodes)
    if (!seen1.has(u)) dfs1(u);      // pass 1 on G
  while (stack.length > 0) {         // pass 2 on reversed G
    const u = stack.pop();           // highest finish first
    if (seen2.has(u)) continue;
    comp = []; dfs2(u);
    sccs.push(comp);                 // one whole SCC
  }
  return sccs;
}
function dfs1(u) {
  seen1.add(u);
  for (const v of adj[u]) if (!seen1.has(v)) dfs1(v);
  stack.push(u);                     // u FINISHED — push last
}
function dfs2(u) {
  seen2.add(u); comp.push(u);        // u joins current SCC
  for (const v of radj[u]) if (!seen2.has(v)) dfs2(v);
}`,
  codeJava: `// edges: 0→1 1→2 2→0 2→3 3→4 4→3  → SCCs {0,1,2} {3,4}
List<List<Integer>> kosaraju() {
  for (int u : nodes)
    if (!seen1.contains(u)) dfs1(u); // pass 1 on G
  while (!stack.isEmpty()) {         // pass 2 on reversed G
    int u = stack.pop();             // highest finish first
    if (seen2.contains(u)) continue;
    comp = new ArrayList<>(); dfs2(u);
    sccs.add(comp);                  // one whole SCC
  }
  return sccs;
}
void dfs1(int u) {
  seen1.add(u);
  for (int v : adj.get(u)) if (!seen1.contains(v)) dfs1(v);
  stack.push(u);                     // u FINISHED — push last
}
void dfs2(int u) {
  seen2.add(u); comp.add(u);         // u joins current SCC
  for (int v : radj.get(u)) if (!seen2.contains(v)) dfs2(v);
}`,
  inputs: [],
  entry: () => `kosaraju()`,
  run({ fn, heap, line, narrate }) {
    const seen1 = new Set<number>()
    const seen2 = new Set<number>()
    const stack: number[] = []
    const sccs: number[][] = []
    let comp: number[] = []
    const dfs1 = fn(
      "dfs1",
      (u: number): string => {
        line(13, `Pass 1: visit ${u} on the ORIGINAL graph.`)
        seen1.add(u)
        for (const v of ADJ[u]) {
          if (!seen1.has(v)) {
            line(14, `Edge ${u}→${v}: unseen — go deeper before finishing ${u}.`)
            dfs1(v)
          } else {
            line(14, `Edge ${u}→${v}: ${v} already seen — skip.`)
          }
        }
        stack.push(u)
        heap("finishStack", stack)
        line(15, `${u} is <b>finished</b> (all its descendants done) — push it. Later finish = higher on the stack.`)
        return `fin ${u}`
      },
      12,
    )
    const dfs2 = fn(
      "dfs2",
      (u: number): string => {
        seen2.add(u)
        comp.push(u)
        heap("components", [...sccs, comp])
        line(18, `Pass 2: ${u} joins the current SCC {${comp.join(",")}}.`)
        for (const v of RADJ[u]) {
          if (!seen2.has(v)) {
            line(19, `Reversed edge ${u}→${v}: reachable both ways → same SCC. Recurse.`)
            dfs2(v)
          } else {
            line(19, `Reversed edge ${u}→${v}: ${v} already assigned — skip.`)
          }
        }
        return `in scc`
      },
      17,
    )
    const kosaraju = fn(
      "kosaraju",
      (): string => {
        for (let u = 0; u < 5; u++) {
          if (!seen1.has(u)) {
            line(3, `Pass 1 from ${u}: run dfs1 on the original graph to compute finish times.`)
            dfs1(u)
          }
        }
        line(4, `Finish stack (top→bottom): [${[...stack].reverse().join(",")}]. Now flip every edge and pop.`)
        while (stack.length > 0) {
          const u = stack.pop() as number
          heap("finishStack", stack)
          if (seen2.has(u)) {
            line(6, `Pop ${u} — already placed in an SCC, skip.`)
            continue
          }
          line(7, `Pop ${u} (latest unclaimed finisher). On the <b>reversed</b> graph, dfs2(${u}) can only reach nodes that also reach ${u} — exactly ${u}'s SCC.`)
          comp = []
          dfs2(u)
          sccs.push(comp)
          heap("components", sccs)
          line(8, `SCC complete: {${comp.join(",")}} — dfs2 was trapped inside it.`)
        }
        line(10, `Done: ${sccs.length} strongly connected components — ${sccs.map((c) => `{${c.join(",")}}`).join(" and ")}.`)
        return JSON.stringify(sccs)
      },
      1,
    )
    narrate(`Kosaraju in two passes: (1) DFS records finish order, (2) DFS on the TRANSPOSED graph, popping latest finishers first — each pass-2 DFS cannot escape its own SCC because all outgoing edges now point backwards.`)
    heap("finishStack", stack)
    heap("components", sccs)
    return kosaraju()
  },
}
