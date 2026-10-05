import type { SolutionDef } from "@/engine/types"

export const letterTilePossibilities: SolutionDef = {
  code: `// tiles is editable; count = frequency map of tiles
function backtrack() {
  let made = 0;
  for (const t of Object.keys(count)) {  // distinct letters only
    if (count[t] === 0) continue;        // none of t left
    count[t]--;                // use one tile 't'
    made += 1 + backtrack();   // 1 = the sequence ending here
    count[t]++;                // backtrack: put the tile back
  }
  return made;
}`,
  codeJava: `// String tiles; int[] count = new int[26] frequency map
int backtrack() {
  int made = 0;
  for (char t = 'A'; t <= 'Z'; t++) {    // distinct letters only
    if (count[t - 'A'] == 0) continue;   // none of t left
    count[t - 'A']--;          // use one tile 't'
    made += 1 + backtrack();   // 1 = the sequence ending here
    count[t - 'A']++;          // backtrack: put the tile back
  }
  return made;
}`,
  inputs: [{ kind: "string", name: "tiles", label: "tiles", default: "AAB", maxLen: 4 }],
  entry: () => `backtrack()`,
  run({ fn, heap, line, vars, narrate }, args) {
    let tiles = (args.tiles as string).toUpperCase().replace(/[^A-Z]/g, "")
    if (!tiles) tiles = "AAB"
    const count: Record<string, number> = {}
    for (const ch of tiles) count[ch] = (count[ch] ?? 0) + 1
    const cur: string[] = []
    const backtrack = fn(
      "backtrack",
      (): number => {
        let made = 0
        vars({ cur: cur.join("") || '""', count: JSON.stringify(count) })
        line(3, `At "${cur.join("") || "(start)"}": try extending with each <b>distinct</b> letter that still has tiles.`)
        for (const t of Object.keys(count)) {
          if (count[t] === 0) {
            line(4, `'${t}': <b>0 tiles left</b> — skip. (Iterating counts, not positions, is what dedupes "AAB"'s two A's.)`)
            continue
          }
          line(5, `Use a '<b>${t}</b>' tile (${count[t]} → ${count[t] - 1} left) → sequence "${cur.join("") + t}".`)
          count[t]--
          cur.push(t)
          heap("count", count)
          line(6, `"<b>${cur.join("")}</b>" itself counts as 1 new sequence, plus everything it extends into.`)
          const below = backtrack()
          made += 1 + below
          line(7, `Backtrack: return the '${t}' tile (${count[t]} → ${count[t] + 1}); subtree added 1 + ${below} = <b>${1 + below}</b> sequences.`)
          count[t]++
          cur.pop()
          heap("count", count)
        }
        line(9, `Node "${cur.join("") || "(start)"}" contributes <b>${made}</b> sequences in total.`)
        return made
      },
      1,
    )
    narrate(`Every tree node (except the root) IS one distinct sequence — so we just count nodes. Looping over letter counts, not tile positions, prevents double-counting duplicates.`)
    heap("count", count)
    const total = backtrack()
    heap("output", { total })
    return total
  },
}
