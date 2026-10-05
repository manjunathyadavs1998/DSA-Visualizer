import type { SolutionDef } from "@/engine/types"

const cards = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(1, Math.trunc(Math.abs(v)) || 1))
  return out.length ? out : [1, 2, 3, 6, 2, 3, 4, 7, 8]
}

export const handOfStraights: SolutionDef = {
  view: "array",
  array: (a) => [...cards(a.hand as number[])].sort((x, y) => x - y),
  code: `// every straight must START at the smallest card left
function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  const count = new Map();
  for (const c of hand) count.set(c, (count.get(c) || 0) + 1);
  const uniq = [...count.keys()].sort((a, b) => a - b);
  for (const u of uniq) {
    while (count.get(u) > 0) {   // u is the smallest unused
      for (let v = u; v < u + groupSize; v++) {
        if (!count.get(v)) return false;
        count.set(v, count.get(v) - 1);
      }
    }
  }
  return true;
}`,
  codeJava: `// every straight must START at the smallest card left
boolean isNStraightHand(int[] hand, int groupSize) {
  if (hand.length % groupSize != 0) return false;
  TreeMap<Integer, Integer> count = new TreeMap<>();
  for (int c : hand) count.merge(c, 1, Integer::sum);
  // TreeMap already iterates keys in sorted order
  for (int u : new ArrayList<>(count.keySet())) {
    while (count.getOrDefault(u, 0) > 0) {  // u = smallest unused
      for (int v = u; v < u + groupSize; v++) {
        if (count.getOrDefault(v, 0) == 0) return false;
        count.merge(v, -1, Integer::sum);
      }
    }
  }
  return true;
}`,
  inputs: [
    { kind: "numbers", name: "hand", label: "hand (card values)", default: [1, 2, 3, 6, 2, 3, 4, 7, 8], maxLen: 12 },
    { kind: "number", name: "groupSize", label: "groupSize (cards per straight)", default: 3, min: 1, max: 6 },
  ],
  entry: (a) => `isNStraightHand([${cards(a.hand as number[]).join(",")}], ${Math.max(1, Math.trunc(a.groupSize as number))})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const hand = cards(args.hand as number[])
    const groupSize = Math.max(1, Math.trunc(args.groupSize as number))
    const sorted = [...hand].sort((x, y) => x - y)
    const solve = fn(
      "isNStraightHand",
      (): boolean => {
        line(2, `${hand.length} cards into straights of ${groupSize}: ${hand.length} % ${groupSize} = ${hand.length % groupSize} → ${hand.length % groupSize !== 0 ? "<b>impossible before we even start</b>" : "divisible, keep going"}.`)
        if (hand.length % groupSize !== 0) return false
        const count = new Map<number, number>()
        for (const c of hand) count.set(c, (count.get(c) || 0) + 1)
        heap("count", Object.fromEntries([...count.entries()].sort((a, b) => a[0] - b[0])))
        line(4, `Count every card value: ${[...count.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}×${v}`).join(", ")}.`)
        const uniq = [...count.keys()].sort((a, b) => a - b)
        line(5, `Process values in sorted order — the smallest remaining card has <b>no choice</b>: it must open a straight.`)
        let used = 0
        const done: number[] = []
        for (const u of uniq) {
          while ((count.get(u) ?? 0) > 0) {
            line(7, `Smallest unused card is <b>${u}</b> (×${count.get(u)}) — start the straight ${u}..${u + groupSize - 1}.`)
            for (let v = u; v < u + groupSize; v++) {
              ptr("v", sorted.findIndex((c, j) => c === v && !done.includes(j)))
              line(9, `Need a <b>${v}</b>: ${count.get(v) ? `have ${count.get(v)} → take one` : "<b>none left — the straight can't be completed → false</b>"}.`)
              if (!count.get(v)) {
                mark("bad", [sorted.indexOf(v) === -1 ? sorted.length - 1 : sorted.indexOf(v)].filter((x) => x >= 0))
                return false
              }
              count.set(v, (count.get(v) ?? 0) - 1)
              const j = sorted.findIndex((c, k) => c === v && !done.includes(k))
              if (j >= 0) done.push(j)
              mark("good", [...done])
              heap("count", Object.fromEntries([...count.entries()].filter(([, n]) => n > 0).sort((a, b) => a[0] - b[0])))
              used++
              vars({ straights: Math.floor(used / groupSize), cardsUsed: used })
              line(10, `count[${v}] → ${count.get(v)}. Straight so far: ${v - u + 1}/${groupSize} cards.`)
            }
            narrate(`Straight <b>${u}..${u + groupSize - 1}</b> complete (${Math.floor(used / groupSize)} total).`)
          }
        }
        ptr("v", -1)
        line(14, `Every card was consumed by some straight → <b>true</b>.`)
        return true
      },
      1,
    )
    narrate(`Greedy is forced here: the globally smallest card can only ever be the LOW end of a straight — so build that straight immediately.`)
    return solve()
  },
}
