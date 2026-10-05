import type { SolutionDef } from "@/engine/types"

export const longestHappyString: SolutionDef = {
  code: `// biggest pile first — but never three in a row
function longestDiverseString(a, b, c) {
  const pq = new MaxHeap();            // (remaining, letter)
  if (a > 0) pq.push([a, "a"]);
  if (b > 0) pq.push([b, "b"]);
  if (c > 0) pq.push([c, "c"]);
  let out = "";
  while (!pq.isEmpty()) {
    const [n, ch] = pq.pop();          // most abundant letter
    if (out.endsWith(ch + ch)) {       // would make a triple
      if (pq.isEmpty()) break;         // no alternative — stop here
      const [n2, ch2] = pq.pop();      // use the runner-up once
      out += ch2;
      if (n2 - 1 > 0) pq.push([n2 - 1, ch2]);
      pq.push([n, ch]);                // leader goes back untouched
    } else {
      out += ch;
      if (n - 1 > 0) pq.push([n - 1, ch]);
    }
  }
  return out;
}`,
  codeJava: `// biggest pile first — but never three in a row
String longestDiverseString(int a, int b, int c) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> y[0] - x[0]);
  if (a > 0) pq.offer(new int[]{a, 'a'});
  if (b > 0) pq.offer(new int[]{b, 'b'});
  if (c > 0) pq.offer(new int[]{c, 'c'});
  StringBuilder out = new StringBuilder();
  while (!pq.isEmpty()) {
    int[] top = pq.poll();             // most abundant letter
    if (endsWithTwo(out, (char) top[1])) { // would make a triple
      if (pq.isEmpty()) break;         // no alternative — stop here
      int[] second = pq.poll();        // use the runner-up once
      out.append((char) second[1]);
      if (second[0] > 1) pq.offer(new int[]{second[0] - 1, second[1]});
      pq.offer(top);                   // leader goes back untouched
    } else {
      out.append((char) top[1]);
      if (top[0] > 1) pq.offer(new int[]{top[0] - 1, top[1]});
    }
  }
  return out.toString();
}`,
  inputs: [
    { kind: "number", name: "a", label: "count of 'a'", default: 1, min: 0, max: 7 },
    { kind: "number", name: "b", label: "count of 'b'", default: 1, min: 0, max: 7 },
    { kind: "number", name: "c", label: "count of 'c'", default: 7, min: 0, max: 7 },
  ],
  entry: (a) => `longestDiverseString(${a.a}, ${a.b}, ${a.c})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const a = Math.max(0, Math.min(7, Math.trunc(args.a as number)))
    const b = Math.max(0, Math.min(7, Math.trunc(args.b as number)))
    const c = Math.max(0, Math.min(7, Math.trunc(args.c as number)))
    const show = (pq: [number, string][]) => pq.map(([n, ch]) => `'${ch}' ×${n}`)
    const push = (pq: [number, string][], item: [number, string]) => {
      let p = 0
      while (p < pq.length && pq[p][0] > item[0]) p++
      pq.splice(p, 0, item)
    }
    const go = fn(
      "longestDiverseString",
      (): string => {
        const pq: [number, string][] = []
        if (a > 0) push(pq, [a, "a"])
        if (b > 0) push(pq, [b, "b"])
        if (c > 0) push(pq, [c, "c"])
        heap("pq", show(pq))
        line(5, `Seed the max-heap with the non-empty piles: [${show(pq).join(", ")}]. Spending from the biggest pile keeps it from being forced into a triple later.`)
        let out = ""
        while (pq.length) {
          const [n, ch] = pq.shift() as [number, string]
          heap("pq", show(pq))
          line(8, `pop() → '<b>${ch}</b>' ×${n} (most abundant). out = "${out}".`)
          if (out.endsWith(ch + ch)) {
            line(9, `"${out}" already ends with "<b>${ch}${ch}</b>" — a third '${ch}' is forbidden.`)
            if (!pq.length) {
              line(10, `No other letter remains → the string cannot be extended. Stop.`)
              break
            }
            const [n2, ch2] = pq.shift() as [number, string]
            heap("pq", show(pq))
            out += ch2
            heap("output", out)
            line(12, `Break the run with the runner-up: out += '<b>${ch2}</b>' → "${out}".`)
            if (n2 - 1 > 0) {
              push(pq, [n2 - 1, ch2])
              heap("pq", show(pq))
              line(13, `'${ch2}' has ${n2 - 1} left → back into the heap.`)
            }
            push(pq, [n, ch])
            heap("pq", show(pq))
            vars({ out, leader: `'${ch}' ×${n}` })
            line(14, `The leader '${ch}' ×${n} returns <b>untouched</b> — next round it is placeable again.`)
          } else {
            out += ch
            heap("output", out)
            line(16, `Safe: out += '<b>${ch}</b>' → "${out}".`)
            if (n - 1 > 0) {
              push(pq, [n - 1, ch])
              heap("pq", show(pq))
              line(17, `'${ch}' has ${n - 1} left → back into the heap.`)
            }
            vars({ out })
          }
        }
        line(20, `Longest happy string: "<b>${out}</b>" (length ${out.length} of ${a + b + c} available letters).`)
        return out
      },
      1,
    )
    narrate("Same engine as Reorganize String, but stopping early is allowed: when only the blocked leader remains, the answer simply ends.")
    return go()
  },
}
