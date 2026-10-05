import type { SolutionDef } from "@/engine/types"

/** Flat [h,k,...] → people sorted tall-first, ties by smaller k. */
const toPeople = (flat: number[]): [number, number][] => {
  const out: [number, number][] = []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const h = Math.max(1, Math.trunc(Math.abs(flat[i])))
    const k = Math.max(0, Math.trunc(Math.abs(flat[i + 1])))
    out.push([h, Math.min(k, 11)])
  }
  if (!out.length) out.push([7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2])
  return out.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]))
}

export const queueReconstructionByHeight: SolutionDef = {
  view: "array",
  array: (a) => toPeople(a.people as number[]).map(([h, k]) => `${h},${k}`),
  code: `// person = [h, k]: k people ≥ h stand in front of them
function reconstructQueue(people) {
  people.sort((a, b) =>
    a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);  // tall first
  const queue = [];
  for (const p of people) {
    queue.splice(p[1], 0, p);   // insert at index k
  }
  return queue;
}`,
  codeJava: `// person = [h, k]: k people ≥ h stand in front of them
int[][] reconstructQueue(int[][] people) {
  Arrays.sort(people, (a, b) ->
    a[0] == b[0] ? a[1] - b[1] : b[0] - a[0]);   // tall first
  List<int[]> queue = new ArrayList<>();
  for (int[] p : people) {
    queue.add(p[1], p);         // insert at index k
  }
  return queue.toArray(new int[0][]);
}`,
  inputs: [
    {
      kind: "numbers", name: "people", label: "people (flat [height,k] pairs: 7,0,4,4 = [7,0],[4,4])",
      default: [7, 0, 4, 4, 7, 1, 5, 0, 6, 1, 5, 2], maxLen: 12,
    },
  ],
  entry: (a) => `reconstructQueue([${toPeople(a.people as number[]).map((p) => `[${p.join(",")}]`).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const people = toPeople(args.people as number[])
    const solve = fn(
      "reconstructQueue",
      (): string => {
        line(2, `Sort tallest first (ties: smaller k first). Cells above show that sorted order.`)
        line(3, `Why tall first? When a person is placed, everyone already placed is ≥ their height — so their k is literally the index they belong at.`)
        const queue: [number, number][] = []
        heap("queue", [])
        for (let idx = 0; idx < people.length; idx++) {
          const p = people[idx]
          ptr("next", idx)
          mark("focus", [idx])
          line(5, `Person [${p.join(",")}]: needs exactly <b>${p[1]}</b> people as-tall-or-taller ahead — and ALL ${queue.length} placed so far qualify.`)
          queue.splice(p[1], 0, p)
          heap("queue", queue.map((q) => `[${q.join(",")}]`))
          mark("good", Array.from({ length: idx + 1 }, (_, k) => k))
          line(6, `Insert at index <b>${p[1]}</b> → queue = ${queue.map((q) => `[${q.join(",")}]`).join(" ")}.`)
          vars({ placed: idx + 1 })
          narrate(`Shorter people inserted later slide in WITHOUT breaking [${p.join(",")}]'s count — they don't count toward anyone taller.`)
        }
        ptr("next", -1)
        mark("focus", [])
        line(8, `Reconstructed queue: <b>${queue.map((q) => `[${q.join(",")}]`).join(" ")}</b>.`)
        return `[${queue.map((q) => `[${q.join(",")}]`).join(",")}]`
      },
      1,
    )
    narrate(`Greedy by height: process tallest → shortest; each insertion is final because later (shorter) arrivals are invisible to earlier counts.`)
    return solve()
  },
}
