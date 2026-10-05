import type { SolutionDef } from "@/engine/types"

const asc = (xs: number[]) => [...xs].sort((a, b) => a - b)

export const assignCookies: SolutionDef = {
  view: "array",
  // sorted kid greeds | sorted cookie sizes
  array: (a) => [...asc(a.g as number[]), "|", ...asc(a.s as number[])],
  code: `// g = each kid's greed factor, s = cookie sizes
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0, j = 0, fed = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) {            // cookie satisfies kid
      fed++;
      i++;                         // next (greedier) kid
    }
    j++;                           // cookie used or too small
  }
  return fed;
}`,
  codeJava: `// g = each kid's greed factor, s = cookie sizes
int findContentChildren(int[] g, int[] s) {
  Arrays.sort(g);
  Arrays.sort(s);
  int i = 0, j = 0, fed = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) {            // cookie satisfies kid
      fed++;
      i++;                         // next (greedier) kid
    }
    j++;                           // cookie used or too small
  }
  return fed;
}`,
  inputs: [
    { kind: "numbers", name: "g", label: "kid greeds g", default: [1, 2, 7, 10], maxLen: 5 },
    { kind: "numbers", name: "s", label: "cookie sizes s", default: [1, 3, 5, 9], maxLen: 5 },
  ],
  entry: () => `findContentChildren(g, s)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const g = asc(args.g as number[])
    const s = asc(args.s as number[])
    const sep = g.length // "|" cell; cookie j lives at sep + 1 + j
    const solve = fn(
      "findContentChildren",
      (): number => {
        line(2, `Sort the kids by greed: satisfy the <b>easiest</b> kid first.`)
        line(3, `Sort the cookies by size: spend the <b>smallest</b> cookie that works.`)
        let i = 0, j = 0, fed = 0
        ptr("i", i)
        ptr("j", sep + 1 + j)
        vars({ i, j, fed })
        line(4, `i walks the kids, j walks the cookies.`)
        const happy: number[] = []
        while (i < g.length && j < s.length) {
          mark("focus", [i, sep + 1 + j])
          line(6, `Cookie <b>${s[j]}</b> vs kid with greed <b>${g[i]}</b>: ${s[j] >= g[i] ? "big enough — feed them!" : "too small for even the least greedy remaining kid."}`)
          if (s[j] >= g[i]) {
            fed++
            happy.push(i, sep + 1 + j)
            mark("good", happy)
            line(7, `<b>fed = ${fed}</b> — this pair is matched.`)
            i++
            vars({ i, j, fed })
            line(8, `Move to the next, greedier kid.`)
          } else {
            narrate(`Cookie ${s[j]} can't satisfy anyone — every remaining kid wants ≥ ${g[i]}. Discard it, it's the cheapest loss.`)
          }
          j++
          vars({ i, j, fed })
          line(10, `Either way this cookie is gone — advance j.`)
          ptr("i", i < g.length ? i : -1)
          ptr("j", j < s.length ? sep + 1 + j : -1)
        }
        mark("focus", [])
        line(12, `${i < g.length ? "Out of cookies" : "Every kid checked"} — <b>${fed}</b> content ${fed === 1 ? "child" : "children"}.`)
        return fed
      },
      1,
    )
    narrate(`Greedy matching: give each kid the <b>smallest</b> cookie that satisfies them, saving big cookies for greedy kids.`)
    return solve()
  },
}
