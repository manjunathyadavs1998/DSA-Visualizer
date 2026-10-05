import type { SolutionDef } from "@/engine/types"

export const countNumbersWithUniqueDigits: SolutionDef = {
  code: `// f(n) = how many x in [0, 10^n) have all-distinct digits
function unique(n) {
  if (n === 0) return 1;
  if (n === 1) return 10;
  if (memo[n] !== undefined) return memo[n];
  const exact = (unique(n - 1) - unique(n - 2)) * (11 - n);
  memo[n] = unique(n - 1) + exact;
  return memo[n];
}`,
  codeJava: `// Integer[] memo
int unique(int n) {
  if (n == 0) return 1;
  if (n == 1) return 10;
  if (memo[n] != null) return memo[n];
  int exact = (unique(n - 1) - unique(n - 2)) * (11 - n);
  memo[n] = unique(n - 1) + exact;
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "n (digits)", default: 4, min: 0, max: 8 }],
  entry: (a) => `unique(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(0, Math.min(8, Math.trunc(args.n as number) || 0))
    const unique = fn(
      "unique",
      (n: number): number => {
        line(2, `unique(${n}): n = 0? (${n === 0 ? "<b>yes — only the number 0, so 1</b>" : "no"})`)
        if (n === 0) return 1
        line(3, `unique(${n}): n = 1? (${n === 1 ? "<b>yes — digits 0..9, so 10</b>" : "no"})`)
        if (n === 1) return 10
        line(4, `unique(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        line(5, `unique(${n}): numbers with EXACTLY ${n - 1} digits all-unique = unique(${n - 1}) − unique(${n - 2}); each extends with any of the ${11 - n} unused digits.`)
        const exact = ((unique(n - 1) as number) - (unique(n - 2) as number)) * (11 - n)
        vars({ n, exact })
        const total = (unique(n - 1) as number) + exact
        line(6, `unique(${n}) = unique(${n - 1}) + ${exact} = <b>${total}</b> → memo[${n}]. (The re-call of unique(${n - 1}) is a memo hit.)`)
        memo[n] = total
        return total
      },
      1,
    )
    narrate("Count by exact length: a unique-digit number of length k−1 extends with any of the (11−k) unused digits — pure multiplication.")
    return unique(N)
  },
}
