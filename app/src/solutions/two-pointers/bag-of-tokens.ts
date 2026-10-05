import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] =>
  [...(args.tokens as number[])].map((x) => Math.max(1, Math.trunc(x))).sort((a, b) => a - b)

export const bagOfTokens: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// cheap tokens buy points; the priciest token buys back power
function bagOfTokensScore(tokens, power) {
  tokens.sort((a, b) => a - b);
  let left = 0, right = tokens.length - 1, score = 0, best = 0;
  while (left <= right) {
    if (power >= tokens[left]) {
      power -= tokens[left]; left++; score++;   // play cheapest face-up
      best = Math.max(best, score);
    } else if (score > 0) {
      power += tokens[right]; right--; score--; // play priciest face-down
    } else {
      break;             // broke and scoreless — stuck
    }
  }
  return best;
}`,
  codeJava: `// cheap tokens buy points; the priciest token buys back power
int bagOfTokensScore(int[] tokens, int power) {
  Arrays.sort(tokens);
  int left = 0, right = tokens.length - 1, score = 0, best = 0;
  while (left <= right) {
    if (power >= tokens[left]) {
      power -= tokens[left]; left++; score++;   // play cheapest face-up
      best = Math.max(best, score);
    } else if (score > 0) {
      power += tokens[right]; right--; score--; // play priciest face-down
    } else {
      break;             // broke and scoreless — stuck
    }
  }
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "tokens", label: "tokens", default: [50, 100, 150, 200, 300, 400], maxLen: 10 },
    { kind: "number", name: "power", label: "power", default: 150, min: 0, max: 999 },
  ],
  entry: (a) => `bagOfTokensScore([${prep(a).join(",")}], ${a.power})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const tokens = prep(args)
    let power = Math.max(0, Math.trunc(args.power as number))
    const go = fn(
      "bagOfTokensScore",
      (): number => {
        line(2, `Sorted: [${tokens.join(", ")}]. Buy points as <b>cheaply</b> as possible; sell power as <b>dearly</b> as possible.`)
        let left = 0
        let right = tokens.length - 1
        let score = 0
        let best = 0
        ptr("left", left)
        ptr("right", right)
        line(3, `power = ${power}, score = 0.`)
        while (left <= right) {
          mark("focus", left === right ? [left] : [left, right])
          if (power >= tokens[left]) {
            power -= tokens[left]
            mark("good", [left])
            line(6, `Afford the cheapest: pay ${tokens[left]} power (→ ${power}), play tokens[${left}] <b>face-up</b>, score → ${score + 1}.`)
            left++
            score++
            ptr("left", left <= right ? left : -1)
            if (score > best) best = score
            line(7, `best = <b>${best}</b>.`)
          } else if (score > 0) {
            power += tokens[right]
            mark("bad", [right])
            line(9, `Can't afford ${tokens[left]} (power ${power - tokens[right]}). Trade 1 point for the priciest token: +${tokens[right]} power (→ ${power}), score → ${score - 1}.`)
            right--
            score--
            ptr("right", right >= left ? right : -1)
          } else {
            line(11, `power ${power} < ${tokens[left]} and score = 0 — nothing to trade. <b>Stuck.</b>`)
            break
          }
          vars({ left, right, power, score, best })
        }
        mark("focus", [])
        line(14, `Peak score along the way: <b>${best}</b> (cashing a point back in never helps unless it leads to ≥2 buys).`)
        return best
      },
      1,
    )
    return go()
  },
}
