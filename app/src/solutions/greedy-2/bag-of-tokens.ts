import type { SolutionDef } from "@/engine/types"

const sortedTokens = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(1, Math.trunc(Math.abs(v)) || 1))
  if (!out.length) out.push(100, 200, 300, 400)
  return out.sort((a, b) => a - b)
}

export const bagOfTokens: SolutionDef = {
  view: "array",
  array: (a) => sortedTokens(a.tokens as number[]),
  code: `// face-up: pay power, gain 1 score; face-down: the reverse
function bagOfTokensScore(tokens, power) {
  tokens.sort((a, b) => a - b);
  let i = 0, j = tokens.length - 1, score = 0, best = 0;
  while (i <= j) {
    if (power >= tokens[i]) {        // buy score CHEAP
      power -= tokens[i]; i++; score++;
      best = Math.max(best, score);
    } else if (score > 0) {          // sell score DEAR
      power += tokens[j]; j--; score--;
    } else break;                    // can't move at all
  }
  return best;
}`,
  codeJava: `// face-up: pay power, gain 1 score; face-down: the reverse
int bagOfTokensScore(int[] tokens, int power) {
  Arrays.sort(tokens);
  int i = 0, j = tokens.length - 1, score = 0, best = 0;
  while (i <= j) {
    if (power >= tokens[i]) {        // buy score CHEAP
      power -= tokens[i]; i++; score++;
      best = Math.max(best, score);
    } else if (score > 0) {          // sell score DEAR
      power += tokens[j]; j--; score--;
    } else break;                    // can't move at all
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "tokens", label: "tokens (costs; shown sorted)", default: [100, 200, 300, 400], maxLen: 12 },
    { kind: "number", name: "power", label: "power (starting energy)", default: 200, min: 1, max: 999 },
  ],
  entry: (a) => `bagOfTokensScore([${sortedTokens(a.tokens as number[]).join(",")}], ${Math.max(1, Math.trunc(a.power as number))})`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const tokens = sortedTokens(args.tokens as number[])
    let power = Math.max(1, Math.trunc(args.power as number))
    const solve = fn(
      "bagOfTokensScore",
      (): number => {
        line(2, `Sort the tokens: score should be <b>bought at the cheap end</b> (left) and <b>sold at the expensive end</b> (right).`)
        let i = 0
        let j = tokens.length - 1
        let score = 0
        let best = 0
        vars({ power, score, best })
        while (i <= j) {
          ptr("i", i)
          ptr("j", j)
          mark("focus", i === j ? [i] : [i, j])
          if (power >= tokens[i]) {
            power -= tokens[i]
            mark("good", Array.from({ length: i + 1 }, (_, k) => k))
            i++
            score++
            best = Math.max(best, score)
            vars({ power, score, best })
            line(6, `Cheapest token costs ${tokens[i - 1]} ≤ power → play it <b>face-up</b>: power = ${power}, score = <b>${score}</b>.`)
            line(7, `best = <b>${best}</b>.`)
          } else if (score > 0) {
            power += tokens[j]
            mark("bad", [j])
            j--
            score--
            vars({ power, score, best })
            line(9, `Can't afford ${tokens[i]} — sacrifice 1 score on the <b>priciest</b> token (face-down): power = <b>${power}</b>, score = ${score}.`)
          } else {
            line(10, `No power for the cheapest token and no score to sell → stuck.`)
            break
          }
        }
        ptr("i", -1)
        ptr("j", -1)
        mark("focus", [])
        line(12, `Best score ever held: <b>${best}</b>.`)
        return best
      },
      1,
    )
    narrate(`Two-pointer greedy: 1 score is worth more power when sold high (tokens[j]) and costs least when bought low (tokens[i]). Track the best score seen — the last trade may be a loss.`)
    return solve()
  },
}
