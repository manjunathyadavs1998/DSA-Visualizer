import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const wordPattern: SolutionDef = {
  view: "array",
  array: (a) => [...(a.pattern as string).split(""), "|", ...(a.s as string).split("")],
  code: `// letter ↔ word must be a perfect bijection
function wordPattern(pattern, s) {
  const words = s.split(" ");
  if (words.length !== pattern.length) return false;
  const p2w = {}, w2p = {};
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i], w = words[i];
    if (p2w[c] !== undefined && p2w[c] !== w) return false;
    if (w2p[w] !== undefined && w2p[w] !== c) return false;
    p2w[c] = w;
    w2p[w] = c;
  }
  return true;
}`,
  codeJava: `// letter ↔ word must be a perfect bijection
boolean wordPattern(String pattern, String s) {
  String[] words = s.split(" ");
  if (words.length != pattern.length()) return false;
  Map<Character, String> p2w = new HashMap<>(); Map<String, Character> w2p = new HashMap<>();
  for (int i = 0; i < pattern.length(); i++) {
    char c = pattern.charAt(i); String w = words[i];
    if (p2w.containsKey(c) && !p2w.get(c).equals(w)) return false;
    if (w2p.containsKey(w) && w2p.get(w) != c) return false;
    p2w.put(c, w);
    w2p.put(w, c);
  }
  return true;
}`,
  inputs: [
    { kind: "string", name: "pattern", label: "pattern", default: "abba", maxLen: 6 },
    { kind: "string", name: "s", label: "s (words)", default: "we go go we", maxLen: 14 },
  ],
  entry: (a) => `wordPattern("${a.pattern}", "${a.s}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const pattern = args.pattern as string
    const s = args.s as string
    const off = pattern.length + 1 // s starts after the "|" cell
    const go = fn(
      "wordPattern",
      (): boolean => {
        const words: string[] = []
        const spans: [number, number][] = []
        const re = /\S+/g
        let m: RegExpExecArray | null
        while ((m = re.exec(s))) {
          words.push(m[0])
          spans.push([off + m.index, off + m.index + m[0].length - 1])
        }
        line(2, `Split s into <b>${words.length}</b> words: [${words.join(", ")}].`)
        if (words.length !== pattern.length) {
          line(3, `${words.length} words but ${pattern.length} pattern letters — counts differ → <b>false</b>.`)
          return false
        }
        line(3, `Counts match (${pattern.length}). Pair letter i with word i and demand a <b>bijection</b> both ways.`)
        const p2w: Record<string, string> = {}
        const w2p: Record<string, string> = {}
        heap("letter→word", { ...p2w })
        heap("word→letter", { ...w2p })
        for (let i = 0; i < pattern.length; i++) {
          const c = pattern[i]
          const w = words[i]
          ptr("i", i)
          mark("focus", [i])
          mark("window", rng(spans[i][0], spans[i][1]))
          line(6, `Position ${i}: letter '<b>${c}</b>' faces word "<b>${w}</b>" (blue) — check both maps.`)
          if (p2w[c] !== undefined && p2w[c] !== w) {
            mark("bad", [i, ...rng(spans[i][0], spans[i][1])])
            line(7, `'${c}' already means "<b>${p2w[c]}</b>" but here it faces "<b>${w}</b>" → <b>false</b>.`)
            return false
          }
          if (w2p[w] !== undefined && w2p[w] !== c) {
            mark("bad", [i, ...rng(spans[i][0], spans[i][1])])
            line(8, `"${w}" is already claimed by letter '<b>${w2p[w]}</b>' but '<b>${c}</b>' wants it too → <b>false</b>.`)
            return false
          }
          const isNew = p2w[c] === undefined
          p2w[c] = w
          w2p[w] = c
          heap("letter→word", { ...p2w })
          heap("word→letter", { ...w2p })
          line(10, isNew ? `New pair: '<b>${c}</b>' ↔ "<b>${w}</b>" stored in both maps.` : `'${c}' ↔ "${w}" agrees with the stored pair — consistent.`)
          vars({ i, c, w })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", rng(0, pattern.length - 1))
        line(12, `All ${pattern.length} pairs consistent in both directions → the sentence <b>follows the pattern</b>.`)
        return true
      },
      1,
    )
    return go()
  },
}
