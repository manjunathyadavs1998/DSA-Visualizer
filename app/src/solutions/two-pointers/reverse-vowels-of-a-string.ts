import type { SolutionDef } from "@/engine/types"

export const reverseVowelsOfAString: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string)],
  code: `// converge-and-swap, but each pointer stops only on vowels
function reverseVowels(s) {
  const a = s.split(''), vowels = "aeiouAEIOU";
  let left = 0, right = a.length - 1;
  while (left < right) {
    if (!vowels.includes(a[left]))  { left++;  continue; }
    if (!vowels.includes(a[right])) { right--; continue; }
    [a[left], a[right]] = [a[right], a[left]];
    left++; right--;
  }
  return a.join('');
}`,
  codeJava: `// converge-and-swap, but each pointer stops only on vowels
String reverseVowels(String s) {
  char[] a = s.toCharArray(); String vowels = "aeiouAEIOU";
  int left = 0, right = a.length - 1;
  while (left < right) {
    if (vowels.indexOf(a[left]) < 0)  { left++;  continue; }
    if (vowels.indexOf(a[right]) < 0) { right--; continue; }
    char t = a[left]; a[left] = a[right]; a[right] = t;
    left++; right--;
  }
  return new String(a);
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "visualization", maxLen: 14 }],
  entry: (a) => `reverseVowels("${a.s}")`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const a = [...(args.s as string)]
    const vowels = "aeiouAEIOU"
    const go = fn(
      "reverseVowels",
      (): string => {
        line(2, `Consonants are scenery — only the <b>vowels</b> reverse among themselves.`)
        let left = 0
        let right = a.length - 1
        ptr("left", left)
        ptr("right", right >= 0 ? right : -1)
        line(3, `Pointers at both ends; each one skips forward until it lands on a vowel.`)
        while (left < right) {
          mark("focus", [left, right])
          if (!vowels.includes(a[left])) {
            line(5, `a[${left}] = '${a[left]}' is a consonant — left skips to ${left + 1}.`)
            left++
            ptr("left", left)
            continue
          }
          if (!vowels.includes(a[right])) {
            line(6, `a[${right}] = '${a[right]}' is a consonant — right skips to ${right - 1}.`)
            right--
            ptr("right", right)
            continue
          }
          const t = a[left]
          a[left] = a[right]
          a[right] = t
          aset(left, a[left])
          aset(right, a[right])
          mark("good", [left, right])
          line(7, `Both pointers sit on vowels: swap '<b>${a[right]}</b>' ↔ '<b>${a[left]}</b>'.`)
          left++
          right--
          ptr("left", left)
          ptr("right", right)
          line(8, `Move past the swapped pair: left = ${left}, right = ${right}.`)
          vars({ left, right })
        }
        mark("focus", [])
        line(10, `Pointers met — vowels reversed, consonants untouched: "<b>${a.join("")}</b>".`)
        return a.join("")
      },
      1,
    )
    return go()
  },
}
