import type { SolutionDef } from "@/engine/types"

const digitsOf = (x: number): number[] => {
  const n = Math.abs(Math.trunc(x))
  return String(n).split("").map(Number)
}

export const palindromeNumber: SolutionDef = {
  view: "array",
  array: (a) => digitsOf(a.x as number),
  code: `// read digits from both ends — no string conversion
function isPalindrome(x) {
  if (x < 0) return false;
  const digits = [];
  for (let t = x; t > 0; t = Math.floor(t / 10))
    digits.unshift(t % 10);
  if (digits.length === 0) digits.push(0);
  let l = 0, r = digits.length - 1;
  while (l < r) {
    if (digits[l] !== digits[r]) return false;
    l++; r--;
  }
  return true;
}`,
  codeJava: `// read digits from both ends — no string conversion
boolean isPalindrome(int x) {
  if (x < 0) return false;
  List<Integer> digits = new ArrayList<>();
  for (int t = x; t > 0; t = t / 10)
    digits.add(0, t % 10);
  if (digits.isEmpty()) digits.add(0);
  int l = 0, r = digits.size() - 1;
  while (l < r) {
    if (!digits.get(l).equals(digits.get(r))) return false;
    l++; r--;
  }
  return true;
}`,
  inputs: [{ kind: "number", name: "x", label: "x", default: 7447, min: -10000, max: 10000 }],
  entry: (a) => `isPalindrome(${Math.trunc(a.x as number)})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const x = Math.trunc(args.x as number)
    const digits = digitsOf(x)
    const go = fn(
      "isPalindrome",
      (): boolean => {
        line(2, `Is ${x} negative? (${x < 0 ? "<b>yes</b> — the '-' sign has no mirror on the right end" : "no"})`)
        if (x < 0) return false
        line(3, `Extract the digits of ${x} by repeated % 10 and ÷ 10 — least significant first.`)
        for (let i = digits.length - 1, t = x; t > 0; t = Math.floor(t / 10), i--) {
          mark("focus", [i])
          line(5, `t = ${t}: t % 10 = <b>${t % 10}</b> goes to the front of the list; t ÷ 10 → ${Math.floor(t / 10)}.`)
        }
        mark("focus", [])
        line(7, `Digits assembled: [${digits.join(", ")}]. Now squeeze two pointers from the ends toward the middle.`)
        let l = 0
        let r = digits.length - 1
        ptr("l", l)
        ptr("r", r)
        vars({ l, r })
        const matched: number[] = []
        while (l < r) {
          mark("focus", [l, r])
          if (digits[l] !== digits[r]) {
            mark("bad", [l, r])
            line(9, `digits[${l}] = <b>${digits[l]}</b> vs digits[${r}] = <b>${digits[r]}</b> — mismatch → <b>not a palindrome</b>.`)
            return false
          }
          line(9, `digits[${l}] = <b>${digits[l]}</b> vs digits[${r}] = <b>${digits[r]}</b> — equal, keep squeezing.`)
          matched.push(l, r)
          mark("good", [...matched])
          l++
          r--
          ptr("l", l)
          ptr("r", r)
          vars({ l, r })
        }
        mark("focus", [])
        mark("good", digits.map((_, i) => i))
        line(12, `Pointers met — every pair matched → <b>${x} is a palindrome</b>.`)
        return true
      },
      1,
    )
    return go()
  },
}
