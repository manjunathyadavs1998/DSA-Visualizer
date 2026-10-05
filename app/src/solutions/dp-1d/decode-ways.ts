import type { SolutionDef } from "@/engine/types"

export const decodeWays: SolutionDef = {
  code: `// s is the digit string, n = s.length
function decode(i) {
  if (i === n) return 1;
  if (s[i] === '0') return 0;
  if (memo[i] !== undefined) return memo[i];
  let ways = decode(i + 1);
  const two = +(s[i] + s[i + 1]);
  if (i + 1 < n && two <= 26) ways += decode(i + 2);
  memo[i] = ways;
  return ways;
}`,
  codeJava: `// String s; int n; Integer[] memo
int decode(int i) {
  if (i == n) return 1;
  if (s.charAt(i) == '0') return 0;
  if (memo[i] != null) return memo[i];
  int ways = decode(i + 1);
  int two = (s.charAt(i) - '0') * 10 + (i + 1 < n ? s.charAt(i + 1) - '0' : 99);
  if (i + 1 < n && two <= 26) ways += decode(i + 2);
  memo[i] = ways;
  return ways;
}`,
  inputs: [{ kind: "string", name: "s", label: "digits s", default: "11106", maxLen: 10 }],
  entry: (a) => `decode(0) on "${String(a.s).replace(/[^0-9]/g, "") || "11106"}"`,
  run({ fn, memo, line, vars, narrate }, args) {
    // non-digits would make the recurrence meaningless — strip them
    let s = String(args.s).replace(/[^0-9]/g, "")
    if (!s) s = "11106"
    const n = s.length
    const decode = fn(
      "decode",
      (i: number): number => {
        line(2, `decode(${i}): all ${n} digits consumed? (${i === n ? "<b>yes — this split works, count 1 way</b>" : "no"})`)
        if (i === n) return 1
        line(3, `decode(${i}): s[${i}]='${s[i]}' — ${s[i] === "0" ? "<b>a lone '0' maps to no letter → 0 ways</b>" : "non-zero, it can stand alone"}`)
        if (s[i] === "0") return 0
        line(4, `decode(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(5, `decode(${i}): take '${s[i]}' as ONE letter → count decode(${i + 1}).`)
        let ways = decode(i + 1)
        const two = i + 1 < n ? +(s[i] + s[i + 1]) : 99
        vars({ i, ways, two })
        line(6, `decode(${i}): pair '${s.slice(i, i + 2)}' = <b>${two === 99 ? "—" : two}</b>; valid letters are 10–26.`)
        if (i + 1 < n && two <= 26) {
          line(7, `decode(${i}): ${two} ≤ 26 → also take TWO digits → add decode(${i + 2}).`)
          ways += decode(i + 2)
        } else {
          line(7, `decode(${i}): ${i + 1 < n ? `${two} > 26 — the pair is not a letter` : "no second digit"} → skip the two-digit branch.`)
        }
        line(8, `decode(${i}): memo[${i}] = <b>${ways}</b> ways for suffix "${s.slice(i)}".`)
        memo[i] = ways
        return ways
      },
      1,
    )
    narrate("Each position decides: one digit, or a two-digit pair ≤ 26 — the memo stores ways per suffix.")
    return decode(0)
  },
}
