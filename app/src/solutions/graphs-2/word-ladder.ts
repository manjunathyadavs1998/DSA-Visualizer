import type { SolutionDef } from "@/engine/types"

// Classic instance: "hit" → "cog" through
// ["hot","dot","dog","lot","log","cog"]
// Shortest ladder: hit → hot → dot → dog → cog (length 5)
const BEGIN = "hit"
const END = "cog"
const WORDS = ["hot", "dot", "dog", "lot", "log", "cog"]
// array view shows [begin, ...wordList]; index 0 is the start word
const ALL = [BEGIN, ...WORDS]

export const wordLadder: SolutionDef = {
  view: "array",
  array: () => [...ALL],
  code: `// begin "hit" → end "cog"; list: hot dot dog lot log cog
function ladderLength(begin, end, wordList) {
  const queue = [[begin, 1]];       // [word, ladder length]
  const visited = new Set([begin]);
  while (queue.length > 0) {
    const [word, steps] = queue.shift();
    if (word === end) return steps; // BFS → first hit is shortest
    for (const next of wordList) {
      if (visited.has(next)) continue;
      if (diffByOne(word, next)) {  // exactly one letter changed
        visited.add(next);
        queue.push([next, steps + 1]);
      }
    }
  }
  return 0;                         // end was never reached
}`,
  codeJava: `// begin "hit" → end "cog"; list: hot dot dog lot log cog
int ladderLength(String begin, String end, List<String> wordList) {
  Deque<Map.Entry<String, Integer>> queue = new ArrayDeque<>(List.of(Map.entry(begin, 1)));
  Set<String> visited = new HashSet<>(Set.of(begin));
  while (!queue.isEmpty()) {
    var e = queue.poll(); String word = e.getKey(); int steps = e.getValue();
    if (word.equals(end)) return steps; // BFS → first hit is shortest
    for (String next : wordList) {
      if (visited.contains(next)) continue;
      if (diffByOne(word, next)) {  // exactly one letter changed
        visited.add(next);
        queue.add(Map.entry(next, steps + 1));
      }
    }
  }
  return 0;                         // end was never reached
}`,
  inputs: [],
  entry: () => `ladderLength("${BEGIN}", "${END}", wordList)`,
  run({ fn, line, vars, mark, ptr, heap, narrate }) {
    const diffByOne = (a: string, b: string): number => {
      let d = 0
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++
      return d
    }
    const idxOf = (w: string) => ALL.indexOf(w)
    const go = fn(
      "ladderLength",
      (): number => {
        const queue: [string, number][] = [[BEGIN, 1]]
        const visited = new Set<string>([BEGIN])
        heap("queue", queue.map(([w, s]) => `${w}:${s}`))
        heap("visited", [...visited])
        line(2, `Seed BFS with ("${BEGIN}", 1) — ladder length counts <b>words</b>, so the start word itself is step 1.`)
        const done: number[] = []
        while (queue.length > 0) {
          const [word, steps] = queue.shift() as [string, number]
          heap("queue", queue.map(([w, s]) => `${w}:${s}`))
          ptr("cur", idxOf(word))
          done.push(idxOf(word))
          mark("done", [...done])
          vars({ word, steps })
          line(5, `Dequeue "<b>${word}</b>" at ladder length ${steps}.`)
          if (word === END) {
            mark("good", [idxOf(word)])
            line(6, `"${word}" IS the end word — BFS visits by increasing depth, so <b>${steps}</b> is the shortest ladder: hit→hot→dot→dog→cog.`)
            return steps
          }
          for (const next of WORDS) {
            if (visited.has(next)) {
              line(8, `"${next}": already visited — a shorter-or-equal ladder reached it first. Skip.`)
              continue
            }
            const d = diffByOne(word, next)
            if (d === 1) {
              visited.add(next)
              queue.push([next, steps + 1])
              heap("queue", queue.map(([w, s]) => `${w}:${s}`))
              heap("visited", [...visited])
              mark("focus", [idxOf(next)])
              line(11, `"${word}" → "<b>${next}</b>" differ by exactly 1 letter — a rung! Enqueue at length ${steps + 1}.`)
            } else {
              line(9, `"${word}" vs "${next}": ${d} letters differ — not adjacent.`)
            }
          }
        }
        line(15, `Queue empty, "${END}" never reached → <b>0</b>.`)
        return 0
      },
      1,
    )
    narrate(`The word list is an implicit graph: words are nodes, one-letter edits are edges. "Shortest transformation" screams BFS — mark words visited at enqueue time.`)
    return go()
  },
}
