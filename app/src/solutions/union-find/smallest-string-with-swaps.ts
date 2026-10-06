import type { SolutionDef } from "@/engine/types"

// str1 = "dcab", str2 = "ab"
// pairs: (0,3) d↔b, (1,2) c↔a  → swap d↔b and c↔a → "bacd" → sort → "abcd"
const STR1 = "dcab"
const STR2 = "ab"
const PAIRS: [number, number][] = [[0, 3], [1, 2]]

export const smallestStringWithSwaps: SolutionDef = {
  view: "array",
  array: () => STR1.split(""),
  code: `function smallestStringWithSwaps(s, pairs) {
  // union all swappable indices
  for (const [a, b] of pairs) union(a, b);
  // group indices by root
  const groups = new Map();
  for (let i = 0; i < s.length; i++) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(i);
  }
  // sort each group's chars and place them back
  const res = [...s];
  for (const indices of groups.values()) {
    const chars = indices.map(i => s[i]).sort();
    indices.sort((a,b) => a-b);
    for (let k = 0; k < indices.length; k++)
      res[indices[k]] = chars[k];
  }
  return res.join('');
}`,
  codeJava: `String smallestStringWithSwaps(String s, List<List<Integer>> pairs) {
  for (List<Integer> p : pairs) union(p.get(0), p.get(1));
  Map<Integer,List<Integer>> groups = new HashMap<>();
  for (int i = 0; i < s.length(); i++) {
    int r = find(i);
    groups.computeIfAbsent(r, k -> new ArrayList<>()).add(i);
  }
  char[] res = s.toCharArray();
  for (List<Integer> indices : groups.values()) {
    char[] chars = new char[indices.size()];
    for (int k = 0; k < indices.size(); k++) chars[k] = s.charAt(indices.get(k));
    Arrays.sort(chars); Collections.sort(indices);
    for (int k = 0; k < indices.size(); k++) res[indices.get(k)] = chars[k];
  }
  return new String(res);
}`,
  inputs: [],
  entry: () => `smallestStringWithSwaps("${STR1}", pairs)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const n = STR1.length
    const parent = Array.from({ length: n }, (_, i) => i)
    const find = fn("find", (x: number): number => {
      if (parent[x] !== x) { parent[x] = find(parent[x]); }
      return parent[x]
    }, 0)
    const unionFn = fn("union", (a: number, b: number): void => {
      const ra = find(a), rb = find(b)
      if (ra !== rb) parent[rb] = ra
    }, 0)
    const go = fn("smallestStringWithSwaps", (): string => {
      line(1, `Union all swappable index pairs — indices in the same component can be freely rearranged.`)
      for (const [a, b] of PAIRS) {
        mark("focus", [a, b])
        vars({ pair: `(${a},${b})` })
        line(2, `union(${a}, ${b}): indices '${STR1[a]}' and '${STR1[b]}' can swap.`)
        unionFn(a, b)
        heap("parent", [...parent])
      }
      mark("focus", [])
      line(4, `Group indices by root — each group's characters can be sorted independently.`)
      const groups = new Map<number, number[]>()
      for (let i = 0; i < n; i++) {
        const r = find(i)
        if (!groups.has(r)) groups.set(r, [])
        groups.get(r)!.push(i)
      }
      heap("groups", Object.fromEntries([...groups.entries()].map(([r, idxs]) => [r, idxs.map(i => STR1[i]).join("")])))
      const res = STR1.split("")
      for (const indices of groups.values()) {
        const chars = indices.map(i => STR1[i]).sort()
        indices.sort((a, b) => a - b)
        for (let k = 0; k < indices.length; k++) {
          res[indices[k]] = chars[k]
          aset(indices[k], chars[k])
        }
        mark("good", indices)
        line(13, `Sorted chars [${chars.join("")}] placed at indices [${indices.join(",")}].`)
      }
      const answer = res.join("")
      line(16, `Result: <b>"${answer}"</b> — lexicographically smallest achievable string.`)
      return answer
    }, 0)
    narrate("Swappable indices form equivalence classes via union-find. Within each class, sort the characters and place them back in sorted index order.")
    return go()
  },
}
