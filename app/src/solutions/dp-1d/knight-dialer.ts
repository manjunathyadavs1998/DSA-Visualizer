import type { SolutionDef } from "@/engine/types"

const MOVES: number[][] = [
  [4, 6], [6, 8], [7, 9], [4, 8], [0, 3, 9],
  [], [0, 1, 7], [2, 6], [1, 3], [2, 4],
]

export const knightDialer: SolutionDef = {
  code: `// moves[d] = digits a knight can hop to from key d
function dial(d, hops) {
  if (hops === 1) return 1;
  const key = 10 * hops + d;
  if (memo[key] !== undefined) return memo[key];
  let total = 0;
  for (const nd of moves[d]) {
    total += dial(nd, hops - 1);
  }
  memo[key] = total;
  return total;
}
// answer = dial(0, n) + dial(1, n) + ... + dial(9, n)`,
  codeJava: `// int[][] moves; Integer[] memo = new Integer[10 * (n + 1)]
int dial(int d, int hops) {
  if (hops == 1) return 1;
  int key = 10 * hops + d;
  if (memo[key] != null) return memo[key];
  int total = 0;
  for (int nd : moves[d]) {
    total += dial(nd, hops - 1);
  }
  memo[key] = total;
  return total;
}
// answer = dial(0, n) + dial(1, n) + ... + dial(9, n)`,
  inputs: [{ kind: "number", name: "n", label: "number length n", default: 3, min: 1, max: 5 }],
  entry: (a) => `knightDialer(${a.n})`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    const N = Math.max(1, Math.min(5, Math.trunc(args.n as number) || 1))
    heap("moves", MOVES)
    const dial = fn(
      "dial",
      (d: number, hops: number): number => {
        line(2, `dial(${d}, ${hops}): last digit of the number? (${hops === 1 ? "<b>yes — the number is complete, 1 way</b>" : "no"})`)
        if (hops === 1) return 1
        const key = 10 * hops + d
        line(3, `key = 10·${hops} + ${d} = <b>${key}</b> — one slot per (hops, digit).`)
        line(4, `dial(${d}, ${hops}): checking memo[${key}]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let total = 0
        for (const nd of MOVES[d]) {
          line(7, `dial(${d}, ${hops}): knight hops ${d} → <b>${nd}</b>, then dial(${nd}, ${hops - 1}).`)
          total += dial(nd, hops - 1)
          vars({ d, hops, nd, total })
        }
        line(9, `dial(${d}, ${hops}) = <b>${total}</b> numbers → memo[${key}]. ${MOVES[d].length === 0 ? "(5 is a knight's dead end!)" : ""}`)
        memo[key] = total
        return total
      },
      1,
    )
    const knightDialerMain = fn("knightDialer", (): number => {
      narrate("A chess knight on a phone keypad: from each key only certain keys are reachable — note key 5 reaches NOTHING.")
      let ans = 0
      for (let d = 0; d <= 9; d++) {
        const c = dial(d, N)
        ans += c
        vars({ startDigit: d, count: c, ans })
        line(12, `starting on key ${d}: <b>${c}</b> numbers → running total ${ans}.`)
      }
      return ans
    })
    return knightDialerMain()
  },
}
