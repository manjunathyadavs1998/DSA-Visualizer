import type { SolutionDef } from "@/engine/types"

const clampNum = (x: number) => Math.min(10000, Math.max(1, Math.trunc(x)))

export const perfectNumber: SolutionDef = {
  view: "array",
  // candidate divisors 1..floor(sqrt(num))
  array: (a) => Array.from({ length: Math.max(1, Math.floor(Math.sqrt(clampNum(a.num as number)))) }, (_, i) => i + 1),
  code: `// divisors pair up: if d divides num, so does num / d
function checkPerfectNumber(num) {
  if (num <= 1) return false;
  let sum = 1;                          // 1 always divides; skip num itself
  for (let d = 2; d * d <= num; d++) {
    if (num % d === 0) {
      sum += d + num / d;               // add BOTH ends of the pair
      if (d === num / d) sum -= d;      // perfect square: count once
    }
  }
  return sum === num;
}`,
  codeJava: `// divisors pair up: if d divides num, so does num / d
boolean checkPerfectNumber(int num) {
  if (num <= 1) return false;
  int sum = 1;                          // 1 always divides; skip num itself
  for (int d = 2; d * d <= num; d++) {
    if (num % d == 0) {
      sum += d + num / d;               // add BOTH ends of the pair
      if (d == num / d) sum -= d;       // perfect square: count once
    }
  }
  return sum == num;
}`,
  inputs: [{ kind: "number", name: "num", label: "num", default: 496, min: 1, max: 10000 }],
  entry: (a) => `checkPerfectNumber(${clampNum(a.num as number)})`,
  run({ fn, line, mark, vars, heap }, args) {
    const num = clampNum(args.num as number)
    const go = fn(
      "checkPerfectNumber",
      (): boolean => {
        line(2, `num = ${num}: is it ≤ 1? (${num <= 1 ? "<b>yes — 1 has no proper divisors below it, not perfect</b>" : "no"})`)
        if (num <= 1) return false
        let sum = 1
        const divisors = [1]
        heap("divisors", [...divisors])
        mark("good", [0])
        line(3, `Start sum = <b>1</b> — 1 divides everything. We only sweep d up to √${num} ≈ ${Math.floor(Math.sqrt(num))} (cells below).`)
        const hits = [0]
        for (let d = 2; d * d <= num; d++) {
          mark("focus", [d - 1])
          vars({ d, sum })
          if (num % d === 0) {
            const pair = num / d
            sum += d + pair
            if (d === pair) {
              sum -= d
              divisors.push(d)
              line(7, `d = <b>${d}</b> divides ${num} and ${d}² = ${num} — add it <b>once</b>: sum = ${sum}.`)
            } else {
              divisors.push(d, pair)
              line(6, `${num} % ${d} = 0 → divisor pair <b>(${d}, ${pair})</b>: sum += ${d} + ${pair} → sum = <b>${sum}</b>.`)
            }
            hits.push(d - 1)
            mark("good", [...hits])
            heap("divisors", [...divisors].sort((a, b) => a - b))
          } else {
            line(5, `${num} % ${d} = ${num % d} ≠ 0 — ${d} is not a divisor, move on.`)
          }
        }
        mark("focus", [])
        line(10, `Proper divisors of ${num} sum to <b>${sum}</b> — ${sum === num ? `exactly ${num} → <b>perfect number!</b> (6, 28, 496, 8128…)` : `not ${num} → <b>not perfect</b>.`}`)
        return sum === num
      },
      1,
    )
    return go()
  },
}
