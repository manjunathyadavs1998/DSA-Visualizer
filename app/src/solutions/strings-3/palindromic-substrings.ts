import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const palindromicSubstrings: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// every palindrome has a center — there are 2n-1 of them
function countSubstrings(s) {
  let count = 0;
  for (let c = 0; c < 2 * s.length - 1; c++) {
    let l = Math.floor(c / 2), r = l + (c % 2);
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;                 // s[l..r] is a palindrome
      l--;
      r++;
    }
  }
  return count;
}`,
  codeJava: `// every palindrome has a center — there are 2n-1 of them
int countSubstrings(String s) {
  int count = 0;
  for (int c = 0; c < 2 * s.length() - 1; c++) {
    int l = c / 2, r = l + (c % 2);
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
      count++;                 // s[l..r] is a palindrome
      l--;
      r++;
    }
  }
  return count;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "aabaa", maxLen: 8 }],
  entry: (a) => `countSubstrings("${a.s}")`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = args.s as string
    const go = fn(
      "countSubstrings",
      (): number => {
        let count = 0
        line(3, `${s.length} letter-centers (odd palindromes) + ${s.length - 1} gap-centers (even palindromes) = <b>${2 * s.length - 1}</b> centers to expand.`)
        for (let c = 0; c < 2 * s.length - 1; c++) {
          let l = Math.floor(c / 2)
          let r = l + (c % 2)
          line(4, c % 2 === 0 ? `Center ${c}: the <b>letter</b> at index ${l} (odd lengths).` : `Center ${c}: the <b>gap</b> between ${l} and ${r} (even lengths).`)
          while (l >= 0 && r < s.length && s[l] === s[r]) {
            ptr("l", l)
            ptr("r", r)
            mark("window", rng(l, r))
            count++
            line(6, `s[${l}] = s[${r}] = '${s[l]}' → "<b>${s.slice(l, r + 1)}</b>" is palindrome #<b>${count}</b>. Expand.`)
            l--
            r++
            vars({ c, l, r, count })
          }
          if (l >= 0 && r < s.length) {
            mark("bad", [l, r])
            line(5, `s[${l}] = '${s[l]}' ≠ s[${r}] = '${s[r]}' — expansion stops for this center.`)
            mark("bad", [])
          }
        }
        ptr("l", -1)
        ptr("r", -1)
        mark("window", [])
        line(11, `All ${2 * s.length - 1} centers expanded → <b>${count}</b> palindromic substrings in O(n²) with O(1) space.`)
        return count
      },
      1,
    )
    return go()
  },
}
