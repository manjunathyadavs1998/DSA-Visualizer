import type { SolutionDef } from "@/engine/types"

export const reverseString: SolutionDef = {
  view: "array",
  array: (a) => [...(a.s as string)],
  code: `// the classic converge-and-swap
function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
}`,
  codeJava: `// the classic converge-and-swap
char[] reverseString(char[] s) {
  int left = 0, right = s.length - 1;
  while (left < right) {
    char t = s[left]; s[left] = s[right]; s[right] = t;
    left++;
    right--;
  }
  return s;
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "pointers", maxLen: 14 }],
  entry: (a) => `reverseString("${a.s}")`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const s = [...(args.s as string)]
    const go = fn(
      "reverseString",
      (): string => {
        let left = 0
        let right = s.length - 1
        ptr("left", left)
        ptr("right", right >= 0 ? right : -1)
        line(2, `Two pointers at the ends. Each swap fixes <b>two</b> characters, so we only need n/2 swaps.`)
        while (left < right) {
          mark("focus", [left, right])
          const a = s[left]
          s[left] = s[right]
          s[right] = a
          aset(left, s[left])
          aset(right, s[right])
          line(4, `Swap s[${left}] ↔ s[${right}]: '<b>${s[left]}</b>' and '<b>${a}</b>' trade places.`)
          mark("done", [...Array.from({ length: left + 1 }, (_, i) => i), ...Array.from({ length: s.length - right }, (_, i) => right + i)])
          left++
          ptr("left", left)
          line(5, `left → ${left}`)
          right--
          ptr("right", right)
          line(6, `right → ${right}${left < right ? "" : left === right ? " — pointers met on the middle char (it stays put), done" : " — pointers crossed, done"}.`)
          vars({ left, right })
        }
        mark("focus", [])
        line(8, `Reversed in place with O(1) extra space: "<b>${s.join("")}</b>".`)
        return s.join("")
      },
      1,
    )
    return go()
  },
}
