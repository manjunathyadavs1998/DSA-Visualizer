import type { SolutionDef } from "@/engine/types"

/** Each bill becomes the nearest of 5 / 10 / 20. */
const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => {
    const x = Math.abs(Math.trunc(v))
    return x <= 7 ? 5 : x <= 15 ? 10 : 20
  })
  return out.length ? out : [5, 5, 5, 10, 20, 5, 10, 20]
}

export const lemonadeChange: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.bills as number[]),
  code: `// lemonade costs $5; start with no change at all
function lemonadeChange(bills) {
  let fives = 0, tens = 0;
  for (const b of bills) {
    if (b === 5) fives++;              // no change needed
    else if (b === 10) { fives--; tens++; }
    else if (tens > 0) { tens--; fives--; }  // 20 → 10+5
    else fives -= 3;                         // 20 → 5+5+5
    if (fives < 0) return false;  // couldn't make change
  }
  return true;
}`,
  codeJava: `// lemonade costs $5; start with no change at all
boolean lemonadeChange(int[] bills) {
  int fives = 0, tens = 0;
  for (int b : bills) {
    if (b == 5) fives++;               // no change needed
    else if (b == 10) { fives--; tens++; }
    else if (tens > 0) { tens--; fives--; }  // 20 → 10+5
    else fives -= 3;                         // 20 → 5+5+5
    if (fives < 0) return false;  // couldn't make change
  }
  return true;
}`,
  inputs: [
    { kind: "numbers", name: "bills", label: "bills (5, 10 or 20 — others snap to nearest)", default: [5, 5, 5, 10, 20, 5, 10, 20], maxLen: 12 },
  ],
  entry: (a) => `lemonadeChange([${sanitize(a.bills as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const bills = sanitize(args.bills as number[])
    const solve = fn(
      "lemonadeChange",
      (): boolean => {
        let fives = 0
        let tens = 0
        vars({ fives, tens })
        heap("till", { $5: 0, $10: 0 })
        line(2, `The till starts empty — every bit of change must come from earlier customers.`)
        for (let i = 0; i < bills.length; i++) {
          const b = bills[i]
          ptr("i", i)
          mark("focus", [i])
          if (b === 5) {
            fives++
            line(4, `$5 — exact payment, pocket it: fives = <b>${fives}</b>.`)
          } else if (b === 10) {
            fives--
            tens++
            line(5, `$10 — return one $5 (fives → ${fives}), keep the ten (tens → <b>${tens}</b>).`)
          } else if (tens > 0) {
            tens--
            fives--
            line(6, `$20 — give $15 as <b>10+5</b> (tens → ${tens}, fives → ${fives}): spend the ten first, fives are the only way to answer a $10 bill!`)
          } else {
            fives -= 3
            line(7, `$20 — no tens left, give <b>5+5+5</b>: fives → ${fives}.`)
          }
          heap("till", { $5: Math.max(fives, 0), $10: tens })
          vars({ fives, tens })
          if (fives < 0) {
            mark("bad", [i])
            line(8, `fives went negative — customer ${i} can't get change → <b>false</b>.`)
            return false
          }
          mark("good", Array.from({ length: i + 1 }, (_, k) => k))
        }
        ptr("i", -1)
        mark("focus", [])
        line(10, `Every customer got correct change → <b>true</b>.`)
        return true
      },
      1,
    )
    narrate(`The greedy rule: break a $20 with 10+5, never 5+5+5, because $5 bills are strictly more useful than $10 bills.`)
    return solve()
  },
}
