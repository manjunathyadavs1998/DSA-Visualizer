import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): number[] => {
  const s = [...new Set((a.score as number[]).map(Math.trunc))]
  if (!s.length) s.push(5, 4, 3, 2, 1)
  return s
}

export const relativeRanks: SolutionDef = {
  view: "array",
  array: (a) => clean(a),
  code: `// pop athletes from a max-heap — podium comes out first
function findRelativeRanks(score) {
  const pq = new MaxHeap();          // (score, index) pairs
  for (let i = 0; i < score.length; i++)
    pq.push([score[i], i]);          // sift up by score
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const ans = new Array(score.length);
  for (let place = 1; !pq.isEmpty(); place++) {
    const [s, i] = pq.pop();         // best remaining athlete
    ans[i] = place <= 3 ? medals[place - 1] : String(place);
  }
  return ans;
}`,
  codeJava: `// pop athletes from a max-heap — podium comes out first
String[] findRelativeRanks(int[] score) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
  for (int i = 0; i < score.length; i++)
    pq.offer(new int[]{score[i], i}); // sift up by score
  String[] medals = {"Gold Medal", "Silver Medal", "Bronze Medal"};
  String[] ans = new String[score.length];
  for (int place = 1; !pq.isEmpty(); place++) {
    int[] top = pq.poll();           // best remaining athlete
    ans[top[1]] = place <= 3 ? medals[place - 1] : String.valueOf(place);
  }
  return ans;
}`,
  inputs: [
    { kind: "numbers", name: "score", label: "score", default: [10, 3, 8, 9, 4], maxLen: 10 },
  ],
  entry: (a) => `findRelativeRanks([${clean(a).join(",")}])`,
  run({ fn, line, mark, aset, vars, heap, narrate }, args) {
    const score = clean(args)
    const go = fn(
      "findRelativeRanks",
      (): string => {
        // max-heap simulated as an array sorted by score DESCENDING
        const pq: [number, number][] = []
        heap("pq", [])
        line(2, `Build a <b>max-heap of (score, index)</b> pairs — the index rides along so we know whose rank we are assigning.`)
        for (let i = 0; i < score.length; i++) {
          mark("focus", [i])
          let p = 0
          while (p < pq.length && pq[p][0] > score[i]) p++
          pq.splice(p, 0, [score[i], i])
          heap("pq", pq.map(([s, i2]) => `${s} (athlete ${i2})`))
          line(4, `push((${score[i]}, idx ${i})) — sifts past ${p} higher score(s). Heap: [${pq.map((e) => e[0]).join(", ")}].`)
        }
        mark("focus", [])
        const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"]
        const ans: string[] = new Array(score.length)
        line(7, `Now pop ${score.length} times — the heap hands back athletes <b>best first</b>, which IS the ranking.`)
        for (let place = 1; pq.length; place++) {
          const [s, i] = pq.shift() as [number, number]
          heap("pq", pq.map(([s2, i2]) => `${s2} (athlete ${i2})`))
          mark("focus", [i])
          line(8, `pop() → score <b>${s}</b> (athlete ${i}): this is place <b>${place}</b>.`)
          ans[i] = place <= 3 ? medals[place - 1] : String(place)
          aset(i, place <= 3 ? ["G", "S", "B"][place - 1] : place)
          heap("output", [...ans])
          vars({ place, athlete: i, rank: ans[i] })
          line(9, `ans[${i}] = "<b>${ans[i]}</b>".`)
        }
        mark("focus", [])
        mark("good", score.map((_, i) => i).filter((i) => ans[i].endsWith("Medal")))
        line(11, `Done — the array now reads G/S/B for the podium and plain places after that. Sorting by heap: O(n log n).`)
        return ans.join(", ")
      },
      1,
    )
    narrate("Ranking is just 'pop everyone from a max-heap and count as you go' — the heap does the sorting.")
    return go()
  },
}
