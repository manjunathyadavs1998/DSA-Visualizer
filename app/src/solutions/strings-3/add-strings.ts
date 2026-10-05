import type { SolutionDef } from "@/engine/types"

const digits = (raw: unknown, dflt: string): string => {
  const d = String(raw).replace(/\D/g, "").replace(/^0+(?=.)/, "")
  return d.length ? d : dflt
}

export const addStrings: SolutionDef = {
  view: "array",
  array: (a) => [...digits(a.num1, "456").split(""), "+", ...digits(a.num2, "777").split("")],
  code: `// add digit by digit from the right, carrying
function addStrings(num1, num2) {
  let i = num1.length - 1, j = num2.length - 1;
  let carry = 0, out = "";
  while (i >= 0 || j >= 0 || carry > 0) {
    const a = i >= 0 ? num1[i--] - 0 : 0;
    const b = j >= 0 ? num2[j--] - 0 : 0;
    const sum = a + b + carry;
    out = (sum % 10) + out;
    carry = Math.floor(sum / 10);
  }
  return out;
}`,
  codeJava: `// add digit by digit from the right, carrying
String addStrings(String num1, String num2) {
  int i = num1.length() - 1, j = num2.length() - 1;
  int carry = 0; StringBuilder out = new StringBuilder();
  while (i >= 0 || j >= 0 || carry > 0) {
    int a = i >= 0 ? num1.charAt(i--) - '0' : 0;
    int b = j >= 0 ? num2.charAt(j--) - '0' : 0;
    int sum = a + b + carry;
    out.insert(0, sum % 10);
    carry = sum / 10;
  }
  return out.toString();
}`,
  inputs: [
    { kind: "string", name: "num1", label: "num1", default: "456", maxLen: 6 },
    { kind: "string", name: "num2", label: "num2", default: "777", maxLen: 6 },
  ],
  entry: (a) => `addStrings("${digits(a.num1, "456")}", "${digits(a.num2, "777")}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const num1 = digits(args.num1, "456")
    const num2 = digits(args.num2, "777")
    const off = num1.length + 1 // num2 starts after the "+" cell
    const go = fn(
      "addStrings",
      (): string => {
        let i = num1.length - 1
        let j = num2.length - 1
        let carry = 0
        let out = ""
        ptr("i", i)
        ptr("j", off + j)
        line(2, `Start both pointers at the <b>rightmost digit</b> — exactly how you add on paper.`)
        heap("out", out)
        while (i >= 0 || j >= 0 || carry > 0) {
          mark("focus", [...(i >= 0 ? [i] : []), ...(j >= 0 ? [off + j] : [])])
          const a = i >= 0 ? Number(num1[i]) : 0
          const b = j >= 0 ? Number(num2[j]) : 0
          if (i >= 0) line(5, `a = num1[${i}] = <b>${a}</b>.`)
          else line(5, `num1 is exhausted → a = <b>0</b>.`)
          if (j >= 0) line(6, `b = num2[${j}] = <b>${b}</b>.`)
          else line(6, `num2 is exhausted → b = <b>0</b>.`)
          i--
          j--
          const sum = a + b + carry
          line(7, `sum = ${a} + ${b} + carry(${carry}) = <b>${sum}</b>.`)
          out = String(sum % 10) + out
          heap("out", out)
          line(8, `Prepend the ones digit ${sum % 10} → out = "<b>${out}</b>".`)
          carry = Math.floor(sum / 10)
          line(9, `carry = ⌊${sum} / 10⌋ = <b>${carry}</b>.`)
          ptr("i", i)
          ptr("j", j >= 0 ? off + j : -1)
          vars({ i, j, carry, out })
        }
        mark("focus", [])
        line(11, `Both numbers consumed and carry is 0 → "<b>${out}</b>". No BigInt, no overflow — just digits.`)
        return out
      },
      1,
    )
    return go()
  },
}
