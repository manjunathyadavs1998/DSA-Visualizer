import type { SolutionDef } from "@/engine/types"

export const matchsticksToSquare: SolutionDef = {
  code: `// sticks sorted descending; sides = [0,0,0,0]
function makesquare() {
  const total = sum(sticks), target = total / 4;
  if (total % 4 !== 0) return false;
  return backtrack(0);
}
function backtrack(i) {
  if (i === sticks.length) return true;   // every stick placed
  for (let s = 0; s < 4; s++) {
    if (sides[s] + sticks[i] > target) continue;   // would overflow
    if (s > 0 && sides[s] === sides[s - 1]) continue; // same as prev side
    sides[s] += sticks[i];       // put stick i on side s
    if (backtrack(i + 1)) return true;
    sides[s] -= sticks[i];       // backtrack
  }
  return false;                  // stick i fits nowhere
}`,
  codeJava: `// sticks sorted descending; int[] sides = new int[4]
boolean makesquare() {
  int total = IntStream.of(sticks).sum(), target = total / 4;
  if (total % 4 != 0) return false;
  return backtrack(0);
}
boolean backtrack(int i) {
  if (i == sticks.length) return true;    // every stick placed
  for (int s = 0; s < 4; s++) {
    if (sides[s] + sticks[i] > target) continue;   // would overflow
    if (s > 0 && sides[s] == sides[s - 1]) continue;  // same as prev side
    sides[s] += sticks[i];       // put stick i on side s
    if (backtrack(i + 1)) return true;
    sides[s] -= sticks[i];       // backtrack
  }
  return false;                  // stick i fits nowhere
}`,
  inputs: [{ kind: "numbers", name: "matchsticks", label: "matchsticks", default: [2, 2, 2, 1, 1], maxLen: 6 }],
  entry: () => `makesquare()`,
  run({ fn, heap, line, vars, narrate }, args) {
    const sticks = (args.matchsticks as number[])
      .map(Math.trunc)
      .filter((x) => x > 0)
      .sort((a, b) => b - a)
    if (!sticks.length) sticks.push(2, 2, 2, 1, 1)
    const total = sticks.reduce((a, b) => a + b, 0)
    const target = total / 4
    const sides = [0, 0, 0, 0]
    const backtrack = fn(
      "backtrack",
      (i: number): boolean => {
        vars({ i, sides: `[${sides.join(",")}]` })
        line(7, `backtrack(${i}): all ${sticks.length} sticks placed? (${i === sticks.length ? "<b>yes — square built!</b>" : "no"})`)
        if (i === sticks.length) return true
        for (let s = 0; s < 4; s++) {
          if (sides[s] + sticks[i] > target) {
            line(9, `Side ${s} holds ${sides[s]}; adding stick ${sticks[i]} → ${sides[s] + sticks[i]} <b>&gt; target ${target}</b> — skip.`)
            continue
          }
          if (s > 0 && sides[s] === sides[s - 1]) {
            line(10, `Side ${s} = side ${s - 1} = ${sides[s]} — trying it again would <b>repeat the same failed state</b>: skip.`)
            continue
          }
          line(11, `Put stick <b>${sticks[i]}</b> on side ${s}: ${sides[s]} → ${sides[s] + sticks[i]} (target ${target}).`)
          sides[s] += sticks[i]
          heap("sides", sides)
          if (backtrack(i + 1)) {
            line(12, `Side ${s} worked for everything below — <b>bubble true up</b>.`)
            return true
          }
          line(13, `Backtrack: take stick ${sticks[i]} off side ${s}: ${sides[s]} → ${sides[s] - sticks[i]}.`)
          sides[s] -= sticks[i]
          heap("sides", sides)
        }
        line(15, `Stick ${sticks[i]} fits on <b>no side</b> — this partial square is doomed, return false.`)
        return false
      },
      6,
    )
    const makesquare = fn(
      "makesquare",
      (): boolean => {
        line(2, `total = ${sticks.join("+")} = <b>${total}</b> → each side must be ${total % 4 === 0 ? `<b>${target}</b>` : `${total}/4 — not an integer`}.`)
        line(3, `total % 4 = ${total % 4}: ${total % 4 !== 0 ? "<b>impossible — no square can exist</b>" : "divisible, worth searching"}.`)
        if (total % 4 !== 0) return false
        line(4, `Sort descending (${sticks.join(",")}) so big sticks fail fast, then try every side for every stick.`)
        return backtrack(0)
      },
      1,
    )
    narrate("Bucket-filling backtracking: each stick tries all 4 sides. Sorting descending + skipping equal sides prunes the 4^n tree hard.")
    heap("sticks (sorted)", sticks)
    heap("sides", sides)
    return makesquare()
  },
}
