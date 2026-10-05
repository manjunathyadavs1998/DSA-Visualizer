import type { SolutionDef } from "@/engine/types"

export const nimGame: SolutionDef = {
  code: `// take 1-3 stones; you win if ANY move leaves the opponent losing
function canWin(n) {
  if (n <= 3) return true;              // grab them all, you win
  if (memo[n] !== undefined) return memo[n];
  let win = false;
  for (let take = 1; take <= 3; take++) {
    if (!canWin(n - take)) win = true;  // opponent stuck -> I win
  }
  memo[n] = win;
  return win;                           // false exactly when n % 4 == 0
}`,
  codeJava: `// take 1-3 stones; you win if ANY move leaves the opponent losing
boolean canWin(int n) {
  if (n <= 3) return true;              // grab them all, you win
  if (memo[n] != null) return memo[n];
  boolean win = false;
  for (int take = 1; take <= 3; take++) {
    if (!canWin(n - take)) win = true;  // opponent stuck -> I win
  }
  memo[n] = win;
  return win;                           // false exactly when n % 4 == 0
}`,
  inputs: [{ kind: "number", name: "n", label: "n (stones)", default: 8, min: 1, max: 12 }],
  entry: (a) => `canWin(${Math.min(12, Math.max(1, Math.trunc(a.n as number)))})`,
  run({ fn, memo, line, vars, narrate }, args) {
    const start = Math.min(12, Math.max(1, Math.trunc(args.n as number)))
    const canWin = fn(
      "canWin",
      (n: number): boolean => {
        line(2, `canWin(${n}): can I take all remaining stones? (${n <= 3 ? "<b>yes — take " + n + " and win on the spot</b>" : "no, more than 3 left"})`)
        if (n <= 3) return true
        line(3, `canWin(${n}): checking the memo…`)
        if (memo[n] !== undefined) return memo[n] as boolean
        let win = false
        for (let take = 1; take <= 3; take++) {
          line(6, `canWin(${n}): take <b>${take}</b> → opponent faces canWin(${n - take}).`)
          if (!canWin(n - take)) {
            win = true
            line(6, `Opponent LOSES at ${n - take} stones → taking ${take} from ${n} is a <b>winning move</b>!`)
          }
          vars({ n, take, win })
        }
        line(8, `canWin(${n}) = <b>${win}</b>${win ? "" : ` — every move hands the opponent a win (${n} is a multiple of 4)`}.`)
        memo[n] = win
        return win
      },
      1,
    )
    narrate(
      "Game theory by recursion: a position is WINNING if some move reaches a LOSING position, LOSING if all moves reach WINNING ones. The memo reveals the pattern — losing positions are exactly the multiples of 4.",
    )
    return canWin(start)
  },
}
