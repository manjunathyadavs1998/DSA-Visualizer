import type { SolutionDef } from "@/engine/types"

export const divisorGame: SolutionDef = {
  code: `// Alice picks x | n with 0 < x < n, hands over n - x
function wins(n) {
  if (n === 1) return false;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = false;
  for (let x = 1; x < n; x++) {
    if (n % x === 0 && !wins(n - x)) { memo[n] = true; break; }
  }
  return memo[n];
}`,
  codeJava: `// Boolean[] memo
boolean wins(int n) {
  if (n == 1) return false;
  if (memo[n] != null) return memo[n];
  memo[n] = false;
  for (int x = 1; x < n; x++) {
    if (n % x == 0 && !wins(n - x)) { memo[n] = true; break; }
  }
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 6, min: 1, max: 12 }],
  entry: (a) => `wins(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(1, Math.min(12, Math.trunc(args.n as number) || 1))
    const wins = fn(
      "wins",
      (n: number): boolean => {
        line(2, `wins(${n}): n = 1? (${n === 1 ? "<b>yes — no legal x exists, current player LOSES</b>" : "no"})`)
        if (n === 1) return false
        line(3, `wins(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as boolean
        line(4, `wins(${n}): assume losing until a winning move appears.`)
        memo[n] = false
        for (let x = 1; x < n; x++) {
          if (n % x !== 0) continue
          line(6, `wins(${n}): move x = ${x} (divides ${n}) → opponent faces wins(${n - x}).`)
          if (!wins(n - x)) {
            line(6, `opponent LOSES at ${n - x} → x = ${x} is a winning move → memo[${n}] = <b>true</b>.`)
            memo[n] = true
            break
          }
          vars({ n, x })
        }
        line(8, `wins(${n}) = <b>${memo[n]}</b>.`)
        return memo[n] as boolean
      },
      1,
    )
    narrate("Game-theory DP: a position wins iff SOME move sends the opponent to a losing position. (Spoiler the DP proves: even n wins.)")
    return wins(N)
  },
}
