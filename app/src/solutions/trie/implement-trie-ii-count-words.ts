import type { SolutionDef } from "@/engine/types"

export const implementTrieII: SolutionDef = {
  code: `// memo[p] = words passing prefix p;  memo[w+"$"] = copies of w
function insert(done, rest) {
  if (rest === "") { memo[done + "$"] = (memo[done + "$"] || 0) + 1; return; }
  const next = done + rest[0];
  memo[next] = (memo[next] || 0) + 1;  // one more word through this node
  insert(next, rest.slice(1));
}
function countEqual(w)  { return memo[w + "$"] || 0; }
function countPrefix(p) { return memo[p] || 0; }`,
  codeJava: `// memo: prefix → pass count;  w+"$" → copies of word w
void insert(String done, String rest) {
  if (rest.isEmpty()) { memo.merge(done + "$", 1, Integer::sum); return; }
  String next = done + rest.charAt(0);
  memo.merge(next, 1, Integer::sum);
  insert(next, rest.substring(1));
}
int countEqual(String w)  { return memo.getOrDefault(w + "$", 0); }
int countPrefix(String p) { return memo.getOrDefault(p, 0); }`,
  inputs: [
    { kind: "string", name: "words", label: "words (comma-sep)", default: "app,app,ape", maxLen: 14 },
    { kind: "string", name: "word", label: "countEqual word", default: "app", maxLen: 5 },
    { kind: "string", name: "prefix", label: "countPrefix prefix", default: "ap", maxLen: 5 },
  ],
  entry: (a) => `Trie("${a.words}")`,
  run({ fn, memo, line, heap, vars, narrate }, args) {
    const words = (args.words as string)
      .split(/[,\s]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((w) => w.slice(0, 5))
    const word = (args.word as string).trim().slice(0, 5) || "app"
    const prefix = (args.prefix as string).trim().slice(0, 5) || "ap"

    // shadow counters so incrementing doesn't spam auto-traced memo reads
    const counts: Record<string, number> = {}
    const bump = (k: string): number => {
      counts[k] = (counts[k] || 0) + 1
      memo[k] = counts[k]
      return counts[k]
    }

    const ins = fn(
      "ins",
      (done: string, rest: string): string => {
        if (rest === "") {
          line(2, `End of "${done}" — bump the <b>end-marker counter</b> '${done}$'.`)
          bump(done + "$")
          return "end ✓"
        }
        const next = done + rest[0]
        line(4, `Node '${next}': one more word flows through it → count becomes ${(counts[next] || 0) + 1}.`)
        bump(next)
        ins(next, rest.slice(1))
        return "✓"
      },
      1,
    )

    const countEqual = fn(
      "countEqual",
      (w: string): number => {
        line(7, `countWordsEqualTo("${w}") — just read the end-marker counter '${w}$'.`)
        const v = memo[w + "$"]
        if (v === undefined) {
          line(7, `No end marker '${w}$' — "${w}" was never inserted → <b>0</b>.`)
          return 0
        }
        return v as number
      },
      7,
    )

    const countPrefix = fn(
      "countPrefix",
      (p: string): number => {
        line(8, `countWordsStartingWith("${p}") — the pass-through counter at node '${p}' was precomputed by the inserts.`)
        const v = memo[p]
        if (v === undefined) {
          line(8, `No node '${p}' exists — no word starts this way → <b>0</b>.`)
          return 0
        }
        return v as number
      },
      8,
    )

    const root = fn(
      "Trie",
      (_ws: string): string => {
        narrate("Trie II: every node carries a counter. Each insert +1's its whole path, so count queries are answered by a single read — no scanning.")
        heap("words", words)
        for (const w of words) {
          line(1, `<b>insert("${w}")</b> — +1 every node on its character path.`)
          ins("", w)
        }
        const eq = countEqual(word)
        const pre = countPrefix(prefix)
        vars({ equal: eq, prefix: pre })
        return `equal("${word}")=${eq}, prefix("${prefix}")=${pre}`
      },
      0,
    )
    return root(args.words as string)
  },
}
