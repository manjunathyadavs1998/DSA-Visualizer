import type { SolutionDef } from "@/engine/types"

export const interleavingString: SolutionDef = {
  code: `// is s3 an interleaving of s1 and s2? (s3[i+j] is the next slot)
function weave(i, j) {
  if (i === s1.length && j === s2.length) return true;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  let ok = false;
  if (i < s1.length && s1[i] === s3[i + j])
    ok = weave(i + 1, j);
  if (!ok && j < s2.length && s2[j] === s3[i + j])
    ok = weave(i, j + 1);
  memo[key] = ok;
  return ok;
}`,
  codeJava: `// is s3 an interleaving of s1 and s2? (s3[i+j] is the next slot)
boolean weave(int i, int j) {
  if (i == s1.length() && j == s2.length()) return true;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  boolean ok = false;
  if (i < s1.length() && s1.charAt(i) == s3.charAt(i + j))
    ok = weave(i + 1, j);
  if (!ok && j < s2.length() && s2.charAt(j) == s3.charAt(i + j))
    ok = weave(i, j + 1);
  memo.put(key, ok);
  return ok;
}`,
  inputs: [
    { kind: "string", name: "s1", label: "s1", default: "aab", maxLen: 4 },
    { kind: "string", name: "s2", label: "s2", default: "axy", maxLen: 4 },
    { kind: "string", name: "s3", label: "s3", default: "aaxaby", maxLen: 7 },
  ],
  entry: (a) => `weave(0, 0)  // s1="${a.s1}", s2="${a.s2}", s3="${a.s3}"`,
  run({ fn, memo, line, narrate }, args) {
    let s1 = args.s1 as string
    let s2 = args.s2 as string
    let s3 = args.s3 as string
    // lengths must add up or the answer is trivially false and the trace is empty — fall back
    if (s1.length + s2.length !== s3.length) {
      s1 = "aab"; s2 = "axy"; s3 = "aaxaby"
      narrate(`len(s1)+len(s2) ≠ len(s3) → inputs reset to the defaults.`)
    }
    const weave = fn(
      "weave",
      (i: number, j: number): boolean => {
        line(2, `weave(${i},${j}): both sources exhausted? (${i === s1.length && j === s2.length ? "<b>yes — perfect weave!</b>" : "no"})`)
        if (i === s1.length && j === s2.length) return true
        const key = i + "," + j
        line(4, `weave(${i},${j}): next slot is s3[${i + j}]='${s3[i + j]}' — checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as boolean
        let ok = false
        if (i < s1.length && s1[i] === s3[i + j]) {
          line(7, `s1[${i}]='${s1[i]}' fits slot '${s3[i + j]}' → <b>try taking from s1</b>.`)
          ok = weave(i + 1, j)
        }
        if (!ok && j < s2.length && s2[j] === s3[i + j]) {
          line(9, `s2[${j}]='${s2[j]}' fits slot '${s3[i + j]}' → <b>try taking from s2</b>.`)
          ok = weave(i, j + 1)
        }
        line(10, `weave(${i},${j}) = <b>${ok}</b>${ok ? "" : " — neither source can fill this slot"}.`)
        memo[key] = ok
        return ok
      },
      1,
    )
    narrate("The trick: after taking i chars of s1 and j of s2, the next s3 slot is forced — it is i+j. Two choices per state, memo on (i,j).")
    return weave(0, 0)
  },
}
