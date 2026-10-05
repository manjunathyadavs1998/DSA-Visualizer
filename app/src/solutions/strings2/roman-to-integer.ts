import type { SolutionDef } from "@/engine/types"

const VAL: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

export const romanToInteger: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below (Roman numeral)
function romanToInt(s) {
  const val = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && val[s[i]] < val[s[i + 1]])
      total -= val[s[i]];   // smaller before bigger → subtract
    else
      total += val[s[i]];
  }
  return total;
}`,
  codeJava: `// String s editable below (Roman numeral)
int romanToInt(String s) {
  Map<Character,Integer> val = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
  int total = 0;
  for (int i = 0; i < s.length(); i++) {
    if (i + 1 < s.length() && val.get(s.charAt(i)) < val.get(s.charAt(i + 1)))
      total -= val.get(s.charAt(i)); // smaller before bigger → subtract
    else
      total += val.get(s.charAt(i));
  }
  return total;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "MCMXCIV", maxLen: 12 }],
  entry: (a) => `romanToInt("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const go = fn(
      "romanToInt",
      (): number => {
        let total = 0
        vars({ total })
        line(3, `Read left to right; a symbol normally <b>adds</b> its value.`)
        for (let i = 0; i < s.length; i++) {
          const cur = VAL[s[i]] ?? 0
          const nxt = i + 1 < s.length ? VAL[s[i + 1]] ?? 0 : 0
          ptr("i", i); mark("focus", [i])
          if (i + 1 < s.length && cur < nxt) {
            mark("bad", [i])
            line(6, `'${s[i]}' (${cur}) sits <b>before a bigger</b> '${s[i + 1]}' (${nxt}) — that's the subtractive form, so <b>subtract</b>: ${total} − ${cur} = ${total - cur}.`)
            total -= cur
          } else {
            mark("good", [i])
            line(8, `'${s[i]}' (${cur}) is ≥ what follows — <b>add</b>: ${total} + ${cur} = ${total + cur}.`)
            total += cur
          }
          vars({ i, total })
        }
        mark("focus", [])
        line(10, `All symbols consumed — "${s}" = <b>${total}</b>.`)
        return total
      },
      1,
    )
    return go()
  },
}
