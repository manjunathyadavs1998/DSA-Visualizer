import type { SolutionDef } from "@/engine/types"

/** Keep only [a-z0-9[\]], clamp repeat counts, and fall back to the
 *  default when brackets are unbalanced or the output would explode. */
const sanitize = (raw: unknown): string => {
  const s = String(raw).replace(/[^a-z0-9[\]]/g, "")
  let depth = 0
  let outLen = 0
  const factors: number[] = [1]
  let num = 0
  let ok = s.length > 0
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") num = num * 10 + Number(ch)
    else if (ch === "[") {
      if (num === 0) ok = false
      factors.push(factors[factors.length - 1] * Math.min(num, 50))
      depth++
      num = 0
    } else if (ch === "]") {
      depth--
      if (depth < 0) ok = false
      factors.pop()
    } else {
      outLen += factors[factors.length - 1]
    }
    if (!ok || outLen > 300) return "3[a2[c]]"
  }
  return ok && depth === 0 ? s : "3[a2[c]]"
}

export const decodeString: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.s).split(""),
  code: `// stacks remember what to repeat when ] arrives
function decodeString(s) {
  const counts = [], parts = [];
  let cur = "", num = 0;
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") num = num * 10 + (ch - 0);
    else if (ch === "[") {
      counts.push(num); parts.push(cur);
      num = 0; cur = "";
    } else if (ch === "]") {
      const k = counts.pop(), prev = parts.pop();
      cur = prev + cur.repeat(k);
    } else cur += ch;
  }
  return cur;
}`,
  codeJava: `// stacks remember what to repeat when ] arrives
String decodeString(String s) {
  Deque<Integer> counts = new ArrayDeque<>(); Deque<String> parts = new ArrayDeque<>();
  String cur = ""; int num = 0;
  for (char ch : s.toCharArray()) {
    if (ch >= '0' && ch <= '9') num = num * 10 + (ch - '0');
    else if (ch == '[') {
      counts.push(num); parts.push(cur);
      num = 0; cur = "";
    } else if (ch == ']') {
      int k = counts.pop(); String prev = parts.pop();
      cur = prev + cur.repeat(k);
    } else cur += ch;
  }
  return cur;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "3[a2[c]]", maxLen: 14 }],
  entry: (a) => `decodeString("${sanitize(a.s)}")`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const s = sanitize(args.s)
    const go = fn(
      "decodeString",
      (): string => {
        const counts: number[] = []
        const parts: string[] = []
        let cur = ""
        let num = 0
        heap("counts (stack)", [...counts])
        heap("parts (stack)", [...parts])
        line(3, `cur holds the string being built at the <b>current nesting level</b>; the stacks save outer levels.`)
        for (let i = 0; i < s.length; i++) {
          const ch = s[i]
          ptr("i", i)
          mark("focus", [i])
          if (ch >= "0" && ch <= "9") {
            num = num * 10 + Number(ch)
            line(5, `Digit '${ch}' → num = <b>${num}</b> (multi-digit counts build up here).`)
          } else if (ch === "[") {
            counts.push(num)
            parts.push(cur)
            heap("counts (stack)", [...counts])
            heap("parts (stack)", [...parts])
            line(7, `'[' opens a level: push num = <b>${num}</b> and cur = "<b>${parts[parts.length - 1]}</b>", then start fresh.`)
            num = 0
            cur = ""
          } else if (ch === "]") {
            const k = counts.pop()!
            const prev = parts.pop()!
            heap("counts (stack)", [...counts])
            heap("parts (stack)", [...parts])
            cur = prev + cur.repeat(k)
            line(11, `']' closes a level: cur = "${prev}" + "${cur.slice(prev.length, prev.length + (cur.length - prev.length) / k)}" × ${k} = "<b>${cur}</b>".`)
          } else {
            cur += ch
            line(12, `Letter '${ch}' → cur = "<b>${cur}</b>".`)
          }
          vars({ i, ch, num, cur })
        }
        mark("focus", [])
        mark("good", Array.from({ length: s.length }, (_, x) => x))
        line(14, `End of input, stacks empty → decoded string "<b>${cur}</b>" (${cur.length} chars).`)
        return cur
      },
      1,
    )
    return go()
  },
}
