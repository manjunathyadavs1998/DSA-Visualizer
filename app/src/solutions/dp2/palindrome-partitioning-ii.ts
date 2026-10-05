import type { SolutionDef } from "@/engine/types"

export const palindromePartitioningII: SolutionDef = {
  code: `// s is editable below
function minCuts(i) {
  if (i === s.length) return -1; // refunds the final cut
  if (memo[i] !== undefined) return memo[i];
  let best = Infinity;
  for (let j = i; j < s.length; j++)
    if (isPal(i, j))    // prefix s[i..j] is a palindrome
      best = Math.min(best, 1 + minCuts(j + 1));
  memo[i] = best;
  return best;
}
function isPal(l, r) {
  while (l < r) if (s[l++] !== s[r--]) return false;
  return true;
}`,
  codeJava: `// String s editable below; Integer[] memo
int minCuts(int i) {
  if (i == s.length()) return -1; // refunds the final cut
  if (memo[i] != null) return memo[i];
  int best = Integer.MAX_VALUE;
  for (int j = i; j < s.length(); j++)
    if (isPal(i, j))    // prefix s[i..j] is a palindrome
      best = Math.min(best, 1 + minCuts(j + 1));
  memo[i] = best;
  return best;
}
boolean isPal(int l, int r) {
  while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
  return true;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aabba", maxLen: 8 }],
  entry: (a) => `minCuts(0)  // s="${a.s}"`,
  run({ fn, memo, line, narrate }, args) {
    const s = args.s as string
    const isPal = (l: number, r: number): boolean => {
      while (l < r) if (s[l++] !== s[r--]) return false
      return true
    }
    const minCuts = fn(
      "minCuts",
      (i: number): number => {
        line(2, `minCuts(${i}): "${s.slice(i)}" left. Off the end? (${i === s.length ? "<b>yes — return -1 so the last piece isn't charged a cut</b>" : "no"})`)
        if (i === s.length) return -1
        line(3, `minCuts(${i}): checking memo[${i}]…`)
        if (memo[i] !== undefined) return memo[i] as number
        let best = Infinity
        for (let j = i; j < s.length; j++) {
          const pal = isPal(i, j)
          line(6, `Is the prefix "${s.slice(i, j + 1)}" a palindrome? ${pal ? "<b>yes</b>" : "no — can't cut there"}.`)
          if (pal) {
            line(7, `Peel "${s.slice(i, j + 1)}" off as one piece (1 cut after it) + minCuts(${j + 1}).`)
            best = Math.min(best, 1 + minCuts(j + 1))
          }
        }
        line(8, `minCuts(${i}) = <b>${best}</b> cuts for "${s.slice(i)}".`)
        memo[i] = best
        return best
      },
      1,
    )
    narrate("Peel every palindromic prefix, pay one cut, recurse on the rest. The -1 base refunds the cut after the final piece.")
    if (s.length === 0) return 0
    return minCuts(0)
  },
}
