import type { SolutionDef } from "@/engine/types"

const digits = (raw: unknown, dflt: string): string => {
  const d = String(raw).replace(/\D/g, "").replace(/^0+(?=.)/, "")
  return d.length ? d : dflt
}

export const multiplyStrings: SolutionDef = {
  view: "array",
  array: (a) => [...digits(a.num1, "123").split(""), "×", ...digits(a.num2, "45").split("")],
  code: `// grade-school: digit i × digit j lands in slot i+j+1
function multiply(num1, num2) {
  if (num1 === "0" || num2 === "0") return "0";
  const m = num1.length, n = num2.length;
  const res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const prod = (num1[i] - 0) * (num2[j] - 0) + res[i + j + 1];
      res[i + j + 1] = prod % 10;
      res[i + j] += Math.floor(prod / 10);
    }
  }
  return res.join("").replace(/^0+/, "");
}`,
  codeJava: `// grade-school: digit i × digit j lands in slot i+j+1
String multiply(String num1, String num2) {
  if (num1.equals("0") || num2.equals("0")) return "0";
  int m = num1.length(), n = num2.length();
  int[] res = new int[m + n];
  for (int i = m - 1; i >= 0; i--) {
    for (int j = n - 1; j >= 0; j--) {
      int prod = (num1.charAt(i) - '0') * (num2.charAt(j) - '0') + res[i + j + 1];
      res[i + j + 1] = prod % 10;
      res[i + j] += prod / 10;
    }
  }
  StringBuilder sb = new StringBuilder(); for (int d : res) sb.append(d); return sb.toString().replaceFirst("^0+", "");
}`,
  inputs: [
    { kind: "string", name: "num1", label: "num1", default: "123", maxLen: 4 },
    { kind: "string", name: "num2", label: "num2", default: "45", maxLen: 3 },
  ],
  entry: (a) => `multiply("${digits(a.num1, "123")}", "${digits(a.num2, "45")}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const num1 = digits(args.num1, "123")
    const num2 = digits(args.num2, "45")
    const off = num1.length + 1 // num2 starts after the "×" cell
    const go = fn(
      "multiply",
      (): string => {
        if (num1 === "0" || num2 === "0") {
          line(2, `One factor is "0" → the product is "<b>0</b>" without any work.`)
          return "0"
        }
        const m = num1.length
        const n = num2.length
        const res: number[] = new Array(m + n).fill(0)
        heap("res", [...res])
        line(4, `${m}-digit × ${n}-digit never exceeds <b>${m + n}</b> digits → res has ${m + n} slots, all 0.`)
        for (let i = m - 1; i >= 0; i--) {
          ptr("i", i)
          for (let j = n - 1; j >= 0; j--) {
            ptr("j", off + j)
            mark("focus", [i, off + j])
            const prod = (Number(num1[i])) * (Number(num2[j])) + res[i + j + 1]
            line(7, `${num1[i]} × ${num2[j]} + res[${i + j + 1}] (=${res[i + j + 1]}) = <b>${prod}</b> — the pair (i=${i}, j=${j}) feeds slots ${i + j} and ${i + j + 1}.`)
            res[i + j + 1] = prod % 10
            heap("res", [...res])
            line(8, `Ones digit: res[${i + j + 1}] = ${prod} % 10 = <b>${prod % 10}</b>.`)
            res[i + j] += Math.floor(prod / 10)
            heap("res", [...res])
            line(9, `Carry: res[${i + j}] += ${Math.floor(prod / 10)} → <b>${res[i + j]}</b>.`)
            vars({ i, j, prod, res: res.join("") })
          }
        }
        mark("focus", [])
        ptr("i", -1)
        ptr("j", -1)
        const out = res.join("").replace(/^0+/, "")
        line(12, `res = [${res.join(",")}] → strip leading zeros → "<b>${out}</b>".`)
        return out
      },
      1,
    )
    return go()
  },
}
