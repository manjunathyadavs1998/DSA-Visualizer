import type { SolutionDef } from "@/engine/types"

export const excelSheetColumnTitle: SolutionDef = {
  view: "array",
  array: (a) => String(a.n).split(""),
  code: `// base 26 — but digits run 1..26, so subtract 1 first
function convertToTitle(n) {
  let title = "";
  while (n > 0) {
    n--;                        // shift to 0..25
    const d = n % 26;
    title = String.fromCharCode(65 + d) + title;
    n = Math.floor(n / 26);
  }
  return title;
}`,
  codeJava: `// base 26 — but digits run 1..26, so subtract 1 first
String convertToTitle(int n) {
  StringBuilder title = new StringBuilder();
  while (n > 0) {
    n--;                        // shift to 0..25
    int d = n % 26;
    title.insert(0, (char) ('A' + d));
    n = n / 26;
  }
  return title.toString();
}`,
  inputs: [{ kind: "number", name: "n", label: "n (column number)", default: 2024, min: 1, max: 100000 }],
  entry: (a) => `convertToTitle(${a.n})`,
  run({ fn, line, vars, heap }, args) {
    let n = args.n as number
    const go = fn(
      "convertToTitle",
      (): string => {
        let title = ""
        heap("title", title)
        line(2, `This is NOT plain base 26: there is no zero. A=1 … Z=26, so <b>n-- first</b> turns it into honest 0..25 digits.`)
        while (n > 0) {
          n--
          line(4, `n-- → <b>${n}</b> (shift the 1..26 digit range down to 0..25).`)
          const d = n % 26
          line(5, `d = ${n} % 26 = <b>${d}</b>.`)
          title = String.fromCharCode(65 + d) + title
          heap("title", title)
          line(6, `'A' + ${d} = '<b>${String.fromCharCode(65 + d)}</b>' → prepend → title = "<b>${title}</b>".`)
          n = Math.floor(n / 26)
          line(7, `n = ⌊${n * 26 + d} / 26⌋ = <b>${n}</b> — that many full blocks of 26 columns remain.`)
          vars({ n, d, title })
        }
        line(9, `n hit 0 → the title is "<b>${title}</b>". The −1 each round is why Z (26) and AA (27) sit next to each other.`)
        return title
      },
      1,
    )
    return go()
  },
}
