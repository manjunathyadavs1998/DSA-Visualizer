import type { SolutionDef } from "@/engine/types"

export const countWaysToReachNthStairDistinct: SolutionDef = {
  code: `// steps of size 1, 2 or 3 per hop; ways(0) = 1 (stand still)
function ways(n) {
  if (n === 0) return 1;
  if (n < 0) return 0;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = ways(n - 1) + ways(n - 2) + ways(n - 3);
  return memo[n];
}`,
  codeJava: `// Integer[] memo
int ways(int n) {
  if (n == 0) return 1;
  if (n < 0) return 0;
  if (memo[n] != null) return memo[n];
  memo[n] = ways(n - 1) + ways(n - 2) + ways(n - 3);
  return memo[n];
}`,
  inputs: [{ kind: "number", name: "n", label: "stairs n", default: 7, min: 1, max: 12 }],
  entry: (a) => `ways(${a.n})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const N = Math.max(1, Math.min(12, Math.trunc(args.n as number) || 1))
    const ways = fn(
      "ways",
      (n: number): number => {
        line(2, `ways(${n}): landed exactly on the ground? (${n === 0 ? "<b>yes — one complete way</b>" : "no"})`)
        if (n === 0) return 1
        line(3, `ways(${n}): overshot below ground? (${n < 0 ? "<b>yes — invalid, 0 ways</b>" : "no"})`)
        if (n < 0) return 0
        line(4, `ways(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as number
        line(5, `ways(${n}): last hop was 1, 2 or 3 stairs → ways(${n - 1}) + ways(${n - 2}) + ways(${n - 3}).`)
        const v = ways(n - 1) + ways(n - 2) + ways(n - 3)
        vars({ n, v })
        line(5, `ways(${n}) = <b>${v}</b> → memo[${n}].`)
        memo[n] = v
        return v
      },
      1,
    )
    narrate("Climbing Stairs with a THIRD step size — classify every route by its final hop and the three groups partition all ways.")
    return ways(N)
  },
}
