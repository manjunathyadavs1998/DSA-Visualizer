import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): string => {
  const s = (a.s as string).replace(/\s/g, "")
  return s.length ? s : "tree"
}

export const sortCharactersByFrequency: SolutionDef = {
  view: "array",
  array: (a) => clean(a).split(""),
  code: `// count every char, then pop the most frequent first
function frequencySort(s) {
  const count = new Map();
  for (const ch of s)
    count.set(ch, (count.get(ch) || 0) + 1);
  const pq = new MaxHeap((a, b) => b[0] - a[0]);
  for (const [ch, f] of count)
    pq.push([f, ch]);                // heavier letters rise
  let out = "";
  while (!pq.isEmpty()) {
    const [f, ch] = pq.pop();        // most frequent remaining
    out += ch.repeat(f);             // all its copies, together
  }
  return out;
}`,
  codeJava: `// count every char, then pop the most frequent first
String frequencySort(String s) {
  Map<Character, Integer> count = new HashMap<>();
  for (char ch : s.toCharArray())
    count.merge(ch, 1, Integer::sum);
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
  for (var e : count.entrySet())
    pq.offer(new int[]{e.getValue(), e.getKey()});
  StringBuilder out = new StringBuilder();
  while (!pq.isEmpty()) {
    int[] top = pq.poll();           // most frequent remaining
    out.append(String.valueOf((char) top[1]).repeat(top[0]));
  }
  return out.toString();
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "tweettreat", maxLen: 14 },
  ],
  entry: (a) => `frequencySort("${clean(a)}")`,
  run({ fn, line, mark, vars, heap, narrate }, args) {
    const s = clean(args)
    const go = fn(
      "frequencySort",
      (): string => {
        const count = new Map<string, number>()
        for (let i = 0; i < s.length; i++) {
          mark("focus", [i])
          count.set(s[i], (count.get(s[i]) || 0) + 1)
          if (i === s.length - 1 || i === 0)
            line(4, `Counting pass: '${s[i]}' → ${count.get(s[i])}. ${i === s.length - 1 ? `Final counts: {${[...count].map(([c, f]) => `${c}:${f}`).join(", ")}}.` : "…"}`)
        }
        mark("focus", [])
        heap("counts", Object.fromEntries(count))
        // max-heap simulated as an array sorted by frequency DESCENDING
        const pq: [number, string][] = []
        for (const [ch, f] of count) {
          let p = 0
          while (p < pq.length && pq[p][0] > f) p++
          pq.splice(p, 0, [f, ch])
          heap("pq", pq.map(([f2, c2]) => `'${c2}' ×${f2}`))
          line(7, `push(('${ch}', ${f})) — sifts up by frequency. Heap: [${pq.map(([f2, c2]) => `${c2}:${f2}`).join(", ")}].`)
        }
        let out = ""
        line(8, `Heap built from ${pq.length} distinct letters. Now drain it, biggest count first.`)
        while (pq.length) {
          const [f, ch] = pq.shift() as [number, string]
          heap("pq", pq.map(([f2, c2]) => `'${c2}' ×${f2}`))
          const idxs = s.split("").map((c, i) => (c === ch ? i : -1)).filter((i) => i >= 0)
          mark("focus", idxs)
          line(10, `pop() → '<b>${ch}</b>' ×${f} — the most frequent letter left.`)
          out += ch.repeat(f)
          heap("output", out)
          vars({ popped: `'${ch}'`, freq: f, out })
          line(11, `Append all ${f} copies at once → out = "<b>${out}</b>". Equal letters MUST be adjacent, so this is safe.`)
        }
        mark("focus", [])
        mark("good", s.split("").map((_, i) => i))
        line(13, `All letters placed: "<b>${out}</b>". Counting O(n) + heap O(u log u) over u distinct letters.`)
        return out
      },
      1,
    )
    narrate("Two phases: a hash map turns the string into (letter, count) piles, then a max-heap empties the piles biggest-first.")
    return go()
  },
}
