import type { SolutionDef } from "@/engine/types"

export const distinctSubstrings: SolutionDef = {
  code: `// memo = set of trie nodes; each node = one distinct substring
function insert(done, rest) {
  if (rest === "") return;
  const next = done + rest[0];
  if (!memo[next]) { memo[next] = true; count++; }  // NEW node!
  insert(next, rest.slice(1));
}
// for every suffix: insert("", s.slice(i));  answer = count`,
  codeJava: `// seen: Set<String>; each trie node = one distinct substring
void insert(String done, String rest) {
  if (rest.isEmpty()) return;
  String next = done + rest.charAt(0);
  if (!seen.contains(next)) { seen.add(next); count++; }
  insert(next, rest.substring(1));
}
// for every suffix i: insert("", s.substring(i));  answer = count`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "abab", maxLen: 6 }],
  entry: (a) => `distinct("${a.s}")`,
  run({ fn, memo, line, heap, vars, narrate }, args) {
    const s = (args.s as string).trim().slice(0, 6)
    let count = 0

    const ins = fn(
      "ins",
      (done: string, rest: string): string => {
        if (rest === "") {
          line(2, `Suffix fully inserted — every prefix of it has been visited.`)
          return "✓"
        }
        const next = done + rest[0]
        if (memo[next] === undefined) {
          count++
          line(4, `'${next}' is a <b>brand-new trie node</b> → distinct substring #${count}.`)
          memo[next] = true
          vars({ count })
        } else {
          line(4, `'${next}' is already in the trie — substring seen before; keep walking, deeper prefixes may still be new.`)
        }
        ins(next, rest.slice(1))
        return "✓"
      },
      1,
    )

    const root = fn(
      "distinct",
      (_str: string): number => {
        narrate("Every substring is a prefix of some suffix. Insert all suffixes into one trie: duplicates merge onto existing paths, so each distinct substring creates exactly ONE node.")
        const sufs: string[] = []
        for (let i = 0; i < s.length; i++) sufs.push(s.slice(i))
        heap("suffixes", sufs)
        for (let i = 0; i < s.length; i++) {
          line(7, `insert suffix "${s.slice(i)}" — its prefixes are all substrings starting at index ${i}.`)
          ins("", s.slice(i))
        }
        vars({ count })
        line(7, `Every node was counted exactly once → <b>${count}</b> distinct substrings.`)
        return count
      },
      0,
    )
    return root(s)
  },
}
