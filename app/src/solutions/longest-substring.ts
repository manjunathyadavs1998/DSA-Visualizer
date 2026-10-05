import type { SolutionDef } from "@/engine/types"

export const longestSubstring: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below (sliding window)
function lengthOfLongestSubstring(s) {
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (memo[c] >= left) left = memo[c] + 1;
    memo[c] = right;   // last index where c was seen
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// String s editable below (sliding window)
int lengthOfLongestSubstring(String s) {
  int best = 0, left = 0;                 // Map<Character,Integer> memo
  for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (memo.getOrDefault(c, -1) >= left) left = memo.get(c) + 1;
    memo.put(c, right); // last index where c was seen
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "abcabcbb", maxLen: 14 }],
  entry: (a) => `lengthOfLongestSubstring("${a.s}")`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const s = args.s as string
    const go = fn(
      "lengthOfLongestSubstring",
      (): number => {
        let best = 0, left = 0
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0); vars({ best, left })
        line(2, `Slide a window that never contains a repeated character.`)
        for (let right = 0; right < s.length; right++) {
          const c = s[right]
          ptr("right", right); mark("focus", [right])
          line(4, `Take '${c}' at index ${right} into the window.`)
          const seen = memo[c] as number | undefined
          if (seen !== undefined && seen >= left) {
            line(5, `'${c}' was already in the window (index ${seen}) → <b>shrink</b>: left jumps to ${seen + 1}.`)
            mark("bad", [seen])
            left = seen + 1
            ptr("left", left)
          }
          memo[c] = right
          const winLen = right - left + 1
          mark("window", Array.from({ length: winLen }, (_, x) => left + x))
          mark("bad", [])
          if (winLen > best) {
            best = winLen
            bestRange = [left, right]
            line(7, `Window "${s.slice(left, right + 1)}" has ${winLen} unique chars — <b>new best!</b>`)
          } else {
            line(7, `Window "${s.slice(left, right + 1)}" (len ${winLen}) — best stays ${best}.`)
          }
          vars({ left, right, best })
        }
        mark("focus", []); mark("window", [])
        mark("good", Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, x) => bestRange[0] + x))
        line(9, `Longest run without repeats: <b>${best}</b> ("${s.slice(bestRange[0], bestRange[1] + 1)}", green).`)
        return best
      },
      1,
    )
    return go()
  },
}
