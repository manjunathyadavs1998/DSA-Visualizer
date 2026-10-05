import type { SolutionDef } from "@/engine/types"

const COINS = [50, 20, 10, 5, 2, 1]

export const minimumCoinsGreedy: SolutionDef = {
  view: "array",
  // the fixed denominations, largest first — the greedy scan order
  array: () => COINS,
  code: `// Indian coin system — amount is editable below
function minCoins(amount) {
  const coins = [50, 20, 10, 5, 2, 1];  // largest first
  const picked = [];
  let remaining = amount;
  for (const c of coins) {
    while (remaining >= c) {       // take c while it fits
      picked.push(c);
      remaining -= c;
    }
  }
  return picked.length;
}`,
  codeJava: `// Indian coin system — amount is editable below
int minCoins(int amount) {
  int[] coins = {50, 20, 10, 5, 2, 1};  // largest first
  List<Integer> picked = new ArrayList<>();
  int remaining = amount;
  for (int c : coins) {
    while (remaining >= c) {       // take c while it fits
      picked.add(c);
      remaining -= c;
    }
  }
  return picked.size();
}`,
  inputs: [{ kind: "number", name: "amount", label: "amount", default: 87, min: 1, max: 99 }],
  entry: (a) => `minCoins(${a.amount})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const amount = args.amount as number
    const solve = fn(
      "minCoins",
      (): number => {
        line(2, `Denominations sorted <b>largest first</b> — each coin here divides evenly into the bigger ones' combinations, which is what makes greedy safe.`)
        const picked: number[] = []
        heap("picked", picked)
        line(3, `No coins picked yet.`)
        let remaining = amount
        vars({ remaining })
        line(4, `We still owe <b>${remaining}</b>.`)
        const used: number[] = []
        for (let k = 0; k < COINS.length; k++) {
          const c = COINS[k]
          ptr("c", k)
          mark("focus", [k])
          line(5, `Try coin <b>${c}</b>: ${remaining >= c ? `it fits into ${remaining}` : `too big for ${remaining} — skip`}.`)
          while (remaining >= c) {
            line(6, `${remaining} ≥ ${c} → take a <b>${c}</b>. Any smaller coins covering ${c} would use strictly more coins.`)
            picked.push(c)
            heap("picked", picked)
            line(7, `picked = [${picked.join(", ")}].`)
            remaining -= c
            vars({ remaining })
            line(8, `remaining ${remaining + c} − ${c} = <b>${remaining}</b>.`)
            if (!used.includes(k)) used.push(k)
            mark("good", used)
          }
        }
        mark("focus", [])
        ptr("c", -1)
        line(11, `remaining = 0 — <b>${picked.length}</b> coins pay ${amount} exactly.`)
        return picked.length
      },
      1,
    )
    narrate(`Greedy works here because {1, 2, 5, 10, 20, 50} is a <b>canonical</b> system: taking the biggest coin that fits never hurts. (With coins like {1, 3, 4} it would fail — that needs DP.)`)
    return solve()
  },
}
