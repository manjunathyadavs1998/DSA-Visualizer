import type { SolutionDef } from "@/engine/types"

export const partitionLabels: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string)],
  code: `// grow the window's end to each char's LAST occurrence
function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const sizes = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {              // nothing in the window reaches past i
      sizes.push(i - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}`,
  codeJava: `// grow the window's end to each char's LAST occurrence
List<Integer> partitionLabels(String s) {
  int[] last = new int[26];
  for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
  List<Integer> sizes = new ArrayList<>();
  int start = 0, end = 0;
  for (int i = 0; i < s.length(); i++) {
    end = Math.max(end, last[s.charAt(i) - 'a']);
    if (i == end) {               // nothing in the window reaches past i
      sizes.add(i - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "ababcbacadefeg", maxLen: 14 }],
  entry: (a) => `partitionLabels("${a.s}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = args.s as string
    const go = fn(
      "partitionLabels",
      (): string => {
        const last: Record<string, number> = {}
        for (let i = 0; i < s.length; i++) last[s[i]] = i
        heap("last", last)
        line(3, `One pass records each letter's <b>last</b> index: ${Object.entries(last).map(([c, i]) => `${c}→${i}`).join(", ")}.`)
        const sizes: number[] = []
        heap("sizes", sizes)
        let start = 0
        let end = 0
        ptr("start", 0)
        line(5, `A partition can close only when no letter inside it appears again later. Track that as a running <b>end</b>.`)
        for (let i = 0; i < s.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          const reach = last[s[i]]
          if (reach > end) {
            end = reach
            ptr("end", end)
            mark("window", Array.from({ length: end - start + 1 }, (_, x) => start + x))
            line(7, `'${s[i]}' appears again at index ${reach} → the partition must stretch: end = <b>${end}</b>.`)
          } else {
            line(7, `'${s[i]}' last appears at ${reach} ≤ end ${end} — no stretch needed.`)
          }
          if (i === end) {
            sizes.push(i - start + 1)
            heap("sizes", sizes)
            mark("good", Array.from({ length: i - start + 1 }, (_, x) => start + x))
            line(9, `i = end = ${i}: no letter escapes → <b>close</b> the partition "${s.slice(start, i + 1)}" (size <b>${i - start + 1}</b>).`)
            start = i + 1
            ptr("start", start < s.length ? start : -1)
            line(10, `Next partition starts at ${start}.`)
          }
          vars({ i, start, end })
        }
        mark("focus", [])
        mark("window", [])
        ptr("i", -1)
        ptr("end", -1)
        line(13, `Greedy gives the most, smallest partitions: sizes = [<b>${sizes.join(", ")}</b>].`)
        return `[${sizes.join(",")}]`
      },
      1,
    )
    return go()
  },
}
