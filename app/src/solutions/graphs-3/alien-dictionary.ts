import type { SolutionDef } from "@/engine/types"

// Alien dictionary: words in sorted order → derive character ordering
// words: ["wrt","wrf","er","ett","rftt"]
// edges: t→f, w→e, r→t, e→r  → order: w,e,r,t,f
const WORDS = ["wrt", "wrf", "er", "ett", "rftt"]

export const alienDictionary: SolutionDef = {
  view: "array",
  array: () => [0, 0, 0, 0, 0],  // indegree of each unique char (w,e,r,t,f)
  code: `function alienOrder(words) {
  const chars = [...new Set(words.join(''))];
  const indeg = Object.fromEntries(chars.map(c => [c, 0]));
  const adj = Object.fromEntries(chars.map(c => [c, []]));
  // compare adjacent words to extract ordering edges
  for (let i = 0; i < words.length - 1; i++) {
    const [a, b] = [words[i], words[i+1]];
    const len = Math.min(a.length, b.length);
    for (let j = 0; j < len; j++) {
      if (a[j] !== b[j]) {
        adj[a[j]].push(b[j]);
        indeg[b[j]]++;
        break;  // only first differing char matters
      }
    }
  }
  // topological sort (Kahn's)
  const queue = chars.filter(c => indeg[c] === 0);
  const order = [];
  while (queue.length) {
    const c = queue.shift();
    order.push(c);
    for (const next of adj[c]) {
      if (--indeg[next] === 0) queue.push(next);
    }
  }
  return order.length === chars.length ? order.join('') : '';
}`,
  codeJava: `String alienOrder(String[] words) {
  Map<Character,Integer> indeg = new HashMap<>();
  Map<Character,List<Character>> adj = new HashMap<>();
  for (String w : words) for (char c : w.toCharArray()) {
    indeg.putIfAbsent(c, 0); adj.putIfAbsent(c, new ArrayList<>());
  }
  for (int i = 0; i < words.length-1; i++) {
    String a=words[i], b=words[i+1];
    for (int j=0; j<Math.min(a.length(),b.length()); j++) {
      if (a.charAt(j)!=b.charAt(j)) {
        adj.get(a.charAt(j)).add(b.charAt(j));
        indeg.merge(b.charAt(j),1,Integer::sum); break;
      }
    }
  }
  Queue<Character> q = new LinkedList<>();
  for (char c : indeg.keySet()) if (indeg.get(c)==0) q.add(c);
  StringBuilder sb = new StringBuilder();
  while (!q.isEmpty()) {
    char c = q.poll(); sb.append(c);
    for (char next : adj.get(c))
      if (--indeg.get(next)==0) q.add(next);
  }
  return sb.length()==indeg.size() ? sb.toString() : "";
}`,
  inputs: [],
  entry: () => `alienOrder(["wrt","wrf","er","ett","rftt"])`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const go = fn("alienOrder", (): string => {
      const chars = [...new Set(WORDS.join(""))]
      const charIdx = Object.fromEntries(chars.map((c, i) => [c, i]))
      const indeg: Record<string, number> = Object.fromEntries(chars.map(c => [c, 0]))
      const adj: Record<string, string[]> = Object.fromEntries(chars.map(c => [c, []]))
      heap("chars", chars)
      line(1, `Unique chars: [${chars.join(",")}]. Compare adjacent words to extract ordering edges.`)
      for (let i = 0; i < WORDS.length - 1; i++) {
        const [a, b] = [WORDS[i], WORDS[i + 1]]
        vars({ comparing: `"${a}" vs "${b}"` })
        const len = Math.min(a.length, b.length)
        for (let j = 0; j < len; j++) {
          if (a[j] !== b[j]) {
            adj[a[j]].push(b[j])
            indeg[b[j]]++
            aset(charIdx[b[j]], indeg[b[j]])
            mark("focus", [charIdx[a[j]], charIdx[b[j]]])
            heap("edges", Object.fromEntries(Object.entries(adj).filter(([, v]) => v.length > 0)))
            line(9, `'${a[j]}' → '${b[j]}' (first diff at pos ${j}). indeg['${b[j]}']=${indeg[b[j]]}.`)
            break
          }
        }
      }
      mark("focus", [])
      line(15, `Kahn's topological sort on the character DAG.`)
      const queue = chars.filter(c => indeg[c] === 0)
      const order: string[] = []
      heap("queue", [...queue])
      while (queue.length > 0) {
        const c = queue.shift()!
        order.push(c)
        mark("good", order.map(ch => charIdx[ch]))
        vars({ processing: c, order: order.join("") })
        line(18, `Take '${c}' (indeg=0). Order so far: "${order.join("")}".`)
        for (const next of adj[c]) {
          indeg[next]--
          aset(charIdx[next], indeg[next])
          if (indeg[next] === 0) {
            queue.push(next)
            heap("queue", [...queue])
            line(20, `'${c}' → '${next}': indeg['${next}'] hits 0 — enqueue.`)
          }
        }
      }
      const result = order.length === chars.length ? order.join("") : ""
      line(23, order.length === chars.length
        ? `Alien alphabet order: <b>"${result}"</b>.`
        : `Cycle detected — no valid ordering.`)
      return result
    }, 0)
    narrate("Extract ordering edges by comparing adjacent words. Then topological sort (Kahn's) on the character DAG gives the alien alphabet order.")
    return go()
  },
}
