import type { SolutionDef } from "@/engine/types"

const sortedPeople = (nums: number[], limit: number): number[] => {
  const out = nums.map((v) => Math.min(limit, Math.max(1, Math.trunc(Math.abs(v)) || 1)))
  if (!out.length) out.push(1, 2)
  return out.sort((a, b) => a - b)
}

const getLimit = (a: Record<string, unknown>): number => Math.max(1, Math.trunc(a.limit as number))

export const boatsToSavePeople: SolutionDef = {
  view: "array",
  array: (a) => sortedPeople(a.people as number[], getLimit(a)),
  code: `// each boat: ≤ 2 people, weight ≤ limit (array shown sorted)
function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let i = 0, j = people.length - 1, boats = 0;
  while (i <= j) {
    if (people[i] + people[j] <= limit)
      i++;        // lightest person shares the boat
    j--;          // heaviest person ALWAYS boards now
    boats++;
  }
  return boats;
}`,
  codeJava: `// each boat: ≤ 2 people, weight ≤ limit (array shown sorted)
int numRescueBoats(int[] people, int limit) {
  Arrays.sort(people);
  int i = 0, j = people.length - 1, boats = 0;
  while (i <= j) {
    if (people[i] + people[j] <= limit)
      i++;        // lightest person shares the boat
    j--;          // heaviest person ALWAYS boards now
    boats++;
  }
  return boats;
}`,
  inputs: [
    { kind: "numbers", name: "people", label: "people (weights; clamped to ≤ limit)", default: [3, 5, 3, 4, 2, 1, 2], maxLen: 12 },
    { kind: "number", name: "limit", label: "limit (max weight per boat)", default: 5, min: 1, max: 30 },
  ],
  entry: (a) => `numRescueBoats([${sortedPeople(a.people as number[], getLimit(a)).join(",")}], ${getLimit(a)})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const limit = getLimit(args)
    const people = sortedPeople(args.people as number[], limit)
    const solve = fn(
      "numRescueBoats",
      (): number => {
        line(2, `Sort the weights. The heaviest person must leave on SOME boat — the only question is whether anyone fits beside them.`)
        let i = 0
        let j = people.length - 1
        let boats = 0
        vars({ i, j, boats })
        const launched: string[] = []
        while (i <= j) {
          ptr("i", i)
          ptr("j", j)
          mark("focus", i === j ? [i] : [i, j])
          const pair = people[i] + people[j] <= limit
          line(5, `Lightest ${people[i]} + heaviest ${people[j]} = ${people[i] + people[j]} ${pair ? "≤" : ">"} ${limit} → ${pair ? "<b>they share a boat</b>" : "<b>too heavy together</b> — and if the LIGHTEST can't join, nobody can"}.`)
          if (i === j && pair) {
            launched.push(`[${people[i]}]`)
          } else if (pair) {
            launched.push(`[${people[i]},${people[j]}]`)
          } else {
            launched.push(`[${people[j]}]`)
          }
          if (pair) {
            i++
            line(6, `Pair them up — i moves to ${i}.`)
          }
          j--
          boats++
          heap("boats", [...launched])
          vars({ i, j, boats })
          mark("done", Array.from({ length: people.length }, (_, k) => k).filter((k) => k < i || k > j))
          line(8, `Boat #${boats} launches: ${launched[launched.length - 1]}.`)
        }
        ptr("i", -1)
        ptr("j", -1)
        mark("focus", [])
        line(10, `Everyone is rescued in <b>${boats}</b> boats.`)
        return boats
      },
      1,
    )
    narrate(`Greedy pairing: match the heaviest with the lightest. Wasting the lightest person on a middle-weight can never save a boat.`)
    return solve()
  },
}
