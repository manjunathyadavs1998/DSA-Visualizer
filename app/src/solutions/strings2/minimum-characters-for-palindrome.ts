import type { SolutionDef, Args } from "@/engine/types"

const combined = (a: Args): string => {
  const s = a.s as string
  return s + "#" + s.split("").reverse().join("")
}

export const minimumCharactersForPalindrome: SolutionDef = {
  view: "array",
  array: (a) => combined(a).split(""),
  code: `// s is editable below
function minCharsForPalindrome(s) {
  const rev = s.split("").reverse().join("");
  const t = s + "#" + rev;        // lps of t finds the
  const lps = new Array(t.length).fill(0);  // longest palindromic prefix
  for (let i = 1, len = 0; i < t.length; ) {
    if (t[i] === t[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return s.length - lps[t.length - 1];
}`,
  codeJava: `// String s editable below
int minCharsForPalindrome(String s) {
  String rev = new StringBuilder(s).reverse().toString();
  String t = s + "#" + rev;       // lps of t finds the
  int[] lps = new int[t.length()];          // longest palindromic prefix
  for (int i = 1, len = 0; i < t.length(); ) {
    if (t.charAt(i) == t.charAt(len)) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return s.length() - lps[t.length() - 1];
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aacec", maxLen: 6 }],
  entry: (a) => `minCharsForPalindrome("${a.s}")`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const s = args.s as string
    const go = fn(
      "minCharsForPalindrome",
      (): number => {
        if (s.length === 0) return 0
        const t = combined(args)
        const n = s.length
        mark("window", Array.from({ length: n }, (_, x) => x))
        mark("focus", [n])
        line(3, `The cells show t = s + "#" + reverse(s) = "<b>${t}</b>". A prefix of s that is also a suffix of reverse(s) is a <b>palindromic prefix</b> of s — exactly what LPS measures.`)
        const lps: number[] = new Array(t.length).fill(0)
        heap("lps", lps)
        for (let i = 1, len = 0; i < t.length; ) {
          ptr("i", i); ptr("len", len); vars({ i, len })
          if (t[i] === t[len]) {
            lps[i] = len + 1
            heap("lps", lps)
            line(6, `t[${i}]='${t[i]}' equals t[${len}]='${t[len]}' → lps[${i}] = <b>${len + 1}</b>.`)
            i++; len++
          } else if (len > 0) {
            line(7, `t[${i}]='${t[i]}' ≠ t[${len}]='${t[len]}' — fall back: len = lps[${len - 1}] = ${lps[len - 1]}.`)
            len = lps[len - 1]
          } else {
            lps[i] = 0
            heap("lps", lps)
            line(8, `t[${i}]='${t[i]}' matches no prefix → lps[${i}] = 0.`)
            i++
          }
        }
        const keep = lps[t.length - 1]
        const ans = n - keep
        ptr("i", -1); ptr("len", -1)
        mark("good", Array.from({ length: keep }, (_, x) => x))
        mark("bad", Array.from({ length: ans }, (_, x) => keep + x))
        narrate(`lps of the last cell = ${keep}: the first <b>${keep}</b> chars of s ("${s.slice(0, keep)}") already form a palindrome; the '#' guarantees this never exceeds |s|.`)
        line(10, `Everything after that palindromic prefix (${ans} red char${ans === 1 ? "" : "s"}) must be mirrored in front → add <b>${ans}</b> character${ans === 1 ? "" : "s"}.`)
        return ans
      },
      1,
    )
    return go()
  },
}
