import type { SolutionDef, Args } from "@/engine/types"

const prep = (args: Args): number[] =>
  [...(args.people as number[])].map((x) => Math.max(1, Math.trunc(x))).sort((a, b) => a - b)

export const boatsToSavePeople: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// sort; pair the heaviest with the lightest if they fit
function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0, right = people.length - 1, boats = 0;
  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++;                     // lightest rides along for free
    }
    right--;                      // heaviest always boards this boat
    boats++;
  }
  return boats;
}`,
  codeJava: `// sort; pair the heaviest with the lightest if they fit
int numRescueBoats(int[] people, int limit) {
  Arrays.sort(people);
  int left = 0, right = people.length - 1, boats = 0;
  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++;                     // lightest rides along for free
    }
    right--;                      // heaviest always boards this boat
    boats++;
  }
  return boats;
}`,
  inputs: [
    { kind: "numbers", name: "people", label: "people (weights)", default: [3, 2, 2, 1, 4, 5], maxLen: 12 },
    { kind: "number", name: "limit", label: "limit", default: 5, min: 1, max: 30 },
  ],
  entry: (a) => `numRescueBoats([${prep(a).join(",")}], ${a.limit})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const people = prep(args)
    // each person must individually fit in a boat, or the answer is undefined
    const limit = Math.max(args.limit as number, people[people.length - 1] ?? 1)
    const go = fn(
      "numRescueBoats",
      (): number => {
        line(2, `Sorted: [${people.join(", ")}]. Greedy claim: the <b>heaviest</b> person boards now — the only question is who joins them.`)
        let left = 0
        let right = people.length - 1
        let boats = 0
        ptr("left", left)
        ptr("right", right)
        line(3, `left = lightest remaining, right = heaviest remaining; each boat seats at most 2 within limit ${limit}.`)
        while (left <= right) {
          mark("focus", left === right ? [left] : [left, right])
          if (people[left] + people[right] <= limit) {
            line(5, left === right
              ? `Last person (${people[left]}) sails alone.`
              : `${people[left]} + ${people[right]} = ${people[left] + people[right]} ≤ ${limit} — the lightest <b>fits alongside</b> the heaviest.`)
            mark("good", left === right ? [left] : [left, right])
            left++
            ptr("left", left)
            line(6, `left → ${left}: that lightest person is aboard. If they can't pair with the heaviest, nobody can.`)
          } else {
            line(5, `${people[left]} + ${people[right]} = ${people[left] + people[right]} > ${limit} — no one can share with ${people[right]}.`)
            mark("good", [right])
          }
          right--
          ptr("right", right >= 0 ? right : -1)
          boats++
          line(9, `Boat <b>#${boats}</b> departs. Remaining range: [${left}..${right}].`)
          vars({ left, right, boats })
        }
        mark("focus", [])
        line(11, `Everyone is rescued with <b>${boats}</b> boats — provably minimal.`)
        return boats
      },
      1,
    )
    return go()
  },
}
