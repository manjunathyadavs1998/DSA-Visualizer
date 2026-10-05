import type { SolutionDef } from "@/engine/types"

export const addDigits: SolutionDef = {
  code: `// digital root: collapse digit sums until one digit remains
function addDigits(num) {
  if (num < 10) return num;             // single digit -> done
  let sum = 0, t = num;
  while (t > 0) {
    sum += t % 10;                      // peel off the last digit
    t = Math.floor(t / 10);
  }
  return addDigits(sum);                // O(1) trick: 1 + (num-1) % 9
}`,
  codeJava: `// digital root: collapse digit sums until one digit remains
int addDigits(int num) {
  if (num < 10) return num;             // single digit -> done
  int sum = 0, t = num;
  while (t > 0) {
    sum += t % 10;                      // peel off the last digit
    t = t / 10;
  }
  return addDigits(sum);                // O(1) trick: 1 + (num-1) % 9
}`,
  inputs: [{ kind: "number", name: "num", label: "num", default: 9875, min: 0, max: 10000 }],
  entry: (a) => `addDigits(${Math.max(0, Math.trunc(a.num as number))})`,
  run({ fn, line, vars, narrate }, args) {
    const start = Math.max(0, Math.trunc(args.num as number))
    const addDigitsFn = fn(
      "addDigits",
      (num: number): number => {
        line(2, `addDigits(${num}): single digit already? (${num < 10 ? `<b>yes — the digital root is ${num}</b>` : "no — collapse one more round"})`)
        if (num < 10) return num
        let sum = 0
        let t = num
        const parts: number[] = []
        while (t > 0) {
          const d = t % 10
          sum += d
          parts.push(d)
          line(5, `peel digit <b>${d}</b> (t = ${t}): sum = <b>${sum}</b>, t ÷ 10 → ${Math.floor(t / 10)}.`)
          t = Math.floor(t / 10)
          vars({ num, t, sum })
        }
        line(8, `${num} → ${parts.reverse().join(" + ")} = <b>${sum}</b>; recurse until one digit remains.`)
        return addDigitsFn(sum)
      },
      1,
    )
    const ans = addDigitsFn(start)
    narrate(
      `Why 1 + (num − 1) % 9 works: 10 ≡ 1 (mod 9), so every number is congruent to its digit sum mod 9 — the loop just walks num down to its residue class representative, <b>${ans}</b>.`,
    )
    return ans
  },
}
