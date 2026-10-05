import type { SolutionDef } from "@/engine/types"

export const longestWordAllPrefixes: SolutionDef = {
  code: `// memo[w] = true  ⇔  w is a complete word
function insert(done, rest) {
  if (rest === "") { memo[done] = true; return; }  // word end reached
  insert(done + rest[0], rest.slice(1));
}
function allPrefixes(w, i) {
  if (i === w.length) return true;         // every prefix checked
  if (!memo[w.slice(0, i)]) return false;  // chain breaks: not a word
  return allPrefixes(w, i + 1);
}
// best = longest word passing allPrefixes (smallest on ties)`,
  codeJava: `// words: Set<String> of complete words (the memo)
void insert(String done, String rest) {
  if (rest.isEmpty()) { words.add(done); return; }
  insert(done + rest.charAt(0), rest.substring(1));
}
boolean allPrefixes(String w, int i) {
  if (i == w.length()) return true;
  if (!words.contains(w.substring(0, i))) return false;
  return allPrefixes(w, i + 1);
}
// best = longest word passing allPrefixes (smallest on ties)`,
  inputs: [{ kind: "string", name: "words", label: "words (comma-sep)", default: "a,an,and,ape", maxLen: 14 }],
  entry: (a) => `solve("${a.words}")`,
  run({ fn, memo, line, heap, vars, narrate }, args) {
    const words = (args.words as string)
      .split(/[,\s]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((w) => w.slice(0, 5))

    const ins = fn(
      "ins",
      (done: string, rest: string): string => {
        if (rest === "") {
          line(2, `Mark "${done}" as a <b>complete word</b>.`)
          memo[done] = true
          return "✓"
        }
        ins(done + rest[0], rest.slice(1))
        return "✓"
      },
      1,
    )

    const chk = fn(
      "chk",
      (w: string, i: number): boolean => {
        if (i === w.length) {
          line(6, `All ${w.length - 1 || "0"} proper prefixes of "${w}" are complete words — <b>"${w}" qualifies!</b>`)
          return true
        }
        const p = w.slice(0, i)
        line(7, `Is prefix "${p}" a complete word?`)
        if (memo[p] === undefined) {
          line(7, `"${p}" is <b>not</b> a word — the prefix chain breaks; "${w}" is out.`)
          return false
        }
        return chk(w, i + 1)
      },
      5,
    )

    const root = fn(
      "solve",
      (_ws: string): string => {
        narrate("A word wins only if EVERY proper prefix is itself a word — insert everything first, then follow each word's chain of prefixes.")
        heap("words", words)
        for (const w of words) {
          line(1, `insert "${w}" into the word set.`)
          ins("", w)
        }
        let best = ""
        const candidates: string[] = []
        heap("candidates", candidates)
        for (const w of words) {
          line(5, `Check "${w}": walk its prefix chain ${w.length > 1 ? `"${w[0]}" → …` : "(no proper prefixes)"}.`)
          const ok = chk(w, 1)
          if (ok) {
            candidates.push(w)
            heap("candidates", candidates)
            if (w.length > best.length) {
              line(10, `"${w}" is <b>longer</b> than "${best || "∅"}" → new best.`)
              best = w
            } else if (w.length === best.length && w < best) {
              line(10, `"${w}" ties "${best}" in length but is <b>lexicographically smaller</b> → new best.`)
              best = w
            } else {
              line(10, `"${w}" doesn't beat "${best}" — keep the current best.`)
            }
            vars({ best })
          }
        }
        return best === "" ? '""' : best
      },
      0,
    )
    return root(args.words as string)
  },
}
