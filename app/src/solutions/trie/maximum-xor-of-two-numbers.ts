import type { SolutionDef } from "@/engine/types"

/** Clamp to at most 4 values in the 5-bit range 0..31 (keeps the trie tiny). */
const mask5 = (nums: number[]): number[] => nums.slice(0, 4).map((n) => Math.abs(Math.round(n)) & 31)
const b = (n: number): string => n.toString(2).padStart(5, "0")

export const maximumXor: SolutionDef = {
  code: `// b(n) = 5-bit binary string; nodes = set of bit paths (the trie)
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
// for each n: query FIRST, then insert — pairs only with earlier nums`,
  codeJava: `// b(n) = 5-bit binary string; Set<String> nodes = bit paths
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
// for each n: query FIRST, then insert — pairs only with earlier nums`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (0–31)", default: [5, 10, 25], maxLen: 4 }],
  entry: (a) => `maxXor(${JSON.stringify(mask5(a.nums as number[]))})`,
  run({ fn, line, heap, vars, narrate }, args) {
    const nums = mask5(args.nums as number[])
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
          line(
            10,
            `Bit ${bit}: mine is ${rest[0]}, the <b>opposite</b> ${want} exists → take it. This XOR bit becomes 1, worth ${2 ** (rest.length - 1)} — a high 1-bit beats everything below it.`,
          )
          return q(done + want, rest.slice(1), acc * 2 + 1)
        }
        line(12, `Bit ${bit}: opposite ${want} missing — forced to follow my own ${rest[0]}; this XOR bit is 0.`)
        return q(done + rest[0], rest.slice(1), acc * 2)
      },
      7,
    )

    const root = fn(
      "maxXor",
      (_ns: number[]): number => {
        narrate("Greedy on bits: at every trie level, taking the OPPOSITE bit sets that XOR bit to 1 — and bit 16 outweighs 8+4+2+1 combined, so grab high bits first. Query each number BEFORE inserting it, so it pairs only with earlier numbers.")
        heap("nums", nums)
        heap("bits", nums.map((n) => `${n} = ${b(n)}`))
        let best = 0
        for (const n of nums) {
          if (nodes.size > 0) {
            line(14, `Query ${n} (${b(n)}) against the trie of earlier numbers: chase opposite bits.`)
            const v = q("", b(n), 0)
            if (v > best) best = v
            vars({ best })
            narrate(`${n} reaches XOR ${v} with its best earlier partner; best so far = ${best}.`)
          }
          line(1, `insert ${n} = <b>${b(n)}</b> bit by bit — the call chain below is its trie path.`)
          ins("", b(n))
        }
        return best
      },
      0,
    )
    return root(nums)
  },
}
