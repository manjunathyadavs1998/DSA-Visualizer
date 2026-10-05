import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const maximumPointsYouCanObtainFromCards: SolutionDef = {
  view: "array",
  array: (a) => a.cardPoints as number[],
  code: `// taking k from the ends == leaving a window of n-k in the middle
function maxScore(cardPoints, k) {
  const n = cardPoints.length, keep = n - k;
  let total = 0;
  for (const p of cardPoints) total += p;
  let sum = 0, minKeep = Infinity;
  for (let right = 0; right < n; right++) {
    sum += cardPoints[right];
    if (right >= keep) sum -= cardPoints[right - keep];
    if (right >= keep - 1) minKeep = Math.min(minKeep, sum);
  }
  return total - minKeep;             // best ends = total - worst middle
}`,
  codeJava: `// taking k from the ends == leaving a window of n-k in the middle
int maxScore(int[] cardPoints, int k) {
  int n = cardPoints.length, keep = n - k;
  int total = 0;
  for (int p : cardPoints) total += p;
  int sum = 0, minKeep = Integer.MAX_VALUE;
  for (int right = 0; right < n; right++) {
    sum += cardPoints[right];
    if (right >= keep) sum -= cardPoints[right - keep];
    if (right >= keep - 1) minKeep = Math.min(minKeep, sum);
  }
  return total - minKeep;             // best ends = total - worst middle
}`,
  inputs: [
    { kind: "numbers", name: "cardPoints", label: "cardPoints", default: [1, 2, 3, 4, 5, 6, 1], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 12 },
  ],
  entry: (a) => `maxScore([${(a.cardPoints as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const cardPoints = (args.cardPoints as number[]).map((v) => Math.max(0, Math.trunc(v)))
    const n = cardPoints.length
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), n)
    const go = fn(
      "maxScore",
      (): number => {
        const keep = n - k
        line(2, `Take <b>${k}</b> cards from the ends ⇔ leave a contiguous middle window of <b>${keep}</b> cards. Minimize what you leave!`)
        let total = 0
        for (const p of cardPoints) total += p
        line(4, `total of all cards = <b>${total}</b>.`)
        let sum = 0
        let minKeep = Infinity
        let bestEnd = keep - 1
        line(5, `Slide a window of size ${keep}; the cheapest window is the middle we abandon.`)
        for (let right = 0; right < n; right++) {
          ptr("right", right)
          mark("focus", [right])
          sum += cardPoints[right]
          line(7, `sum += cardPoints[${right}] = ${cardPoints[right]} → sum = <b>${sum}</b>.`)
          if (right >= keep) {
            sum -= cardPoints[right - keep]
            line(8, `cardPoints[${right - keep}] = ${cardPoints[right - keep]} slides out → sum = <b>${sum}</b>.`)
          }
          const start = Math.max(0, right - keep + 1)
          ptr("left", start)
          mark("window", keep === 0 ? [] : win(start, right))
          if (right >= keep - 1) {
            if (sum < minKeep) {
              minKeep = sum
              bestEnd = right
              line(9, `Middle window [${start}..${right}] costs only <b>${sum}</b> — cheapest to leave so far.`)
            } else {
              line(9, `Middle window costs ${sum} — minKeep stays ${minKeep}.`)
            }
          }
          vars({ right, sum, minKeep: minKeep === Infinity ? "∞" : minKeep, total })
        }
        mark("focus", [])
        mark("window", [])
        if (keep > 0) mark("bad", win(bestEnd - keep + 1, bestEnd))
        mark("good", [...win(0, bestEnd - keep), ...win(bestEnd + 1, n - 1)])
        const minVal = keep === 0 ? 0 : minKeep
        line(11, `Leave the red middle (${minVal}) and take the green ends: ${total} − ${minVal} = <b>${total - minVal}</b>.`)
        return total - minVal
      },
      1,
    )
    return go()
  },
}
