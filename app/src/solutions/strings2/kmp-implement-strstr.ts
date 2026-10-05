import type { SolutionDef } from "@/engine/types"

export const kmpImplementStrstr: SolutionDef = {
  view: "array",
  array: (a) => (a.hay as string).split(""),
  code: `// haystack and needle are editable below (KMP)
function strStr(hay, nee) {
  const lps = new Array(nee.length).fill(0);
  for (let i = 1, len = 0; i < nee.length; ) {   // build LPS
    if (nee[i] === nee[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  let j = 0;                                     // chars of nee matched
  for (let i = 0; i < hay.length; i++) {
    while (j > 0 && hay[i] !== nee[j]) j = lps[j - 1];  // fallback
    if (hay[i] === nee[j]) j++;
    if (j === nee.length) return i - j + 1;
  }
  return -1;
}`,
  codeJava: `// haystack and needle editable below (KMP)
int strStr(String hay, String nee) {
  int[] lps = new int[nee.length()];
  for (int i = 1, len = 0; i < nee.length(); ) { // build LPS
    if (nee.charAt(i) == nee.charAt(len)) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  int j = 0;                                     // chars of nee matched
  for (int i = 0; i < hay.length(); i++) {
    while (j > 0 && hay.charAt(i) != nee.charAt(j)) j = lps[j - 1]; // fallback
    if (hay.charAt(i) == nee.charAt(j)) j++;
    if (j == nee.length()) return i - j + 1;
  }
  return -1;
}`,
  inputs: [
    { kind: "string", name: "hay", label: "haystack", default: "aabaabaaf", maxLen: 12 },
    { kind: "string", name: "nee", label: "needle", default: "aabaaf", maxLen: 8 },
  ],
  entry: (a) => `strStr("${a.hay}", "${a.nee}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const hay = args.hay as string
    const nee = args.nee as string
    const go = fn(
      "strStr",
      (): number => {
        if (nee.length === 0) return 0
        const lps: number[] = new Array(nee.length).fill(0)
        heap("needle", nee.split(""))
        heap("lps", lps)
        line(2, `<b>Phase 1</b>: build the LPS table of "${nee}" — lps[i] = longest proper prefix of nee[0..i] that is also its suffix.`)
        for (let i = 1, len = 0; i < nee.length; ) {
          vars({ i, len })
          if (nee[i] === nee[len]) {
            lps[i] = len + 1
            line(4, `nee[${i}]='${nee[i]}' extends the prefix nee[0..${len}] → lps[${i}] = <b>${len + 1}</b>.`)
            heap("lps", lps)
            i++; len++
          } else if (len > 0) {
            line(5, `nee[${i}]='${nee[i]}' ≠ nee[${len}]='${nee[len]}' — <b>fall back</b>: len = lps[${len - 1}] = ${lps[len - 1]}, don't move i.`)
            len = lps[len - 1]
          } else {
            lps[i] = 0
            line(6, `nee[${i}]='${nee[i]}' matches no prefix at all → lps[${i}] = 0.`)
            heap("lps", lps)
            i++
          }
        }
        let j = 0
        ptr("j", -1)
        line(8, `<b>Phase 2</b>: scan the haystack. lps = [${lps.join(", ")}]. j counts matched needle chars.`)
        for (let i = 0; i < hay.length; i++) {
          ptr("i", i)
          while (j > 0 && hay[i] !== nee[j]) {
            const j2 = lps[j - 1]
            mark("bad", [i])
            line(10, `hay[${i}]='${hay[i]}' ≠ nee[${j}]='${nee[j]}' — <b>fallback j = lps[${j - 1}] = ${j2}</b>: the first ${j2} chars still match, so never re-read the haystack.`)
            j = j2
            mark("good", Array.from({ length: j }, (_, x) => i - j + x))
          }
          if (hay[i] === nee[j]) {
            j++
            mark("bad", []); mark("good", Array.from({ length: j }, (_, x) => i - j + 1 + x))
            line(11, `hay[${i}]='${hay[i]}' matches nee[${j - 1}] — <b>${j}</b> of ${nee.length} needle chars matched.`)
          } else if (j === 0) {
            mark("bad", [i]); mark("good", [])
            line(11, `hay[${i}]='${hay[i]}' ≠ nee[0]='${nee[0]}' and j is already 0 — just move on.`)
            mark("bad", [])
          }
          vars({ i, j })
          if (j === nee.length) {
            mark("bad", []); mark("window", Array.from({ length: j }, (_, x) => i - j + 1 + x))
            line(12, `The whole needle matched — it starts at index <b>${i - j + 1}</b>.`)
            return i - j + 1
          }
        }
        mark("good", [])
        line(14, `Haystack exhausted with only ${j} chars matched — needle not found, return −1.`)
        return -1
      },
      1,
    )
    return go()
  },
}
