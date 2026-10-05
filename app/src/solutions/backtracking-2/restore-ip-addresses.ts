import type { SolutionDef } from "@/engine/types"

export const restoreIpAddresses: SolutionDef = {
  code: `// s is a digit string (editable below)
function backtrack(start, parts) {
  if (parts.length === 4) {    // 4 segments chosen
    if (start === s.length) output.push(parts.join("."));
    return;
  }
  for (let len = 1; len <= 3 && start + len <= s.length; len++) {
    const seg = s.slice(start, start + len);
    if (seg.length > 1 && seg[0] === '0') break;  // leading zero
    if (parseInt(seg) > 255) break;               // > 255
    parts.push(seg);           // commit segment
    backtrack(start + len, parts);
    parts.pop();               // backtrack
  }
}`,
  codeJava: `// String s is a digit string (editable below)
void backtrack(int start, List<String> parts) {
  if (parts.size() == 4) {     // 4 segments chosen
    if (start == s.length()) output.add(String.join(".", parts));
    return;
  }
  for (int len = 1; len <= 3 && start + len <= s.length(); len++) {
    String seg = s.substring(start, start + len);
    if (seg.length() > 1 && seg.charAt(0) == '0') break;  // leading zero
    if (Integer.parseInt(seg) > 255) break;               // > 255
    parts.add(seg);            // commit segment
    backtrack(start + len, parts);
    parts.remove(parts.size() - 1);               // backtrack
  }
}`,
  inputs: [{ kind: "string", name: "s", label: "s (digits)", default: "25525", maxLen: 8 }],
  entry: () => `backtrack(0, [])`,
  run({ fn, heap, line, vars, narrate }, args) {
    // digits only; 4..8 chars keeps the tree interesting but small
    let s = (args.s as string).replace(/\D/g, "")
    if (s.length < 4) s = "25525"
    const output: string[] = []
    const backtrack = fn(
      "backtrack",
      (start: number, parts: string[]): string => {
        vars({ start, parts: parts.join(".") || '""' })
        line(2, `parts = [${parts.join(" | ")}] — all 4 segments chosen? (${parts.length === 4 ? "<b>yes</b>" : "no"})`)
        if (parts.length === 4) {
          const ok = start === s.length
          line(3, ok
            ? `start = ${start} consumed the whole string → <b>valid IP: ${parts.join(".")}</b>`
            : `start = ${start} but |s| = ${s.length} — <b>${s.length - start} digit(s) left over</b>, reject.`)
          if (ok) {
            output.push(parts.join("."))
            heap("output", output)
          }
          return ok ? parts.join(".") : "✗ leftover"
        }
        for (let len = 1; len <= 3 && start + len <= s.length; len++) {
          const seg = s.slice(start, start + len)
          if (seg.length > 1 && seg[0] === "0") {
            line(8, `seg "${seg}" has a <b>leading zero</b> — longer segments here only get worse: break.`)
            break
          }
          if (parseInt(seg) > 255) {
            line(9, `seg "${seg}" = ${parseInt(seg)} <b>&gt; 255</b> — adding digits only grows it: break.`)
            break
          }
          line(10, `Segment #${parts.length + 1} = "<b>${seg}</b>" (chars ${start}..${start + len - 1}) → ${[...parts, seg].join(".")}`)
          parts.push(seg)
          heap("parts", parts)
          backtrack(start + len, parts)
          line(12, `Backtrack: drop "${seg}" → ${parts.slice(0, -1).join(".") || "(empty)"}`)
          parts.pop()
          heap("parts", parts)
        }
        return "✓"
      },
      1,
    )
    narrate(`Each level cuts one segment of 1–3 digits. Two prunes (leading zero, > 255) use 'break' not 'continue' — longer cuts can never fix either problem.`)
    heap("s", s)
    heap("output", output)
    backtrack(0, [])
    return JSON.stringify(output)
  },
}
