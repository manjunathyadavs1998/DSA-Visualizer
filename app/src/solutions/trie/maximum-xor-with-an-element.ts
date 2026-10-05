import type { SolutionDef } from "@/engine/types"

const mask5 = (nums: number[]): number[] => nums.slice(0, 4).map((n) => Math.abs(Math.round(n)) & 31)
const b = (n: number): string => n.toString(2).padStart(5, "0")

export const maximumXorWithElement: SolutionDef = {
  code: `// one query (x, limit): keep nums ≤ limit, then greedy trie walk
function insert(done, rest) {
  if (rest === "") return;
  const next = done + rest[0];
  if (!nodes.has(next)) nodes.add(next);
  insert(next, rest.slice(1));
}
function bestXor(done, rest, acc) {
  if (rest === "") return acc;
  const want = rest[0] === "0" ? "1" : "0";  // opposite bit → XOR bit 1
  if (nodes.has(done + want))
    return bestXor(done + want, rest.slice(1), acc * 2 + 1);
  return bestXor(done + rest[0], rest.slice(1), acc * 2);
}
// cand = nums ≤ limit;  no cand → -1;  else bestXor("", b(x), 0)`,
  codeJava: `// one query (x, limit): keep nums ≤ limit, then greedy trie walk
void insert(String done, String rest) {
  if (rest.isEmpty()) return;
  String next = done + rest.charAt(0);
  if (!nodes.contains(next)) nodes.add(next);
  insert(next, rest.substring(1));
}
int bestXor(String done, String rest, int acc) {
  if (rest.isEmpty()) return acc;
  char want = rest.charAt(0) == '0' ? '1' : '0';
  if (nodes.contains(done + want))
    return bestXor(done + want, rest.substring(1), acc * 2 + 1);
  return bestXor(done + rest.charAt(0), rest.substring(1), acc * 2);
}
// cand = nums ≤ limit;  no cand → -1;  else bestXor("", b(x), 0)`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (0–31)", default: [3, 10, 5, 25], maxLen: 4 },
    { kind: "number", name: "x", label: "x", default: 6, min: 0, max: 31 },
    { kind: "number", name: "limit", label: "limit", default: 10, min: 0, max: 31 },
  ],
  entry: (a) => `query(${a.x}, ${a.limit})`,
  run({ fn, line, heap, vars, narrate }, args) {
    const nums = mask5(args.nums as number[])
    const x = (args.x as number) & 31
    const limit = (args.limit as number) & 31
    const nodes = new Set<string>()

    const ins = fn(
      "ins",
      (done: string, rest: string): string => {
        if (rest === "") return "✓"
        const next = done + rest[0]
        if (!nodes.has(next)) {
          nodes.add(next)
          heap("trie", [...nodes].sort())
        }
        ins(next, rest.slice(1))
        return "✓"
      },
      1,
    )

    const q = fn(
      "xor",
      (done: string, rest: string, acc: number): number => {
        if (rest === "") {
          line(8, `All 5 bits chosen — partner path '${done}' gives XOR = <b>${acc}</b>.`)
          return acc
        }
        const bit = 5 - rest.length
        const want = rest[0] === "0" ? "1" : "0"
        if (nodes.has(done + want)) {
          line(10, `Bit ${bit}: mine is ${rest[0]}, the <b>opposite</b> ${want} exists among the allowed numbers → take it; XOR bit 1 (worth ${2 ** (rest.length - 1)}).`)
          return q(done + want, rest.slice(1), acc * 2 + 1)
        }
        line(12, `Bit ${bit}: opposite ${want} missing — forced to follow my own ${rest[0]}; XOR bit 0.`)
        return q(done + rest[0], rest.slice(1), acc * 2)
      },
      7,
    )

    const root = fn(
      "query",
      (_x: number, _limit: number): number => {
        narrate(
          `The partner must be ≤ ${limit}. Simplified here: pre-filter the candidates, then run the usual opposite-bit walk. A production version stores each subtree's MIN value in its node, so one shared trie answers every (x, limit) without rebuilding.`,
        )
        heap("nums", nums)
        const cand = nums.filter((n) => n <= limit)
        line(14, `<b>Constraint check</b>: keep only nums ≤ ${limit} → [${cand.join(", ")}]. ${nums.length - cand.length ? `Dropped ${nums.filter((n) => n > limit).join(", ")} — too big to be a partner.` : "Nothing dropped."}`)
        heap("candidates", cand)
        if (cand.length === 0) {
          line(14, `No number obeys the limit — the query has no partner → <b>-1</b>.`)
          return -1
        }
        for (const n of cand) {
          line(1, `insert ${n} = <b>${b(n)}</b> into the bit trie.`)
          ins("", b(n))
        }
        line(14, `Now walk for x = ${x} (${b(x)}), chasing opposite bits.`)
        const best = q("", b(x), 0)
        vars({ best })
        narrate(`Answer: max XOR of ${x} with any allowed number = <b>${best}</b>.`)
        return best
      },
      0,
    )
    return root(x, limit)
  },
}
