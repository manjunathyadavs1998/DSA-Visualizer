import type { SolutionDef } from "@/engine/types"

export const palindromePartitioning: SolutionDef = {
  code: `// s is editable below
function partition(start, cur) {
  if (start === s.length) { result.push([...cur]); return; }
  for (let end = start; end < s.length; end++) {
    const piece = s.slice(start, end + 1);
    if (!isPal(piece)) continue;    // only palindromic cuts
    cur.push(piece);
    partition(end + 1, cur);
    cur.pop();                      // backtrack
  }
}`,
  codeJava: `// String s is editable below
void partition(int start, List<String> cur) {
  if (start == s.length()) { result.add(new ArrayList<>(cur)); return; }
  for (int end = start; end < s.length(); end++) {
    String piece = s.substring(start, end + 1);
    if (!isPal(piece)) continue;    // only palindromic cuts
    cur.add(piece);
    partition(end + 1, cur);
    cur.remove(cur.size() - 1);     // backtrack
  }
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aab", maxLen: 6 }],
  entry: (a) => `partition(0, [])  // s = "${a.s}"`,
  run({ fn, line, narrate }, args) {
    const s = args.s as string
    const result: string[][] = []
    const isPal = (p: string) => p === p.split("").reverse().join("")
    const partition = fn(
      "partition",
      (start: number, cur: string[]): string => {
        line(2, `start = ${start}: consumed the whole string? (${start === s.length ? `<b>yes — record [${cur.join(" | ")}]</b>` : "no"})`)
        if (start === s.length) {
          result.push([...cur])
          return cur.join("|")
        }
        for (let end = start; end < s.length; end++) {
          const piece = s.slice(start, end + 1)
          if (!isPal(piece)) {
            line(5, `"${piece}" is not a palindrome → can't cut here.`)
            continue
          }
          line(6, `"${piece}" is a palindrome → cut it off, solve the rest ("${s.slice(end + 1)}").`)
          cur.push(piece)
          partition(end + 1, cur)
          line(8, `Backtrack: undo the "${piece}" cut.`)
          cur.pop()
        }
        return "✓"
      },
      1,
    )
    narrate("Try every prefix cut; recurse only when the prefix is a palindrome.")
    partition(0, [])
    return JSON.stringify(result.map((r) => r.join("|")))
  },
}
