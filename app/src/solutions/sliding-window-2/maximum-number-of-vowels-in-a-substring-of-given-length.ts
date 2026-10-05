import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const maximumNumberOfVowelsInASubstringOfGivenLength: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// most vowels in any window of exactly length k
function maxVowels(s, k) {
  const vowels = "aeiou";
  let count = 0;
  for (let i = 0; i < k; i++)
    if (vowels.includes(s[i])) count++;     // first window
  let best = count;
  for (let right = k; right < s.length; right++) {
    if (vowels.includes(s[right])) count++;
    if (vowels.includes(s[right - k])) count--;
    best = Math.max(best, count);
  }
  return best;
}`,
  codeJava: `// most vowels in any window of exactly length k
int maxVowels(String s, int k) {
  String vowels = "aeiou";
  int count = 0;
  for (int i = 0; i < k; i++)
    if (vowels.indexOf(s.charAt(i)) >= 0) count++;
  int best = count;
  for (int right = k; right < s.length(); right++) {
    if (vowels.indexOf(s.charAt(right)) >= 0) count++;
    if (vowels.indexOf(s.charAt(right - k)) >= 0) count--;
    best = Math.max(best, count);
  }
  return best;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "abciiidef", maxLen: 14 },
    { kind: "number", name: "k", label: "k", default: 3, min: 1, max: 14 },
  ],
  entry: (a) => `maxVowels("${a.s}", ${a.k})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const s = (args.s as string).toLowerCase()
    const k = Math.min(Math.max(1, Math.trunc(args.k as number)), s.length)
    const vowels = "aeiou"
    const go = fn(
      "maxVowels",
      (): number => {
        let count = 0
        line(3, `Fixed window of size ${k}: track the vowel count, add on the right, drop on the left.`)
        for (let i = 0; i < k; i++) {
          mark("focus", [i])
          mark("window", win(0, i))
          if (vowels.includes(s[i])) {
            count++
            line(5, `'${s[i]}' is a <b>vowel</b> → count = ${count}.`)
          } else {
            line(5, `'${s[i]}' is a consonant — count stays ${count}.`)
          }
        }
        let best = count
        let bestEnd = k - 1
        line(6, `First window "${s.slice(0, k)}" has <b>${count}</b> vowel(s).`)
        for (let right = k; right < s.length; right++) {
          ptr("right", right)
          ptr("left", right - k + 1)
          mark("focus", [right])
          if (vowels.includes(s[right])) {
            count++
            line(8, `Vowel '${s[right]}' enters → count = <b>${count}</b>.`)
          } else {
            line(8, `Consonant '${s[right]}' enters — count stays ${count}.`)
          }
          if (vowels.includes(s[right - k])) {
            count--
            line(9, `Vowel '${s[right - k]}' leaves → count = <b>${count}</b>.`)
          } else {
            line(9, `Consonant '${s[right - k]}' leaves — count stays ${count}.`)
          }
          mark("window", win(right - k + 1, right))
          if (count > best) {
            best = count
            bestEnd = right
            line(10, `Window "${s.slice(right - k + 1, right + 1)}" has <b>${count}</b> vowels — new best!`)
          } else {
            line(10, `Window has ${count} vowels — best stays ${best}.`)
          }
          vars({ right, count, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestEnd - k + 1, bestEnd))
        line(12, `Max vowels in any length-${k} window: <b>${best}</b> ("${s.slice(bestEnd - k + 1, bestEnd + 1)}").`)
        return best
      },
      1,
    )
    return go()
  },
}
