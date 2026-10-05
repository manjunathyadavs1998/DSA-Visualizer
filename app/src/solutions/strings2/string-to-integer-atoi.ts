import type { SolutionDef } from "@/engine/types"

export const stringToIntegerAtoi: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below
function myAtoi(s) {
  let i = 0, sign = 1, num = 0;
  while (s[i] === ' ') i++;            // 1) skip spaces
  if (s[i] === '+' || s[i] === '-') {  // 2) read the sign
    if (s[i] === '-') sign = -1;
    i++;
  }
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    num = num * 10 + (s[i] - '0');     // 3) accumulate digits
    i++;
  }
  num = sign * num;                    // 4) clamp to 32-bit range
  if (num < -2147483648) num = -2147483648;
  if (num > 2147483647) num = 2147483647;
  return num;
}`,
  codeJava: `// String s editable below
int myAtoi(String s) {
  int i = 0, sign = 1; long num = 0;
  while (i < s.length() && s.charAt(i) == ' ') i++;     // 1) skip spaces
  if (i < s.length() && "+-".indexOf(s.charAt(i)) >= 0) { // 2) read the sign
    if (s.charAt(i) == '-') sign = -1;
    i++;
  }
  while (i < s.length() && Character.isDigit(s.charAt(i))) {
    num = num * 10 + (s.charAt(i) - '0');               // 3) accumulate digits
    i++;
  }
  num = sign * num;                                     // 4) clamp to 32-bit range
  if (num < Integer.MIN_VALUE) num = Integer.MIN_VALUE;
  if (num > Integer.MAX_VALUE) num = Integer.MAX_VALUE;
  return (int) num;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "   -42abc", maxLen: 14 }],
  entry: (a) => `myAtoi("${a.s}")`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const s = args.s as string
    const go = fn(
      "myAtoi",
      (): number => {
        let i = 0, sign = 1, num = 0
        ptr("i", 0); vars({ i, sign, num })
        line(2, `Four phases: skip spaces → sign → digits → clamp.`)
        while (i < s.length && s[i] === " ") {
          mark("done", Array.from({ length: i + 1 }, (_, x) => x))
          line(3, `<b>Phase 1:</b> s[${i}] is a space — skip it.`)
          i++
          ptr("i", i)
        }
        if (i < s.length && (s[i] === "+" || s[i] === "-")) {
          mark("focus", [i])
          if (s[i] === "-") sign = -1
          line(5, `<b>Phase 2:</b> s[${i}] is '${s[i]}' — the sign is ${sign === -1 ? "negative" : "positive"} (sign = ${sign}).`)
          i++
          ptr("i", i); vars({ i, sign, num })
        } else {
          line(4, `<b>Phase 2:</b> no explicit sign here — sign stays +1.`)
        }
        while (i < s.length && s[i] >= "0" && s[i] <= "9") {
          mark("focus", [i]); mark("window", [i])
          const d = s.charCodeAt(i) - 48
          line(9, `<b>Phase 3:</b> digit '${s[i]}' → num = ${num} × 10 + ${d} = <b>${num * 10 + d}</b>.`)
          num = num * 10 + d
          i++
          ptr("i", i); vars({ i, sign, num })
        }
        if (i < s.length) {
          mark("bad", [i]); mark("focus", [])
          narrate(`s[${i}] = '${s[i]}' is not a digit — parsing <b>stops</b>; the rest is ignored.`)
        }
        num = sign * num
        line(12, `<b>Phase 4:</b> apply the sign → ${num}. Now clamp to [−2147483648, 2147483647].`)
        if (num < -2147483648) {
          num = -2147483648
          line(13, `Below INT_MIN — <b>clamp</b> to −2147483648.`)
        }
        if (num > 2147483647) {
          num = 2147483647
          line(14, `Above INT_MAX — <b>clamp</b> to 2147483647.`)
        }
        vars({ i, sign, num })
        line(15, `Answer: <b>${num}</b>.`)
        return num
      },
      1,
    )
    return go()
  },
}
