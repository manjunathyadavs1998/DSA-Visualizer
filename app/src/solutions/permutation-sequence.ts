import type { SolutionDef } from "@/engine/types"

export const permutationSequence: SolutionDef = {
  code: `// n, k editable — build the k-th permutation directly
function kth(digits, k) {   // k is 0-based here
  if (digits.length === 0) return "";
  const f = fact(digits.length - 1);  // block size
  const idx = Math.floor(k / f);      // which block?
  const d = digits[idx];
  digits.splice(idx, 1);              // digit d is used up
  return d + kth(digits, k % f);
}`,
  codeJava: `// int n, k — build the k-th permutation directly
String kth(List<Integer> digits, int k) { // k 0-based
  if (digits.size() == 0) return "";
  int f = fact(digits.size() - 1);    // block size
  int idx = k / f;                    // which block?
  int d = digits.get(idx);
  digits.remove(idx);                 // digit d is used up
  return d + kth(digits, k % f);
}`,
  inputs: [
    { kind: "number", name: "n", label: "n", default: 4, min: 3, max: 6 },
    { kind: "number", name: "k", label: "k (1-based)", default: 17, min: 1, max: 720 },
  ],
  entry: (a) => `kth([1..${a.n}], ${(a.k as number) - 1})`,
  run({ fn, line, vars, narrate }, args) {
    const n = args.n as number
    const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1))
    const kMax = fact(n)
    const k0 = Math.min((args.k as number) - 1, kMax - 1)
    const kth = fn(
      "kth",
      (digits: number[], k: number): string => {
        line(2, `Digits left: [${digits.join(",")}], k = ${k}. ${digits.length === 0 ? "<b>Nothing left — done.</b>" : ""}`)
        if (digits.length === 0) return ""
        const f = fact(digits.length - 1)
        const idx = Math.floor(k / f)
        vars({ k, "block f": f, idx, pick: digits[idx] })
        line(3, `Permutations starting with each digit form blocks of (${digits.length}-1)! = ${f}.`)
        line(4, `k = ${k} lands in block ${idx} → the leader is digit <b>${digits[idx]}</b>. No brute force!`)
        const d = digits[idx]
        digits.splice(idx, 1)
        line(7, `Prefix so far gains ${d}; recurse with k = ${k} mod ${f} = ${k % f}.`)
        return d + kth(digits, k % f)
      },
      1,
    )
    narrate(`Instead of enumerating all ${kMax} permutations, jump straight to the k-th using factorial block sizes.`)
    return kth(Array.from({ length: n }, (_, i) => i + 1), k0)
  },
}
