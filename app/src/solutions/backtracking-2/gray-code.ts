import type { SolutionDef } from "@/engine/types"

export const grayCode: SolutionDef = {
  code: `// n-bit Gray code by reflect-and-prefix
function gray(n) {
  if (n === 1) return ["0", "1"];      // base: 1 bit
  const prev = gray(n - 1);            // (n-1)-bit sequence
  const out = [];
  for (const code of prev)
    out.push("0" + code);              // first half: prefix 0
  for (const code of [...prev].reverse())
    out.push("1" + code);              // second half: REFLECT, prefix 1
  return out;
}`,
  codeJava: `// n-bit Gray code by reflect-and-prefix
List<String> gray(int n) {
  if (n == 1) return new ArrayList<>(List.of("0", "1"));  // base: 1 bit
  List<String> prev = gray(n - 1);     // (n-1)-bit sequence
  List<String> out = new ArrayList<>();
  for (String code : prev)
    out.add("0" + code);               // first half: prefix 0
  for (int i = prev.size() - 1; i >= 0; i--)
    out.add("1" + prev.get(i));        // second half: REFLECT, prefix 1
  return out;
}`,
  inputs: [{ kind: "number", name: "n", label: "n (bits)", default: 3, min: 1, max: 4 }],
  entry: (a) => `gray(${a.n})`,
  run({ fn, heap, line, vars, narrate }, args) {
    const n = args.n as number
    const gray = fn(
      "gray",
      (bits: number): string[] => {
        line(2, `gray(${bits}): base case? (${bits === 1 ? '<b>yes — ["0","1"]</b>, the only 1-bit Gray code' : "no — recurse first"})`)
        if (bits === 1) return ["0", "1"]
        line(3, `Need the ${bits - 1}-bit sequence before we can build the ${bits}-bit one.`)
        const prev = gray(bits - 1)
        const out: string[] = []
        vars({ n: bits, prev: `[${prev.join(",")}]` })
        for (const code of prev) {
          out.push("0" + code)
          line(6, `Forward pass: "0" + "${code}" → "<b>0${code}</b>" (out = [${out.join(",")}]).`)
        }
        heap("output", out)
        for (const code of [...prev].reverse()) {
          out.push("1" + code)
          line(8, `Reflected pass: "1" + "${code}" → "<b>1${code}</b>" — walking prev <b>backwards</b> makes the seam ("0${prev[prev.length - 1]}" → "1${prev[prev.length - 1]}") differ by one bit.`)
        }
        heap("output", out)
        line(9, `gray(${bits}) returns ${out.length} codes: [${out.join(",")}] — neighbors (and the wrap-around) differ by exactly 1 bit.`)
        return out
      },
      1,
    )
    narrate(`Reflect-and-prefix: mirror the (n−1)-bit list so the junction changes only the new leading bit. 2ⁿ = ${2 ** n} codes for n = ${n}.`)
    const codes = gray(n)
    heap("output", codes)
    return JSON.stringify(codes.map((c) => parseInt(c, 2)))
  },
}
