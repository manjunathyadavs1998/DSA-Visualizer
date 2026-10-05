import type { SolutionDef } from "@/engine/types"

export const implementTrie: SolutionDef = {
  code: `// insert every word, then answer the two queries
function insert(done, rest) {
  if (rest === "") { end.add(done); return; }  // mark word end
  const next = done + rest[0];
  if (!nodes.has(next)) nodes.add(next);       // create missing node
  insert(next, rest.slice(1));                 // walk down one char
}
function walk(done, rest) {
  if (rest === "") return true;                // whole path exists
  const next = done + rest[0];
  if (!nodes.has(next)) return false;          // path breaks here
  return walk(next, rest.slice(1));
}
// search(w) = walk("", w) && end.has(w);  startsWith(p) = walk("", p)`,
  codeJava: `// Set<String> nodes = trie paths; Set<String> end = word ends
void insert(String done, String rest) {
  if (rest.isEmpty()) { end.add(done); return; }
  String next = done + rest.charAt(0);
  if (!nodes.contains(next)) nodes.add(next);
  insert(next, rest.substring(1));
}
boolean walk(String done, String rest) {
  if (rest.isEmpty()) return true;
  String next = done + rest.charAt(0);
  if (!nodes.contains(next)) return false;
  return walk(next, rest.substring(1));
}
// search(w) = walk("", w) && end.contains(w);  startsWith(p) = walk("", p)`,
  inputs: [
    { kind: "string", name: "words", label: "words (comma-sep)", default: "cat,car,can", maxLen: 14 },
    { kind: "string", name: "query", label: "query", default: "ca", maxLen: 5 },
  ],
  entry: (a) => `Trie("${a.words}")`,
  run({ fn, line, heap, vars, narrate }, args) {
    const words = (args.words as string)
      .split(/[,\s]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((w) => w.slice(0, 5))
    const query = (args.query as string).trim().slice(0, 5) || "ca"
    const nodes = new Set<string>()
    const end = new Set<string>()

    const ins = fn(
      "ins",
      (done: string, rest: string): string => {
        if (rest === "") {
          line(2, `"${done}" fully inserted — mark this node as a <b>word end</b>.`)
          end.add(done)
          heap("wordEnds", [...end])
          return "end ✓"
        }
        const next = done + rest[0]
        if (nodes.has(next)) {
          line(4, `'${next}' <b>already exists</b> — walk it, don't rebuild. Shared prefixes are stored exactly once.`)
        } else {
          line(4, `No node '${next}' yet — <b>create it</b> as a child of '${done || "root"}'.`)
          nodes.add(next)
          heap("trie", [...nodes].sort())
        }
        ins(next, rest.slice(1))
        return "✓"
      },
      1,
    )

    const walk = fn(
      "walk",
      (done: string, rest: string): boolean => {
        if (rest === "") {
          line(8, `Query consumed — the path '${done}' exists in the trie.`)
          return true
        }
        const next = done + rest[0]
        if (!nodes.has(next)) {
          line(10, `<b>No node '${next}'</b> — the path breaks; nothing in the trie starts this way.`)
          return false
        }
        line(10, `Node '${next}' exists — keep walking.`)
        return walk(next, rest.slice(1))
      },
      7,
    )

    const root = fn(
      "Trie",
      (_ws: string): string => {
        narrate("A trie stores words as root-to-node paths — the call tree below IS the trie: each frame is one node.")
        heap("words", words)
        heap("trie", [])
        heap("wordEnds", [])
        for (const w of words) {
          line(1, `<b>insert("${w}")</b> — walk char by char from the root, reusing existing nodes.`)
          ins("", w)
        }
        line(13, `<b>search("${query}")</b>: the path must exist AND carry a word-end marker.`)
        const found = walk("", query)
        const isWord = found && end.has(query)
        line(
          13,
          !found
            ? `Path broke → search("${query}") = <b>false</b>.`
            : isWord
              ? `Path '${query}' exists and is a marked word end → search = <b>true</b>.`
              : `Path '${query}' exists but has <b>no end marker</b> — it's only a prefix → search = <b>false</b>.`,
        )
        line(13, `<b>startsWith("${query}")</b>: only the path needs to exist — no end marker required.`)
        const pre = walk("", query)
        vars({ search: isWord, startsWith: pre })
        return `search=${isWord}, startsWith=${pre}`
      },
      0,
    )
    // the root call is labeled with the raw input so entry() matches
    return root(args.words as string)
  },
}
