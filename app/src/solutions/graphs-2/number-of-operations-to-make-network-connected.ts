import type { SolutionDef } from "@/engine/types"

// 6 computers; 5 cables: 0-1, 0-2, 1-2, 0-3, 1-3.
// Cluster {0,1,2,3} is over-wired (2 spare cables); 4 and 5 are offline.
// Answer: move 2 spare cables → 2 operations.
const N = 6
const CABLES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 3],
  [1, 3],
]

export const makeNetworkConnected: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// 6 computers; cables 0-1, 0-2, 1-2, 0-3, 1-3
function makeConnected(n, cables) {
  if (cables.length < n - 1) return -1; // not enough cables, ever
  let components = n, spare = 0;
  for (const [a, b] of cables) {
    const ra = find(a), rb = find(b);
    if (ra === rb) { spare++; continue; } // redundant → movable
    parent[rb] = ra;                      // union
    components--;
  }
  return components - 1;    // one spare cable per missing link
}
function find(x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// 6 computers; cables 0-1, 0-2, 1-2, 0-3, 1-3
int makeConnected(int n, int[][] cables) {
  if (cables.length < n - 1) return -1; // not enough cables, ever
  int components = n, spare = 0;
  for (int[] e : cables) {
    int ra = find(e[0]), rb = find(e[1]);
    if (ra == rb) { spare++; continue; }  // redundant → movable
    parent[rb] = ra;                      // union
    components--;
  }
  return components - 1;    // one spare cable per missing link
}
int find(int x) {
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [],
  entry: () => `makeConnected(6, [0-1, 0-2, 1-2, 0-3, 1-3])`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(13, `find(${x}): parent[${cur}] = ${parent[cur]} — climb.`)
          cur = parent[cur]
        }
        line(14, `find(${x}) = <b>${cur}</b>.`)
        return cur
      },
      12,
    )
    const go = fn(
      "makeConnected",
      (): number => {
        line(2, `${CABLES.length} cables for ${N} computers: a spanning network needs ${N - 1}. ${CABLES.length} ≥ ${N - 1} → <b>possible</b>, keep going.`)
        let components = N
        let spare = 0
        const spares: string[] = []
        vars({ components, spare })
        line(3, `Start: <b>${N}</b> isolated machines (parent[i] = i below). Count components and spare cables in one pass.`)
        for (const [a, b] of CABLES) {
          mark("focus", [a, b])
          line(5, `Cable ${a}-${b}: are its ends already in the same cluster?`)
          const ra = find(a)
          const rb = find(b)
          if (ra === rb) {
            spare++
            spares.push(`${a}-${b}`)
            heap("spareCables", spares)
            mark("bad", [a, b])
            vars({ components, spare })
            line(6, `Yes — both roots are ${ra}. Cable ${a}-${b} is <b>redundant</b>: unplug it later. spare = <b>${spare}</b>.`)
            continue
          }
          parent[rb] = ra
          aset(rb, ra)
          components--
          vars({ components, spare })
          line(7, `Roots ${ra} ≠ ${rb} — this cable does real work. Union: parent[${rb}] = ${ra} → <b>${components}</b> clusters left.`)
        }
        mark("focus", [])
        const ops = components - 1
        mark("good", parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0))
        line(10, `${components} clusters remain (roots in green) and ${spare} spare cable${spare === 1 ? "" : "s"} — move <b>${ops}</b> of them to stitch everything together.`)
        return ops
      },
      1,
    )
    narrate(`Key counting fact: k components need exactly k−1 extra links, and the early length check guarantees enough redundant cables exist to supply them.`)
    return go()
  },
}
