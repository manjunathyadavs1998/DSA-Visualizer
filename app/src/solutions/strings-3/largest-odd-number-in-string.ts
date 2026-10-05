import type { SolutionDef } from "@/engine/types"

const digits = (raw: unknown, dflt: string): string => {
  const d = String(raw).replace(/\D/g, "")
  return d.length ? d : dflt
}

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const largestOddNumberInString: SolutionDef = {
  view: "array",
  array: (a) => digits(a.num, "354270648").split(""),
  code: `// the answer is a prefix ending at the RIGHTMOST odd digit
function largestOddNumber(num) {
  for (let i = num.length - 1; i >= 0; i--) {
    const d = num[i] - 0;
    if (d % 2 === 1) {
      return num.slice(0, i + 1);
    }
  }
  return "";
}`,
  codeJava: `// the answer is a prefix ending at the RIGHTMOST odd digit
String largestOddNumber(String num) {
  for (int i = num.length() - 1; i >= 0; i--) {
    int d = num.charAt(i) - '0';
    if (d % 2 == 1) {
      return num.substring(0, i + 1);
    }
  }
  return "";
}`,
  inputs: [{ kind: "string", name: "num", label: "num", default: "354270648", maxLen: 14 }],
  entry: (a) => `largestOddNumber("${digits(a.num, "354270648")}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const num = digits(args.num, "354270648")
    const go = fn(
      "largestOddNumber",
      (): string => {
        line(2, `A number is odd iff its <b>last digit</b> is odd — so the longest (= largest) odd substring is a <b>prefix</b>. Scan from the right for the first odd digit.`)
        for (let i = num.length - 1; i >= 0; i--) {
          const d = Number(num[i])
          ptr("i", i)
          mark("focus", [i])
          line(3, `Look at num[${i}] = <b>${d}</b> — is it odd?`)
          if (d % 2 === 1) {
            mark("focus", [])
            mark("good", rng(0, i))
            line(5, `num[${i}] = <b>${d}</b> is odd → the prefix num[0..${i}] = "<b>${num.slice(0, i + 1)}</b>" is the largest odd number.`)
            return num.slice(0, i + 1)
          }
          mark("bad", [i])
          line(4, `No — ${d} is even, so any number ending here is even. Step left.`)
          vars({ i, d })
        }
        mark("focus", [])
        line(8, `Every digit is even → no odd substring exists → return "".`)
        return ""
      },
      1,
    )
    return go()
  },
}
