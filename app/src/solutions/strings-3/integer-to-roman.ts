import type { SolutionDef } from "@/engine/types"

export const integerToRoman: SolutionDef = {
  view: "array",
  array: (a) => String(a.num).split(""),
  code: `// greedy: subtract the largest value that fits
function intToRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let out = "";
  for (let k = 0; k < vals.length; k++) {
    while (num >= vals[k]) {
      out += syms[k];
      num -= vals[k];
    }
  }
  return out;
}`,
  codeJava: `// greedy: subtract the largest value that fits
String intToRoman(int num) {
  int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
  String[] syms = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
  StringBuilder out = new StringBuilder();
  for (int k = 0; k < vals.length; k++) {
    while (num >= vals[k]) {
      out.append(syms[k]);
      num -= vals[k];
    }
  }
  return out.toString();
}`,
  inputs: [{ kind: "number", name: "num", label: "num", default: 1994, min: 1, max: 3999 }],
  entry: (a) => `intToRoman(${a.num})`,
  run({ fn, line, vars, heap }, args) {
    let num = args.num as number
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    const go = fn(
      "intToRoman",
      (): string => {
        let out = ""
        heap("out", out)
        line(3, `The table pairs each value with its symbol — including the subtractive pairs <b>900=CM, 400=CD, 90=XC…</b> That is the whole trick.`)
        for (let k = 0; k < vals.length; k++) {
          if (num <= 0) break
          if (num < vals[k]) {
            line(5, `${num} &lt; ${vals[k]} — "${syms[k]}" doesn't fit, move to the next smaller value.`)
            continue
          }
          while (num >= vals[k]) {
            out += syms[k]
            heap("out", out)
            line(7, `${num} ≥ ${vals[k]} → append "<b>${syms[k]}</b>" → out = "<b>${out}</b>".`)
            num -= vals[k]
            line(8, `num −= ${vals[k]} → num = <b>${num}</b>.`)
            vars({ k, val: vals[k], sym: syms[k], num, out })
          }
        }
        line(11, `num reached 0 — greedy with subtractive pairs is complete: "<b>${out}</b>".`)
        return out
      },
      1,
    )
    return go()
  },
}
