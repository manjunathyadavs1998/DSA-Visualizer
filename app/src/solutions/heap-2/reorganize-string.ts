import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): string => {
  const s = (a.s as string).toLowerCase().replace(/[^a-z]/g, "")
  return s.length ? s : "aaabbc"
}

export const reorganizeString: SolutionDef = {
  code: `// most-frequent-first, but never the same letter twice in a row
function reorganizeString(s) {
  const count = new Map();
  for (const ch of s)
    count.set(ch, (count.get(ch) || 0) + 1);
  const pq = new MaxHeap();          // (remaining, letter)
  for (const [ch, c] of count) pq.push([c, ch]);
  let out = "";
  while (!pq.isEmpty()) {
    let [c, ch] = pq.pop();          // most frequent letter
    if (out.endsWith(ch)) {          // would repeat — use runner-up
      if (pq.isEmpty()) return "";   // no alternative → impossible
      const [c2, ch2] = pq.pop();
      out += ch2;
      if (c2 - 1 > 0) pq.push([c2 - 1, ch2]);
      pq.push([c, ch]);              // leader returns untouched
    } else {
      out += ch;
      if (c - 1 > 0) pq.push([c - 1, ch]);
    }
  }
  return out;
}`,
  codeJava: `// most-frequent-first, but never the same letter twice in a row
String reorganizeString(String s) {
  Map<Character, Integer> count = new HashMap<>();
  for (char ch : s.toCharArray())
    count.merge(ch, 1, Integer::sum);
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
  for (var e : count.entrySet()) pq.offer(new int[]{e.getValue(), e.getKey()});
  StringBuilder out = new StringBuilder();
  while (!pq.isEmpty()) {
    int[] top = pq.poll();           // most frequent letter
    if (out.length() > 0 && out.charAt(out.length() - 1) == top[1]) {
      if (pq.isEmpty()) return "";   // no alternative → impossible
      int[] second = pq.poll();
      out.append((char) second[1]);
      if (second[0] > 1) pq.offer(new int[]{second[0] - 1, second[1]});
      pq.offer(top);                 // leader returns untouched
    } else {
      out.append((char) top[1]);
      if (top[0] > 1) pq.offer(new int[]{top[0] - 1, top[1]});
    }
  }
  return out.toString();
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "aaabbc", maxLen: 12 },
  ],
  entry: (a) => `reorganizeString("${clean(a)}")`,
  run({ fn, line, vars, heap, narrate }, args) {
    const s = clean(args)
    const show = (pq: [number, string][]) => pq.map(([c, ch]) => `'${ch}' ×${c}`)
    const push = (pq: [number, string][], item: [number, string]) => {
      let p = 0
      while (p < pq.length && pq[p][0] > item[0]) p++
      pq.splice(p, 0, item)
    }
    const go = fn(
      "reorganizeString",
      (): string => {
        const count = new Map<string, number>()
        for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1)
        heap("counts", Object.fromEntries(count))
        line(4, `Counts: {${[...count].map(([c, f]) => `${c}:${f}`).join(", ")}}. The most abundant letter is the dangerous one — it must be spread out.`)
        const pq: [number, string][] = []
        for (const [ch, c] of count) push(pq, [c, ch])
        heap("pq", show(pq))
        line(6, `Heapify into a max-heap by remaining count: [${show(pq).join(", ")}].`)
        let out = ""
        while (pq.length) {
          const [c, ch] = pq.shift() as [number, string]
          heap("pq", show(pq))
          line(9, `pop() → '<b>${ch}</b>' ×${c}, the most frequent letter left. out = "${out}".`)
          if (out.endsWith(ch)) {
            line(10, `"${out}" already ends with '<b>${ch}</b>' — placing it again would make "${ch}${ch}". Fall back to the runner-up.`)
            if (!pq.length) {
              heap("output", "(impossible)")
              line(11, `No other letter is available — '<b>${ch}</b>' has more copies than the remaining slots can separate. Return <b>""</b>.`)
              return ""
            }
            const [c2, ch2] = pq.shift() as [number, string]
            heap("pq", show(pq))
            line(12, `pop() → runner-up '<b>${ch2}</b>' ×${c2}.`)
            out += ch2
            heap("output", out)
            line(13, `Place it: out = "<b>${out}</b>".`)
            if (c2 - 1 > 0) {
              push(pq, [c2 - 1, ch2])
              heap("pq", show(pq))
              line(14, `'${ch2}' has ${c2 - 1} left → push it back.`)
            }
            push(pq, [c, ch])
            heap("pq", show(pq))
            vars({ out, blocked: `'${ch}'` })
            line(15, `The blocked leader '<b>${ch}</b>' ×${c} returns to the heap untouched — it gets first pick next round.`)
          } else {
            out += ch
            heap("output", out)
            line(17, `Safe to place: out = "<b>${out}</b>".`)
            if (c - 1 > 0) {
              push(pq, [c - 1, ch])
              heap("pq", show(pq))
              line(18, `'${ch}' has ${c - 1} left → push it back (now competing with a smaller count).`)
            }
            vars({ out })
          }
        }
        line(21, `All letters placed with no two neighbors equal: "<b>${out}</b>".`)
        return out
      },
      1,
    )
    narrate("Always spending a copy of the biggest pile (or the runner-up when the biggest just played) keeps any letter from being forced into a double.")
    return go()
  },
}
