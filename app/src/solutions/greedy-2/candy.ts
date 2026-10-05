import type { SolutionDef } from "@/engine/types"

const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(0, Math.trunc(Math.abs(v))))
  return out.length ? out : [1, 3, 2, 2, 1, 4, 5, 2]
}

export const candy: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.ratings as number[]),
  code: `// each child beats a lower-rated NEIGHBOR → more candy
function candy(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);   // everyone gets 1
  for (let i = 1; i < n; i++)             // left → right
    if (ratings[i] > ratings[i - 1])
      candies[i] = candies[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--)        // right → left
    if (ratings[i] > ratings[i + 1])
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
  let sum = 0;
  for (const c of candies) sum += c;
  return sum;
}`,
  codeJava: `// each child beats a lower-rated NEIGHBOR → more candy
int candy(int[] ratings) {
  int n = ratings.length;
  int[] candies = new int[n]; Arrays.fill(candies, 1);
  for (int i = 1; i < n; i++)             // left → right
    if (ratings[i] > ratings[i - 1])
      candies[i] = candies[i - 1] + 1;
  for (int i = n - 2; i >= 0; i--)        // right → left
    if (ratings[i] > ratings[i + 1])
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
  int sum = 0;
  for (int c : candies) sum += c;
  return sum;
}`,
  inputs: [
    { kind: "numbers", name: "ratings", label: "ratings (child i's rating)", default: [1, 3, 2, 2, 1, 4, 5, 2], maxLen: 10 },
  ],
  entry: (a) => `candy([${sanitize(a.ratings as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const ratings = sanitize(args.ratings as number[])
    const n = ratings.length
    const solve = fn(
      "candy",
      (): number => {
        const candies = new Array(n).fill(1)
        heap("candies", [...candies])
        line(3, `Baseline: every child gets <b>1</b> candy. Now fix the two rules one direction at a time.`)
        for (let i = 1; i < n; i++) {
          ptr("i", i)
          mark("focus", [i - 1, i])
          line(5, `L→R: ratings[${i}]=${ratings[i]} vs left neighbor ${ratings[i - 1]} → ${ratings[i] > ratings[i - 1] ? "<b>higher, must get more</b>" : "not higher, rule satisfied"}.`)
          if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1
            heap("candies", [...candies])
            line(6, `candies[${i}] = candies[${i - 1}] + 1 = <b>${candies[i]}</b>. Left-neighbor rule now holds up to ${i}.`)
          }
        }
        narrate(`After the left pass every rising slope is paid: candies = [${candies.join(",")}]. But falling slopes are still flat 1s.`)
        for (let i = n - 2; i >= 0; i--) {
          ptr("i", i)
          mark("focus", [i, i + 1])
          line(8, `R→L: ratings[${i}]=${ratings[i]} vs right neighbor ${ratings[i + 1]} → ${ratings[i] > ratings[i + 1] ? "<b>higher, must get more</b>" : "not higher, rule satisfied"}.`)
          if (ratings[i] > ratings[i + 1]) {
            const want = candies[i + 1] + 1
            candies[i] = Math.max(candies[i], want)
            heap("candies", [...candies])
            line(9, `candies[${i}] = max(${candies[i] === want ? `old, ${want}` : `<b>${candies[i]}</b> from the left pass, ${want}`}) = <b>${candies[i]}</b> — max() keeps the left rule intact.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        let sum = 0
        for (const c of candies) sum += c
        vars({ sum })
        mark("good", candies.map((_, k) => k))
        line(12, `Final candies [${candies.join(",")}] sum to <b>${sum}</b> — the proven minimum.`)
        return sum
      },
      1,
    )
    narrate(`Two independent constraints (left neighbor, right neighbor) → two sweeps; taking max() merges them without breaking either.`)
    return solve()
  },
}
