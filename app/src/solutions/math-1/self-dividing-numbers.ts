import type { SolutionDef } from "@/engine/types"

const range = (a: Record<string, unknown>): [number, number] => {
  const left = Math.min(100, Math.max(1, Math.trunc(a.left as number)))
  let right = Math.min(100, Math.max(left, Math.trunc(a.right as number)))
  if (right - left > 29) right = left + 29 // keep the sweep small
  return [left, right]
}

export const selfDividingNumbers: SolutionDef = {
  view: "array",
  array: (a) => {
    const [l, r] = range(a)
    return Array.from({ length: r - l + 1 }, (_, i) => l + i)
  },
  code: `// a number is self-dividing if EVERY digit divides it (no 0 digits)
function selfDividingNumbers(left, right) {
  const out = [];
  for (let n = left; n <= right; n++) {
    let ok = true, t = n;
    while (t > 0) {
      const d = t % 10;
      if (d === 0 || n % d !== 0) ok = false;
      t = Math.floor(t / 10);
    }
    if (ok) out.push(n);
  }
  return out;
}`,
  codeJava: `// a number is self-dividing if EVERY digit divides it (no 0 digits)
List<Integer> selfDividingNumbers(int left, int right) {
  List<Integer> out = new ArrayList<>();
  for (int n = left; n <= right; n++) {
    boolean ok = true; int t = n;
    while (t > 0) {
      int d = t % 10;
      if (d == 0 || n % d != 0) ok = false;
      t = t / 10;
    }
    if (ok) out.add(n);
  }
  return out;
}`,
  inputs: [
    { kind: "number", name: "left", label: "left", default: 1, min: 1, max: 100 },
    { kind: "number", name: "right", label: "right", default: 22, min: 1, max: 100 },
  ],
  entry: (a) => `selfDividingNumbers(${range(a)[0]}, ${range(a)[1]})`,
  run({ fn, line, mark, vars, heap }, args) {
    const [left, right] = range(args)
    const go = fn(
      "selfDividingNumbers",
      (): string => {
        const out: number[] = []
        const good: number[] = []
        const bad: number[] = []
        line(3, `Check each n in [${left}, ${right}]: n must be divisible by each of its own digits.`)
        for (let n = left; n <= right; n++) {
          const idx = n - left
          mark("focus", [idx])
          vars({ n })
          let ok = true
          const checks: string[] = []
          for (let t = n; t > 0; t = Math.floor(t / 10)) {
            const d = t % 10
            if (d === 0) {
              ok = false
              checks.push(`digit 0 — nothing is divisible by 0`)
            } else if (n % d !== 0) {
              ok = false
              checks.push(`${n} % ${d} = ${n % d} ✗`)
            } else {
              checks.push(`${n} % ${d} = 0 ✓`)
            }
          }
          if (ok) {
            out.push(n)
            good.push(idx)
            mark("good", [...good])
            heap("out", [...out])
            line(10, `n = <b>${n}</b>: ${checks.reverse().join(", ")} → every digit divides it → <b>keep</b>.`)
          } else {
            bad.push(idx)
            mark("bad", [...bad])
            line(7, `n = ${n}: ${checks.reverse().join(", ")} → <b>reject</b>.`)
          }
        }
        mark("focus", [])
        line(12, `Self-dividing numbers in [${left}, ${right}]: <b>[${out.join(", ")}]</b> — note every 1-digit number qualifies, and nothing containing a 0 ever can.`)
        return `[${out.join(",")}]`
      },
      1,
    )
    return go()
  },
}
