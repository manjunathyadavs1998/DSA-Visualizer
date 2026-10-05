import type { SolutionDef } from "@/engine/types"

export const backspaceStringCompare: SolutionDef = {
  view: "array",
  // show s and t side by side: [ s… | t… ]
  array: (a) => [...(a.s as string), "|", ...(a.t as string)],
  code: `// walk both from the END, skipping chars a '#' deletes
function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  while (i >= 0 || j >= 0) {
    i = nextLive(s, i);           // settle on a real char (or -1)
    j = nextLive(t, j);
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;  // one ran out first
    i--; j--;
  }
  return true;
}
function nextLive(str, k) {
  let skip = 0;
  while (k >= 0 && (str[k] === '#' || skip > 0)) {
    skip += str[k] === '#' ? 1 : -1;
    k--;
  }
  return k;
}`,
  codeJava: `// walk both from the END, skipping chars a '#' deletes
boolean backspaceCompare(String s, String t) {
  int i = s.length() - 1, j = t.length() - 1;
  while (i >= 0 || j >= 0) {
    i = nextLive(s, i);           // settle on a real char (or -1)
    j = nextLive(t, j);
    if (i >= 0 && j >= 0 && s.charAt(i) != t.charAt(j)) return false;
    if ((i >= 0) != (j >= 0)) return false;   // one ran out first
    i--; j--;
  }
  return true;
}
int nextLive(String str, int k) {
  int skip = 0;
  while (k >= 0 && (str.charAt(k) == '#' || skip > 0)) {
    skip += str.charAt(k) == '#' ? 1 : -1;
    k--;
  }
  return k;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "ab#c", maxLen: 10 },
    { kind: "string", name: "t", label: "t", default: "ad#c", maxLen: 10 },
  ],
  entry: (a) => `backspaceCompare("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const t = args.t as string
    const off = s.length + 1 // t starts after the "|" separator in the display
    const nextLive = fn(
      "nextLive",
      (which: "s" | "t", k: number): number => {
        const str = which === "s" ? s : t
        const base = which === "s" ? 0 : off
        const name = which === "s" ? "i" : "j"
        let skip = 0
        line(14, `nextLive(${which}, ${k}): walk left past anything a '#' erases.`)
        while (k >= 0 && (str[k] === "#" || skip > 0)) {
          skip += str[k] === "#" ? 1 : -1
          mark("bad", [base + k])
          line(16, `${which}[${k}] = '${str[k]}' is ${str[k] === "#" ? "a backspace → one more char to erase" : "erased by a pending '#'"} (skip = ${skip}); step left.`)
          k--
          ptr(name, k >= 0 ? base + k : -1)
        }
        line(19, k >= 0 ? `${which}[${k}] = '<b>${str[k]}</b>' survives the backspaces.` : `${which} is exhausted — nothing live remains.`)
        return k
      },
      13,
    )
    const go = fn(
      "backspaceCompare",
      (): boolean => {
        let i = s.length - 1
        let j = t.length - 1
        ptr("i", i >= 0 ? i : -1)
        ptr("j", j >= 0 ? off + j : -1)
        line(2, `Scan from the <b>right</b>: out there, a '#' only affects chars we haven't visited yet.`)
        while (i >= 0 || j >= 0) {
          line(4, `Find the next surviving char of s at or left of index ${i}.`)
          i = nextLive("s", i)
          line(5, `Find the next surviving char of t at or left of index ${j}.`)
          j = nextLive("t", j)
          vars({ i, j })
          if (i >= 0 && j >= 0 && s[i] !== t[j]) {
            mark("focus", [i, off + j])
            line(6, `Live chars differ: '<b>${s[i]}</b>' vs '<b>${t[j]}</b>' → the typed strings can't be equal. Return <b>false</b>.`)
            return false
          }
          if (i >= 0 && j >= 0) {
            mark("good", [i, off + j])
            line(6, `Both live chars are '<b>${s[i]}</b>' — they agree, keep going.`)
          }
          if ((i >= 0) !== (j >= 0)) {
            line(7, `${i >= 0 ? "t" : "s"} ran out while the other still has '<b>${i >= 0 ? s[i] : t[j]}</b>' → different lengths. Return <b>false</b>.`)
            return false
          }
          i--
          j--
          ptr("i", i >= 0 ? i : -1)
          ptr("j", j >= 0 ? off + j : -1)
          line(8, `Step both pointers left: i = ${i}, j = ${j}.`)
        }
        line(10, `Both strings exhausted at the same moment → they type the same text. Return <b>true</b>.`)
        return true
      },
      1,
    )
    return go()
  },
}
