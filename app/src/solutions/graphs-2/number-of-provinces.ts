import type { SolutionDef } from "@/engine/types"

// 6 cities, 3 roads: 0-1, 1-2, 3-4  →  provinces {0,1,2} {3,4} {5}
const N = 6
const ROADS: [number, number][] = [
  [0, 1],
  [1, 2],
  [3, 4],
]

export const numberOfProvinces: SolutionDef = {
  view: "array",
  // the array below IS the union-find parent[] table — watch it mutate
  array: () => Array.from({ length: N }, (_, i) => i),
  code: `// 6 cities; roads: 0-1, 1-2, 3-4 → provinces {0,1,2} {3,4} {5}
function countProvinces() {
  let provinces = n;                  // every city starts alone
  for (const [a, b] of roads) {
    const ra = find(a), rb = find(b);
    if (ra === rb) continue;          // already one province
    parent[rb] = ra;                  // union: rb's tree joins ra
    provinces--;                      // two groups became one
  }
  return provinces;
}
function find(x) {                    // walk up to the root
  while (parent[x] !== x) x = parent[x];
  return x;
}`,
  codeJava: `// 6 cities; roads: 0-1, 1-2, 3-4 → provinces {0,1,2} {3,4} {5}
int countProvinces() {
  int provinces = n;                  // every city starts alone
  for (int[] r : roads) {
    int ra = find(r[0]), rb = find(r[1]);
    if (ra == rb) continue;           // already one province
    parent[rb] = ra;                  // union: rb's tree joins ra
    provinces--;                      // two groups became one
  }
  return provinces;
}
int find(int x) {                     // walk up to the root
  while (parent[x] != x) x = parent[x];
  return x;
}`,
  inputs: [],
  entry: () => `countProvinces()  // 6 cities, roads 0-1, 1-2, 3-4`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const parent = Array.from({ length: N }, (_, i) => i)
    const find = fn(
      "find",
      (x: number): number => {
        let cur = x
        while (parent[cur] !== cur) {
          line(12, `find(${x}): parent[${cur}] = ${parent[cur]} — not a root, climb one level up.`)
          cur = parent[cur]
        }
        line(13, `find(${x}) = <b>${cur}</b> — parent[${cur}] = ${cur}, so ${cur} is the root of this province.`)
        return cur
      },
      11,
    )
    const go = fn(
      "countProvinces",
      (): number => {
        let provinces = N
        const merged: string[] = []
        vars({ provinces })
        line(2, `parent[i] = i for all ${N} cities (the array below) — <b>${N}</b> one-city provinces to start.`)
        for (const [a, b] of ROADS) {
          mark("focus", [a, b])
          line(4, `Road ${a}-${b}: whose provinces are these? Find the root of each side.`)
          const ra = find(a)
          const rb = find(b)
          vars({ provinces, road: `${a}-${b}`, ra, rb })
          if (ra === rb) {
            mark("bad", [a, b])
            line(5, `Both roots are ${ra} — ${a} and ${b} were <b>already merged</b> by earlier roads. Nothing to do.`)
            continue
          }
          parent[rb] = ra
          aset(rb, ra)
          provinces--
          vars({ provinces, road: `${a}-${b}`, ra, rb })
          line(6, `Roots differ (${ra} ≠ ${rb}) — <b>union</b>: parent[${rb}] = ${ra}. Watch cell ${rb} change below.`)
          merged.push(`${a}-${b}`)
          heap("merged", merged)
          line(7, `Two provinces fused into one → <b>${provinces}</b> remain.`)
        }
        mark("focus", [])
        mark("good", parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0))
        line(9, `Roads exhausted. The roots left standing (green) each head one province → <b>${provinces}</b>.`)
        return provinces
      },
      1,
    )
    narrate(`Union-Find in one sentence: parent[] stores a forest; find() walks to a tree's root, union() hangs one root under another. Provinces = trees left.`)
    return go()
  },
}
