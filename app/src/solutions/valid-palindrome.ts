import type { SolutionDef } from "@/engine/types"

export const validPalindrome: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
  codeJava: `// String s is editable below
boolean isPalindrome(String s) {
  int left = 0, right = s.length() - 1;
  while (left < right) {
    if (s.charAt(left) != s.charAt(right)) return false;
    left++;
    right--;
  }
  return true;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "racecar", maxLen: 14 }],
  entry: (a) => `isPalindrome("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const go = fn(
      "isPalindrome",
      (): boolean => {
        let left = 0, right = s.length - 1
        ptr("left", left); ptr("right", right); vars({ left, right })
        line(2, `Compare the string from both ends, moving inward.`)
        while (left < right) {
          mark("focus", [left, right])
          vars({ left, right, "s[left]": s[left], "s[right]": s[right] })
          line(4, `'${s[left]}' vs '${s[right]}' → ${s[left] !== s[right] ? "<b>mismatch — not a palindrome!</b>" : "match ✓"}`)
          if (s[left] !== s[right]) {
            mark("bad", [left, right]); mark("focus", [])
            return false
          }
          mark("good", [left, right])
          line(5, `Move both pointers inward.`)
          left++
          right--
          ptr("left", left); ptr("right", right)
        }
        mark("focus", []); mark("good", s.split("").map((_, i) => i))
        line(8, `Pointers met — every pair matched. <b>It's a palindrome.</b>`)
        return true
      },
      1,
    )
    return go()
  },
}
