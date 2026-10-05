import type { SolutionDef } from "@/engine/types"

const termAt = (n: number): string => {
  let t = "1"
  for (let r = 2; r <= n; r++) {
    let next = ""
    for (let i = 0; i < t.length; ) {
      let j = i
      while (j < t.length && t[j] === t[i]) j++
      next += String(j - i) + t[i]
      i = j
    }
    t = next
  }
  return t
}

export const countAndSay: SolutionDef = {
  view: "array",
  array: (a) => {
    const finalLen = termAt(a.n as number).length
    return Array.from({ length: finalLen }, (_, i) => (i === 0 ? "1" : "·"))
  },
  code: `// n is editable below (1..5)
function countAndSay(n) {
  let term = "1";
  for (let round = 2; round <= n; round++) {
    let next = "";
    for (let i = 0; i < term.length; ) {
      let j = i;                    // run of equal digits
      while (j < term.length && term[j] === term[i]) j++;
      next += (j - i) + term[i];    // say "count digit"
      i = j;
    }
    term = next;
  }
  return term;
}`,
  codeJava: `// int n editable below (1..5)
String countAndSay(int n) {
  String term = "1";
  for (int round = 2; round <= n; round++) {
    StringBuilder next = new StringBuilder();
    for (int i = 0; i < term.length(); ) {
      int j = i;                    // run of equal digits
      while (j < term.length() && term.charAt(j) == term.charAt(i)) j++;
      next.append(j - i).append(term.charAt(i)); // say "count digit"
      i = j;
    }
    term = next.toString();
  }
  return term;
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 4, min: 1, max: 5 }],
  entry: (a) => `countAndSay(${a.n})`,
  run({ fn, line, ptr, mark, aset, vars, heap, narrate }, args) {
    const n = args.n as number
    const cells = termAt(n).length
    const show = (term: string) => {
      for (let x = 0; x < cells; x++) aset(x, x < term.length ? term[x] : "·")
    }
    const go = fn(
      "countAndSay",
      (): string => {
        let term = "1"
        line(2, `Round 1: the sequence starts as "<b>1</b>". Each round reads the previous term aloud.`)
        for (let round = 2; round <= n; round++) {
          let next = ""
          heap("next", next)
          vars({ round, term: `"${term}"` })
          line(4, `<b>Round ${round}</b>: read "${term}" run by run.`)
          for (let i = 0; i < term.length; ) {
            let j = i
            while (j < term.length && term[j] === term[i]) j++
            ptr("i", i); ptr("j", Math.min(j, cells - 1))
            mark("window", Array.from({ length: j - i }, (_, x) => i + x))
            next += String(j - i) + term[i]
            heap("next", next)
            line(8, `A run of ${j - i} '${term[i]}'${j - i > 1 ? "s" : ""} — say "<b>${j - i} ${term[i]}</b>" → next = "${next}".`)
            i = j
          }
          term = next
          show(term)
          mark("window", [])
          narrate(`Round ${round} produced "<b>${term}</b>" — the cells now show it.`)
          line(11, `term becomes "${term}".`)
        }
        ptr("i", -1); ptr("j", -1)
        mark("good", Array.from({ length: term.length }, (_, x) => x))
        line(13, `After ${n} round${n > 1 ? "s" : ""} the term is "<b>${term}</b>".`)
        return term
      },
      1,
    )
    return go()
  },
}
