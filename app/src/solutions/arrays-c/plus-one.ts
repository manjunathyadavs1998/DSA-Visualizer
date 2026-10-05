import type { SolutionDef } from "@/engine/types"

export const plusOne: SolutionDef = {
  view: "array",
  array: (a) => a.digits as number[],
  code: `// add one to the number spelled by the digit array
function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;             // absorb the carry — done
      return digits;
    }
    digits[i] = 0;             // 9 rolls over, carry moves left
  }
  return [1, ...digits];       // all 9s → need a new leading 1
}`,
  codeJava: `// add one to the number spelled by the digit array
int[] plusOne(int[] digits) {
  for (int i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;             // absorb the carry — done
      return digits;
    }
    digits[i] = 0;             // 9 rolls over, carry moves left
  }
  int[] r = new int[digits.length + 1]; r[0] = 1; return r;
}`,
  inputs: [{ kind: "numbers", name: "digits", label: "digits", default: [4, 3, 9, 9, 9], maxLen: 10 }],
  entry: (a) => `plusOne([${(a.digits as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, narrate }, args) {
    // sanitize: each cell must be a single digit 0..9
    const digits = (args.digits as number[]).map((d) => Math.min(9, Math.max(0, Math.trunc(Math.abs(d)))))
    digits.forEach((d, i) => aset(i, d))
    const go = fn(
      "plusOne",
      (): number[] => {
        line(2, `Add 1 the way we do on paper: start at the <b>last digit</b> and carry leftwards.`)
        for (let i = digits.length - 1; i >= 0; i--) {
          ptr("i", i)
          mark("focus", [i])
          vars({ i, digit: digits[i] })
          line(3, `digits[${i}] = <b>${digits[i]}</b> — less than 9? (${digits[i] < 9 ? "<b>yes</b>" : "no, it will overflow"})`)
          if (digits[i] < 9) {
            digits[i]++
            aset(i, digits[i])
            mark("good", [i])
            line(4, `Bump it to <b>${digits[i]}</b> — the carry is absorbed, nothing left to do.`)
            line(5, `Return <b>[${digits.join(",")}]</b>.`)
            return digits
          }
          digits[i] = 0
          aset(i, 0)
          mark("bad", [i])
          line(7, `9 + 1 = 10 → write <b>0</b> here and carry the 1 to index ${i - 1 >= 0 ? i - 1 : "— none left!"}.`)
        }
        ptr("i", -1)
        mark("focus", [])
        const res = [1, ...digits]
        line(9, `Every digit was a 9 → the number grows a digit: <b>[${res.join(",")}]</b>.`)
        return res
      },
      1,
    )
    narrate("The only interesting case is the carry: a trailing run of 9s turns to 0s, and the first non-9 (or a brand-new 1) absorbs it.")
    const res = go()
    return `[${res.join(",")}]`
  },
}
