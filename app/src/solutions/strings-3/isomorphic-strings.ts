import type { SolutionDef } from "@/engine/types"

export const isomorphicStrings: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string).split(""), "|", ...(a.t as string).split("")],
  code: `// chars must map 1-to-1 in BOTH directions
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const st = {}, ts = {};
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = t[i];
    if (st[a] !== undefined && st[a] !== b) return false;
    if (ts[b] !== undefined && ts[b] !== a) return false;
    st[a] = b;
    ts[b] = a;
  }
  return true;
}`,
  codeJava: `// chars must map 1-to-1 in BOTH directions
boolean isIsomorphic(String s, String t) {
  if (s.length() != t.length()) return false;
  Map<Character, Character> st = new HashMap<>(), ts = new HashMap<>();
  for (int i = 0; i < s.length(); i++) {
    char a = s.charAt(i), b = t.charAt(i);
    if (st.containsKey(a) && st.get(a) != b) return false;
    if (ts.containsKey(b) && ts.get(b) != a) return false;
    st.put(a, b);
    ts.put(b, a);
  }
  return true;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "paper", maxLen: 6 },
    { kind: "string", name: "t", label: "t", default: "title", maxLen: 6 },
  ],
  entry: (a) => `isIsomorphic("${a.s}", "${a.t}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = args.s as string
    const t = args.t as string
    const off = s.length + 1 // t starts after the "|" cell
    const go = fn(
      "isIsomorphic",
      (): boolean => {
        if (s.length !== t.length) {
          line(2, `Lengths differ (${s.length} vs ${t.length}) — a 1-to-1 position mapping is impossible.`)
          return false
        }
        line(2, `Same length (${s.length}). Now demand a <b>bijection</b>: each s-char maps to one t-char AND vice versa.`)
        const st: Record<string, string> = {}
        const ts: Record<string, string> = {}
        heap("s→t", { ...st })
        heap("t→s", { ...ts })
        for (let i = 0; i < s.length; i++) {
          const a = s[i]
          const b = t[i]
          ptr("i", i)
          ptr("j", off + i)
          mark("focus", [i, off + i])
          line(5, `Position ${i}: s has '<b>${a}</b>', t has '<b>${b}</b>' — check both maps before pairing them.`)
          if (st[a] !== undefined && st[a] !== b) {
            mark("bad", [i, off + i])
            line(6, `'${a}' already maps to '<b>${st[a]}</b>' but here it faces '<b>${b}</b>' — one char can't map to two. Return <b>false</b>.`)
            return false
          }
          if (ts[b] !== undefined && ts[b] !== a) {
            mark("bad", [i, off + i])
            line(7, `'${b}' is already the image of '<b>${ts[b]}</b>' but here '<b>${a}</b>' claims it too — two chars can't share one image. Return <b>false</b>.`)
            return false
          }
          const isNew = st[a] === undefined
          st[a] = b
          ts[b] = a
          heap("s→t", { ...st })
          heap("t→s", { ...ts })
          line(9, isNew ? `New pair: '<b>${a}</b>' ↔ '<b>${b}</b>' recorded in both maps.` : `'${a}' ↔ '${b}' matches the existing pair — consistent.`)
          vars({ i, a, b })
        }
        mark("focus", [])
        mark("good", Array.from({ length: off + t.length }, (_, x) => x).filter((x) => x !== s.length))
        line(11, `Every position respected the bijection → <b>isomorphic</b>. Two maps because 'badc'/'baba' breaks with only one.`)
        return true
      },
      1,
    )
    return go()
  },
}
