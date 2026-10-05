import type { SolutionDef } from "@/engine/types"

export const zAlgorithm: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below (Z-function)
function zAlgorithm(s) {
  const n = s.length, z = new Array(n).fill(0);
  let l = 0, r = 0;                 // rightmost Z-box [l, r]
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]])
      z[i]++;                       // explicit compares extend
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}`,
  codeJava: `// String s editable below (Z-function)
int[] zAlgorithm(String s) {
  int n = s.length(); int[] z = new int[n];
  int l = 0, r = 0;                 // rightmost Z-box [l, r]
  for (int i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i]))
      z[i]++;                       // explicit compares extend
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aabxaab", maxLen: 12 }],
  entry: (a) => `zAlgorithm("${a.s}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const go = fn(
      "zAlgorithm",
      (): string => {
        const n = s.length
        const z: number[] = n > 0 ? [0] : []
        heap("z", z)
        let l = 0, r = 0
        line(2, `z[i] = length of the longest prefix of s that also starts at i. z[0] stays 0 by convention.`)
        for (let i = 1; i < n; i++) {
          z.push(0)
          ptr("i", i)
          vars({ i, l, r, "z[i]": 0 })
          if (i <= r) {
            z[i] = Math.min(r - i + 1, z[i - l])
            heap("z", z)
            line(5, `i = ${i} sits <b>inside</b> the Z-box [${l}, ${r}] — mirror position ${i - l} says z[${i - l}] = ${z[i - l]}, capped by the box edge (${r - i + 1}) → <b>reuse</b> z[${i}] = ${z[i]} with zero compares.`)
          } else {
            line(5, `i = ${i} is <b>outside</b> the Z-box — nothing to reuse, compare from scratch.`)
          }
          while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
            mark("focus", [z[i], i + z[i]])
            line(6, `<b>Explicit compare</b>: s[${z[i]}]='${s[z[i]]}' vs s[${i + z[i]}]='${s[i + z[i]]}' — equal, extend z[${i}] to ${z[i] + 1}.`)
            z[i]++
            heap("z", z)
          }
          if (i + z[i] < n) {
            mark("focus", [z[i], i + z[i]])
            line(6, `s[${z[i]}]='${s[z[i]]}' vs s[${i + z[i]}]='${s[i + z[i]]}' — differ, z[${i}] settles at <b>${z[i]}</b>.`)
          }
          mark("focus", [])
          if (i + z[i] - 1 > r) {
            l = i; r = i + z[i] - 1
            mark("window", Array.from({ length: r - l + 1 }, (_, x) => l + x))
            line(8, `This match reaches further right than any before — the Z-box becomes [${l}, ${r}].`)
          }
          vars({ i, l, r, "z[i]": z[i] })
        }
        mark("window", [])
        line(10, `Done: z = [${z.join(", ")}].`)
        return JSON.stringify(z)
      },
      1,
    )
    return go()
  },
}
