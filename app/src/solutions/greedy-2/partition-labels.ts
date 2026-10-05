import type { SolutionDef } from "@/engine/types"

const sanitize = (s: string): string => {
  const t = s.toLowerCase().replace(/[^a-z]/g, "").slice(0, 14)
  return t.length ? t : "ababcbacadefeg"
}

export const partitionLabels: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.s as string).split(""),
  code: `// a letter's part must stretch to its LAST occurrence
function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const sizes = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {       // nothing inside points past i
      sizes.push(i - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}`,
  codeJava: `// a letter's part must stretch to its LAST occurrence
List<Integer> partitionLabels(String s) {
  int[] last = new int[26];
  for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
  List<Integer> sizes = new ArrayList<>();
  int start = 0, end = 0;
  for (int i = 0; i < s.length(); i++) {
    end = Math.max(end, last[s.charAt(i) - 'a']);
    if (i == end) {        // nothing inside points past i
      sizes.add(i - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s (lowercase letters)", default: "ababcbacadefeg", maxLen: 14 },
  ],
  entry: (a) => `partitionLabels("${sanitize(a.s as string)}")`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const s = sanitize(args.s as string)
    const solve = fn(
      "partitionLabels",
      (): string => {
        const last: Record<string, number> = {}
        for (let i = 0; i < s.length; i++) last[s[i]] = i
        heap("last", last)
        line(3, `Pass 1: record each letter's <b>last</b> index — ${Object.entries(last).map(([c, i]) => `${c}:${i}`).join(" ")}.`)
        const sizes: number[] = []
        let start = 0
        let end = 0
        heap("sizes", sizes)
        vars({ start, end })
        line(5, `Pass 2: grow a window; it can only close once we pass every letter's last occurrence.`)
        for (let i = 0; i < s.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: i - start + 1 }, (_, k) => start + k))
          const grew = last[s[i]] > end
          end = Math.max(end, last[s[i]])
          ptr("end", end)
          vars({ start, end })
          line(7, `'${s[i]}' last appears at ${last[s[i]]} → ${grew ? `the part must stretch: end = <b>${end}</b>` : `end stays ${end}`}.`)
          if (i === end) {
            sizes.push(i - start + 1)
            heap("sizes", [...sizes])
            mark("good", Array.from({ length: i - start + 1 }, (_, k) => start + k))
            line(9, `i = end = ${i}: no letter inside points past here → <b>cut!</b> Part "${s.slice(start, i + 1)}" has size <b>${i - start + 1}</b>.`)
            start = i + 1
            vars({ start, end })
            line(10, `Next part starts fresh at index ${start}.`)
          }
        }
        ptr("i", -1)
        ptr("end", -1)
        mark("focus", [])
        mark("window", [])
        line(13, `Partition sizes: <b>[${sizes.join(",")}]</b> — each letter lives in exactly one part.`)
        return `[${sizes.join(",")}]`
      },
      1,
    )
    narrate(`The greedy cut point is forced: a part is closable exactly when the scan index reaches the max "last occurrence" seen inside it.`)
    return solve()
  },
}
