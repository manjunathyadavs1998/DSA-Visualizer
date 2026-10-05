import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const groupAnagrams: SolutionDef = {
  view: "array",
  array: (a) => (a.words as string).split(""),
  code: `// words are space-separated in the input box
function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
  codeJava: `// words are space-separated in the input box
List<List<String>> groupAnagrams(String[] words) {
  Map<String, List<String>> groups = new HashMap<>();
  for (String w : words) {
    char[] a = w.toCharArray(); Arrays.sort(a); String key = new String(a);
    if (!groups.containsKey(key)) groups.put(key, new ArrayList<>());
    groups.get(key).add(w);
  }
  return new ArrayList<>(groups.values());
}`,
  inputs: [
    { kind: "string", name: "words", label: "words (space-separated)", default: "tea ate eat nb", maxLen: 14 },
  ],
  entry: (a) => `groupAnagrams([${(a.words as string).trim().split(/\s+/).filter(Boolean).join(", ")}])`,
  run({ fn, line, mark, vars, heap }, args) {
    const raw = args.words as string
    const words: string[] = []
    const spans: [number, number][] = []
    const re = /\S+/g
    let m: RegExpExecArray | null
    while ((m = re.exec(raw))) {
      words.push(m[0])
      spans.push([m.index, m.index + m[0].length - 1])
    }
    if (!words.length) {
      words.push("tea")
      spans.push([0, 2])
    }
    const go = fn(
      "groupAnagrams",
      (): string => {
        const groups = new Map<string, string[]>()
        const keyOfSpan = new Map<number, string>()
        heap("groups", {})
        line(2, `One bucket per <b>sorted letter signature</b> — anagrams share the exact same signature.`)
        for (let k = 0; k < words.length; k++) {
          const w = words[k]
          const [a, b] = spans[k]
          mark("focus", rng(a, b))
          const key = [...w].sort().join("")
          keyOfSpan.set(k, key)
          line(4, `"${w}" sorted letter-by-letter → key "<b>${key}</b>".`)
          if (!groups.has(key)) {
            groups.set(key, [])
            line(5, `First time seeing key "${key}" → open a <b>new bucket</b>.`)
          } else {
            line(5, `Bucket "${key}" already exists — "${w}" is an <b>anagram</b> of [${groups.get(key)!.join(", ")}].`)
          }
          groups.get(key)!.push(w)
          heap("groups", Object.fromEntries(groups))
          line(6, `Push "${w}" into bucket "${key}" → [${groups.get(key)!.join(", ")}]. Buckets so far: <b>${groups.size}</b>.`)
          vars({ w, key, buckets: groups.size })
        }
        mark("focus", [])
        // highlight all words that found at least one anagram partner
        const good: number[] = []
        for (let k = 0; k < words.length; k++) {
          const key = keyOfSpan.get(k)!
          if (groups.get(key)!.length > 1) good.push(...rng(spans[k][0], spans[k][1]))
        }
        mark("good", good)
        const res = [...groups.values()]
        line(8, `Collect the ${groups.size} buckets → <b>${JSON.stringify(res)}</b>. Sorting each word costs k log k; the map does the grouping.`)
        return JSON.stringify(res)
      },
      1,
    )
    return go()
  },
}
