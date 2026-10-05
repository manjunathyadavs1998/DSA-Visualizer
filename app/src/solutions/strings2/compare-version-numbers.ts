import type { SolutionDef } from "@/engine/types"

export const compareVersionNumbers: SolutionDef = {
  view: "array",
  array: (a) => [...(a.v1 as string).split(""), "|", ...(a.v2 as string).split("")],
  code: `// version1 and version2 are editable below
function compareVersion(v1, v2) {
  let i = 0, j = 0;
  while (i < v1.length || j < v2.length) {
    let a = 0, b = 0;                // missing chunk = 0
    while (i < v1.length && v1[i] !== '.') a = a * 10 + +v1[i++];
    while (j < v2.length && v2[j] !== '.') b = b * 10 + +v2[j++];
    if (a !== b) return a < b ? -1 : 1;
    i++; j++;                        // skip the dots
  }
  return 0;
}`,
  codeJava: `// version1 and version2 editable below
int compareVersion(String v1, String v2) {
  int i = 0, j = 0;
  while (i < v1.length() || j < v2.length()) {
    int a = 0, b = 0;                // missing chunk = 0
    while (i < v1.length() && v1.charAt(i) != '.') a = a * 10 + (v1.charAt(i++) - '0');
    while (j < v2.length() && v2.charAt(j) != '.') b = b * 10 + (v2.charAt(j++) - '0');
    if (a != b) return a < b ? -1 : 1;
    i++; j++;                        // skip the dots
  }
  return 0;
}`,
  inputs: [
    { kind: "string", name: "v1", label: "version1", default: "1.2", maxLen: 6 },
    { kind: "string", name: "v2", label: "version2", default: "1.10", maxLen: 6 },
  ],
  entry: (a) => `compareVersion("${a.v1}", "${a.v2}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const v1 = args.v1 as string
    const v2 = args.v2 as string
    const off = v1.length + 1 // where v2 starts in the cells
    const go = fn(
      "compareVersion",
      (): number => {
        let i = 0, j = 0
        let chunk = 1
        ptr("i", 0); ptr("j", off)
        line(2, `Two pointers chunk through the dot-separated numbers of each version in lockstep.`)
        while (i < v1.length || j < v2.length) {
          let a = 0, b = 0
          const i0 = i, j0 = j
          while (i < v1.length && v1[i] !== ".") {
            a = a * 10 + Number(v1[i]); i++
          }
          ptr("i", Math.min(i, v1.length - 1))
          mark("window", Array.from({ length: i - i0 }, (_, x) => i0 + x))
          line(5, i > i0
            ? `Chunk ${chunk} of version1: "${v1.slice(i0, i)}" parses to a = <b>${a}</b>${v1.slice(i0, i).startsWith("0") && i - i0 > 1 ? " — leading zeros vanish because we parse numerically" : ""}.`
            : `version1 has <b>run out of chunks</b> — the zero-padding rule treats the missing chunk as a = 0.`)
          while (j < v2.length && v2[j] !== ".") {
            b = b * 10 + Number(v2[j]); j++
          }
          ptr("j", off + Math.min(j, v2.length - 1))
          mark("focus", Array.from({ length: j - j0 }, (_, x) => off + j0 + x))
          line(6, j > j0
            ? `Chunk ${chunk} of version2: "${v2.slice(j0, j)}" parses to b = <b>${b}</b>${v2.slice(j0, j).startsWith("0") && j - j0 > 1 ? " — leading zeros vanish because we parse numerically" : ""}.`
            : `version2 has <b>run out of chunks</b> — the zero-padding rule treats the missing chunk as b = 0.`)
          vars({ i, j, a, b })
          if (a !== b) {
            mark(a < b ? "bad" : "good", Array.from({ length: Math.max(i - i0, 1) }, (_, x) => Math.min(i0 + x, v1.length - 1)))
            line(7, `a = ${a} ${a < b ? "<" : ">"} b = ${b} — version1 is <b>${a < b ? "smaller" : "bigger"}</b>, return ${a < b ? -1 : 1}.`)
            return a < b ? -1 : 1
          }
          line(8, `a = b = ${a} — this chunk ties, move past the dots to the next chunk.`)
          i++; j++
          chunk++
        }
        mark("window", []); mark("focus", [])
        line(10, `Every chunk tied (missing ones counted as 0) — the versions are <b>equal</b>, return 0.`)
        return 0
      },
      1,
    )
    return go()
  },
}
