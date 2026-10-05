import type { SolutionDef } from "@/engine/types"

const clampN = (n: number) => Math.min(30, Math.max(3, Math.trunc(n)))

export const fizzBuzz: SolutionDef = {
  view: "array",
  array: (a) => Array.from({ length: clampN(a.n as number) }, (_, i) => i + 1),
  code: `// divisibility by 3, by 5, or by both — check 15 FIRST
function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }
  return out;
}`,
  codeJava: `// divisibility by 3, by 5, or by both — check 15 FIRST
List<String> fizzBuzz(int n) {
  List<String> out = new ArrayList<>();
  for (int i = 1; i <= n; i++) {
    if (i % 15 == 0) out.add("FizzBuzz");
    else if (i % 3 == 0) out.add("Fizz");
    else if (i % 5 == 0) out.add("Buzz");
    else out.add(String.valueOf(i));
  }
  return out;
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 15, min: 3, max: 30 }],
  entry: (a) => `fizzBuzz(${clampN(a.n as number)})`,
  run({ fn, line, mark, aset, heap, vars }, args) {
    const n = clampN(args.n as number)
    const go = fn(
      "fizzBuzz",
      (): string => {
        const out: string[] = []
        const fizz: number[] = []
        line(2, `Walk i = 1…${n}; cells show "F" for Fizz, "B" for Buzz, "FB" for FizzBuzz.`)
        for (let i = 1; i <= n; i++) {
          mark("focus", [i - 1])
          vars({ i })
          if (i % 15 === 0) {
            out.push("FizzBuzz")
            aset(i - 1, "FB")
            fizz.push(i - 1)
            line(4, `${i} % 15 = 0 — divisible by BOTH 3 and 5 → <b>FizzBuzz</b>. (Test 15 first, or "Fizz" would steal it.)`)
          } else if (i % 3 === 0) {
            out.push("Fizz")
            aset(i - 1, "F")
            fizz.push(i - 1)
            line(5, `${i} % 3 = 0 (and ${i} % 5 = ${i % 5}) → <b>Fizz</b>.`)
          } else if (i % 5 === 0) {
            out.push("Buzz")
            aset(i - 1, "B")
            fizz.push(i - 1)
            line(6, `${i} % 5 = 0 (and ${i} % 3 = ${i % 3}) → <b>Buzz</b>.`)
          } else {
            out.push(String(i))
            line(7, `${i}: not divisible by 3 or 5 → keep "<b>${i}</b>".`)
          }
          mark("good", [...fizz])
          heap("out", out)
        }
        mark("focus", [])
        line(9, `Done — every 15th cell is "FB", the pattern repeats with period <b>15</b> = lcm(3, 5).`)
        return out.join(",")
      },
      1,
    )
    return go()
  },
}
