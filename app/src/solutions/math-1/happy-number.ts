import type { SolutionDef } from "@/engine/types"

export const happyNumber: SolutionDef = {
  code: `// sum of squared digits either reaches 1 or falls into a cycle
const seen = new Set();
function isHappy(n) {
  if (n === 1) return true;
  if (seen.has(n)) return false;        // revisit -> cycle -> never 1
  seen.add(n);
  let next = 0, t = n;
  while (t > 0) {
    const d = t % 10;
    next += d * d;                      // square each digit
    t = Math.floor(t / 10);
  }
  return isHappy(next);
}`,
  codeJava: `// sum of squared digits either reaches 1 or falls into a cycle
Set<Integer> seen = new HashSet<>();
boolean isHappy(int n) {
  if (n == 1) return true;
  if (seen.contains(n)) return false;   // revisit -> cycle -> never 1
  seen.add(n);
  int next = 0, t = n;
  while (t > 0) {
    int d = t % 10;
    next += d * d;                      // square each digit
    t = t / 10;
  }
  return isHappy(next);
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 19, min: 1, max: 10000 }],
  entry: (a) => `isHappy(${Math.max(1, Math.trunc(a.n as number))})`,
  run({ fn, line, vars, heap, narrate }, args) {
    const start = Math.max(1, Math.trunc(args.n as number))
    const seen = new Set<number>()
    const isHappy = fn(
      "isHappy",
      (n: number): boolean => {
        line(3, `isHappy(${n}): reached 1? (${n === 1 ? "<b>yes — happy!</b>" : "no"})`)
        if (n === 1) return true
        line(4, `isHappy(${n}): seen before? (${seen.has(n) ? `<b>yes — {${[...seen].join(", ")}} contains ${n}, we're looping forever → unhappy</b>` : "no — first visit"})`)
        if (seen.has(n)) return false
        seen.add(n)
        heap("seen", [...seen])
        let next = 0
        let t = n
        const parts: string[] = []
        while (t > 0) {
          const d = t % 10
          next += d * d
          parts.push(`${d}²=${d * d}`)
          line(9, `digit <b>${d}</b> of ${n}: next += ${d}·${d} → next = <b>${next}</b>.`)
          t = Math.floor(t / 10)
          vars({ n, t, next })
        }
        line(12, `${n} → ${parts.join(" + ")} = <b>${next}</b>; recurse on ${next}.`)
        return isHappy(next)
      },
      2,
    )
    narrate(
      "Squared-digit sums of any n ≤ 10000 quickly drop below 1000, so the sequence must eventually repeat — the seen-set catches the cycle (4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 for unhappy numbers).",
    )
    return isHappy(start)
  },
}
