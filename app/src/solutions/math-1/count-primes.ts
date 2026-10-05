import type { SolutionDef } from "@/engine/types"

const clampN = (n: number) => Math.min(50, Math.max(2, Math.trunc(n)))

export const countPrimes: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: clampN(a.n as number) }, (_, i) => i),
  code: `// sieve of Eratosthenes: cross out multiples, survivors are prime
function countPrimes(n) {
  const comp = new Array(n).fill(false);
  for (let p = 2; p * p < n; p++) {
    if (comp[p]) continue;              // already crossed out
    for (let j = p * p; j < n; j += p)
      comp[j] = true;                   // j = p * k is composite
  }
  let count = 0;
  for (let i = 2; i < n; i++)
    if (!comp[i]) count++;
  return count;
}`,
  codeJava: `// sieve of Eratosthenes: cross out multiples, survivors are prime
int countPrimes(int n) {
  boolean[] comp = new boolean[n];
  for (int p = 2; p * p < n; p++) {
    if (comp[p]) continue;              // already crossed out
    for (int j = p * p; j < n; j += p)
      comp[j] = true;                   // j = p * k is composite
  }
  int count = 0;
  for (int i = 2; i < n; i++)
    if (!comp[i]) count++;
  return count;
}`,
  inputs: [{ kind: "number", name: "n", label: "n (count primes < n)", default: 30, min: 2, max: 50 }],
  entry: (a) => `countPrimes(${clampN(a.n as number)})`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const n = clampN(args.n as number)
    const go = fn(
      "countPrimes",
      (): number => {
        const comp = new Array(n).fill(false)
        const crossed: number[] = []
        const primes: number[] = []
        mark("bad", n > 1 ? [0, 1] : [0])
        line(2, `Cells are the numbers 0…${n - 1}. Assume all ≥ 2 are prime; 0 and 1 are out by definition.`)
        for (let p = 2; p * p < n; p++) {
          ptr("p", p)
          if (comp[p]) {
            line(4, `p = ${p} is already crossed out — its multiples were handled by a smaller prime. Skip.`)
            continue
          }
          primes.push(p)
          mark("good", [...primes])
          line(4, `p = <b>${p}</b> survived every smaller prime → it is prime. Cross out its multiples.`)
          for (let j = p * p; j < n; j += p) {
            ptr("j", j)
            if (!comp[j]) {
              comp[j] = true
              crossed.push(j)
              aset(j, "×")
              mark("bad", [0, 1, ...crossed])
              line(6, `j = <b>${j}</b> = ${p} × ${j / p} — composite, cross it out.`)
            } else {
              line(6, `j = ${j} was already crossed out (a smaller prime got there first) — starting at p² = ${p * p} skips most of these.`)
            }
            vars({ p, j })
          }
          ptr("j", -1)
        }
        ptr("p", -1)
        line(3, `p² ≥ ${n}: any composite < ${n} has a factor ≤ √${n}, so the sieve is complete.`)
        let count = 0
        const survivors: number[] = []
        for (let i = 2; i < n; i++) {
          if (!comp[i]) {
            count++
            survivors.push(i)
          }
        }
        mark("good", [...survivors])
        line(11, `Survivors (green) are the primes < ${n}: ${survivors.join(", ")} → count = <b>${count}</b>.`)
        return count
      },
      1,
    )
    return go()
  },
}
