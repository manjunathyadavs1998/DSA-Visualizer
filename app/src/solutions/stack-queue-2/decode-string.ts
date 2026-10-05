import type { SolutionDef } from "@/engine/types"

const DECODE_DEFAULT = "3[a2[c]]"

/** Keep only legal characters and reject anything unbalanced or explosive. */
function encoded(args: Record<string, unknown>): string {
  const s = String(args.s ?? "").replace(/[^a-z0-9[\]]/g, "").slice(0, 14)
  // validate: brackets balanced, every "[" preceded by a number, decoded size bounded
  let num = 0
  const counts: number[] = []
  const lens: number[] = [0]
  for (const c of s) {
    if (c >= "0" && c <= "9") num = num * 10 + +c
    else if (c === "[") {
      if (num < 1 || num > 9) return DECODE_DEFAULT
      counts.push(num)
      num = 0
      lens.push(0)
    } else if (c === "]") {
      if (!counts.length || num !== 0) return DECODE_DEFAULT
      const inner = lens.pop() as number
      lens[lens.length - 1] += inner * (counts.pop() as number)
      if (lens[lens.length - 1] > 300) return DECODE_DEFAULT
    } else {
      if (num !== 0) return DECODE_DEFAULT
      lens[lens.length - 1]++
    }
  }
  if (counts.length || num !== 0 || lens[0] === 0) return DECODE_DEFAULT
  return s
}

export const decodeString: SolutionDef = {
  view: "array",
  array: (a) => encoded(a).split(""),
  code: `// expand k[sub] patterns, inside-out, with two stacks
function decodeString(s) {
  const counts = [], parts = [];
  let cur = "", num = 0;
  for (const c of s) {
    if (c >= "0" && c <= "9") num = num * 10 + +c;
    else if (c === "[") {
      counts.push(num); parts.push(cur);
      num = 0; cur = "";       // start a fresh inner string
    } else if (c === "]") {
      cur = parts.pop() + cur.repeat(counts.pop());
    } else cur += c;
  }
  return cur;
}`,
  codeJava: `// expand k[sub] patterns, inside-out, with two stacks
String decodeString(String s) {
  Deque<Integer> counts = new ArrayDeque<>(); Deque<String> parts = new ArrayDeque<>();
  String cur = ""; int num = 0;
  for (char c : s.toCharArray()) {
    if (c >= '0' && c <= '9') num = num * 10 + (c - '0');
    else if (c == '[') {
      counts.push(num); parts.push(cur);
      num = 0; cur = "";       // start a fresh inner string
    } else if (c == ']') {
      cur = parts.pop() + cur.repeat(counts.pop());
    } else cur += c;
  }
  return cur;
}`,
  inputs: [{ kind: "string", name: "s", label: "s (e.g. 3[a2[c]])", default: DECODE_DEFAULT, maxLen: 14 }],
  entry: (a) => `decodeString("${encoded(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = encoded(args)
    const go = fn(
      "decodeString",
      (): string => {
        const counts: number[] = []
        const parts: string[] = []
        let cur = ""
        let num = 0
        line(2, `Two parallel stacks: <b>counts</b> (the pending multiplier) and <b>parts</b> (the string built so far outside this bracket).`)
        heap("stack", { counts: [], parts: [] })
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          if (c >= "0" && c <= "9") {
            num = num * 10 + +c
            vars({ cur, num })
            line(5, `Digit '${c}' → build the multiplier: num = <b>${num}</b> (digits may be multi-char, hence × 10).`)
          } else if (c === "[") {
            counts.push(num)
            parts.push(cur)
            heap("stack", { counts: [...counts], parts: [...parts] })
            line(7, `'[' opens a nested level → <b>save the context</b>: push num = ${num} and cur = "${cur}".`)
            num = 0
            cur = ""
            vars({ cur, num })
            line(8, `Reset num and cur — everything we build now belongs <b>inside</b> this bracket.`)
          } else if (c === "]") {
            const k = counts.pop() as number
            const prefix = parts.pop() as string
            const inner = cur
            line(10, `']' closes the level → pop k = <b>${k}</b> and the saved prefix "<b>${prefix}</b>".`)
            cur = prefix + inner.repeat(k)
            heap("stack", { counts: [...counts], parts: [...parts] })
            vars({ cur, num })
            line(10, `cur = "${prefix}" + "${inner}" × ${k} = "<b>${cur}</b>" — the inner block expands exactly when it closes.`)
          } else {
            cur += c
            vars({ cur, num })
            line(11, `Letter '${c}' → append to the current level: cur = "<b>${cur}</b>".`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        heap("output", cur)
        line(13, `Stacks empty, decoding complete: "<b>${cur}</b>". Each output char is written O(1) amortized times.`)
        return cur
      },
      1,
    )
    return go()
  },
}
