import type { SolutionDef } from "@/engine/types"

export const validPalindromeIi: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string)],
  code: `// on the first mismatch we get ONE free deletion — try both sides
function validPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return isPal(s, left + 1, right) || isPal(s, left, right - 1);
    }
    left++; right--;
  }
  return true;
}
function isPal(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}`,
  codeJava: `// on the first mismatch we get ONE free deletion — try both sides
boolean validPalindrome(String s) {
  int left = 0, right = s.length() - 1;
  while (left < right) {
    if (s.charAt(left) != s.charAt(right)) {
      return isPal(s, left + 1, right) || isPal(s, left, right - 1);
    }
    left++; right--;
  }
  return true;
}
boolean isPal(String s, int left, int right) {
  while (left < right) {
    if (s.charAt(left) != s.charAt(right)) return false;
    left++; right--;
  }
  return true;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "abccfba", maxLen: 14 }],
  entry: (a) => `validPalindrome("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const isPal = fn(
      "isPal",
      (left: number, right: number): boolean => {
        line(12, `Plain palindrome check on s[${left}..${right}] = "${s.slice(left, right + 1)}" — no more free deletions.`)
        while (left < right) {
          ptr("left", left)
          ptr("right", right)
          mark("focus", [left, right])
          if (s[left] !== s[right]) {
            line(13, `'${s[left]}' ≠ '${s[right]}' — a second repair would be needed. Return <b>false</b>.`)
            return false
          }
          line(13, `'${s[left]}' = '${s[right]}' ✓`)
          left++
          right--
          line(14, `Move inward: left = ${left}, right = ${right}.`)
          vars({ left, right })
        }
        line(16, `Pointers crossed with no mismatch → s[?..?] is a palindrome. Return <b>true</b>.`)
        return true
      },
      11,
    )
    const go = fn(
      "validPalindrome",
      (): boolean => {
        let left = 0
        let right = s.length - 1
        ptr("left", left)
        ptr("right", right >= 0 ? right : -1)
        line(2, `Converge from both ends; we're allowed to delete <b>at most one</b> character.`)
        while (left < right) {
          mark("focus", [left, right])
          if (s[left] !== s[right]) {
            mark("bad", [left, right])
            line(4, `First mismatch: '<b>${s[left]}</b>' vs '<b>${s[right]}</b>'. Spend the free deletion — but on which side?`)
            line(5, `Try deleting s[${left}] ('skip left') OR s[${right}] ('skip right') — one of them must work.`)
            const ans = isPal(left + 1, right) || isPal(left, right - 1)
            line(5, ans ? `One of the two skips closes the gap → <b>true</b>.` : `Neither skip works → <b>false</b>.`)
            return ans
          }
          line(4, `'${s[left]}' = '${s[right]}' — ends agree, no deletion spent.`)
          mark("good", [left, right])
          left++
          right--
          ptr("left", left)
          ptr("right", right)
          line(7, `Move inward: left = ${left}, right = ${right}.`)
          vars({ left, right })
        }
        line(9, `Already a palindrome without any deletion → <b>true</b>.`)
        return true
      },
      1,
    )
    return go()
  },
}
